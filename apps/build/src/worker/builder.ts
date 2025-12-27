import { execSync } from "child_process";
import fs from "fs";
import redis from "redis";
import path from "path";
import { fileURLToPath } from "url";
import yaml from "js-yaml";

const config: any = yaml.load(fs.readFileSync("./vercel-clone.yml", "utf-8"));

const publisher = redis.createClient();
publisher.connect();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function buildReactProject(deploymentId: string) {
  let projectPath = path.join(__dirname, "../../output", deploymentId);
  const outputPath = path.join(__dirname, "../../builded-folder", deploymentId);

  if (config.root && config.root.trim() !== "") {
    projectPath = path.join(projectPath, config.root);
  }

  fs.mkdirSync(outputPath, { recursive: true });

  console.log("📂 Final projectPath =", projectPath);

  try {
    console.log("📄 Files in projectPath:", fs.readdirSync(projectPath));
  } catch (e) {
    console.log("❌ ERROR: projectPath doesn't exist");
  }

  if (!fs.existsSync(path.join(projectPath, "package.json"))) {
    console.error("❌ No package.json found in:", projectPath);
    throw new Error("Project has no package.json (wrong upload or wrong root folder)");
  }

  console.log(`🚀 Building project ${deploymentId}...`);

  try {
    execSync(
      `
      docker run --rm --user root \
        -v ${projectPath}:/src \
        -v ${outputPath}:/build \
        node:20-alpine \
        sh -c "
          set -e
          cd /src

          echo '📦 Installing dependencies...'

          if [ -f pnpm-lock.yaml ]; then
            corepack enable && pnpm i --frozen-lockfile
          elif [ -f yarn.lock ]; then
            npm i -g yarn >/dev/null 2>&1 && yarn install --frozen-lockfile
          else
            npm install --legacy-peer-deps
          fi

          echo '⚙ Building the project...'
          (npm run build || yarn build || pnpm build || npx vite build)

          mkdir -p /build

          if [ -d dist ]; then
            cp -r dist/* /build/;
          elif [ -d build ]; then
            cp -r build/* /build/;
          elif [ -d out ]; then
            cp -r out/* /build/;
          elif [ -d .next ]; then
            echo '⚙ Detected Next.js build';
            if [ -d out ]; then
              cp -r out/* /build/;
            else
              echo '❌ Next.js app is not configured for static export';
              echo '👉 Add output: \"export\" in next.config.js';
              exit 1;
            fi
          else
            echo '❌ No build directory found';
            exit 1;
          fi
        "
      `,
      { stdio: "inherit" }
    );

    console.log(`✅ Build complete for ${deploymentId}`);
    await publisher.hSet("status", deploymentId, "builded");
  } catch (err) {
    console.error(`❌ Build failed for ${deploymentId}:`);
    throw err;
  }
}