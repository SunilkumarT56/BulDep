import type { Request, Response } from "express";

export const authMe = (req: Request, res: Response): Promise<void> => {
  console.log("frontend asked");
  console.log((req as any).user);
  
  res.json({
    authenticated: true,
    user: (req as any).user,
  });
  return new Promise(() => {});
};
