import { fal } from "@fal-ai/client";
import dotenv from "dotenv";
import { decreaseCredits } from "./creditController.js";
import { videoGenerationHandlers } from "../handlers/videohandlers.js";
import { deepFluxProV1_1, falFluxProV1_1 } from "../services/flux11Service.js";
import { falFooocus } from "../services/fooocusService.js";
import {
  falRecraftV3,
  segmindRecraftV3,
} from "../services/recraftv3Service.js";
import {
  generateAudioWithFal,
  generateWithRapidApiAudio,
} from "../services/audioServices.js";
import { stableFal, stableReplicate } from "../services/stableService.js";
dotenv.config();

fal.config({
  credentials: process.env.FAL_AI_API,
});
fal.config({
  credentials: process.env.FAL_AI_AUDIO_API,
});

export const generateVideo = async (req, res) => {
  const { id } = req.params;
  const { prompt, userId } = req.body;

  if (!prompt || !userId) {
    return res.status(400).json({ error: "Prompt and User ID are required." });
  }

  const matchingHandlers = videoGenerationHandlers
    .filter((h) => h.model === id)
    .sort((a, b) => a.credits - b.credits); // Try cheapest first

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
          videoUrl = Array.isArray(rawData)
            ? rawData[0]
            : rawData?.video_url || rawData?.url;
          break;
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
      continue;
    }
  }

  res.status(500).json({ error: "All handlers failed to generate video." });
};

export const generateImage = async (req, res) => {
  const { id } = req.params;
  const { prompt, userId } = req.body;

  if (!prompt || !userId) {
    return res.status(400).json({ error: "Prompt and User ID are required." });
  }

  // All generation handlers and their metadata
  const generationHandlers = [
    {
      model: "flux-pro",
      handler: falFluxProV1_1,
      credits: 3,
    },
    {
      model: "flux-pro",
      handler: deepFluxProV1_1,
      credits: 6,
    },
    {
      model: "recraft-v3",
      handler: falRecraftV3,
      credits: 4,
    },
    {
      model: "recraft-v3",
      handler: segmindRecraftV3,
      credits: 2,
    },
    {
      model: "fooocus",
      handler: falFooocus,
      credits: 4,
    },
  ];

  // Find all handlers matching the requested model
  const matchingHandlers = generationHandlers
    .filter((h) => h.model === id)
    .sort((a, b) => a.credits - b.credits); // Sort by cheapest first

  if (matchingHandlers.length === 0) {
    return res.status(400).json({ error: "Invalid model ID." });
  }

  // Try each handler until one succeeds
  for (const { handler, credits } of matchingHandlers) {
    try {
      console.log("handler", handler);
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
        continue; // Try next cheaper handler
      }

      // Decrease credits after successful generation
      try {
        await decreaseCredits(userId, credits);
      } catch (creditError) {
        return res.status(402).json({ error: creditError.message });
      }

      return res.status(200).json({ imageUrl });
    } catch (error) {
      console.error("Handler error, trying next one:", error.message || error);
      continue; // Try next cheaper handler
    }
  }

  res.status(500).json({ error: "All handlers failed to generate image." });
};

// Audio generation function
export const generateAudio = async (req, res) => {
  const { prompt, userId } = req.body;
  const { id } = req.params;

  console.log("id", id);

  if (!prompt || !userId) {
    return res.status(400).json({ error: "Prompt and User ID are required." });
  }

  const audioGenerators = [
    {
      model: "stable-audio",
      handler: stableReplicate,
      credits: 3,
    },
    {
      model: "stable-audio",
      handler: stableFal,
      credits: 6,
    },
  ];

  const matchingHandlers = audioGenerators
    .filter((h) => h.model === id)
    .sort((a, b) => a.credits - b.credits); // Sort by cheapest first

  if (matchingHandlers.length === 0) {
    return res.status(400).json({ error: "Invalid model ID." });
  }

  for (const { handler, credits } of matchingHandlers) {
    try {
      const audioUrl = await handler(prompt);

      if (!audioUrl) {
        console.warn("No audio returned, trying next handler...");
        continue;
      }

      // Deduct credits after success
      try {
        await decreaseCredits(userId, credits);
      } catch (creditError) {
        return res.status(402).json({ error: creditError.message });
      }

      return res.status(200).json({ audioUrl });
    } catch (error) {
      console.error("Audio handler failed:", error.message || error);
      continue;
    }
  }

  return res.status(500).json({ error: "All audio generators failed." });
};
