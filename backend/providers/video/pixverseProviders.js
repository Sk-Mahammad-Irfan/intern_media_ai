// generatePixverseVideo.js
import dotenv from "dotenv";
import { fal } from "@fal-ai/client";

dotenv.config();

fal.config({
  credentials: process.env.FAL_AI_API,
});

// === Supported enums for Pixverse v4 ===
const SUPPORTED_ASPECT_RATIOS = ["16:9", "4:3", "1:1", "3:4", "9:16"];
const SUPPORTED_RESOLUTIONS = ["360p", "540p", "720p", "1080p"];
const SUPPORTED_DURATIONS = [5, 8];
const SUPPORTED_STYLES = [
  "anime",
  "3d_animation",
  "clay",
  "comic",
  "cyberpunk",
];

// === Ratio parsing utility ===
const parseRatio = (str) => {
  const [w, h] = str.split(":").map(Number);
  return w / h;
};

// === Find closest supported aspect ratio ===
const mapToClosestSupportedAspectRatio = (input) => {
  const inputRatio = parseRatio(input);
  let closest = SUPPORTED_ASPECT_RATIOS[0];
  let minDiff = Math.abs(inputRatio - parseRatio(closest));

  for (const ratio of SUPPORTED_ASPECT_RATIOS) {
    const diff = Math.abs(inputRatio - parseRatio(ratio));
    if (diff < minDiff) {
      closest = ratio;
      minDiff = diff;
    }
  }

  console.warn(
    `Unsupported aspect ratio "${input}", using closest: "${closest}"`
  );
  return closest;
};

// === Unified Pixverse Video Generator ===
export const generateVideoPixverse = async (body) => {
  const {
    prompt,
    aspect_ratio = "16:9",
    resolution = "720p",
    duration = 5,
    negative_prompt = "",
    style = null,
    seed = null,
  } = body;

  try {
    if (!prompt || typeof prompt !== "string") {
      throw new Error("Prompt is required and must be a string.");
    }

    // Final validated values
    const finalAspectRatio = SUPPORTED_ASPECT_RATIOS.includes(aspect_ratio)
      ? aspect_ratio
      : mapToClosestSupportedAspectRatio(aspect_ratio);

    const finalResolution = SUPPORTED_RESOLUTIONS.includes(resolution)
      ? resolution
      : "720p";

    let finalDuration = SUPPORTED_DURATIONS.includes(duration) ? duration : 5;
    if (finalResolution === "1080p" && finalDuration !== 5) {
      console.warn(`1080p only supports 5s duration. Using 5s.`);
      finalDuration = 5;
    }

    const finalStyle = style && SUPPORTED_STYLES.includes(style) ? style : null;

    const input = {
      prompt,
      resolution: finalResolution,
      aspect_ratio: finalAspectRatio,
      duration: finalDuration,
      negative_prompt,
    };

    if (finalStyle) input.style = finalStyle;
    if (seed !== null) input.seed = seed;

    console.log("Pixverse Input:", input);

    const result = await fal.subscribe("fal-ai/pixverse/v4/text-to-video", {
      input,
      logs: false,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS" && Array.isArray(update.logs)) {
          console.log(update.logs.map((log) => log.message).join("\n"));
        }
      },
    });

    return result?.data;
  } catch (error) {
    console.error("Error generating video with Pixverse (FAL):", error);

    if (error?.body?.detail) {
      console.error(
        "Validation details:",
        JSON.stringify(error.body.detail, null, 2)
      );
    }

    throw error;
  }
};
