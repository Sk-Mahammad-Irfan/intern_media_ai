import dotenv from "dotenv";
import { fal } from "@fal-ai/client";

dotenv.config();

fal.config({
  credentials: process.env.FAL_AI_API,
});

export const cassetteFAL = async (prompt, duration = 30) => {
  try {
    const result = await fal.subscribe("cassetteai/sound-effects-generator", {
      input: {
        prompt,
        duration,
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    });

    const audioUrl = result?.data?.audio_url || result?.data?.audio?.url;
    if (!audioUrl) throw new Error("No valid audio URL returned");
    return audioUrl;
  } catch (error) {
    console.error("Sound effect generation failed:", error.message || error);
    return null;
  }
};
