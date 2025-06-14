import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const replicateFluxKontext = async (
  prompt = "Make this a 90s cartoon",
  resolution,
  seed
) => {
  try {
    const payload = {
      input: {
        prompt,
        aspect_ratio: resolution,
        seed,
        output_format: "jpg",
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
