// hidreamFAL.js

import { fal } from "@fal-ai/client";
import dotenv from "dotenv";

dotenv.config();

fal.config({
  credentials: process.env.FAL_AI_API,
});

// The resolution of the generated image Default value: square_hd
// Possible enum values: square_hd, square, portrait_4_3, portrait_16_9, landscape_4_3, landscape_16_9
export const hidreamFAL = async (prompt, resolution = "square_hd") => {
  try {
    const result = await fal.subscribe("fal-ai/hidream-i1-dev", {
      input: { prompt, image_size: resolution },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    });
    return result.data;
  } catch (error) {
    console.error("Error generating image with HiDream I1:", error);
  }
};
