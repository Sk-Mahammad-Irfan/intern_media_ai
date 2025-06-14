import dotenv from "dotenv";
import { fal } from "@fal-ai/client";

dotenv.config();

fal.config({
  credentials: process.env.FAL_AI_API,
});

const SUPPORTED_IMAGE_SIZES = [
  "square_hd",
  "square",
  "portrait_4_3",
  "portrait_16_9",
  "landscape_4_3",
  "landscape_16_9",
];

export const generateImageHidreamFull = async (body) => {
  const {
    prompt,
    resolution = "square_hd",
    enableSafetyInput = true,
    negative_prompt = "",
    seed,
    numInferenceSteps = 28,
    outputFormat = "jpeg",
  } = body;

  try {
    if (!prompt || typeof prompt !== "string") {
      throw new Error("Prompt is required and must be a string.");
    }

    const finalResolution = SUPPORTED_IMAGE_SIZES.includes(resolution)
      ? resolution
      : "square_hd";

    if (!SUPPORTED_IMAGE_SIZES.includes(resolution)) {
      console.warn(
        `Invalid resolution "${resolution}", defaulting to "square_hd"`
      );
    }

    let finalSteps = parseInt(numInferenceSteps);
    if (isNaN(finalSteps) || finalSteps < 1 || finalSteps > 100) {
      console.warn(
        `Invalid numInferenceSteps "${numInferenceSteps}", defaulting to 28`
      );
      finalSteps = 28;
    }

    const finalSafetyChecker =
      typeof enableSafetyInput === "boolean" ? enableSafetyInput : true;

    const finalNegativePrompt =
      typeof negative_prompt === "string" ? negative_prompt : "";

    const finalSeed = typeof seed === "number" && seed >= 0 ? seed : undefined;

    const result = await fal.subscribe("fal-ai/hidream-i1-full", {
      input: {
        prompt,
        image_size: finalResolution,
        enable_safety_checker: finalSafetyChecker,
        negative_prompt: finalNegativePrompt,
        seed: finalSeed,
        num_inference_steps: finalSteps,
        output_format: outputFormat,
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
      "Error generating image with HiDream I1 FULL:",
      error.message || error
    );
    throw error;
  }
};
