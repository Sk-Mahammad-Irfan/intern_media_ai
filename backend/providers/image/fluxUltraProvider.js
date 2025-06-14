import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const replicateFluxUltraProvider = async (
  prompt = "a majestic snow-capped mountain peak bathed in a warm glow of the setting sun",
  resolution = "3:2",
  seed,
  outputFormat = "jpg",
  rawMode,
  safetyTolerance
) => {
  try {
    const payload = {
      input: {
        prompt,
        aspect_ratio: resolution,
        seed,
        output_format: outputFormat,
        raw: rawMode,
        safety_tolerance: parseInt(safetyTolerance, 10),
      },
    };

    const headers = {
      Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json",
      Prefer: "wait",
    };

    const response = await axios.post(
      "https://api.replicate.com/v1/models/black-forest-labs/flux-1.1-pro-ultra/predictions",
      payload,
      { headers }
    );

    return response.data;
  } catch (error) {
    const status = error?.response?.status || "unknown";
    const detail = error?.response?.data || error.message || "Unknown error";
    console.error(
      `Replicate Flux-1.1-Pro-Ultra generation failed [${status}]:`,
      detail
    );
    throw new Error(
      `Replicate Flux-1.1-Pro-Ultra generation failed [${status}]: ${JSON.stringify(
        detail
      )}`
    );
  }
};

export const generateImageFluxUltra = async (body) => {
  const {
    provider,
    model = "fluxpro",
    prompt,
    resolution = "square_hd",
    outputFormat = "jpeg",
    safetyTolerance = 2,
    enableSafetyInput = true,
    seed = Math.floor(1000 + Math.random() * 9000),
    rawMode = false,
    syncMode = true,
    numImages = 1,
  } = body;

  try {
    switch (provider) {
      case "replicate":
        const data = await replicateFluxUltraProvider(
          prompt,
          resolution,
          seed,
          outputFormat,
          rawMode,
          safetyTolerance
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
