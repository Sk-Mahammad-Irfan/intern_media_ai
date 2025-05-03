import { fal } from "@fal-ai/client";
import dotenv from "dotenv";

dotenv.config();

fal.config({
  credentials: process.env.FAL_AI_API,
});

export const pixverseFAL = async (prompt) => {
  try {
    const result = await fal.subscribe("fal-ai/pixverse/v4/text-to-video", {
      input: { prompt },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS" && update.logs) {
          update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    });

    console.log("Pixverse FAL video generated");
    console.log("Request ID:", result.requestId);

    return result.data;
  } catch (error) {
    console.error("Error generating video with Pixverse (FAL):", error);
  }
};
