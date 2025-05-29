import { fal } from "@fal-ai/client";
import dotenv from "dotenv";

dotenv.config();

fal.config({
  credentials: process.env.FAL_AI_AUDIO_API,
});

export const generateAudioLyria2 = async (body) => {
  const { prompt = "", negative_prompt = "", seed = 65535 } = body;

  try {
    const result = await fal.subscribe("fal-ai/lyria2", {
      input: {
        prompt,
        negative_prompt,
        seed,
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS" && Array.isArray(update.logs)) {
          update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    });

    const audioUrl = result.data?.audio_file?.url || result?.data?.audio?.url;
    if (!audioUrl) throw new Error("FAL did not return a valid audio URL");
    return audioUrl;
  } catch (error) {
    // Custom error message extraction for ValidationError
    if (error?.body?.detail) {
      const validationDetails = error.body.detail
        .map((d) => `${d.loc?.join(".") || "unknown"}: ${d.msg}`)
        .join("\n");
      console.error("Validation error(s) from FAL:\n", validationDetails);
      throw new Error(`Validation failed:\n${validationDetails}`);
    }

    // Generic fallback error
    console.error("Error generating mmaudio audio:", error);
    throw new Error(`Failed to generate audio: ${error.message || error}`);
  }
};
