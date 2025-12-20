import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
dotenv.config();

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { auth_token } = req.cookies;
  console.log(auth_token);
  try {
    if (!auth_token) {
      res.status(401).json({ status: false, error: "Unauthorizedd" });
      return;
    }
    const decoded = jwt.verify(auth_token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    (req as any).user = { id: decoded.userId };
    next();
    return;
  } catch (error) {
    res.status(401).json({ status: false, error: "Unauthorized" });
  }
};
