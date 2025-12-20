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
  const storedState = github_oauth_state;
  if (!temp_user_token) {
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
  const jsonwebtoken = jwt.verify(temp_user_token, process.env.JWT_SECRET!) as {
    userId: string;
  };
  const userId = jsonwebtoken.userId;
  await prisma.users.update({
    where: { id: userId },
    data: {
      email: user.email,
      avatar_url: user.avatar_url,
      status: user.status,
      updated_at: new Date(),
    },
  });

  const token: string = generateJWT(user.email);
  res.clearCookie("temp_user_token", { path: "/" });
  res.clearCookie("github_oauth_state", { path: "/" });
  const isProd = process.env.NODE_ENV === "production";

res.cookie("auth_token", token, {
  httpOnly: true,
  sameSite: "none",
  secure: false,
  path: "/",
});

  res.redirect(302, "http://localhost:5173/dashboard");
};

export const logoutController = async (req: Request, res: Response) => {
  res.clearCookie("auth_token", { path: "/" });
  res.json({ status: true });
};
