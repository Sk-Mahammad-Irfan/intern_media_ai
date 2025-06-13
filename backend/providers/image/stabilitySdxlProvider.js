import { stability35Mid } from "../../services/image/stability35midService.js";
import { stability35SDXL } from "../../services/image/stabilitySdxlService.js";

export const generateImageStability35SDXL = async (body) => {
  const {
    provider,
    model = "fluxpro",
    prompt,
    resolution = "square_hd",
    outputFormat = "jpeg",
    safetyTolerance = 2,
    enableSafetyInput = true,
    seed,
    rawMode = false,
    syncMode = true,
    numImages = 1,
  } = body;

  try {
    switch (provider) {
      case "deepinfra":
        return stability35SDXL(prompt, resolution, seed);
      default:
        throw new Error(`Unsupported provider '${provider}'.`);
    }
  } catch (error) {
    console.error("Image generation error:", error.message);
    throw error;
  }
};
