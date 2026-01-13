import express from "express";
import cors from "cors";
import authRoutes from "./routes/user.routes.js";
import dotenv from "dotenv";
import { redisClient } from "./services/redis.service.js";
import { emailSender } from './utils/deque.js';


dotenv.config();

const PORT = process.env.PORT || 7004;
const app = express();
await redisClient.connect();


// await emailSender();


app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: false,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization" , "ngrok-skip-browser-warning"],
  })
);

app.use("/", authRoutes);

app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});
