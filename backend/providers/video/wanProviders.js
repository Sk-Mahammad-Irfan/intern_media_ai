import { fal } from "@fal-ai/client";
import dotenv from "dotenv";
import Replicate from "replicate";
import axios from "axios";

dotenv.config();

// Configure FAL client
fal.config({ credentials: process.env.FAL_AI_API });

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Constants
const SUPPORTED_REPLICATE_RESOLUTIONS = ["480p"];
const SUPPORTED_ASPECTS = ["16:9", "9:16"];

const validateResolution = (res) =>
  SUPPORTED_REPLICATE_RESOLUTIONS.includes(res) ? res : "480p";

const validateAspectRatio = (ratio) =>
  SUPPORTED_ASPECTS.includes(ratio) ? ratio : "16:9";

// ---------------- Unified Interface ----------------
export const generateVideoWan = async (body) => {
  const {
    provider,
    prompt,
    aspect_ratio = "16:9",
    resolution = "480p",
    shift = 5,
    sampler = "unipc",
    num_inference_steps = 30,
    guidance_scale = 5,
    negative_prompt = "",
    seed,
    enable_prompt_expansion,
    enable_safety_checker,
    frame_num = 81,
    webhook,
  } = body;

  try {
    switch (provider) {
      case "replicate": {
        const input = {
          prompt,
          frame_num,
          resolution: validateResolution(resolution),
          aspect_ratio: validateAspectRatio(aspect_ratio),
          sample_shift: shift,
          sample_steps: num_inference_steps,
          sample_guide_scale: guidance_scale,
        };

        const output = await replicate.run("wan-video/wan-2.1-1.3b", { input });
        return typeof output?.url === "function" ? await output.url() : output;
      }

      case "fal": {
        const input = {
          prompt,
          resolution: validateResolution(resolution),
          aspect_ratio: validateAspectRatio(aspect_ratio),
          guidance_scale,
        };

        if (seed !== undefined) input.seed = seed;
        if (negative_prompt) input.negative_prompt = negative_prompt;
        if (webhook) input.webhook = webhook;

        const result = await fal.subscribe(
          "fal-ai/wan/v2.1/1.3b/text-to-video",
          {
            input,
            logs: false,
            onQueueUpdate: (update) => {
              if (
                update.status === "IN_PROGRESS" &&
                Array.isArray(update.logs)
              ) {
                console.log(update.logs.map((log) => log.message).join("\n"));
              }
            },
          }
        );

        return result?.data;
      }

      case "deepinfra": {
        const input = {
          prompt,
          frame_num,
          resolution: validateResolution(resolution),
          aspect_ratio: validateAspectRatio(aspect_ratio),
          sample_shift: shift,
          sample_steps: num_inference_steps,
          sample_guide_scale: guidance_scale,
        };

        if (seed !== undefined) input.seed = seed;

        const response = await axios.post(
          "https://api.deepinfra.com/v1/inference/Wan-AI/Wan2.1-T2V-1.3B",
          input,
          {
            headers: {
              Authorization: `Bearer ${process.env.DEEPINFRA_API}`,
              "Content-Type": "application/json",
            },
          }
        );

        return response.data;
      }

      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  } catch (error) {
    console.error(`Error generating video with ${provider}:`, error);
    throw error;
  }
};
