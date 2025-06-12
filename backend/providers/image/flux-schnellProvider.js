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

const STANDARD_ASPECT_RATIOS = [
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
  "21:9": "landscape_16_9",
  "3:2": "landscape_4_3",
  "2:3": "portrait_4_3",
  "4:5": "portrait_4_3",
  "5:4": "landscape_4_3",
  "9:21": "portrait_16_9",
};

const getRandom4DigitSeed = () => Math.floor(1000 + Math.random() * 9000);

// Helpers
const validateFormat = (format) =>
  SUPPORTED_IMAGE_FORMATS.includes(format) ? format : "webp";

const validateReplicateAspectRatio = (ratio) =>
  STANDARD_ASPECT_RATIOS.includes(ratio) ? ratio : "1:1";

const validateFalAspectRatio = (ratio) =>
  FAL_ASPECT_RATIOS.includes(ratio)
    ? ratio
    : standardToFalAspectRatio[ratio] || "square";

const normalizeToStandardAspectRatio = (resolution) => {
  if (STANDARD_ASPECT_RATIOS.includes(resolution)) return resolution;
  return falToStandardAspectRatio[resolution] || "1:1";
};

const getDimensionsFromAspectRatio = (aspectRatio, targetHeight = 768) => {
  const [w, h] = aspectRatio.split(":").map(Number);
  if (!w || !h) throw new Error("Invalid aspect ratio format.");
  const ratio = w / h;
  const width = Math.round(targetHeight * ratio);
  return { width, height: targetHeight };
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

// 🔹 Replicate Handler
export const generateImageFluxSchnellReplicate = async (
  prompt,
  resolution = "1:1",
  seed = 1234
) => {
  if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
    throw new Error("Prompt is required for image generation.");
  }

  const normalizedRatio = normalizeToStandardAspectRatio(resolution);

  const input = {
    prompt,
    go_fast: true,
    megapixels: "1",
    num_outputs: 1,
    aspect_ratio: validateReplicateAspectRatio(normalizedRatio),
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
          Prefer: "wait",
        },
      }
    );

    return response.data?.output;
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

  const input = {
    prompt,
    image_size: validateFalAspectRatio(resolution),
    num_inference_steps: 4,
    num_images: 1,
    enable_safety_checker: true,
    seed,
  };

  try {
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

// 🔹 Together.xyz Handler
export const generateImageFluxSchnellTogether = async (
  prompt,
  resolution = "square_hd",
  steps = 22,
  seed = 42
) => {
  if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
    throw new Error("Prompt is required for image generation.");
  }

  const normalizedRatio = normalizeToStandardAspectRatio(resolution);
  const { width, height } = getDimensionsFromAspectRatio(normalizedRatio);

  const input = {
    model: "black-forest-labs/FLUX.1-schnell",
    prompt,
    width,
    height,
    steps,
    seed,
  };

  try {
    const response = await axios.post(
      "https://api.together.xyz/v1/images/generations",
      input,
      {
        headers: {
          Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    handleGenerationError(error, "together.xyz", prompt);
  }
};

// 🔄 Unified Handler
export const generateImageFluxSchnell = async ({
  provider,
  prompt,
  resolution = "1:1",
  seed,
  steps = 6,
}) => {
  const effectiveSeed = typeof seed === "number" ? seed : getRandom4DigitSeed();
  switch (provider) {
    case "replicate":
      return generateImageFluxSchnellReplicate(
        prompt,
        resolution,
        effectiveSeed
      );
    case "fal":
      return generateImageFluxSchnellFal(prompt, resolution, effectiveSeed);
    case "together":
      return generateImageFluxSchnellTogether(
        prompt,
        resolution,
        steps,
        effectiveSeed
      );
    default:
      throw new Error(`Unsupported provider '${provider}'.`);
  }
};
