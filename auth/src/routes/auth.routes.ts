import express from "express";
import {
  oauthGithubController,
  redirectHandlerGithubController,
  getName,
  logoutController
} from "../controllers/auth.controller.js";

const router = express.Router();
router.get("/github", oauthGithubController);
router.get("/github/callback", redirectHandlerGithubController);
router.post("/get-username", getName);
router.post("/logout", logoutController);

export default router;
