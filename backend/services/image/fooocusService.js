import { fal } from "@fal-ai/client";
import dotenv from "dotenv";

dotenv.config();

// Configure FAL client
fal.config({
  credentials: process.env.FAL_AI_API,
});

export const falFooocus = async (prompt, resolution) => {
  try {
    const result = await fal.subscribe("fal-ai/fooocus", {
      input: { prompt, aspect_ratio: resolution },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    });

    return result?.data;
  } catch (error) {
    console.error(
      "Error generating image with FAL Fooocus:",
      error.message || error
    );
  }
};
