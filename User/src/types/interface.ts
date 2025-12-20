import type { Request } from "express";

export interface AuthenticateUserRequest extends Request {
  user?: {
    email: string;
  };
}
