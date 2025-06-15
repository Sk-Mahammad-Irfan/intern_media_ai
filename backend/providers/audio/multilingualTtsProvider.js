import { fal } from "@fal-ai/client";
import dotenv from "dotenv";

dotenv.config();

fal.config({
  credentials: process.env.FAL_AI_AUDIO_API,
});

/**
 * Generate multilingual TTS audio using FAL
 * @param {Object} input - Input options for TTS generation
 * @param {string} input.text - Required text to convert to speech
 * @param {string} [input.voice="Rachel"] - Voice selection
 * @param {number} [input.stability=0.5] - Voice stability (0-1)
 * @param {number} [input.similarity_boost=0.75] - Similarity boost (0-1)
 * @param {number} [input.style] - Style exaggeration (0-1)
 * @param {number} [input.speed=1] - Speech speed (0.7-1.2)
 * @returns {Promise<string>} - Audio URL
 */
export const generateAudioMultilingualTtsFAL = async (input) => {
  try {
    const {
      prompt,
      voice = "Rachel",
      stability = 0.5,
      similarity_boost = 0.75,
      style,
      speed = 1,
    } = input;

    const result = await fal.subscribe(
      "fal-ai/elevenlabs/tts/multilingual-v2",
      {
        input: { text: prompt, voice, stability, similarity_boost, speed },
        logs: false,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS") {
            if (Array.isArray(update.logs)) {
              update.logs.map((log) => log.message).forEach(console.log);
            }
          }
        },
      }
    );

    const audioUrl = result?.data?.audio?.url;
    if (!audioUrl) throw new Error("FAL did not return a valid audio URL");
    return audioUrl;
  } catch (error) {
    console.error("Error generating audio with FAL:", error.message || error);
    throw error;
  }
};
