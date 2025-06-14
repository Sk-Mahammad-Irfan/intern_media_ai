import { fal } from "@fal-ai/client";
import dotenv from "dotenv";

dotenv.config();

fal.config({
  credentials: process.env.FAL_AI_AUDIO_API,
});

export const generateAudioAceStep = async (body) => {
  const {
    prompt,
    instrumental,
    duration,
    scheduler,
    guidance_type,
    granularity_scale,
    guidance_interval,
    guidance_interval_decay,
    guidance_scale,
    minimum_guidance_scale,
    tag_guidance_scale,
    lyric_guidance_scale,
  } = body;
  try {
    const result = await fal.subscribe("fal-ai/ace-step/prompt-to-audio", {
      input: {
        prompt,
        instrumental,
        duration,
        scheduler,
        guidance_type,
        granularity_scale,
        guidance_interval,
        guidance_interval_decay,
        guidance_scale,
        minimum_guidance_scale,
        tag_guidance_scale,
        lyric_guidance_scale,
      },
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
