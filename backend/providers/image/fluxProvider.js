import { fal } from "@fal-ai/client";
import dotenv from "dotenv";
import Replicate from "replicate";
import axios from "axios";

dotenv.config();

// Configure FAL client
fal.config({ credentials: process.env.FAL_AI_API });

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});
// Constants
const SUPPORTED_IMAGE_FORMATS = ["jpeg", "png"];
const SUPPORTED_ASPECT_RATIOS = [
  "21:9",
  "16:9",
  "4:3",
  "3:2",
  "1:1",
  "2:3",
  "3:4",
  "9:16",
  "9:21",
];
const SAFETY_TOLERANCE_LEVELS = [1, 2, 3, 4, 5, 6];

// Validation helpers
const validateFormat = (format) =>
  SUPPORTED_IMAGE_FORMATS.includes(format) ? format : "jpeg";

const validateAspectRatio = (ratio) =>
  SUPPORTED_ASPECT_RATIOS.includes(ratio) ? ratio : "16:9";

const validateSafetyTolerance = (level) => {
  const numeric = typeof level === "string" ? parseInt(level) : level;
  return SAFETY_TOLERANCE_LEVELS.includes(numeric) ? numeric : 2;
};
export const generateImageFluxPro = async (body) => {
  const {
    provider,
    prompt,
    resolution = "1024x448",
    outputFormat = "jpeg",
    safetyTolerance = 2,
    enableSafetyInput = true,
    seed,
    rawMode = false,
    syncMode = true,
    numImages = 1,
  } = body;

  try {
    switch (provider) {
      case "fal": {
        const input = {
          prompt,
          image_size: resolution,
          output_format: validateFormat(outputFormat),
          aspect_ratio: validateAspectRatio(resolution),
          safety_tolerance: validateSafetyTolerance(safetyTolerance),
          enable_safety_checker:
            typeof enableSafetyInput === "boolean" ? enableSafetyInput : true,
          raw: typeof rawMode === "boolean" ? rawMode : false,
        };

        if (typeof seed === "number" && seed >= 0) {
          input.seed = seed;
        }

        const result = await fal.subscribe("fal-ai/flux-pro/v1.1-ultra", {
          input,
          logs: true,
          onQueueUpdate: (update) => {
            if (update.status === "IN_PROGRESS" && Array.isArray(update.logs)) {
              console.log(update.logs.map((log) => log.message).join("\n"));
            }
          },
        });

        return result?.data;
      }

      case "replicate": {
        const input = {
          prompt,
          output_format: validateFormat(outputFormat),
          aspect_ratio: validateAspectRatio(resolution),
          safety_tolerance: validateSafetyTolerance(safetyTolerance),
          enable_safety_checker:
            typeof enableSafetyInput === "boolean" ? enableSafetyInput : true,
        };

        const output = await replicate.run("black-forest-labs/flux-pro", {
          input,
        });

        return typeof output?.url === "function" ? await output.url() : output;
      }

      case "deepinfra": {
        const resolutionMap = {
          square_hd: "1024x1024",
          square: "1024x1024",
          portrait_4_3: "768x1024",
          portrait_16_9: "576x1024",
          landscape_4_3: "1024x768",
          landscape_16_9: "1024x576",
        };
        try {
          // Ensure resolution is valid and parse width/height
          const size = resolutionMap[resolution] || "1024x1024";

          // POST request to DeepInfra model-specific endpoint
          const payload = {
            prompt,
            size,
            model: "black-forest-labs/FLUX-1.1-pro",
            n: 1,
          };

          // Send POST request using axios (same as curl)
          const response = await axios.post(
            "https://api.deepinfra.com/v1/openai/images/generations",
            payload,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.DEEPINFRA_API}`,
              },
            }
          );

          return response.data;
        } catch (error) {
          // Extract useful error details
          const status = error?.response?.status || "unknown";
          const detail =
            error?.response?.data?.detail || error.message || "Unknown error";

          throw new Error(
            `Image generation failed with provider 'deepinfra': Status ${status}, Detail: ${detail}`
          );
        }
      }

      default:
        throw new Error(
          `Unsupported provider: '${provider}'. Supported providers are: 'fal', 'replicate', 'deepinfra'.`
        );
    }
  } catch (error) {
    // Enhanced error formatting
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
  }
};
