import { deployService } from "./deployController.js";
export const webhook = async (req: any, res: any) => {
  const event = req.headers["x-github-event"];
  console.log("Webhook event:", event);
  const repourl = req.body.repository.clone_url;
  await deployService(repourl);
  res.status(200).send("OK");
};
