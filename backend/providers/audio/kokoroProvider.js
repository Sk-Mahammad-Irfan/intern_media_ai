import { fal } from "@fal-ai/client";
import dotenv from "dotenv";

dotenv.config();

fal.config({
  credentials: process.env.FAL_AI_AUDIO_API,
});
/**
 * Generate American English speech audio using FAL Kokoro model
 * @param {Object} input - Input options for voice generation
 * @param {string} [input.prompt=""] - Prompt text
 * @param {string} [input.voice="hf_alpha"] - Voice ID
 * @param {number} [input.speed=1   ] - Speed of speech
 * @returns {Promise<string>} - URL of generated audio
 */
export const generateAudioKokoroHindiFAL = async (input) => {
  try {
    const { prompt = "", voice = "hf_alpha", speed = 1 } = input;

    const result = await fal.subscribe("fal-ai/kokoro/hindi", {
      input: {
        prompt,
        voice,
        speed,
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          if (Array.isArray(update.logs)) {
            update.logs.map((log) => log.message).forEach(console.log);
          }
        }
      },
    });

    const audioUrl = result?.data?.audio?.url;
    if (!audioUrl) throw new Error("FAL did not return a valid audio URL");
    return audioUrl;
  } catch (error) {
    console.error("Error generating audio with FAL:", error.message || error);
    throw error;
  }
};
