import { fal } from "@fal-ai/client";
import dotenv from "dotenv";

dotenv.config();

fal.config({
  credentials: process.env.FAL_AI_API,
});

export const generateImageSana = async (
  prompt,
  {
    negative_prompt = "",
    num_inference_steps = 18,
    seed,
    guidance_scale = 5,
    sync_mode = false,
    num_images = 1,
    enable_safety_checker = true,
    output_format = "jpeg",
    style_name = "(No style)",
  } = {}
) => {
  try {
    const result = await fal.subscribe("fal-ai/sana/v1.5/4.8b", {
      input: {
        prompt,
        negative_prompt,
        num_inference_steps,
        seed,
        guidance_scale,
        sync_mode,
        num_images,
        enable_safety_checker,
        output_format,
        style_name,
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    });

    return {
      data: result.data,
      requestId: result.requestId,
    };
  } catch (error) {
    console.error("Error generating image with sana model:", error);
  }
};
