import { fal } from "@fal-ai/client";
import dotenv from "dotenv";
import { decreaseCredits } from "./creditController.js";
import {
  generateWithDeepInfra,
  generateWithFAL,
  generateWithReplicate,
} from "../services/videoServices.js";
import { generateAudioWithFal } from "../services/audioServices.js";
dotenv.config();

fal.config({
  credentials: process.env.FAL_AI_API,
});
fal.config({
  credentials: process.env.FAL_AI_AUDIO_API,
});

export const generateVideo = async (req, res) => {
  const { prompt, userId } = req.body;

  if (!prompt || !userId) {
    return res.status(400).json({ error: "Prompt and User ID are required" });
  }

  try {
    // API priority
    const apiPriority = [
      { name: "DeepInfra", handler: generateWithDeepInfra },
      { name: "FAL", handler: generateWithFAL },
      { name: "Replicate", handler: generateWithReplicate },
    ];

    // Credit values per provider
    const amt = {
      FAL: 8,
      Replicate: 6,
      DeepInfra: 4,
    };

    // Try each provider
    for (const api of apiPriority) {
      try {
        const rawData = await api.handler(prompt);

        // Skip if no data returned
        if (!rawData) throw new Error(`${api.name} returned no data`);

        // Extract the video URL based on API source
        let video_url = null;

        switch (api.name) {
          case "DeepInfra":
            video_url = rawData.video_url || rawData.data?.video_url;
            break;
          case "FAL":
            video_url = rawData.video?.url;
            break;
          case "Replicate":
            // Assuming Replicate returns a direct URL or array of outputs
            video_url = Array.isArray(rawData)
              ? rawData[0]
              : rawData?.video_url || rawData?.url;
            break;
        }

        if (!video_url)
          throw new Error(`${api.name} did not return a valid video URL`);

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
  const { prompt, userId } = req.body;

  if (!prompt || !userId) {
    return res.status(400).json({ error: "Prompt and User ID are required." });
  }

  try {
    try {
      await decreaseCredits(userId, 2);
    } catch (err) {
      return res.status(402).json({ error: err.message });
    }

    const result = await fal.subscribe("fal-ai/fooocus", {
      input: { prompt },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs?.forEach((log) => {
            // console.log(`[FAL LOG]: ${log.message}`);
          });
        }
      },
    });

    const imageUrl = result?.data?.images?.[0]?.url;

    if (!imageUrl) {
      return res
        .status(500)
        .json({ error: "Image URL not found in response." });
    }

    res.json({ imageUrl });
  } catch (error) {
    console.error("Image Generation Error:", error.message || error);
    res
      .status(500)
      .json({ error: error.message || "Image generation failed." });
  }
};
export const generateAudio = async (req, res) => {
  const { prompt, userId, duration = 20 } = req.body;

  if (!prompt || !userId) {
    return res.status(400).json({ error: "Prompt and User ID are required" });
  }

  try {
    // Define priority list of APIs
    const apiPriority = [
      { name: "FAL", handler: generateAudioWithFal },
      // You can add other providers like DeepInfra, Replicate here
    ];

    // Credit costs per provider
    const creditsRequired = {
      FAL: 8,
      Replicate: 6,
      DeepInfra: 4,
    };

    for (const api of apiPriority) {
      try {
        const audioUrl = await api.handler(prompt, duration); // Passing duration

        if (!audioUrl) {
          throw new Error(`${api.name} returned an empty audio URL`);
        }

        // Deduct credits
        try {
          await decreaseCredits(userId, creditsRequired[api.name]);
        } catch (creditErr) {
          return res.status(402).json({ error: creditErr.message });
        }

        // Success response
        return res.status(200).json({ audioUrl }); // NOTE: renamed to `audioUrl` for consistency
      } catch (error) {
        console.warn(`Error with ${api.name}:`, error.message || error);
      }
    }

    // If all services failed
    return res
      .status(500)
      .json({ error: "All audio generation services failed." });
  } catch (err) {
    console.error("Audio Generation Error:", err.message || err);
    return res
      .status(500)
      .json({ error: err.message || "Failed to generate audio" });
  }
};
