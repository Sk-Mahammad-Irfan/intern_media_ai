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
      logs: false,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS" && Array.isArray(update.logs)) {
          console.log(update.logs.map((log) => log.message).join("\n"));
        }
      },
    });
    return result?.data;
  } catch (error) {
    console.error("Error generating video with Pixverse (FAL):", error);
  }
};
