// generateHunyuanVideo.js
import dotenv from "dotenv";
import {
  hunyuanFAL,
  hunyuanReplicate,
} from "../../services/video/hunyuanService.js";

dotenv.config();

export const generateHunyuanVideo = async (body) => {
  const {
    provider = "fal",
    prompt = "A cat walks on the grass, realistic style",
    resolution = "720p",
    aspect_ratio = "16:9",
    seed = null,
    pro_mode = false,
  } = body;

  switch (provider) {
    case "fal":
      return await hunyuanFAL(prompt, resolution, aspect_ratio, seed, pro_mode);

    case "replicate":
      return await hunyuanReplicate(prompt, resolution, aspect_ratio, seed);

    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
};
