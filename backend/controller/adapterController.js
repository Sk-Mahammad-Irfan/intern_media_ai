import axios from "axios";
import FormData from "form-data";
import { fal } from "@fal-ai/client";
import dotenv from "dotenv";
import { decreaseCredits } from "./creditController.js";
dotenv.config();

fal.config({
  credentials: process.env.FAL_AI_API,
});
fal.config({
  credentials:
    process.env.FAL_AI_AUDIO_API ||
    "ecc99927-def0-4f61-9c54-97b6371ebadf:e71eaba34872ae890feabaa56e6b230c",
});

export const generateVideo = async (req, res) => {
  const { prompt, userId } = req.body;

  if (!prompt || !userId) {
    return res.status(400).json({ error: "Prompt and User ID are required" });
  }

  try {
    try {
      await decreaseCredits(userId, 5);
    } catch (err) {
      return res.status(402).json({ error: err.message });
    }

    const response = await axios.post(
      "https://api.deepinfra.com/v1/inference/Wan-AI/Wan2.1-T2V-1.3B",
      { prompt },
      {
        headers: {
          Authorization: `Bearer ${process.env.DEEPINFRA_API}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Video Generation Error:", error.message || error);
    res
      .status(500)
      .json({ error: error.message || "Failed to generate video" });
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
