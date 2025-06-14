import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const replicateFluxKontextProProvider = async (
  prompt = "Make this a 90s cartoon",
  resolution,
  seed,
  safetyTolerance,
  outputFormat
) => {
  try {
    const payload = {
      input: {
        prompt,
        aspect_ratio: resolution,
        seed,
        output_format: "jpg",
        safety_tolerance: safetyTolerance,
        output_format: outputFormat,
      },
    };

    const headers = {
      Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json",
      Prefer: "wait",
    };

    const response = await axios.post(
      "https://api.replicate.com/v1/models/black-forest-labs/flux-kontext-pro/predictions",
      payload,
      { headers }
    );

    return response.data;
  } catch (error) {
    const status = error?.response?.status || "unknown";
    const detail = error?.response?.data || error.message || "Unknown error";
    console.error(
      `Replicate Flux-Kontext generation failed [${status}]:`,
      detail
    );
    throw new Error(
      `Replicate Flux-Kontext generation failed [${status}]: ${JSON.stringify(
        detail
      )}`
    );
  }
};

export const generateImageFluxKontextPro = async (body) => {
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
      case "replicate":
        const parsedSafetyTolerance = parseInt(safetyTolerance, 10); // 👈 Parse to integer
        const data = await replicateFluxKontextProProvider(
          prompt,
          resolution,
          seed,
          parsedSafetyTolerance,
          outputFormat
        );
        return data;
      default:
        throw new Error(`Unsupported provider '${provider}'.`);
    }
  } catch (error) {
    console.error("Image generation error:", error.message);
    throw error;
  }
};
