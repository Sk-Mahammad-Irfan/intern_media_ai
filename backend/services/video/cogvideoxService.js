import dotenv from "dotenv";
import { fal } from "@fal-ai/client";

dotenv.config();

fal.config({
  credentials: process.env.FAL_AI_API,
});

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
  resolution = "720p",
  aspect_ratio = "landscape_16_9",
  seed = ""
) => {
  try {
    // Validate video size
    if (!SUPPORTED_VIDEO_SIZE.includes(aspect_ratio)) {
      console.warn(
        `Invalid video size "${aspect_ratio}", defaulting to "landscape_16_9"`
      );
      aspect_ratio = "landscape_16_9";
    }

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
      video_size: aspect_ratio,
      seed,
    };

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
    // Custom error message extraction for ValidationError
    if (error?.body?.detail) {
      const validationDetails = error.body.detail
        .map((d) => `${d.loc?.join(".") || "unknown"}: ${d.msg}`)
        .join("\n");
      console.error("Validation error(s) from FAL:\n", validationDetails);
      throw new Error(`Validation failed:\n${validationDetails}`);
    }

    // Generic fallback error
    console.error("Error generating cog Video:", error);
    throw new Error(`Failed to generate Video: ${error.message || error}`);
  }
};
