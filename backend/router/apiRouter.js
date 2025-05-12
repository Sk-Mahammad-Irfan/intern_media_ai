import express from "express";

import {
  deleteAPIKey,
  generateAPIKey,
  getAPIKeys,
} from "../controller/apiKeyController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Update user credits - requires authentication
router.post("/generate-api-key", generateAPIKey);
router.post("/my-api-keys", getAPIKeys);
router.delete("/delete-api-key/:key", deleteAPIKey);

export default router;
