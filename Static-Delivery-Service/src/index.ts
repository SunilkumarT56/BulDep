import express from "express";
import cors from "cors";
import AWS from "aws-sdk";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
console.log("working well");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  region: process.env.AWS_REGION || "us-east-1",
});

const s3 = new AWS.S3();
const BUCKET = process.env.AWS_S3_BUCKET || "";


app.get(/.*/, async (req, res) => {
  const host = req.hostname;
  const id = host.split(".")[0];

  let filepath = req.path;

  // Fix root path
  if (filepath === "/" || filepath === "") {
    filepath = "/index.html";
  }

  const key = `main/${id}${filepath}`;
  console.log("Fetching S3 key:", key);

  try {
    const contents = await s3.getObject({
      Bucket: BUCKET,
      Key: key
    }).promise();

    const type =
      filepath.endsWith(".html") ? "text/html" :
      filepath.endsWith(".css") ? "text/css" :
      filepath.endsWith(".svg") ? "image/svg+xml" :
      filepath.endsWith(".png") ? "image/png" :
      filepath.endsWith(".jpg") || filepath.endsWith(".jpeg") ? "image/jpeg" :
      "application/javascript";

    res.set("Content-Type", type);
    res.send(contents.Body);
  } catch (err) {
    console.error("S3 ERROR:", err);
    res.status(404).send("File not found");
  }
});




app.listen(PORT , ()=>{
    console.log(`App is up and running on port ${PORT}`);
});