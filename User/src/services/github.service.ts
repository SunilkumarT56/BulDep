import axios from "axios";

export const getLastCommits = async (
  accessToken: string,
  owner: string,
  repo: string
) => {
  const res = await axios.get(
    `https://api.github.com/repos/${owner}/${repo}/commits`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      params: {
        per_page: 5,
      },
    }
  );

  return res.data.map((c: any) => ({
    message: c.commit.message.split("\n")[0],
    author: c.commit.author?.name ?? "Unknown",
    time: c.commit.author?.date,
  }));
};
export const getRepoRootDirectories = async (
  accessToken: string,
  owner: string,
  repo: string
) => {
  const res = await axios.get(
    `https://api.github.com/repos/${owner}/${repo}/contents`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  return res.data
    .filter((item: any) => item.type === "dir")
    .map((dir: any) => ({
      name: dir.name,
      path: dir.path,
    }));
};
export const getRepoDirectoryContents = async (
  accessToken: string,
  owner: string,
  repo: string,
  path: string
) => {
  const res = await axios.get(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  return res.data.map((item: any) => ({
    name: item.name,
    path: item.path,
    type: item.type,
  }));
};
export const detectFrontendFramework = async (files: { name: string }[]) => {
  const names = files.map((f) => f.name);
  console.log(names);
  let installCommand = "npm install";

  if (names.includes("pnpm-lock.yaml")) {
    installCommand = "pnpm install";
  } else if (names.includes("yarn.lock")) {
    installCommand = "yarn install";
  } else if (names.includes("package-lock.json")) {
    installCommand = "npm install";
  }

  if (names.includes("vite.config.ts") || names.includes("vite.config.js")) {
    return {
      framework: "Vite",
      outputDir: "dist",
      installCommand,
      buildCommand: "npm run build",
    };
  }

  if (names.includes("next.config.js") || names.includes("next.config.ts")) {
    return {
      framework: "Next.js",
      installCommand,
    };
  }

  return {
    framework: "unknown",
    confidence: "low",
  };
};
