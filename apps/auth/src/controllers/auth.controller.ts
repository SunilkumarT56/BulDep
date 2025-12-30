import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import axios from 'axios';
import { pool } from '../config/postgresql.js';
import { generateJWT } from '@zylo/auth';
import { ghDataCollector } from '../services/github.service.js';
import { upsertGithubProfile } from '../services/github.service.js';
import { cookieSender } from '../utils/cookies.js';
import { redisClient } from '../config/redis.js';
import { sendEmail } from '../services/email.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ERROR_CODES } from '@zylo/errors';
import { fetchMyChannelDetails } from '../services/youtube.service.js';
import { GOOGLE_OAUTH_SCOPES } from '@zylo/scopes';
import { getGooglePublicKeySomehow } from '../services/youtube.service.js';
import type { AuthenticateUserRequest } from '@zylo/types';

export const oauthGoogleController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
      response_type: 'code',
      scope: GOOGLE_OAUTH_SCOPES,
      access_type: 'offline',
      prompt: 'consent',
    });

    const oauthUrl = `https://accounts.google.com/o/oauth2/auth?${params.toString()}`;
    res.redirect(302, oauthUrl);
  },
);
export const redirectHandlerGoogleController = asyncHandler(async (req: Request, res: Response) => {
  const code = req.query.code as string;

  if (!code) {
    return res.status(400).send(ERROR_CODES.UNAUTHORIZED_ACCESS);
  }

  const client = await pool.connect();

  try {
    // 1. Exchange code for tokens
    const tokenResponse = await axios.post(
      'https://oauth2.googleapis.com/token',
      {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      },
      { headers: { 'Content-Type': 'application/json' } },
    );

    const { access_token, refresh_token, id_token, expires_in } = tokenResponse.data;
    const expiresAt = new Date(Date.now() + expires_in * 1000);

    console.log('Google Token Response:', {
      hasAccessToken: !!access_token,
      hasRefreshToken: !!refresh_token,
      expiresIn: expires_in,
    });

    if (!access_token || !id_token) {
      return res.status(401).json({
        status: false,
        error: ERROR_CODES.OAUTH_FAILED,
      });
    }

    const decoded: any = await new Promise((resolve, reject) => {
      jwt.verify(
        id_token,
        getGooglePublicKeySomehow(),
        {
          audience: process.env.GOOGLE_CLIENT_ID,
          issuer: ['https://accounts.google.com', 'accounts.google.com'],
        },
        (err, decoded) => {
          if (err) return reject(err);
          resolve(decoded);
        },
      );
    });

    const email = decoded.email;
    if (!email) {
      return res.status(400).send('Email permission not granted');
    }

    await client.query('BEGIN');
    const userResult = await client.query(
      `
        INSERT INTO users (email)
        VALUES ($1)
        ON CONFLICT (email)
        DO UPDATE SET email = EXCLUDED.email
        RETURNING id
        `,
      [email],
    );

    const userId = userResult.rows[0].id;
    const channelData = await fetchMyChannelDetails(access_token);
    const channelId = channelData.id;
    await client.query(
      `
        INSERT INTO oauth_accounts
          (user_id, provider, provider_user_id, channel_id, access_token, refresh_token, scope , access_token_expires_at)
        VALUES ($1, 'google', $2, $3, $4, $5, $6 , $7)
        ON CONFLICT (provider, provider_user_id)
        DO UPDATE SET
          access_token = EXCLUDED.access_token,
          refresh_token = COALESCE(EXCLUDED.refresh_token, oauth_accounts.refresh_token),
          scope = EXCLUDED.scope,
          updated_at = NOW()
        `,
      [userId, channelId, channelId, access_token, refresh_token, GOOGLE_OAUTH_SCOPES, expiresAt],
    );

    await client.query('COMMIT');

    const authToken = generateJWT(userId);
    console.log(authToken);
    cookieSender(req, res, 'zylo', authToken);

    res.redirect('http://localhost:5173/yt-pipeline-dashboard');
  } catch (err: any) {
    await client.query('ROLLBACK');
    console.error('OAuth error:', err.message);
    res.status(500).send('OAuth failed');
  } finally {
    client.release();
  }
});

