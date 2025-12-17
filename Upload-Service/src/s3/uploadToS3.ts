import fs from "fs";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import {s3} from "./s3Client.js"

export const uploadFile = async (filePath: string, localFilePath: string) => {
  const fileContent = fs.readFileSync(localFilePath);

  const params = {
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: filePath,
    Body: fileContent,
    ContentType: "application/octet-stream",
  };

  try {
    const command = new PutObjectCommand(params);
    await s3.send(command);

    const url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${filePath}`;
    console.log(`✅ Uploaded Successfully: ${url}`);

    return url;
  } catch (err) {
    console.error("❌ Upload Failed:", err);
    throw err;
  }
};
