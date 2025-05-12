// routes/adapterRoutes.js
import express from "express";
const router = express.Router();

import {
  generateAudioWithKey,
  generateImageWithKey,
  generateVideoWithKey,
} from "../controller/adapterControllerWithKey.js";

router.post("/generate-video/:id", generateVideoWithKey);
router.post("/generate-image/:id", generateImageWithKey);
router.post("/generate-audio/:id", generateAudioWithKey);

export default router;
