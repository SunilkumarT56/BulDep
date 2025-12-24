import type { Request, Response } from "express";
import type {
  AuthenticateUserRequest,
  DeployData,
} from "../types/interface.js";
import { pool } from "../config/postgresql.js";
import axios from "axios";
import {
  getLastCommits,
  getRepoRootDirectories,
  getRepoDirectoryContents,
  detectFrontendFramework,
} from "../services/github.service.js";

export const userProfile = async (
  req: AuthenticateUserRequest,
  res: Response
): Promise<void> => {
  const { id } = req.user as { id: string };

  const { rows } = await pool.query(
    `
  SELECT 
    u.id,
    u.email,
    u.avatar_url,
    gp.name AS github_name
  FROM users u
  LEFT JOIN github_profiles gp
    ON gp.user_id = u.id
  WHERE u.id = $1
  LIMIT 1
  `,
    [id]
  );

  const user = rows[0];

  if (!user) {
    res.status(401).json({ status: false, error: "Unauthorized" });
    return;
  }
  console.log(user);
  res.json({
    authenticated: true,
    user,
  });
  return new Promise(() => {});
};
export const repoListController = async (
  req: AuthenticateUserRequest,
  res: Response
): Promise<void> => {
  const { id } = req.user as { id: string };
  const pageNumber = Number(req.query.page ?? 1);

  if (!Number.isInteger(pageNumber) || pageNumber < 1) {
    res.status(400).json({ error: "Invalid page number" });
    return;
  }

  const { rows } = await pool.query(
    `
    SELECT 
      u.id,
      u.avatar_url,
      gp.name AS github_name,
      gp.login,
      oa.access_token
    FROM users u
    LEFT JOIN github_profiles gp
      ON gp.user_id = u.id
    LEFT JOIN oauth_accounts oa
      ON oa.user_id = u.id
     AND oa.provider = 'github'
    WHERE u.id = $1
    LIMIT 1;
    `,
    [id]
  );

  const user = rows[0];

  if (!user) {
    res.status(401).json({ status: false, error: "Unauthorized" });
    return;
  }
  console.log(user);

  const access_token = user.access_token;
  const { login, avatar_url } = user;

  if (!access_token) {
    res.status(400).json({ error: "GitHub account not linked" });
    return;
  }

  const PER_PAGE = 6;

  const githubRes = await axios.get("https://api.github.com/user/repos", {
    headers: {
      Authorization: `Bearer ${access_token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    params: {
      per_page: PER_PAGE,
      page: pageNumber,
      sort: "updated",
      direction: "desc",
    },
  });

  const repos = githubRes.data.map((repo: any) => ({
    id: repo.id,
    name: repo.name,
    full_name: repo.full_name,
    private: repo.private,
    default_branch: repo.default_branch,
    html_url: repo.html_url,
    updated_at: repo.updated_at,
  }));

  res.json({
    login,
    avatar_url,
    page: pageNumber,
    per_page: PER_PAGE,
    hasNextPage: repos.length === PER_PAGE,
    repos,
  });
};
export const repoPreviewController = async (
  req: AuthenticateUserRequest,
  res: Response
) => {
  const { owner, repoName } = req.body;
  const { id: userId } = req.user as { id: string };

  if (!owner || !repoName) {
    res.status(400).json({ error: "Missing repo info" });
    return;
  }
  const { rows } = await pool.query(
    `
    SELECT access_token
    FROM oauth_accounts
    WHERE user_id = $1 AND provider = 'github'
    LIMIT 1
    `,
    [userId]
  );

  const accessToken = rows[0]?.access_token;
  if (!accessToken) {
    res.status(400).json({ error: "GitHub not linked" });
    return;
  }

  const repoRes = await axios.get(
    `https://api.github.com/repos/${owner}/${repoName}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  const langRes = await axios.get(
    `https://api.github.com/repos/${owner}/${repoName}/languages`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
      },
    }
  );
  const commitRes = await getLastCommits(accessToken, owner, repoName);
  console.log(commitRes);

  res.json({
    commits: commitRes,
    name: repoRes.data.name,
    full_name: repoRes.data.full_name,
    private: repoRes.data.private,
    default_branch: repoRes.data.default_branch,
    stars: repoRes.data.stargazers_count,
    forks: repoRes.data.forks_count,
    open_issues: repoRes.data.open_issues_count,
    updated_at: repoRes.data.updated_at,
    html_url: repoRes.data.html_url,
    language: repoRes.data.language,
    languages: langRes.data,
  });
};
export const externalUrlController = async (req: Request, res: Response) => {
  const { githubUrl } = req.body;
  console.log(githubUrl);
  res.json({
    status: true,
  });
};
export const importRepoController = async (
  req: AuthenticateUserRequest,
  res: Response
) => {
  const { owner, repoName } = req.body;
  const { id: userId } = req.user as { id: string };

  if (!owner || !repoName) {
    res.status(400).json({ error: "Missing repo info" });
    return;
  }
  const { rows } = await pool.query(
    `
    SELECT access_token
    FROM oauth_accounts
    WHERE user_id = $1 AND provider = 'github'
    LIMIT 1
    `,
    [userId]
  );

  const accessToken = rows[0]?.access_token;
  if (!accessToken) {
    res.status(400).json({ error: "GitHub not linked" });
    return;
  }

  const dirs = await getRepoRootDirectories(accessToken, owner, repoName);
  console.log(dirs);
  res.json({
    status: true,
    directories: dirs,
  });
};
export const frameworkDetectController = async (
  req: AuthenticateUserRequest,
  res: Response
) => {
  const { owner, repoName, rootDirectory } = req.body;
  console.log(owner, repoName, rootDirectory);
  const { id: userId } = req.user as { id: string };

  if (!owner || !repoName) {
    res.status(400).json({ error: "Missing repo info" });
    return;
  }
  const { rows } = await pool.query(
    `
    SELECT access_token
    FROM oauth_accounts
    WHERE user_id = $1 AND provider = 'github'
    LIMIT 1
    `,
    [userId]
  );

  const accessToken = rows[0]?.access_token;
  if (!accessToken) {
    res.status(400).json({ error: "GitHub not linked" });
    return;
  }
  const files = await getRepoDirectoryContents(
    accessToken,
    owner,
    repoName,
    rootDirectory
  );
  const response = await detectFrontendFramework(files);
  console.log(response);
  res.json({
    status: true,
    response,
  });
};
export const deployProjectController = async (
  req: DeployData,
  res: Response
) => {
  const data = req.body as DeployData;
  console.log(data);
  res.json({
    status: true,
  });
};
