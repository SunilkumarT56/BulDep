import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import deployRouter from "./routes/deployRouter.js";
import webhookRouter from "./routes/webhookRoutes.js";
import bodyParser from "body-parser";
dotenv.config();
import { connectDB } from "./conifg/db.js";
await connectDB();

const PORT = process.env.PORT;

const app = express();
app.use(
  "/api/webhook/deploy",
  bodyParser.json({
    verify: (req: any, res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);
app.use(express.json());
app;
app.use(cors());
app.use("/api/upload", deployRouter);
app.use("/api/webhook", webhookRouter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
