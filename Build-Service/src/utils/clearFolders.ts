import { exec } from "child_process";
import util from "util";

const execPromise = util.promisify(exec);

export async function clearBuildFolders() {
  const cmd = `
     rm -rf output/* &&
     rm -rf builded-folder/*       
  `;

  try {
    const { stdout, stderr } = await execPromise(cmd);
    console.log("Folders cleared:", stdout);
    if (stderr) console.error("stderr:", stderr);
  } catch (error) {
    console.error("clearBuildFolders() Error:", error);
  }
}