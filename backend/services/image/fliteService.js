// fLiteStandard.js

import { fal } from "@fal-ai/client";
import dotenv from "dotenv";

dotenv.config();

fal.config({
  credentials: process.env.FAL_AI_API,
});

export const fLiteStandard = async (
  prompt,
  {
    negative_prompt = "",
    image_size = "landscape_4_3", // or pass custom { width, height }
    num_inference_steps = 28,
    seed,
    guidance_scale = 3.5,
    sync_mode = false,
    num_images = 1,
    enable_safety_checker = true,
  } = {}
) => {
  try {
    const result = await fal.subscribe("fal-ai/f-lite/standard", {
      input: {
        prompt,
        negative_prompt,
        image_size,
        num_inference_steps,
        seed,
        guidance_scale,
        sync_mode,
        num_images,
        enable_safety_checker,
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    });
    return result?.data;
  } catch (error) {
    // Custom error message extraction for ValidationError
    if (error?.body?.detail) {
      const validationDetails = error.body.detail
        .map((d) => `${d.loc?.join(".") || "unknown"}: ${d.msg}`)
        .join("\n");
      console.error("Validation error(s) from FAL:\n", validationDetails);
      throw new Error(`Validation failed:\n${validationDetails}`);
    }

    // Generic fallback error
    console.error("Error generating mmaudio audio:", error);
    throw new Error(`Failed to generate audio: ${error.message || error}`);
  }
};
