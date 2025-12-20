import express from "express";
import {oauthGithubController, redirectHandlerGithubController} from "../controllers/auth.controller.js"


const router = express.Router();
router.get("/auth/github" , oauthGithubController);
router.get("/auth/github/callback" , redirectHandlerGithubController)

export default router;
