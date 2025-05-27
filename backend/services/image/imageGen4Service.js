// ideogramFAL.js

import { fal } from "@fal-ai/client";
import dotenv from "dotenv";

dotenv.config();

fal.config({
  credentials: process.env.FAL_AI_API,
});

// The resolution of the generated image Default value: square_hd

// Possible enum values: square_hd, square, portrait_4_3, portrait_16_9, landscape_4_3, landscape_16_9
export const imageGenFAL = async (
  prompt,
  aspect_ratio = "1:1",
  seed,
  negative_prompt
) => {
  try {
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
    console.error("Error generating image with Ideogram V3:", error);
  }
};
