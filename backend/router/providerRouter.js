import express from "express";
import {
  generateImageForProvider,
  generateVideoforProvider,
} from "../controller/providerController.js";

const router = express.Router();

// Update user credits - requires authentication
router.post("/video/:id", generateVideoforProvider);
router.post("/image/:id", generateImageForProvider);

export default router;
