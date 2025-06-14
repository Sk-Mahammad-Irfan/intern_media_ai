import { wan480Replicate } from "../../services/video/wavespeedWan480.js";
import dotenv from "dotenv";

dotenv.config();

export const generateWan480Video = async (body) => {
  const {
    provider = "fal",
    prompt = "A cat walks on the grass, realistic style",
    resolution = "720p",
    aspect_ratio = "16:9",
    seed = null,
    pro_mode = false,
  } = body;

  switch (provider) {
    case "replicate":
      return await wan480Replicate(prompt, resolution, aspect_ratio, seed);

    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
};
