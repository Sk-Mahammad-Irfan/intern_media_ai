import { wan720Replicate } from "../../services/video/wavespeedWan720.js";
import dotenv from "dotenv";

dotenv.config();

export const generateWan720Video = async (body) => {
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
      return await wan720Replicate(prompt, resolution, aspect_ratio, seed);

    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
};
