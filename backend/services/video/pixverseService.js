// pixverseFAL.js
import dotenv from "dotenv";
import { fal } from "@fal-ai/client";

dotenv.config();

fal.config({
  credentials: process.env.FAL_AI_API,
});

// Supported enums for Pixverse v4
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

// Helper to convert string like "21:9" to numeric ratio
const parseRatio = (str) => {
  const [w, h] = str.split(":").map(Number);
  return w / h;
};

// Find closest supported aspect ratio
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

export const pixverseFAL = async (
  prompt,
  resolution = "720p",
  aspect_ratio = "16:9",
  duration = 5,
  negative_prompt = "",
  style = null,
  seed = null
) => {
  try {
    // Validate resolution
    if (!SUPPORTED_RESOLUTIONS.includes(resolution)) {
      console.warn(`Invalid resolution "${resolution}", defaulting to "720p"`);
      resolution = "720p";
    }

    // Validate duration (max 5s for 1080p)
    if (
      !SUPPORTED_DURATIONS.includes(duration) ||
      (resolution === "1080p" && duration !== 5)
    ) {
      console.warn(
        `Invalid or unsupported duration "${duration}" for resolution "${resolution}", defaulting to 5`
      );
      duration = 5;
    }

    // Validate aspect ratio
    if (!SUPPORTED_ASPECT_RATIOS.includes(aspect_ratio)) {
      aspect_ratio = mapToClosestSupportedAspectRatio(aspect_ratio);
    }

    // Validate style
    if (style && !SUPPORTED_STYLES.includes(style)) {
      console.warn(`Invalid style "${style}", ignoring it.`);
      style = null;
    }

    // Prepare input object
    const input = {
      prompt,
      resolution,
      aspect_ratio,
      duration,
      negative_prompt,
    };

    if (style) input.style = style;
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
  }
};
