import dotenv from "dotenv";
import { fal } from "@fal-ai/client";

dotenv.config();

fal.config({
  credentials: process.env.FAL_AI_API,
});
// The CFG (Classifier Free Guidance) scale is a measure of how close you want the model to stick to your prompt when looking for a related video to show you. Default value: 7 upto 20
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

export const cogvideoFAL = async (
  prompt,
  video_size = "landscape_16_9",
  guidance_scale = 7,
  negative_prompt = "",
  seed = null,
  num_inference_steps = 50,
  use_rife = true
) => {
  try {
    // Validate video size
    if (!SUPPORTED_VIDEO_SIZE.includes(video_size)) {
      console.warn(
        `Invalid video size "${video_size}", defaulting to "landscape_16_9"`
      );
      video_size = "landscape_16_9";
    }

    // Validate CFG scale
    if (!SUPPORTED_CFG_SCALE.includes(guidance_scale)) {
      console.warn(`Invalid CFG scale "${guidance_scale}", defaulting to 7`);
      guidance_scale = 7;
    }
    // Validate RIFE
    if (!SUPPORTED_RIFE.includes(use_rife)) {
      console.warn(`Invalid RIFE value "${use_rife}", defaulting to true`);
      use_rife = true;
    }
    // Validate number of inference steps
    if (
      typeof num_inference_steps !== "number" ||
      !Number.isInteger(num_inference_steps) ||
      num_inference_steps < 1
    ) {
      console.warn(
        `Invalid number of inference steps "${num_inference_steps}", defaulting to 50`
      );
      num_inference_steps = 50;
    }
    // Validate seed
    if (
      seed !== null &&
      (typeof seed !== "number" || !Number.isInteger(seed) || seed < 0)
    ) {
      console.warn(`Invalid seed "${seed}", ignoring it.`);
      seed = null;
    }

    // Prepare input
    const input = {
      prompt,
      video_size,
      guidance_scale,
      negative_prompt,
      seed,
      num_inference_steps,
      use_rife,
    };

    if (style) input.style = style;
    if (typeof seed === "number" && Number.isInteger(seed) && seed >= 0) {
      input.seed = seed;
    }

    console.log("CogVideoX Input:", input);

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
    console.error("Error generating video with CogVideoX (FAL):", error);

    if (error?.body?.detail) {
      console.error(
        "Validation details:",
        JSON.stringify(error.body.detail, null, 2)
      );
    }
  }
};
