// controller/adapterControllerWithKey.js
import { fal } from "@fal-ai/client";
import dotenv from "dotenv";
import User from "../models/userModel.js"; // assuming you already have a User model
import { checkCredits, decreaseCredits } from "./creditController.js";

import { videoGenerationHandlers } from "../handlers/videohandlers.js";
import { imageGenerationHandlers } from "../handlers/imagehandlers.js";
import { audioGenerationHandlers } from "../handlers/audiohandlers.js";
import ApiKeyModel from "../models/apikeyModel.js";

dotenv.config();
fal.config({ credentials: process.env.FAL_AI_API });

const getUserByApiKey = async (req) => {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey) throw new Error("API key missing");
  const user = await ApiKeyModel.findOne({ key: apiKey });
  if (!user) throw new Error("Invalid API key");
  return user;
};

// -------- VIDEO GENERATION WITH API KEY --------
export const generateVideoWithKey = async (req, res) => {
  const { id } = req.params;
  const { prompt } = req.body;

  if (!prompt) return res.status(400).json({ error: "Please enter a prompt." });

  let user;
  try {
    user = await getUserByApiKey(req);
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }

  const handlers = videoGenerationHandlers
    .filter((h) => h.model === id)
    .sort((a, b) => a.credits - b.credits);
  if (handlers.length === 0)
    return res.status(400).json({ error: "Invalid model ID." });

  for (const { handler, credits, type } of handlers) {
    try {
      const hasEnough = await checkCredits(user.userId, credits);
      if (!hasEnough)
        return res.status(402).json({ error: "Not enough credits." });

      const rawData = await handler(prompt);
      let videoUrl = null;

      switch (type) {
        case "fal":
          videoUrl = rawData?.video?.url;
          break;
        case "replicate":
          videoUrl = rawData?.video?.url || rawData?.url || rawData;
          break;
        case "deepinfra":
          videoUrl = rawData?.video_url || rawData?.data?.video_url;
          break;
      }

      if (!videoUrl) continue;

      await decreaseCredits(user.userId, credits);
      return res.status(200).json({ videoUrl });
    } catch (err) {
      console.error("Video handler error:", err.message || err);
    }
  }

  res.status(500).json({ error: "All handlers failed to generate video." });
};

// -------- IMAGE GENERATION WITH API KEY --------
export const generateImageWithKey = async (req, res) => {
  const { id } = req.params;
  const { prompt } = req.body;

  if (!prompt) return res.status(400).json({ error: "Please enter a prompt." });

  let user;
  try {
    user = await getUserByApiKey(req);
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }

  const handlers = imageGenerationHandlers
    .filter((h) => h.model === id)
    .sort((a, b) => a.credits - b.credits);
  if (handlers.length === 0)
    return res.status(400).json({ error: "Invalid model ID." });

  for (const { handler, credits, type } of handlers) {
    try {
      const hasEnough = await checkCredits(user.userId, credits);
      if (!hasEnough)
        return res.status(402).json({ error: "Not enough credits." });

      const rawData = await handler(prompt);
      let imageUrl = null;

      switch (type) {
        case "fal":
          imageUrl = rawData?.images?.[0]?.url;
          break;
        case "base64":
          const base64 = rawData?.data?.[0]?.b64_json;
          imageUrl = base64 ? `data:image/jpeg;base64,${base64}` : null;
          break;
        case "segmind":
          imageUrl = rawData?.output?.[0];
          break;
      }

      if (!imageUrl) continue;

      await decreaseCredits(user.userId, credits);
      return res.status(200).json({ imageUrl });
    } catch (err) {
      console.error("Image handler error:", err.message || err);
    }
  }

  res.status(500).json({ error: "All handlers failed to generate image." });
};

// -------- AUDIO GENERATION WITH API KEY --------
export const generateAudioWithKey = async (req, res) => {
  const { id } = req.params;
  const { prompt, duration } = req.body;

  if (!prompt) return res.status(400).json({ error: "Please enter a prompt." });

  let user;
  try {
    user = await getUserByApiKey(req);
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }

  const handlers = audioGenerationHandlers
    .filter((h) => h.model === id)
    .sort((a, b) => a.credits - b.credits);
  if (handlers.length === 0)
    return res.status(400).json({ error: "Invalid model ID." });

  for (const { handler, credits } of handlers) {
    try {
      const hasEnough = await checkCredits(user.userId, credits);
      if (!hasEnough)
        return res.status(402).json({ error: "Not enough credits." });

      const audioUrl =
        id === "multilingual-audio"
          ? await handler(prompt)
          : await handler(prompt, duration);

      if (!audioUrl) continue;

      await decreaseCredits(user.userId, credits);
      return res.status(200).json({ audioUrl });
    } catch (err) {
      console.error("Audio handler error:", err.message || err);
    }
  }

  res.status(500).json({ error: "All handlers failed to generate audio." });
};
