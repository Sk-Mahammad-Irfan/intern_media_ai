import dotenv from "dotenv";
import { fal } from "@fal-ai/client";

dotenv.config();

fal.config({
  credentials: process.env.FAL_AI_API,
});

// === Supported Ideogram Configuration ===
const SUPPORTED_IMAGE_ASPECT_RATIO = ["1:1", "16:9", "9:16", "3:4", "4:3"];

// === Unified Ideogram Image Generator ===
export const generateImageImageGen = async (body) => {
  const { prompt, aspect_ratio = "1:1", negative_prompt = "", seed } = body;

  try {
    if (!prompt || typeof prompt !== "string") {
      throw new Error("Prompt is required and must be a string.");
    }

    // Validate aspect_ratio
    const finalAspectRatio = SUPPORTED_IMAGE_ASPECT_RATIO.includes(aspect_ratio)
      ? aspect_ratio
      : "1:1";
    if (!SUPPORTED_IMAGE_ASPECT_RATIO.includes(aspect_ratio)) {
      console.warn(
        `Invalid aspect_ratio "${aspect_ratio}", defaulting to "1:1"`
      );
    }

    // Validate negative_prompt
    const finalNegativePrompt =
      typeof negative_prompt === "string" ? negative_prompt : "";

    // Validate seed
    const finalSeed = typeof seed === "number" && seed >= 0 ? seed : undefined;

    const result = await fal.subscribe("fal-ai/imagen4/preview", {
      input: {
        prompt,
        aspect_ratio: finalAspectRatio,
        negative_prompt: finalNegativePrompt,
        ...(finalSeed !== undefined && { seed: finalSeed }),
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
      "Error generating image with Ideogram V3:",
      error.message || error
    );
    throw error;
  }
};
