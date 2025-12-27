import fs from "fs";
import mime from "mime-types";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "./s3Client.js";


export const uploadFile = async (key: string, localFilePath: string) => {
  const fileContent = fs.readFileSync(localFilePath);
  const contentType = mime.lookup(localFilePath) || "application/octet-stream";

  const params = {
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: key,
    Body: fileContent,
    ContentType: contentType,
  };

  try {
    const command = new PutObjectCommand(params);
    const result = await s3.send(command);

    console.log(`✅ Uploaded Successfully: s3://${params.Bucket}/${key}`);
    return `s3://${params.Bucket}/${key}`;
  } catch (err) {
    console.error("❌ Upload Failed:", err);
    throw err;
  }
};