import type { Request, Response } from "express";
import crypto from "crypto";
import axios from "axios";
import { prisma } from "../config/postgresql.js";
import type { User } from "../types/auth.js";

export const getName = async (req: Request, res: Response): Promise<void> => {
  const { name } = req.body;
  const user = await prisma.users.create({
    data: {
      name,
    },
  });
  res.cookie("temp_user_id", user.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
  });
};

export const oauthGithubController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const state = crypto.randomBytes(16).toString("hex");
  const githubAuthURL =
    "https://github.com/login/oauth/authorize" +
    `?client_id=${process.env.GITHUB_CLIENT_ID}` +
    `&redirect_uri=${process.env.GITHUB_CALLBACK_URL}` +
    `&scope=read:user user:email` +
    `&state=${state}`;

  res.cookie("github_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  res.redirect(302, githubAuthURL);
};

export const redirectHandlerGithubController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { code, state } = req.query;
  const { github_oauth_state, temp_user_id } = req.cookies;
  const storedState = github_oauth_state;
  if (!temp_user_id) {
    res.status(400).json({ status: false, error: "User context missing" });
    return;
  }
  if (!state || !storedState || state !== storedState) {
    res
      .status(401)
      .json({ status: false, error: "Invalid OAuth state (CSRF detected)" });
    return;
  }
  const tokenRes = await axios.post(
    "https://github.com/login/oauth/access_token",
    {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    },
    { headers: { Accept: "application/json" } }
  );

  const accessToken = tokenRes.data.access_token;

  if (!accessToken) {
    res
      .status(401)
      .json({ status: false, error: "OAuth token exchange failed" });
    return;
  }
  const userRes = await axios.get("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const emailRes = await axios.get("https://api.github.com/user/emails", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const primaryEmail = emailRes.data.find((e: any) => e.primary)?.email;

  const user: User = {
    avatar_url: userRes.data.avatar_url ?? null,
    email: primaryEmail ?? null,
    status: "active",
    updated_at: Date.now(),
  };
  console.log(user);
  await prisma.users.update({
    where: { id: temp_user_id },
    data: {
      email: user.email,
      avatar_url: user.avatar_url,
      status: user.status,
      updated_at: new Date(),
    },
  });

  const jwt = "SIGNED_JWT_HERE";

  res.cookie("auth_token", jwt, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  res.redirect(302, "");
};
