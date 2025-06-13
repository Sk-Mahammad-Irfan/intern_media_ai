import { deepFluxPro } from "../../services/image/fluxProService.js";

export const generateImageFluxPro = async (body) => {
  const {
    provider,
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
        const data = await deepFluxPro(prompt, resolution, seed);
        return data;
      default:
        throw new Error(`Unsupported provider '${provider}'.`);
    }
  } catch (error) {}
};
