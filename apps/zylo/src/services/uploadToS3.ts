import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '../utils/s3Client.js';
import { v4 as uuid } from 'uuid';

export async function uploadImageToS3(file: Express.Multer.File, id: string) {
  const key = `pipelinesAvatars/${id}/${file.originalname}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype
    }),
  );

  return {
    key,
    url: `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${key}`,
  };
}
