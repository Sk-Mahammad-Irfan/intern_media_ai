import dotenv from "dotenv";
import { fal } from "@fal-ai/client";

dotenv.config();

fal.config({
  credentials: process.env.FAL_AI_API,
});

// === Supported HiDream Configuration ===
const SUPPORTED_IMAGE_SIZES = [
  "square_hd",
  "square",
  "portrait_4_3",
  "portrait_16_9",
  "landscape_4_3",
  "landscape_16_9",
];

// === Unified HiDream Image Generator ===
export const generateImageHidream = async (body) => {
  const {
    prompt,
    resolution = "square_hd",
    enableSafetyInput = true,
    negative_prompt = "",
    seed,
    numInferenceSteps = 28,
    output_format = "jpeg",
  } = body;

  try {
    if (!prompt || typeof prompt !== "string") {
      throw new Error("Prompt is required and must be a string.");
    }

    // Validate resolution
    const finalResolution = SUPPORTED_IMAGE_SIZES.includes(resolution)
      ? resolution
      : "square_hd";

    if (!SUPPORTED_IMAGE_SIZES.includes(resolution)) {
      console.warn(
        `Invalid resolution "${resolution}", defaulting to "square_hd"`
      );
    }

    // Validate num_inference_steps (1–100)
    let finalSteps = parseInt(numInferenceSteps);
    if (isNaN(finalSteps) || finalSteps < 1 || finalSteps > 100) {
      console.warn(
        `Invalid numInferenceSteps "${numInferenceSteps}", defaulting to 28`
      );
      finalSteps = 28;
    }

    // Validate safety checker
    const finalSafetyChecker =
      typeof enableSafetyInput === "boolean" ? enableSafetyInput : true;

    // Validate negative_prompt
    const finalNegativePrompt =
      typeof negative_prompt === "string" ? negative_prompt : "";

    // Validate seed
    const finalSeed = typeof seed === "number" && seed >= 0 ? seed : undefined;

    const result = await fal.subscribe("fal-ai/hidream-i1-dev", {
      input: {
        prompt,
        image_size: finalResolution,
        enable_safety_checker: finalSafetyChecker,
        negative_prompt: finalNegativePrompt,
        seed: finalSeed,
        num_inference_steps: finalSteps,
        output_format,
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS" && Array.isArray(update.logs)) {
          console.log(update.logs.map((log) => log.message).join("\n"));
        }
      },
    });

    return result?.data;
  } catch (error) {
    console.error(
      "Error generating image with HiDream I1:",
      error.message || error
    );
    throw error;
  }
};
