import type { Request } from "express";

export interface AuthenticateUserRequest extends Request {
  user?: {
    id: string;
    email: string;
    avatar_url?: string;
  };
}
export interface DeployData extends AuthenticateUserRequest {
  deploy: {
    owner: string;
    repoName: string;
    rootDirectory: string;
    framework: string;
    buildCommand: string;
    outputDir: string;
    installCommand: string;
    envs: string;
    projectName: string;
  };
}
