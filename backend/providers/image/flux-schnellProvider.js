import { fal } from "@fal-ai/client";
import axios from "axios";
import dotenv from "dotenv";
import Replicate from "replicate";

dotenv.config();

fal.config({ credentials: process.env.FAL_AI_API });

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

const validateFormat = (format) =>
  SUPPORTED_IMAGE_FORMATS.includes(format) ? format : "webp";

const validateReplicateAspectRatio = (ratio) =>
  REPLICATE_ASPECT_RATIOS.includes(ratio)
    ? ratio
    : falToStandardAspectRatio[ratio] || "1:1";

const validateFalAspectRatio = (ratio) =>
  FAL_ASPECT_RATIOS.includes(ratio)
    ? ratio
    : standardToFalAspectRatio[ratio] || "square";

const handleGenerationError = (error, provider, prompt) => {
  const errorDetails = {
    provider,
    prompt,
    message: error.message,
    status: error.response?.status,
    statusText: error.response?.statusText,
    url: error.response?.config?.url,
    responseData: error.response?.data,
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
  };

  console.error(
    "🚨 Image Generation Error:\n",
    JSON.stringify(errorDetails, null, 2)
  );
  throw new Error(
    `❌ [${provider.toUpperCase()}] Generation failed: ${error.message}`
  );
};

// 🔄 Unified Image Generation Handler
export const generateImageFluxSchnell = async ({
  provider,
  prompt,
  resolution = "1:1",
  outputFormat = "webp",
  seed = 1234,
  numInferenceSteps = 4,
  numImages = 1,
  outputQuality = 80,
  enableSafetyChecker = true,
  goFast = true,
  megapixels = "1",
}) => {
  if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
    throw new Error("❗ Prompt is required for image generation.");
  }

  try {
    switch (provider) {
      case "replicate": {
        const input = {
          prompt,
          go_fast: goFast,
          megapixels,
          num_outputs: numImages,
          aspect_ratio: validateReplicateAspectRatio(resolution),
          output_format: validateFormat(outputFormat),
          output_quality: outputQuality,
          num_inference_steps: numInferenceSteps,
          seed,
        };

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

        const output = response.data?.output;
        if (!output || !Array.isArray(output)) {
          throw new Error("No valid output received from Replicate.");
        }

        return output;
      }

      case "fal": {
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
              update.logs.forEach((log) => console.log(log.message));
            }
          },
        });

        return result?.data;
      }

      default:
        throw new Error(
          `Unsupported provider '${provider}'. Supported: 'replicate', 'fal'.`
        );
    }
  } catch (error) {
    handleGenerationError(error, provider, prompt);
  }
};
