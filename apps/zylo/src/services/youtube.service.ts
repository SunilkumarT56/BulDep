import { ERROR_CODES } from '@zylo/errors';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../config/postgresql.js';

const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/channels';
export async function fetchMyChannelDetails(access_token: string) {
  if (!access_token || access_token === '') {
    throw new Error(ERROR_CODES.UNAUTHORIZED_ACCESS);
  }

  try {
    const response = await axios.get(YOUTUBE_API_URL!, {
      params: {
        part: 'snippet,contentDetails,statistics',
        mine: true,
      },
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: 'application/json',
      },
    });
    if (!response.data.items || response.data.items.length === 0) {
      throw new Error('NO_YOUTUBE_CHANNEL');
    }
    const channelData = response.data.items?.[0];

    return channelData;
  } catch (error: any) {
    console.error(ERROR_CODES.ERROR_FETCHING_YT_DETAILS, error.response?.data || error.message);
    throw error;
  }
}

const ACCESS_TOKEN = '';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const VIDEO_FILE_PATH = 'src/videos/Screen Recording 2025-11-27 at 6.42.47 PM.mp4';

const VIDEO_METADATA = {
  snippet: {
    title: 'My First YouTube API Upload',
    description: 'This video was uploaded programmatically using the YouTube Data API and Node.js.',
    tags: ['api upload', 'nodejs', 'youtube'],
    categoryId: '22',
  },
  status: {
    privacyStatus: 'public',
  },
};
export const getValidGoogleAccessToken = async (oauthAccount: any) => {
  if (new Date(oauthAccount.access_token_expires_at) > new Date()) {
    return oauthAccount.access_token;
  }

  const response = await axios.post(
    'https://oauth2.googleapis.com/token',
    {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: oauthAccount.refresh_token,
      grant_type: 'refresh_token',
    },
    { headers: { 'Content-Type': 'application/json' } },
  );

  const { access_token, expires_in } = response.data;

  const expiresAt = new Date(Date.now() + expires_in * 1000);

  await pool.query(
    `
    UPDATE oauth_accounts
    SET access_token = $1,
        access_token_expires_at = $2,
        updated_at = NOW()
    WHERE id = $3
    `,
    [access_token, expiresAt, oauthAccount.id],
  );

  return access_token;
};
