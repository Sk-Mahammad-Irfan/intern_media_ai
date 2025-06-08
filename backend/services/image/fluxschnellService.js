import { fal } from "@fal-ai/client";
import axios from "axios";
import dotenv from "dotenv";
import Replicate from "replicate";

dotenv.config();

// Configure FAL client
fal.config({ credentials: process.env.FAL_AI_API });

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Constants
const SUPPORTED_IMAGE_FORMATS = ["jpeg", "png", "webp"];

const REPLICATE_ASPECT_RATIOS = [
  "1:1",
  "16:9",
  "21:9",
  "3:2",
  "2:3",
  "4:5",
  "5:4",
  "3:4",
  "4:3",
  "9:16",
  "9:21",
];

const FAL_ASPECT_RATIOS = [
  "square_hd",
  "square",
  "portrait_4_3",
  "portrait_16_9",
  "landscape_4_3",
  "landscape_16_9",
];

// Bi-directional aspect ratio conversion
const falToStandardAspectRatio = {
  square_hd: "1:1",
  square: "1:1",
  portrait_4_3: "3:4",
  portrait_16_9: "9:16",
  landscape_4_3: "4:3",
  landscape_16_9: "16:9",
};

const standardToFalAspectRatio = {
  "1:1": "square",
  "3:4": "portrait_4_3",
  "9:16": "portrait_16_9",
  "4:3": "landscape_4_3",
  "16:9": "landscape_16_9",
  // Defaults for unsupported mappings:
  "21:9": "landscape_16_9",
  "3:2": "landscape_4_3",
  "2:3": "portrait_4_3",
  "4:5": "portrait_4_3",
  "5:4": "landscape_4_3",
  "9:21": "portrait_16_9",
};

// Helpers
const validateFormat = (format) =>
  SUPPORTED_IMAGE_FORMATS.includes(format) ? format : "webp";

const validateReplicateAspectRatio = (ratio) => {
  if (REPLICATE_ASPECT_RATIOS.includes(ratio)) return ratio;
  const mapped = falToStandardAspectRatio[ratio];
  return REPLICATE_ASPECT_RATIOS.includes(mapped) ? mapped : "1:1";
};

const validateFalAspectRatio = (ratio) => {
  if (FAL_ASPECT_RATIOS.includes(ratio)) return ratio;
  const mapped = standardToFalAspectRatio[ratio];
  return FAL_ASPECT_RATIOS.includes(mapped) ? mapped : "square";
};

const validateSafetyTolerance = (level) => {
  const numeric = typeof level === "string" ? parseInt(level) : level;
  return SAFETY_TOLERANCE_LEVELS.includes(numeric) ? numeric : 2;
};

// 🔹 Replicate Handler
export const generateImageFluxSchnellReplicate = async (
  prompt,
  resolution = "1:1",
  seed = 1234
) => {
  if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
    throw new Error("Prompt is required for image generation.");
  }

  const input = {
    prompt,
    go_fast: true,
    megapixels: "1",
    num_outputs: 1,
    aspect_ratio: validateReplicateAspectRatio(resolution),
    output_format: validateFormat("webp"),
    output_quality: 80,
    num_inference_steps: 4,
    seed,
  };

  try {
    const response = await axios.post(
      "https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions",
      { input },
      {
        headers: {
          Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json",
          Prefer: "wait", // Wait for prediction completion
        },
      }
    );

    const data = response.data;

    console.log("Replicate response:", data);

    return data;
  } catch (error) {
    handleGenerationError(error, "replicate", prompt);
  }
};

// 🔹 FAL Handler
export const generateImageFluxSchnellFal = async (
  prompt,
  resolution = "square",
  seed = 1234
) => {
  if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
    throw new Error("Prompt is required for image generation.");
  }

  const numInferenceSteps = 4;
  const numImages = 1;
  const enableSafetyChecker = true;

  try {
    const input = {
      prompt,
      image_size: validateFalAspectRatio(resolution),
      num_inference_steps: numInferenceSteps,
      num_images: numImages,
      enable_safety_checker: enableSafetyChecker,
      seed,
    };

    const result = await fal.subscribe("fal-ai/flux/schnell", {
      input,
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS" && Array.isArray(update.logs)) {
          update.logs.map((log) => console.log(log.message));
        }
      },
    });

    return result?.data;
  } catch (error) {
    handleGenerationError(error, "fal", prompt);
  }
};

// 🔸 Shared Error Handler
const handleGenerationError = (error, provider, prompt) => {
  const errorDetails = {
    message: error.message,
    provider,
    inputPrompt: prompt,
    response: error.response?.data || null,
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
  };

  console.error(
    "Image generation failed:",
    JSON.stringify(errorDetails, null, 2)
  );

  throw new Error(
    `Image generation failed with provider '${provider}': ${error.message}`
  );
};
