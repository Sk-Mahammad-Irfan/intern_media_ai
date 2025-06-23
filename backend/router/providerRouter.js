import express from "express";
import {
  generateAudioForProvider,
  generateImageForProvider,
  generateVideoForProvider,
} from "../controller/provider.js";

const router = express.Router();

// Update user credits - requires authentication
router.post("/video/:id", generateVideoForProvider);
router.post("/image/:id", generateImageForProvider);
router.post("/audio/:id", generateAudioForProvider);

export default router;
