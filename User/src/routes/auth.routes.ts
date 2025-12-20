import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authMe } from "../controllers/auth.controller.js";

const app = express();

const router = express.Router();

router.get("/me", authMiddleware, authMe);

export default router;

