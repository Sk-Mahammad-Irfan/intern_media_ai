import dotenv from "dotenv";
import { fal } from "@fal-ai/client";

dotenv.config();

fal.config({
  credentials: process.env.FAL_AI_API,
});

// Supported values
const SUPPORTED_ASPECT_RATIOS = ["16:9", "9:16", "1:1"];
const SUPPORTED_DURATIONS = [5, 10];
const CFG_SCALE_VALUES = [
  0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0,
];

// Convert "21:9" to numeric value
const parseRatio = (str) => {
  const [w, h] = str.split(":").map(Number);
  return w / h;
};

// Find closest supported aspect ratio
const mapToClosestSupportedAspectRatio = (inputRatioStr) => {
  const inputRatio = parseRatio(inputRatioStr);
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
    `Aspect ratio "${inputRatioStr}" is unsupported. Using closest: "${closest}"`
  );
  return closest;
};

export const klingService = async (
  prompt,
  resolution,
  seed,
  duration = 5,
  aspect_ratio = "16:9",
  negative_prompt = "blur, distort, and low quality",
  cfg_scale = 0.5
) => {
  try {
    // Validate duration
    if (!SUPPORTED_DURATIONS.includes(duration)) {
      console.warn(`Unsupported duration "${duration}". Defaulting to 5.`);
      duration = 5;
    }

    // Validate aspect ratio
    if (!SUPPORTED_ASPECT_RATIOS.includes(aspect_ratio)) {
      aspect_ratio = mapToClosestSupportedAspectRatio(aspect_ratio);
    }

    // Validate CFG scale
    if (!CFG_SCALE_VALUES.includes(cfg_scale)) {
      console.warn(`Invalid CFG scale "${cfg_scale}". Defaulting to 0.5.`);
      cfg_scale = 0.5;
    }

    const input = {
      prompt,
      duration,
      aspect_ratio,
      negative_prompt,
      cfg_scale,
    };

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
    // Custom error message extraction for ValidationError
    if (error?.body?.detail) {
      const validationDetails = error.body.detail
        .map((d) => `${d.loc?.join(".") || "unknown"}: ${d.msg}`)
        .join("\n");
      console.error("Validation error(s) from FAL:\n", validationDetails);
      throw new Error(`Validation failed:\n${validationDetails}`);
    }

    // Generic fallback error
    console.error("Error generating cog Video:", error);
    throw new Error(`Failed to generate Video: ${error.message || error}`);
  }
};
