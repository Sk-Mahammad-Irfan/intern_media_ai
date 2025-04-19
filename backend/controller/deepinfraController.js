import axios from "axios";
import FormData from "form-data";
import { fal } from "@fal-ai/client";
import dotenv from "dotenv";
dotenv.config();

fal.config({
  credentials: process.env.FAL_AI_API,
});
fal.config({
  credentials:
    process.env.FAL_AI_AUDIO_API ||
    "ecc99927-def0-4f61-9c54-97b6371ebadf:e71eaba34872ae890feabaa56e6b230c",
});

export const generateVideoDeepinfra = async (req, res) => {
  const prompt = req.body.prompt;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
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
    console.error(
      "DeepInfra API error:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to generate video" });
  }
};

export const generateImage = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required." });
  }

  try {
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
    // console.log("FAL API:", process.env.FAL_AI_API);

    const imageUrl = result?.data?.images?.[0]?.url;

    if (!imageUrl) {
      return res
        .status(500)
        .json({ error: "Image URL not found in response." });
    }

    res.json({ imageUrl });
  } catch (error) {
    console.error("Error generating image:", error);
    res.status(500).json({ error: "Image generation failed." });
  }
};

export const generateAudio = async (req, res) => {
  const { prompt, duration = 30 } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required." });
  }

  try {
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
    // console.log(result);
    const audioUrl = result?.data?.audio_file?.url;
    // console.log(audioUrl);

    if (!audioUrl) {
      return res
        .status(500)
        .json({ error: "Audio URL not found in response." });
    }

    res.json({ audioUrl });
  } catch (error) {
    console.error("Error generating audio:", error);
    res.status(500).json({ error: "Audio generation failed." });
  }
};
