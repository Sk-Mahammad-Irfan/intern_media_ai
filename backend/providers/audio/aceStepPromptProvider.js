// audioService.js
import { fal } from "@fal-ai/client";
import dotenv from "dotenv";

dotenv.config();

fal.config({
  credentials: process.env.FAL_AI_AUDIO_API,
});

export const generateAudioAceStepPrompt = async (body) => {
  const {
    prompt,
    instrumental = false,
    duration = 60,
    number_of_steps = 27,
    seed,
    scheduler = "euler", // "euler" | "heun"
    guidance_type = "apg", // "cfg" | "apg" | "cfg_star"
    granularity_scale = 10,
    guidance_interval = 0.5,
    guidance_interval_decay = 0.0,
    guidance_scale = 15,
    minimum_guidance_scale = 3,
    tag_guidance_scale = 5,
    lyric_guidance_scale = 1.5,
  } = body;

  try {
    const result = await fal.subscribe("fal-ai/ace-step/prompt-to-audio", {
      input: {
        prompt,
        instrumental,
        duration,
        number_of_steps,
        seed,
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
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS" && Array.isArray(update.logs)) {
          update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    });

    console.log(result.data);
    console.log("Request ID:", result.requestId);

    const audioUrl = result.data.audio_file?.url || result.data.audio?.url;
    const lyrics = result.data?.lyrics;
    if (!audioUrl) throw new Error("FAL did not return a valid audio URL");

    return { audioUrl, lyrics };
  } catch (error) {
    const detail =
      error?.response?.data?.detail ||
      error?.body?.detail ||
      error?.message ||
      error?.toString();

    console.error("Error generating audio with FAL:");
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
