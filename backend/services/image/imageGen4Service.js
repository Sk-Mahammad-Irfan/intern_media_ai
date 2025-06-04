// ideogramFAL.js

import { fal } from "@fal-ai/client";
import dotenv from "dotenv";

dotenv.config();

fal.config({
  credentials: process.env.FAL_AI_API,
});

// Allowed aspect ratios
const VALID_ASPECT_RATIOS = ["1:1", "16:9", "9:16", "3:4", "4:3"];

export const imageGenFAL = async (
  prompt,
  aspect_ratio = "1:1",
  seed,
  negative_prompt
) => {
  try {
    // Validate aspect ratio, fallback to '4:3' if invalid
    if (!VALID_ASPECT_RATIOS.includes(aspect_ratio)) {
      console.warn(
        `Invalid aspect ratio '${aspect_ratio}' provided. Falling back to '4:3'.`
      );
      aspect_ratio = "4:3";
    }

    const result = await fal.subscribe("fal-ai/imagen4/preview", {
      input: { prompt, aspect_ratio, seed, negative_prompt },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    });
    return result.data;
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
