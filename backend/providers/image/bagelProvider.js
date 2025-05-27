import dotenv from "dotenv";
import { fal } from "@fal-ai/client";

dotenv.config();

// Configure FAL client
fal.config({
  credentials: process.env.FAL_AI_API,
});

// === Unified Fooocus Image Generator ===
export const generateImageBagel = async (body) => {
  const {
    prompt,
    enableSafetyInput = true,
    enable_safety_checker = enableSafetyInput,
    seed,
  } = body;

  try {
    if (!prompt || typeof prompt !== "string") {
      throw new Error("Prompt is required and must be a string.");
    }

    const finalSafetyChecker =
      typeof enable_safety_checker === "boolean" ? enable_safety_checker : true;

    const finalSeed = typeof seed === "number" && seed >= 0 ? seed : undefined;

    const result = await fal.subscribe("fal-ai/fooocus", {
      input: {
        prompt,
        seed: finalSeed,
        enable_safety_checker: finalSafetyChecker,
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
      "Error generating image with Fooocus:",
      error.message || error
    );
    throw error;
  }
};
