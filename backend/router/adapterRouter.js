import express from "express";
const router = express.Router();
import {
  generateVideoDeepinfra,
  generateVideoFal,
  generateVideoReplicate,
} from "../controller/deepinfraController.js";

router.post("/generate-video/fal", generateVideoFal);
router.post("/generate-video/deep", generateVideoDeepinfra);
router.post("/generate-video/repli", generateVideoReplicate);

export default router;
