import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  userProfile,
  repoListController,
  repoPreviewController,
  externalUrlController
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/me", authMiddleware, userProfile);
router.get("/new", authMiddleware, repoListController);
router.post("/preview", authMiddleware, repoPreviewController);
router.post("/github-url",authMiddleware,externalUrlController)

export default router;
