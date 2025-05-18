// ideogramFAL.js

import { fal } from "@fal-ai/client";
import dotenv from "dotenv";

dotenv.config();

fal.config({
  credentials: process.env.FAL_AI_API,
});

const RENDERING_SPEED = ["TURBO", "BALANCED", "QUALITY"];
const IMAGE_STYLES = ["AUTO", "GENERAL", "REALISTIC", "DESIGN"];
const IMAGE_SIZE = [
  "square_hd",
  "square",
  "portrait_4_3",
  "portrait_16_9",
  "landscape_4_3",
  "landscape_16_9",
];
// The resolution of the generated image Default value: square_hd

// Possible enum values: square_hd, square, portrait_4_3, portrait_16_9, landscape_4_3, landscape_16_9
// expand_prompt default value: true
export const ideogramFAL = async (
  prompt,
  resolution = "square_hd",
  negative_prompt = "",
  seed = null,
  expand_prompt,
  style,
  rendering_speed
) => {
  try {
    // Validate resolution
    if (!IMAGE_SIZE.includes(resolution)) {
      console.warn(
        `Invalid resolution "${resolution}", defaulting to "square_hd"`
      );
      resolution = "square_hd";
    }

    // Validate style
    if (!IMAGE_STYLES.includes(style)) {
      console.warn(`Invalid style "${style}", defaulting to "AUTO"`);
      style = "AUTO";
    }

    // Validate rendering speed
    if (!RENDERING_SPEED.includes(rendering_speed)) {
      console.warn(
        `Invalid rendering speed "${rendering_speed}", defaulting to "BALANCED"`
      );
      rendering_speed = "BALANCED";
    }

    const input = {
      prompt,
      image_size: resolution,
      expand_prompt,
      negative_prompt,
      style,
      rendering_speed,
    };

    if (seed !== null) input.seed = seed;

    const result = await fal.subscribe("fal-ai/ideogram/v3", {
      input,
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    });
    return result?.data;
  } catch (error) {
    console.error("Error generating image with Ideogram V3:", error);
  }
};
