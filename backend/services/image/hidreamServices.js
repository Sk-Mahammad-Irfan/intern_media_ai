import { fal } from "@fal-ai/client";
import dotenv from "dotenv";

dotenv.config();

fal.config({
  credentials: process.env.FAL_AI_API,
});

export const hidreamFAL = async (prompt, resolution = "square_hd", seed) => {
  try {
    const result = await fal.subscribe("fal-ai/hidream-i1-dev", {
      input: { prompt, image_size: resolution, seed },
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
