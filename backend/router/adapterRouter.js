import express from "express";
const router = express.Router();
import {
  generateAudio,
  generateImage,
  generateVideo,
} from "../controller/deepinfraController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";

router.post("/generate-video", generateVideo);
router.post("/generate-image", generateImage);
router.post("/generate-audio", generateAudio);

export default router;
