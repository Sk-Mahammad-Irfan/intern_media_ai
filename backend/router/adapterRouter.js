import express from "express";
const router = express.Router();
import {
  generateAudio,
  generateImage,
  generateVideo,
} from "../controller/adapter.js";

router.post("/generate-video/:id", generateVideo);
router.post("/generate-image/:id", generateImage);
router.post("/generate-audio/:id", generateAudio);

export default router;
