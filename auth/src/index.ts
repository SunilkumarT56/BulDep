import express  from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"
dotenv.config();
import authRoutes from "./routes/auth.routes.js";

const PORT = 7003;

const app = express();

app.use(express.json());
app.use(cors({
    origin : "http://localhost:5173",
    credentials : true,
    exposedHeaders: ["set-cookie"]
}));
app.use(cookieParser());



// app.use("/auth",authRoutes);
app.use("/",authRoutes)
app.get("/health" , (req , res) => {
    res.send("working");
})

app.listen(PORT , () => {
    console.log(`App is up and running on ${PORT}`);
})
