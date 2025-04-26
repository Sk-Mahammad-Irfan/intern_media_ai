import { fal } from "@fal-ai/client";
import dotenv from "dotenv";
import { decreaseCredits } from "./creditController.js";
import {
  generateWithDeepInfra,
  generateWithFAL,
  generateWithReplicate,
} from "../services/videoServices.js";
import {
  generateWithDeepInfraImage,
  generateWithFALImage,
} from "../services/imageServices.js";
import { deepFluxProV1_1, falFluxProV1_1 } from "../services/flux11Service.js";
import { falFooocus } from "../services/fooocusService.js";
import {
  falRecraftV3,
  segmindRecraftV3,
} from "../services/recraftv3Service.js";
dotenv.config();

fal.config({
  credentials: process.env.FAL_AI_API,
});
fal.config({
  credentials: process.env.FAL_AI_AUDIO_API,
});

export const generateVideo = async (req, res) => {
  const { prompt, userId, apiPriority: clientApiPriority } = req.body;

  if (!prompt || !userId) {
    return res.status(400).json({ error: "Prompt and User ID are required" });
  }

  // Handlers for the different APIs
  const apiHandlers = {
    DeepInfra: generateWithDeepInfra,
    FAL: generateWithFAL,
    Replicate: generateWithReplicate,
  };

  // Credit values per provider
  const amt = {
    FAL: 8,
    Replicate: 6,
    DeepInfra: 4,
  };

  // Validate and build the API priority array
  const apiPriority = (
    Array.isArray(clientApiPriority) ? clientApiPriority : []
  )
    .filter((name) => Object.keys(apiHandlers).includes(name))
    .map((name) => ({
      name,
      handler: apiHandlers[name],
    }));

  if (apiPriority.length === 0) {
    return res
      .status(400)
      .json({ error: "Invalid or missing API priority list" });
  }

  try {
    // Try each provider in the given order
    for (const api of apiPriority) {
      try {
        const rawData = await api.handler(prompt);

        if (!rawData) throw new Error(`${api.name} returned no data`);

        // Extract the video URL based on the provider
        let video_url = null;

        switch (api.name) {
          case "DeepInfra":
            video_url = rawData.video_url || rawData.data?.video_url;
            break;
          case "FAL":
            video_url = rawData.video?.url;
            break;
          case "Replicate":
            video_url = Array.isArray(rawData)
              ? rawData[0]
              : rawData?.video_url || rawData?.url;
            break;
        }

        if (!video_url) {
          throw new Error(`${api.name} did not return a valid video URL`);
        }

        // Deduct credits
        try {
          await decreaseCredits(userId, amt[api.name]);
        } catch (creditErr) {
          return res.status(402).json({ error: creditErr.message });
        }

        return res.status(200).json({ video_url });
      } catch (error) {
        console.warn(`Error with ${api.name}:`, error.message || error);
      }
    }

    // If all services fail
    res.status(500).json({ error: "All video generation services failed." });
  } catch (err) {
    console.error("Video Generation Error:", err.message || err);
    res.status(500).json({ error: err.message || "Failed to generate video" });
  }
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

export const generateAudio = async (req, res) => {
  const { prompt, duration = 30, userId } = req.body;

  if (!prompt || !userId) {
    return res.status(400).json({ error: "Prompt and User ID are required." });
  }

  try {
    try {
      await decreaseCredits(userId, 3);
    } catch (err) {
      return res.status(402).json({ error: err.message });
    }

    const result = await fal.subscribe("cassetteai/sound-effects-generator", {
      input: { prompt, duration },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs?.forEach((log) => {
            // console.log(`[FAL LOG]: ${log.message}`);
          });
        }
      },
    });

    const audioUrl = result?.data?.audio_file?.url;

    if (!audioUrl) {
      return res
        .status(500)
        .json({ error: "Audio URL not found in response." });
    }

    res.json({ audioUrl });
  } catch (error) {
    console.error("Audio Generation Error:", error.message || error);
    res
      .status(500)
      .json({ error: error.message || "Audio generation failed." });
  }
};
