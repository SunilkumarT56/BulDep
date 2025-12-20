import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import dotenv from "dotenv";
dotenv.config();


const PORT = 7004;

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    exposedHeaders: ["set-cookie"],
  })
);


// app.use("/user" , authRoutes);
app.use("/", authRoutes);

app.listen(PORT , () => {
    console.log(`User Service is running on port ${PORT}`);
})