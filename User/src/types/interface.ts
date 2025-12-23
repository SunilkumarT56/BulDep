import type { Request } from "express";

export interface AuthenticateUserRequest extends Request {
  user?: {
    id: string;
    email: string;
    avatar_url?: string;
    

  };
}
