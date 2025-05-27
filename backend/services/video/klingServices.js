import dotenv from "dotenv";
import { fal } from "@fal-ai/client";

dotenv.config();

fal.config({
  credentials: process.env.FAL_AI_API,
});

// Supported enums for Kling v4
const SUPPORTED_ASPECT_RATIOS = ["16:9", "9:16", "1:1"];
const SUPPORTED_DURATIONS = [5, 10];

// The CFG (Classifier Free Guidance) scale is a measure of how close you want the model to stick to your prompt. Default value: 0.5
const CFG_SCALE = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];

// Helper to convert "21:9" to numeric ratio
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

export const klingService = async (
  prompt,
  aspect_ratio = "16:9",
  duration = 5,
  negative_prompt = "",
  cfg_scale = 0.5
) => {
  try {
    // Validate duration
    if (!SUPPORTED_DURATIONS.includes(duration) || duration !== 5) {
      console.warn(`Invalid or unsupported duration "${duration}", defaulting to 5`);
      duration = 5;
    }

    // Validate aspect ratio
    if (!SUPPORTED_ASPECT_RATIOS.includes(aspect_ratio)) {
      aspect_ratio = mapToClosestSupportedAspectRatio(aspect_ratio);
      console.warn(
        `Aspect ratio "${aspect_ratio}" is not supported, using closest: "${aspect_ratio}"`
      );
    }
    // Validate CFG scale
    if (!CFG_SCALE.includes(cfg_scale)) {
      console.warn(`Invalid CFG scale "${cfg_scale}", defaulting to 0.5`);
      cfg_scale = 0.5;
    }
    // Prepare input
    const input = {
      prompt,
      aspect_ratio,
      duration,
      negative_prompt,
      cfg_scale,
    };

    console.log("Kling input", input);

    const result = await fal.subscribe(
      "fal-ai/kling-video/v2/master/text-to-video",
      {
        input,
        logs: false,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS" && Array.isArray(update.logs)) {
            console.log(update.logs.map((log) => log.message).join("\n"));
          }
        },
      }
    );

    return result?.data;
  } catch (error) {
    console.error("Error generating video with Kling (FAL):", error);

    if (error?.body?.detail) {
      console.error(
        "Validation details:",
        JSON.stringify(error.body.detail, null, 2)
      );
    }
  }
};
