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

// ---------------- Unified Image Generation Interface ----------------
export const generateImageFluxPro = async (body) => {
  const {
    provider,
    prompt,
    resolution = "16:9", // Used as aspect_ratio
    outputFormat = "jpeg",
    safetyTolerance = 2,
    enableSafetyInput = true,
    seed,
    rawMode = false,
    syncMode = true, // Placeholder if needed later
    numImages = 1, // Placeholder if needed later
  } = body;

  try {
    switch (provider) {
      case "fal": {
        const input = {
          prompt,
          image_size: "landscape_4_3", // Default unless you're using a specific size mapping
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
        const response = await axios.post(
          "https://api.deepinfra.com/v1/openai/images/generations",
          {
            prompt,
            size: "1024x1024",
            model: "black-forest-labs/FLUX-1.1-pro",
            n: 1,
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.DEEPINFRA_API}`,
              "Content-Type": "application/json",
            },
          }
        );
        return response.data;
      }

      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  } catch (error) {
    console.error(`Error generating image with ${provider}:`, error);
    throw error;
  }
};
