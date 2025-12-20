import type { Request, Response } from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import axios from "axios";
import { prisma } from "../config/postgresql.js";
import type { User } from "../types/auth.js";
import { generateJWT, generateJWTForName } from "../utils/jwt.js";

export const getName = async (req: Request, res: Response): Promise<void> => {
  const { name } = req.body;
  const user = await prisma.users.create({
    data: {
      name,
    },
  });
  const token: string = generateJWTForName(user.id);
  res.cookie("temp_user_token", token, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    path: "/",
  });
  res.json({ status: true });
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
    secure: true,
    path: "/",
  });

  res.redirect(302, githubAuthURL);
};

export const redirectHandlerGithubController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { code, state } = req.query;
  const { github_oauth_state, temp_user_token } = req.cookies;

  // 1. CSRF FIRST
  if (!state || state !== github_oauth_state) {
    res.status(401).json({ error: "Invalid OAuth state" });
    return 
  }

  if (!temp_user_token) {
    res.status(400).json({ error: "Missing temp token" });
    return 
  }

  // 2. Verify temp token ONCE
  const payload = jwt.verify(
    temp_user_token,
    process.env.JWT_SECRET!
  ) as { userId: string };

  const userId = payload.userId;

  // 3. Fetch user
  const user = await prisma.users.findUnique({
    where: { id: userId },
  });

  if (!user || user.status !== "active") {
    res.status(400).json({ error: "Invalid user" });
    return ;
  }

  // 4. GitHub token exchange
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
  res.status(401).json({ error: "OAuth failed" });
  return;
  }

  // 5. Fetch GitHub profile
  const ghUser = await axios.get("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const ghEmails = await axios.get("https://api.github.com/user/emails", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const primaryEmail = ghEmails.data.find((e: any) => e.primary)?.email;

  // 6. Update user
  await prisma.users.update({
    where: { id: userId },
    data: {
      email: primaryEmail,
      avatar_url: ghUser.data.avatar_url,
      updated_at: new Date(),
    },
  });

  // 7. Issue final auth token
  const authToken = generateJWT(userId)

  const isProd = process.env.NODE_ENV === "production";

  res.clearCookie("temp_user_token", { path: "/" });
  res.clearCookie("github_oauth_state", { path: "/" });

  res.cookie("auth_token", authToken, {
    httpOnly: true,
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
    path: "/",
  });

  res.redirect("http://localhost:5173/dashboard");
};
export const logoutController = async (req: Request, res: Response) => {
  res.clearCookie("auth_token", { path: "/" });
  res.json({ status: true });
};
