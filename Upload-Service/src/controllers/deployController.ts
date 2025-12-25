import { v4 as uuid } from "uuid";
import { simpleGit } from "simple-git";
import path from "path";
import { fileURLToPath } from "url";
import { getAllFiles } from "../utils/file.js";
import { uploadFile } from "../s3/uploadToS3.js";
import { createClient } from "redis";
import type { Request, Response } from "express";
import { clearBuildFolders } from "../utils/clearFolder.js";
import { Redis } from "ioredis";
import Repo from "../models/Repo.js";
import { deletePrefix } from "../s3/DeleteS3Files.js";
import fs from "fs";

const publisher = createClient();
const pub = new Redis();
publisher.connect().catch(console.error);
publisher.on("ready", () => console.log("✅ Redis connected"));
publisher.on("error", (err) => console.error("❌ Redis error:", err));

const git = simpleGit();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const deployService = async function (repourl: string) {
  const repo_url = repourl;
  let id = uuid();
  const RepoData = await Repo.findOne({ repoUrl: repo_url });
  pub.publish(`logs:${id}`, `cloning the repo${repo_url}`);
  await git.clone(repo_url, path.join(__dirname, `../../output/${id}`));
  const files = getAllFiles(path.join(__dirname, `../../output/${id}`));
  const rootDir = path.join(__dirname, "../../");
  const outputDir = path.join(rootDir, "output");
  const currectPath = path.join(__dirname, "../../output");
  pub.publish(`logs:${id}`, `uploading the files`);
  for (const file of files) {
    if (file.includes(".git") || file.includes(".DS_Store")) continue;
    console.log("📤 Uploading:", file);
    await uploadFile("output/" + file.slice(outputDir.length + 1), file);
  }

  console.log("✅ Upload done, pushing status to Redis...", id);
  await publisher.hSet("status", id, "uploading");
  await publisher.lPush("build-queue", id);

  await clearBuildFolders(id);

  const hostsPath = "/etc/hosts";
  const entry = `127.0.0.1   ${id}.sunilkumar.com`;

  const hostsContent = fs.readFileSync(hostsPath, "utf8");
  fs.appendFileSync(hostsPath, `\n${entry}\n`);
  console.log("Entry added");
};
