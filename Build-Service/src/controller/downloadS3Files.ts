import { s3 } from "../S3/s3Client.js"; // your v3 client instance
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
dotenv.config();
import { fileURLToPath } from "url";
import redis from "redis";

import {
  ListObjectsV2Command,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { Readable } from "stream";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__dirname);

const publisher = redis.createClient();
publisher.connect();

export async function downloadS3File(prefix: string) {
  if (!process.env.AWS_S3_BUCKET) {
    throw new Error("AWS_S3_BUCKET environment variable is not defined");
  }
  const listCommand = new ListObjectsV2Command({
    Bucket: process.env.AWS_S3_BUCKET,
    Prefix: prefix,
  });

  const allFiles = await s3.send(listCommand);

  const allPromises =
    allFiles.Contents?.map(({ Key: key }) => {
      return new Promise(async (resolve) => {
        if (!key) {
          resolve("");
          return;
        }

        const relativeKey = key.replace(/^output\//, "");
        const finalOutputPath = path.join(
          __dirname,
          "../../output",
          relativeKey
        );

        console.log(finalOutputPath);

        const dirName = path.dirname(finalOutputPath);
        if (!fs.existsSync(dirName)) {
          fs.mkdirSync(dirName, { recursive: true });
        }

        const outputFile = fs.createWriteStream(finalOutputPath);

    
        const getCmd = new GetObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET,
          Key: key,
        });

        const data = await s3.send(getCmd);

        const bodyStream = data.Body as Readable;

        if (!bodyStream) {
          resolve("");
          return;
        }

        bodyStream.pipe(outputFile).on("finish", () => resolve(""));
      });
    }) || [];

  console.log("awaiting");
  await Promise.all(allPromises.filter((x) => x !== undefined));
  console.log("done");

  const id = prefix.split("/")[1];
  console.log(id);

  if (id) {
    await publisher.hSet("status", id, "deploying");
  }
}