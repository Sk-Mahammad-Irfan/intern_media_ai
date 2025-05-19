import express from "express";
import {
  generateAudioForProvider,
  generateImageForProvider,
  generateVideoforProvider,
} from "../controller/providerController.js";

const router = express.Router();

// Update user credits - requires authentication
router.post("/video/:id", generateVideoforProvider);
router.post("/image/:id", generateImageForProvider);
router.post("/audio/:id", generateAudioForProvider);

export default router;