export const oauthGithubController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const state = crypto.randomBytes(16).toString('hex');

    const githubAuthURL =
      'https://github.com/login/oauth/authorize' +
      `?client_id=${process.env.GITHUB_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(process.env.GITHUB_CALLBACK_URL!)}` +
      `&scope=read:user user:email repo read:org` +
      `&state=${state}`;

    res.cookie('github_oauth_state', state, {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      path: '/',
    });

    res.redirect(302, githubAuthURL);
  },
);
export const redirectHandlerGithubController = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const client = await pool.connect();

    try {
      const { code, state } = req.query;
      const { github_oauth_state } = req.cookies;

      if (!state || state !== github_oauth_state) {
        res.status(401).json({ status: false, error: ERROR_CODES.INVALID_OAUTH_STATE });
        return;
      }
      const tokenRes = await axios.post(
        'https://github.com/login/oauth/access_token',
        {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        },
        { headers: { Accept: 'application/json' } },
      );

      const accessToken = tokenRes.data.access_token;
      if (!accessToken) {
        res.status(401).json({ status: false, error: ERROR_CODES.OAUTH_FAILED });
        return;
      }

      const { ghUser, ghEmails } = await ghDataCollector(accessToken);
      const primaryEmail = ghEmails.find((e) => e.primary && e.verified)?.email ?? null;

      const provider = 'github';
      const providerUserId = ghUser.id.toString();

      await client.query('BEGIN');
      const userRes = await client.query(
        `
        SELECT u.id
        FROM users u
        LEFT JOIN oauth_accounts oa
          ON oa.user_id = u.id
         AND oa.provider = $1
         AND oa.provider_user_id = $2
        WHERE oa.user_id IS NOT NULL
           OR u.email = $3
        LIMIT 1
        `,
        [provider, providerUserId, primaryEmail],
      );

      let userId: string;

      if (userRes.rows.length === 0) {
        const createUserRes = await client.query(
          `
          INSERT INTO users (email, avatar_url)
          VALUES ($1, $2)
          RETURNING id
          `,
          [primaryEmail, ghUser.avatar_url],
        );
        userId = createUserRes.rows[0].id;
      } else {
        userId = userRes.rows[0].id;
      }
      await client.query(
        `
        INSERT INTO oauth_accounts
          (user_id, provider, provider_user_id, access_token, scope)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (provider, provider_user_id)
        DO UPDATE SET
          access_token = EXCLUDED.access_token,
          scope = EXCLUDED.scope,
          updated_at = NOW()
        `,
        [userId, provider, providerUserId, accessToken, 'read:user user:email repo read:org'],
      );
      await upsertGithubProfile(client, userId, ghUser, ghEmails);

      await client.query('COMMIT');

      res.clearCookie('github_oauth_state', { path: '/' });

      const authToken = generateJWT(userId);
      console.log('Auth token:', authToken);
      cookieSender(req, res, 'zylo', authToken);

      res.redirect('http://localhost:5173/dashboard');
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('GitHub OAuth error:', err);
      res.status(500).json({ status: false, error: ERROR_CODES.OAUTH_FAILED });
    } finally {
      client.release();
    }
  },
);

export const logoutController = asyncHandler(async (req: Request, res: Response) => {
  res.clearCookie('auth_token', { path: '/' });
  res.json({ status: true });
});

export const emailRequestController = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  const client = await pool.connect();

  if (!email) {
    return res.status(400).json({ error: ERROR_CODES.EMAIL_REQUIRED });
  }

  const userRes = await client.query(
    `
    INSERT INTO users (email)
    VALUES ($1)
    ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
    RETURNING id
    `,
    [email],
  );

  const user = userRes.rows[0].id;

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await redisClient.set(`email_otp:${email}`, otp, { EX: 300 });

  await sendEmail(email, 'Email login code', `Your login code is ${otp}`);

  res.json({ status: true, message: 'OTP sent' });
});
