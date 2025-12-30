import express from "express";
import {
  oauthGithubController,
  redirectHandlerGithubController,
  logoutController,
  emailRequestController,
  oauthGoogleController,
  redirectHandlerGoogleController
} from "../controllers/auth.controller.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.post("/email",emailRequestController)
router.get("/github", oauthGithubController);
router.get("/google", oauthGoogleController )
router.get("/github/callback", redirectHandlerGithubController);
router.get("/google/callback",redirectHandlerGoogleController)
router.post("/logout", logoutController);
router.get("/health", (req, res) => {
  res.send("working");
});


export default router;
