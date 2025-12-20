import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

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
      email: string;
    };
    (req as any).user = { email: decoded.email };
    next();
    return;
  } catch (error) {
    res.status(401).json({ status: false, error: "Unauthorized" });
  }
};
