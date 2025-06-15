import { fal } from "@fal-ai/client";
import dotenv from "dotenv";

dotenv.config();

fal.config({
  credentials: process.env.FAL_AI_API,
});

export const generateImageWithMinimax = async (body) => {
  const {
    prompt,
    aspect_ratio = "1:1",
    num_images = 1,
    prompt_optimizer = false,
  } = body;
  try {
    const result = await fal.subscribe("fal-ai/minimax/image-01", {
      input: {
        prompt,
        aspect_ratio,
        num_images,
        prompt_optimizer,
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    });

    return result.data;
  } catch (error) {
    console.error("Error generating image with minimax model:", error);
  }
};
