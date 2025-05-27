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
        `Invalid video size "${video_size}", defaulting to "landscape_16_9"`
      );
      video_size = "landscape_16_9";
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
