import { redisClient } from "../config/redis.js";
import { prisma } from "../config/postgresql.js";
import type { Request, Response } from "express";
import { generateJWT } from "../utils/jwt.js";
import { cookieSender } from "../utils/cookies.js";

export const emailVerifyController = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  const storedOtp = await redisClient.get(`email_otp:${email}`);

  if (!storedOtp || storedOtp !== otp) {
    return res.status(401).json({ error: "Invalid or expired OTP" });
  }

  await redisClient.del(`email_otp:${email}`);

  const user = await prisma.users.findUnique({
    where: { email },
  });

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const authToken = generateJWT(user.id);
  cookieSender(req, res, "zylo", authToken);

  res.json({ status: true });
};
