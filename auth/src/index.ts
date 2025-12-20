import express  from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";


const app = express();

app.use(express.json());
app.use(cors());



app.use("/auth",authRoutes);
