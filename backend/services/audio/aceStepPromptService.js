import { fal } from "@fal-ai/client";
import dotenv from "dotenv";

dotenv.config();

fal.config({
  credentials: process.env.FAL_AI_API,
});

export const aceStepPromptService = async (prompt, duration, step) => {
  try {
    const result = await fal.subscribe("fal-ai/ace-step/prompt-to-audio", {
      input: {
        prompt,
        duration,
        number_of_steps: step,
      },
      logs: false,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS" && Array.isArray(update.logs)) {
          update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    });

    const audioUrl = result.data.audio_file?.url || result?.data?.audio?.url;
    const lyrics = result.data?.lyrics;

    if (!audioUrl) throw new Error("FAL did not return a valid audio URL");

    return { audioUrl, lyrics };
  } catch (error) {
    const detail =
      error?.response?.data?.detail ||
      error?.body?.detail ||
      error?.message ||
      error?.toString();

    console.error("Error generating audio with aceStepPromptService:");
    console.error(JSON.stringify(detail, null, 2));

    throw new Error(
      Array.isArray(detail)
        ? detail.map((d) => d?.msg || JSON.stringify(d)).join(", ")
        : typeof detail === "string"
        ? detail
        : "Unknown error occurred"
    );
  }
};
