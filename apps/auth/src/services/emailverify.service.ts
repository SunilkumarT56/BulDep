import { redisClient } from "../config/redis.js";
import { pool } from "../config/postgresql.js";
import type { Request, Response } from "express";
import { generateJWT } from "@zylo/auth";
import { cookieSender } from "../utils/cookies.js";

export const emailVerifyController = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  const storedOtp = await redisClient.get(`email_otp:${email}`);

  if (!storedOtp || storedOtp !== otp) {
    return res.status(401).json({ error: "Invalid or expired OTP" });
  }

  await redisClient.del(`email_otp:${email}`);

  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1 LIMIT 1",
    [email]
  );

  const user = result.rows[0] || null;

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const authToken = generateJWT(user.id);
  cookieSender(req, res, "zylo", authToken);

  res.json({ status: true });
};
