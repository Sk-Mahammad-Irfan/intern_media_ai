// hunyuan.js
import axios from "axios";
import { fal } from "@fal-ai/client";
import dotenv from "dotenv";

dotenv.config();
fal.config({ credentials: process.env.FAL_AI_API });

const REPLICATE_URL = "https://api.replicate.com/v1/predictions";

// Optional: Define allowed values for validation
const SUPPORTED_ASPECTS = ["16:9", "9:16"];
const SUPPORTED_RESOLUTIONS = ["480p", "580p", "720p"];

const validateAspectRatio = (aspect) =>
  SUPPORTED_ASPECTS.includes(aspect) ? aspect : "16:9";

const validateResolution = (resolution) =>
  SUPPORTED_RESOLUTIONS.includes(resolution) ? resolution : "720p";

// ------------------- FAL -------------------
export const hunyuanFAL = async (
  prompt,
  resolution = "720p",
  aspect_ratio = "16:9",
  seed = null,
  pro_mode = false
) => {
  try {
    const validatedResolution = validateResolution(resolution);
    const validatedAspect = validateAspectRatio(aspect_ratio);

    const result = await fal.subscribe("fal-ai/hunyuan-video", {
      input: {
        prompt: prompt,
        aspect_ratio: validatedAspect,
        resolution: validatedResolution,
        seed: seed,
        pro_mode: pro_mode,
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS" && Array.isArray(update.logs)) {
          console.log(update.logs.map((log) => log.message).join("\n"));
        }
      },
    });

    console.log(result?.data);
    return result?.data;
  } catch (error) {
    console.error("Error generating video with FAL Hunyuan:", error);
    throw error;
  }
};

// ------------------- Replicate -------------------
// Modify getDimensions to respect replicate's limits and aspect ratio
const getDimensions = (aspect_ratio) => {
  // Choose a base size to compute from
  let baseSize = 864; // default width
  const maxSize = 1280;
  const minSize = 16;

  let width, height;

  if (aspect_ratio === "16:9") {
    width = Math.min(Math.max(baseSize, minSize), maxSize);
    height = Math.floor((width * 9) / 16);
  } else {
    // 9:16
    height = Math.min(Math.max(baseSize, minSize), maxSize);
    width = Math.floor((height * 9) / 16);
  }

  // Round both to nearest multiple of 16
  width = Math.floor(width / 16) * 16;
  height = Math.floor(height / 16) * 16;

  // Clamp final values within Replicate's supported range
  width = Math.max(minSize, Math.min(width, maxSize));
  height = Math.max(minSize, Math.min(height, maxSize));

  return { width, height };
};

export const hunyuanReplicate = async (
  prompt,
  resolution = "720p", // Ignored in this version
  aspect_ratio = "16:9",
  seed = null
) => {
  try {
    const validatedAspect = validateAspectRatio(aspect_ratio);
    const { width, height } = getDimensions(validatedAspect);

    const response = await axios.post(
      REPLICATE_URL,
      {
        version:
          "6c9132aee14409cd6568d030453f1ba50f5f3412b844fe67f78a9eb62d55664f",
        input: {
          prompt,
          seed,
          width,
          height,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json",
          Prefer: "wait",
        },
      }
    );

    let status = response.data.status;
    let output = response.data.output;
    const getUrl = response.data.urls?.get;

    while (status !== "succeeded" && status !== "failed") {
      console.log(`Status: ${status}, Output: ${output}`);
      const pollRes = await axios.get(getUrl, {
        headers: {
          Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
        },
      });

      status = pollRes.data.status;
      output = pollRes.data.output;

      if (status === "succeeded") return pollRes.data;
      if (status === "failed") throw new Error("Video generation failed");

      await new Promise((res) => setTimeout(res, 3000));
    }
  } catch (error) {
    console.error("Error generating video with Replicate Hunyuan:", error);
    throw error;
  }
};
