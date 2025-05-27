import dotenv from "dotenv";
import { fal } from "@fal-ai/client";

dotenv.config();

fal.config({
  credentials: process.env.FAL_AI_API,
});

// Supported enums for Pixverse v4
const SUPPORTED_ASPECT_RATIOS = ["auto", "16:9", "9:16", "1:1"];
const SUPPORTED_RESOLUTIONS = ["480p", "720p"];
// Number of inference steps for sampling. Higher values give better quality but take longer. Default value: "16"
const NUMBER_INFERENCE_STEPS = [4, 8, 16, 32, 64];

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

export const MagiFAL = async (
  prompt,
  resolution = "720p",
  aspect_ratio = "auto",
  num_inference_steps = 16,
  seed = null
) => {
  try {
    // Validate resolution
    if (!SUPPORTED_RESOLUTIONS.includes(resolution)) {
      console.warn(`Invalid resolution "${resolution}", defaulting to "720p"`);
      resolution = "720p";
    }

    // Validate aspect ratio
    if (!SUPPORTED_ASPECT_RATIOS.includes(aspect_ratio)) {
      aspect_ratio = mapToClosestSupportedAspectRatio(aspect_ratio);
    }
    // Validate number of inference steps
    if (
      !NUMBER_INFERENCE_STEPS.includes(num_inference_steps) ||
      num_inference_steps < 4
    ) {
      console.warn(
        `Invalid number of inference steps "${num_inference_steps}", defaulting to "16"`
      );
      num_inference_steps = 16;
    }

    // Prepare input
    const input = {
      prompt,
      resolution,
      aspect_ratio,
      num_inference_steps,
    };

    if (typeof seed === "number" && Number.isInteger(seed) && seed >= 0) {
      input.seed = seed;
    }

    console.log("Magi Input:", input);

    const result = await fal.subscribe("fal-ai/magi", {
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
    console.error("Error generating video with Magi (FAL):", error);

    if (error?.body?.detail) {
      console.error(
        "Validation details:",
        JSON.stringify(error.body.detail, null, 2)
      );
    }
  }
};
