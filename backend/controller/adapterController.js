import { fal } from "@fal-ai/client";
import dotenv from "dotenv";
import { checkCredits, decreaseCredits } from "./creditController.js";

// Handler imports
import { videoGenerationHandlers } from "../handlers/videohandlers.js";
import { imageGenerationHandlers } from "../handlers/imagehandlers.js";
import { audioGenerationHandlers } from "../handlers/audiohandlers.js";

dotenv.config();

fal.config({
  credentials: process.env.FAL_AI_API,
});
fal.config({
  credentials: process.env.FAL_AI_AUDIO_API,
});

// -------- VIDEO GENERATION --------
export const generateVideo = async (req, res) => {
  const { id } = req.params;
  const { prompt, userId, aspect_ratio, resolution } = req.body;

  if (!userId) {
    return res.status(401).json({ error: "Please login to generate videos." });
  }
  if (!prompt) {
    return res.status(400).json({ error: "Please enter a prompt." });
  }

  const matchingHandlers = videoGenerationHandlers
    .filter((h) => h.model === id)
    .sort((a, b) => a.credits - b.credits);

  if (matchingHandlers.length === 0) {
    return res.status(400).json({ error: "Invalid model ID." });
  }

  for (const { handler, credits, type } of matchingHandlers) {
    try {
      const hasEnoughCredits = await checkCredits(userId, credits);

      if (!hasEnoughCredits) {
        return res.status(402).json({ error: "Not enough credits." });
      }
      console.log("Trying handler:", handler);
      const rawData = await handler(prompt, resolution, aspect_ratio);
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
        default:
          console.warn(`Unknown handler type: ${type}`);
          break;
      }

      if (!videoUrl) {
        console.warn(
          "Handler did not return a valid video, trying next one..."
        );
        continue;
      }

      try {
        await decreaseCredits(userId, credits);
      } catch (creditError) {
        return res.status(402).json({ error: creditError.message });
      }

      return res.status(200).json({ videoUrl });
    } catch (error) {
      console.error("Handler failed, trying next one:", error.message || error);
    }
  }

  res.status(500).json({ error: "All handlers failed to generate video." });
};

// -------- IMAGE GENERATION --------
export const generateImage = async (req, res) => {
  const { id } = req.params;
  const { prompt, userId, resolution } = req.body;

  if (!userId) {
    return res.status(401).json({ error: "Please login to generate videos." });
  }
  if (!prompt) {
    return res.status(400).json({ error: "Please enter a prompt." });
  }

  const matchingHandlers = imageGenerationHandlers
    .filter((h) => h.model === id)
    .sort((a, b) => a.credits - b.credits);

  if (matchingHandlers.length === 0) {
    return res.status(400).json({ error: "Invalid model ID." });
  }

  for (const { handler, credits, type } of matchingHandlers) {
    try {
      const hasEnoughCredits = await checkCredits(userId, credits);

      if (!hasEnoughCredits) {
        return res.status(402).json({ error: "Not enough credits." });
      }

      const rawData = await handler(prompt, resolution);
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
        default:
          console.warn(`Unknown handler type: ${type}`);
          break;
      }

      if (!imageUrl) {
        console.warn(
          "Handler did not return a valid image, trying next one..."
        );
        continue;
      }

      try {
        await decreaseCredits(userId, credits);
      } catch (creditError) {
        return res.status(402).json({ error: creditError.message });
      }

      return res.status(200).json({ imageUrl });
    } catch (error) {
      console.error("Handler error, trying next one:", error.message || error);
    }
  }

  res.status(500).json({ error: "All handlers failed to generate image." });
};

// -------- AUDIO GENERATION --------
export const generateAudio = async (req, res) => {
  const { prompt, userId, duration } = req.body;
  const { id } = req.params;

  if (!userId) {
    return res.status(401).json({ error: "Please login to generate videos." });
  }
  if (!prompt) {
    return res.status(400).json({ error: "Please enter a prompt." });
  }

  const matchingHandlers = audioGenerationHandlers
    .filter((h) => h.model === id)
    .sort((a, b) => a.credits - b.credits);

  if (matchingHandlers.length === 0) {
    return res.status(400).json({ error: "Invalid model ID." });
  }

  for (const { handler, credits } of matchingHandlers) {
    try {
      const hasEnoughCredits = await checkCredits(userId, credits);

      if (!hasEnoughCredits) {
        return res.status(402).json({ error: "Not enough credits." });
      }

      let audioUrl = null;
      if (id === "multilingual-audio") {
        audioUrl = await handler(prompt);
      } else {
        audioUrl = await handler(prompt, duration);
      }

      if (!audioUrl) {
        console.warn("No audio returned, trying next handler...");
        continue;
      }

      try {
        await decreaseCredits(userId, credits);
      } catch (creditError) {
        return res.status(402).json({ error: creditError.message });
      }

      return res.status(200).json({ audioUrl });
    } catch (error) {
      console.error("Audio handler failed:", error.message || error);
    }
  }
  return res.status(500).json({ error: "All audio generators failed." });
};
