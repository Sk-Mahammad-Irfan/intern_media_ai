import express from "express";
import { generateVideoforProvider } from "../controller/providerController.js";

const router = express.Router();

// Update user credits - requires authentication
router.post("/video/:id", generateVideoforProvider);

export default router;
