// pixverse.js
import axios from "axios";
import { fal } from "@fal-ai/client";
import dotenv from "dotenv";

dotenv.config();

// Configure FAL API
fal.config({ credentials: process.env.FAL_AI_API });

// Replicate Pixverse endpoint
const REPLICATE_URL =
  "https://api.replicate.com/v1/models/pixverse/pixverse-v4.5/predictions";

// Defaults & Validation
const SUPPORTED_ASPECTS = ["16:9", "9:16", "1:1"];
const SUPPORTED_DURATIONS = [5, 8];
const SUPPORTED_QUALITIES = ["360p", "540p", "720p", "1080p"];
const SUPPORTED_STYLES = [
  "None",
  "anime",
  "3d_animation",
  "clay",
  "cyberpunk",
  "comic",
];

const validateAspectRatio = (aspect) =>
  SUPPORTED_ASPECTS.includes(aspect) ? aspect : "16:9";

const validateDuration = (duration) =>
  SUPPORTED_DURATIONS.includes(duration) ? duration : 5;

const validateQuality = (quality) =>
  SUPPORTED_QUALITIES.includes(quality) ? quality : "720p";

const validateStyle = (style) =>
  SUPPORTED_STYLES.includes(style) ? style : "None";

// ------------------- FAL -------------------
export const pixverse45FAL = async (
  prompt = "A futuristic skyline at dusk",
  aspect_ratio = "16:9",
  resolution = "720p",
  duration = 5,
  negative_prompt = "",
  style = "anime",
  seed
) => {
  try {
    const result = await fal.subscribe("fal-ai/pixverse/v4.5/text-to-video", {
      input: {
        prompt,
        aspect_ratio: validateAspectRatio(aspect_ratio),
        resolution: validateQuality(resolution),
        duration: duration,
        negative_prompt,
        style: validateStyle(style),
        seed,
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS" && Array.isArray(update.logs)) {
          console.log(update.logs.map((log) => log.message).join("\n"));
        }
      },
    });
    return result?.data;
  } catch (error) {
    console.error("Error generating video with FAL Pixverse:", error);
    throw error;
  }
};

// ------------------- Replicate -------------------
export const pixverse45Replicate = async (
  prompt = "A futuristic skyline at dusk",
  aspect_ratio = "16:9",
  quality = "720p",
  duration = 5,
  negative_prompt = "",
  style = "None",
  effect = "None",
  motion_mode = "normal",
  seed
) => {
  try {
    const response = await axios.post(
      REPLICATE_URL,
      {
        input: {
          prompt,
          aspect_ratio: validateAspectRatio(aspect_ratio),
          quality: validateQuality(quality),
          duration: validateDuration(duration),
          negative_prompt,
          style: validateStyle(style),
          effect,
          motion_mode,
          seed,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json",
          Prefer: "wait",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error generating video with Replicate Pixverse:", error);
    throw error;
  }
};
