// generatePixverseVideo.js
import dotenv from "dotenv";
import { fal } from "@fal-ai/client";

dotenv.config();

fal.config({
  credentials: process.env.FAL_AI_API,
});

const SUPPORTED_CFG_SCALE = [
  0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5,
  10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5, 16, 16.5, 17,
  17.5, 18, 18.5, 19, 19.5, 20,
];

const SUPPORTED_VIDEO_SIZE = [
  "square_hd",
  "square",
  "portrait_4_3",
  "portrait_16_9",
  "landscape_4_3",
  "landscape_16_9",
];

// Use RIFE for video interpolation Default value: true
const SUPPORTED_RIFE = [true, false];

// === Unified CogVideoX Generator ===
export const generateVideoCogvideoX = async (body) => {
  const {
    prompt,
    video_size = "landscape_16_9",
    guidance_scale = 7,
    negative_prompt = "",
    seed = null,
    num_inference_steps = 50,
    use_rife = true,
  } = body;

  try {
    if (!prompt || typeof prompt !== "string") {
      throw new Error("Prompt is required and must be a string.");
    }

    // Final validated values
    const finalAspectRatio = SUPPORTED_ASPECT_RATIOS.includes(aspect_ratio)
      ? aspect_ratio
      : mapToClosestSupportedAspectRatio(aspect_ratio);

    const finalVideoSize = SUPPORTED_VIDEO_SIZE.includes(video_size)
      ? video_size
      : "landscape_16_9";

    const finalCfgScale = SUPPORTED_CFG_SCALE.includes(guidance_scale)
      ? guidance_scale
      : 7;

    const input = {
      prompt,
      video_size: finalVideoSize,
      guidance_scale: finalCfgScale,
      negative_prompt,
      seed,
      num_inference_steps,
      use_rife,
    };

    if (seed !== null) input.seed = seed;

    const result = await fal.subscribe("fal-ai/cogvideox-5b", {
      input,
      logs: false,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS" && Array.isArray(update.logs)) {
          console.log(update.logs.map((log) => log.message).join("\n"));
        }
      },
    });

    return result?.data;
  } catch (error) {
    console.error("Error generating video with Pixverse (FAL):", error);

    if (error?.body?.detail) {
      console.error(
        "Validation details:",
        JSON.stringify(error.body.detail, null, 2)
      );
    }

    throw error;
  }
};
