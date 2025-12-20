// gateway.ts
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import cors from "cors";

const app = express();
const PORT = 6000

// app.use(express.json());
app.use(cors({
  origin : "http://localhost:5173",
  credentials : true,
  exposedHeaders: ["set-cookie"]
}))
app.use((req, _, next) => {
  console.log("Gateway received:", req.method, req.url);
  next();
});

app.use(
  "/auth",
  createProxyMiddleware({ target: "http://localhost:7003", changeOrigin: true })
);

app.use(
  "/user",
  createProxyMiddleware({ target: "http://localhost:7004", changeOrigin: true })
);

app.listen(PORT, () => {
  console.log("Gateway running on" + PORT);
});