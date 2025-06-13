import { wan14B } from "../../services/video/wan14bService.js";

export const generateVideoWan14B = async (body) => {
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
      case "deepinfra":
        const data = await wan14B(prompt, resolution, aspect_ratio, seed);
        console.log(data);
        return data;
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  } catch (error) {
    console.error("Error generating video:", error);
  }
};
