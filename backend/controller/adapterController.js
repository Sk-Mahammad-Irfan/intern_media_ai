import { fal } from "@fal-ai/client";
import dotenv from "dotenv";
import { decreaseCredits } from "./creditController.js";

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
  const { prompt, userId } = req.body;

  if (!prompt || !userId) {
    return res.status(400).json({ error: "Prompt and User ID are required." });
  }

  const matchingHandlers = videoGenerationHandlers
    .filter((h) => h.model === id)
    .sort((a, b) => a.credits - b.credits);

  if (matchingHandlers.length === 0) {
    return res.status(400).json({ error: "Invalid model ID." });
  }

  for (const { handler, credits } of matchingHandlers) {
    try {
      console.log("Trying handler:", handler.name);
      const rawData = await handler(prompt);
      let videoUrl = null;

      switch (handler) {
        case wanFAL:
          videoUrl = rawData.video?.url;
          break;
        case wanReplicate:
        case ltxReplicate:
          videoUrl = Array.isArray(rawData)
            ? rawData[0]
            : rawData?.video_url || rawData?.url;
          break;
        case wanDeepinfra:
          videoUrl = rawData.video_url || rawData.data?.video_url;
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
  const { prompt, userId } = req.body;

  if (!prompt || !userId) {
    return res.status(400).json({ error: "Prompt and User ID are required." });
  }

  const matchingHandlers = imageGenerationHandlers
    .filter((h) => h.model === id)
    .sort((a, b) => a.credits - b.credits);

  if (matchingHandlers.length === 0) {
    return res.status(400).json({ error: "Invalid model ID." });
  }

  for (const { handler, credits } of matchingHandlers) {
    try {
      const rawData = await handler(prompt);
      let imageUrl = null;

      switch (handler) {
        case falFluxProV1_1:
        case falRecraftV3:
        case falFooocus:
          imageUrl = rawData?.images?.[0]?.url;
          break;
        case deepFluxProV1_1:
          const base64 = rawData?.data?.[0]?.b64_json;
          imageUrl = base64 ? `data:image/jpeg;base64,${base64}` : null;
          break;
        case segmindRecraftV3:
          imageUrl = rawData?.output?.[0];
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

  if (!prompt || !userId) {
    return res.status(400).json({ error: "Prompt and User ID are required." });
  }

  const matchingHandlers = audioGenerationHandlers
    .filter((h) => h.model === id)
    .sort((a, b) => a.credits - b.credits);

  if (matchingHandlers.length === 0) {
    return res.status(400).json({ error: "Invalid model ID." });
  }

  for (const { handler, credits } of matchingHandlers) {
    try {
      const audioUrl = await handler(prompt, duration);

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
