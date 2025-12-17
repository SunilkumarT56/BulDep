import { createClient } from "redis";
import { downloadS3File } from "./controller/downloadS3Files.js"
import {buildReactProject} from "./worker/builder.js"
import { uploadFile } from "./S3/uploadToS3.js";
import { getAllFiles } from "./utils/files.js";
import path from "path";
import {clearBuildFolders} from "./utils/clearFolders.js"


const subscriber = createClient();

subscriber.on?.("ready", () => {
  console.log("✅ Redis connected");
});

subscriber.on?.("error", () => {
  console.error("❌ Redis error:");
});

await subscriber.connect(); 
async function main() {
  console.log("🚀 Waiting for items in build-queue...");
  while (true) {
    const response = await subscriber.brPop("build-queue", 0);
    console.log("📦 Received:", response);
    //@ts-ignore
    await downloadS3File(`output/${response.element}`);
    //@ts-ignore
    await buildReactProject(response.element)
    const buildFolder = `builded-folder/${response?.element}`;
    const files = getAllFiles(buildFolder);

try {
  for (const file of files) {
    console.log("📤 Uploading:", file);

    // Create a relative S3 key (to preserve folder structure)
    const relativePath = file.replace(`${buildFolder}/`, "");
    const s3Key = `main/${response?.element}/${relativePath}`;

    await uploadFile(s3Key, file);
  }

  console.log("🎉 All files uploaded successfully!");
  await clearBuildFolders();
} catch (err) {
  console.error("❌ Upload Error:", err);
}
  }
}

main();