import express from "express";
import {
  updateCreditsController,
  getCreditsController,
  getCreditHistoryController, 
} from "../controller/creditController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Update user credits - requires authentication
router.patch("/updatecredits", requireSignIn, updateCreditsController);

// Get user credits - requires authentication
router.get("/credits/:userId", requireSignIn, getCreditsController);

router.get("/history/:userId", requireSignIn, getCreditHistoryController);


export default router;
