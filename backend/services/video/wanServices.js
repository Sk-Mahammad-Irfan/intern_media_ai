import axios from "axios";
import { fal } from "@fal-ai/client";
import Replicate from "replicate";
import dotenv from "dotenv";

dotenv.config();

// Configure FAL client
fal.config({ credentials: process.env.FAL_AI_API });

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Strictly supported by WAN on Replicate and FAL
const SUPPORTED_REPLICATE_RESOLUTIONS = ["480p"];
const SUPPORTED_ASPECTS = ["16:9", "9:16"];

// Validates and defaults resolution
const validateResolution = (res) =>
  SUPPORTED_REPLICATE_RESOLUTIONS.includes(res) ? res : "480p";

// Validates and defaults aspect ratio
const validateAspectRatio = (ratio) =>
  SUPPORTED_ASPECTS.includes(ratio) ? ratio : "16:9";

// ---------------- DeepInfra (No resolution/aspect) ----------------
export const wanDeepinfra = async (prompt) => {
  try {
    const response = await axios.post(
      "https://api.deepinfra.com/v1/inference/Wan-AI/Wan2.1-T2V-1.3B",
      { prompt },
      {
        headers: {
          Authorization: `Bearer ${process.env.DEEPINFRA_API}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error generating video with DeepInfra:", error);
  }
};

// ---------------- Replicate ----------------
export const wanReplicate = async (
  prompt,
  resolution = "480p",
  aspect_ratio = "16:9"
) => {
  try {
    const validRes = validateResolution(resolution);
    const validAspect = validateAspectRatio(aspect_ratio);

    const input = {
      prompt,
      frame_num: 81,
      resolution: validRes,
      aspect_ratio: validAspect,
      sample_shift: 8,
      sample_steps: 30,
      sample_guide_scale: 6,
    };

    const output = await replicate.run("wan-video/wan-2.1-1.3b", { input });

    const videoUrl =
      typeof output?.url === "function" ? await output.url() : output;

    return videoUrl;
  } catch (error) {
    console.error("Error generating video with Replicate:", error);
    throw error;
  }
};

// ---------------- FAL ----------------
export const wanFAL = async (
  prompt,
  resolution = "480p",
  aspect_ratio = "16:9"
) => {
  try {
    const validRes = validateResolution(resolution);
    const validAspect = validateAspectRatio(aspect_ratio);

    const result = await fal.subscribe("fal-ai/wan/v2.1/1.3b/text-to-video", {
      input: {
        prompt,
        resolution: validRes,
        aspect_ratio: validAspect,
      },
      logs: false,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS" && Array.isArray(update.logs)) {
          console.log(update.logs.map((log) => log.message).join("\n"));
        }
      },
    });

    return result?.data;
  } catch (error) {
    console.error("Error generating video with FAL:", error);
  }
};
