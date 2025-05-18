// hidreamFAL.js

import { fal } from "@fal-ai/client";
import dotenv from "dotenv";

dotenv.config();

fal.config({
  credentials: process.env.FAL_AI_API,
});

const IMAGE_SIZE = [
  "square_hd",
  "square",
  "portrait_4_3",
  "portrait_16_9",
  "landscape_4_3",
  "landscape_16_9",
];

const OUTPUT_FORMAT = ["png", "jpg"];

// The resolution of the generated image Default value: square_hd
// Possible enum values: square_hd, square, portrait_4_3, portrait_16_9, landscape_4_3, landscape_16_9
export const hidreamFAL = async (
  prompt,
  resolution = "square_hd",
  enable_safety_checker,
  negative_prompt = "",
  seed = null,
  num_inference_steps
) => {
  try {
    // Validate resolution
    if (!IMAGE_SIZE.includes(resolution)) {
      console.warn(
        `Invalid resolution "${resolution}", defaulting to "square_hd"`
      );
      resolution = "square_hd";
    }

    // Validate num_inference_steps
    if (num_inference_steps < 1 || num_inference_steps > 100) {
      console.warn(
        `Invalid num_inference_steps "${num_inference_steps}", defaulting to 28`
      );
      num_inference_steps = 28;
    }
    // Validate enable_safety_checker
    if (typeof enable_safety_checker !== "boolean") {
      console.warn(
        `Invalid enable_safety_checker "${enable_safety_checker}", defaulting to true`
      );
      enable_safety_checker = true;
    }
    // Validate negative_prompt
    if (typeof negative_prompt !== "string") {
      console.warn(
        `Invalid negative_prompt "${negative_prompt}", defaulting to ""`
      );
      negative_prompt = "";
    }
    // Validate seed
    if (seed && (typeof seed !== "number" || seed < 0)) {
      console.warn(`Invalid seed "${seed}", defaulting to null`);
      seed = null;
    }

    const input = {
      prompt,
      image_size: resolution,
      enable_safety_checker,
      negative_prompt,
      seed,
      num_inference_steps,
    };

    if (seed !== null) input.seed = seed;
    const result = await fal.subscribe("fal-ai/hidream-i1-dev", {
      input,
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    });
    return result.data;
  } catch (error) {
    console.error("Error generating image with HiDream I1:", error);
  }
};
