import express from "express";
const router = express.Router();
import { generateVideoFal } from "../controller/falController.js";
import { generateVideo } from "../controller/deepinfraController.js";

router.post("/generate-video", generateVideo);

export default router;
