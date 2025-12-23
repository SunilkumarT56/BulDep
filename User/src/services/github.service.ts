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