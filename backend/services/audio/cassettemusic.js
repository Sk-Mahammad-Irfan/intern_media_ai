import { fal } from "@fal-ai/client";
import dotenv from "dotenv";

dotenv.config();

fal.config({
  credentials: process.env.FAL_AI_AUDIO_API,
});

export const cassatteMusic = async (prompt, duration) => {
  try {
    const result = await fal.subscribe("CassetteAI/music-generator", {
      input: { prompt, duration },
      logs: false,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          if (Array.isArray(update.logs)) {
            update.logs.map((log) => log.message).forEach(console.log);
          }
        }
      },
    });

    const audioUrl = result.data.audio_file.url || result?.data?.audio?.url;
    if (!audioUrl) throw new Error("FAL did not return a valid audio URL");
    return audioUrl;
  } catch (error) {
    console.error("Error generating audio with FAL:", error);
    throw error;
  }
};
