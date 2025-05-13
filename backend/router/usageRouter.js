import express from "express";
import { getModelUsageStats } from "../utils/incrementModelUsage.js";

const router = express.Router();

// Route to get model usage stats
router.get("/stats", getModelUsageStats);

export default router;
