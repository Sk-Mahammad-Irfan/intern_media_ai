// ideogramFAL.js

import { fal } from "@fal-ai/client";
import dotenv from "dotenv";

dotenv.config();

fal.config({
  credentials: process.env.FAL_AI_API,
});

// The resolution of the generated image Default value: square_hd

// Possible enum values: square_hd, square, portrait_4_3, portrait_16_9, landscape_4_3, landscape_16_9
export const aceStepService = async (
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
  lyric_guidance_scale
) => {
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
    console.error("Error generating audio with aceStepService:", error);
  }
};
