import type { Request, Response } from "express";

export const authMe = (req: Request, res: Response): Promise<void> => {
  console.log("frontend asked");
  console.log(req.body.user);
  res.json({
    authenticated: true,
    user: req.body.user,
  });
  return new Promise(() => {});
};
