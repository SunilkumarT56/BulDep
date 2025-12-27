import type { GhData } from "@zylo/types";
import axios from "axios";
import { pool } from "../config/postgresql.js";

const ghClient = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Accept: "application/vnd.github+json",
  },
});

export const ghDataCollector = async (accessToken: string): Promise<GhData> => {
  if (!accessToken) {
    throw new Error("GitHub access token missing");
  }

  const authHeader = {
    Authorization: `Bearer ${accessToken}`,
  };

  const [ghUserRes, ghEmailsRes] = await Promise.all([
    ghClient.get("/user", { headers: authHeader }),
    ghClient.get("/user/emails", { headers: authHeader }),
  ]);

  return {
    ghUser: ghUserRes.data,
    ghEmails: ghEmailsRes.data,
  };
};

export const upsertGithubProfile = async (
  client: any,
  userId: string,
  ghUser: GhData["ghUser"],
  ghEmails: GhData["ghEmails"]
) => {
  await client.query(
    `
    INSERT INTO github_profiles (
      user_id,
      github_id,
      login,
      avatar_url,
      gravatar_id,
      html_url,
      repos_url,
      organizations_url,
      events_url,
      received_events_url,
      name,
      company,
      blog,
      location,
      bio,
      twitter_username,
      hireable,
      site_admin,
      public_repos,
      public_gists,
      followers,
      following,
      created_at_github,
      updated_at_github,
      emails
    )
    VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
      $11, $12, $13, $14, $15, $16, $17, $18,
      $19, $20, $21, $22, $23, $24, $25
    )
    ON CONFLICT (github_id)
    DO UPDATE SET
      avatar_url        = EXCLUDED.avatar_url,
      name              = EXCLUDED.name,
      company           = EXCLUDED.company,
      blog              = EXCLUDED.blog,
      location          = EXCLUDED.location,
      bio               = EXCLUDED.bio,
      twitter_username  = EXCLUDED.twitter_username,
      public_repos      = EXCLUDED.public_repos,
      public_gists      = EXCLUDED.public_gists,
      followers         = EXCLUDED.followers,
      following         = EXCLUDED.following,
      emails            = EXCLUDED.emails,
      updated_at_github = EXCLUDED.updated_at_github
    `,
    [
      userId,
      ghUser.id,
      ghUser.login,
      ghUser.avatar_url,
      ghUser.gravatar_id,
      ghUser.html_url,
      ghUser.repos_url,
      ghUser.organizations_url,
      ghUser.events_url,
      ghUser.received_events_url,
      ghUser.name,
      ghUser.company,
      ghUser.blog,
      ghUser.location,
      ghUser.bio,
      ghUser.twitter_username,
      ghUser.hireable,
      ghUser.site_admin,
      ghUser.public_repos,
      ghUser.public_gists,
      ghUser.followers,
      ghUser.following,
      new Date(ghUser.created_at),
      new Date(ghUser.updated_at),
      JSON.stringify(ghEmails),
    ]
  );
};
