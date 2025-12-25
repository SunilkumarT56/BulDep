import {
  ReceiveMessageCommand,
  DeleteMessageCommand,
  SQSClient,
} from "@aws-sdk/client-sqs";
import dotenv from "dotenv";
dotenv.config();
import { getDeploymentFromDb } from "../worker/deployworker.js";

export const sqs = new SQSClient({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_KEY!,
  },
});

export async function pollSQS() {
  console.log("⏳ Worker polling SQS...");

  const command = new ReceiveMessageCommand({
    QueueUrl: process.env.SQS_URL,
    MaxNumberOfMessages: 10,
    WaitTimeSeconds: 10,
  });

  while (true) {
    const response = await sqs.send(command);

    if (!response.Messages || response.Messages.length === 0) {
      continue;
    }

    for (const msg of response.Messages) {
      //@ts-ignore
      const data = JSON.parse(msg.Body);
      console.log("📩 Received from SQS:", msg.MessageId, data);
      await getDeploymentFromDb(data);

      await sqs.send(
        new DeleteMessageCommand({
          QueueUrl: process.env.SQS_URL,
          ReceiptHandle: msg.ReceiptHandle,
        })
      );

      console.log("✔️ Deleted from SQS:", msg.MessageId);
    }
  }
}
pollSQS().catch((err) => {
  console.error(err);
  process.exit(1);
});
