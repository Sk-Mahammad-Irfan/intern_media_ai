import { fal } from "@fal-ai/client";
import dotenv from "dotenv";

dotenv.config();

fal.config({
  credentials: process.env.FAL_AI_AUDIO_API,
});

export const generateAudioWithFal = async (prompt, duration = 20) => {
  try {
    const result = await fal.subscribe("cassetteai/sound-effects-generator", {
      input: { prompt, duration },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          console.log(update.logs.map((log) => log.message).join("\n"));
        }
      },
    });
    console.log("Generating audio...");
    // return result.data;
    // console.log(result.data.audio_file.url);
    return result.data.audio_file.url;
  } catch (error) {
    console.error("Error generating audio with FAL:", error);
    throw error;
  }
};
