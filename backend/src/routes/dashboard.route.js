import { Router } from "express";
import { getTrendingData } from "../controllers/dashboard.controller.js";
import { verifyAccessToken } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/").get(verifyAccessToken,getTrendingData)

export default router;