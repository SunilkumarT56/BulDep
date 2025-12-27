import { ListObjectsV2Command, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { s3 } from "./s3Client.js";

const bucket = process.env.AWS_S3_BUCKET!;

export async function deletePrefix(prefix: string) {
  if (!prefix.endsWith("/")) {
    prefix = prefix + "/";
  }

  const listed = await s3.send(
    new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix,
    })
  );

  if (listed.Contents && listed.Contents.length > 0) {
    const toDelete = listed.Contents.map((f) => ({ Key: f.Key }));

    await s3.send(
      new DeleteObjectsCommand({
        Bucket: bucket,
        Delete: { Objects: toDelete },
      })
    );

    if (listed.IsTruncated) await deletePrefix(prefix);
  }

  
  await s3.send(
    new DeleteObjectsCommand({
      Bucket: bucket,
      Delete: {
        Objects: [{ Key: prefix }], 
      },
    })
  );
}