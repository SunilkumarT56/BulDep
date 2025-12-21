import { createClient } from "redis";

export const redisClient = createClient();

redisClient.on?.("ready", () => {
  console.log("✅ Redis connected");
});

redisClient.on?.("error", () => {
  console.error("❌ Redis error:");
});