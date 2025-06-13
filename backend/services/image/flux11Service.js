import axios from "axios";
import { fal } from "@fal-ai/client";
import dotenv from "dotenv";

dotenv.config();

// Configure FAL client
fal.config({
  credentials: process.env.FAL_AI_API,
});

// Mapping enum resolutions to DeepInfra-supported resolutions
const resolutionMap = {
  square_hd: "1024x1024",
  square: "1024x1024",
  portrait_4_3: "768x1024",
  portrait_16_9: "576x1024",
  landscape_4_3: "1024x768",
  landscape_16_9: "1024x576",
};

// FAL API wrapper
export const falFluxProV1_1 = async (
  prompt,
  resolution = "landscape_4_3",
  seed
) => {
  try {
    const result = await fal.subscribe("fal-ai/flux-pro/v1.1-ultra", {
      input: { prompt, image_size: resolution, seed },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    });

    return result?.data;
  } catch (error) {
    console.error(
      "Error generating image with FAL Flux Pro v1.1:",
      error.message || error
    );
  }
};

// DeepInfra API wrapper
export const deepFluxProV1_1 = async (
  prompt = "A photo of an astronaut riding a horse on Mars.",
  resolution = "square_hd",
  seed
) => {
  try {
    // Use the resolution map to get the correct size string
    const size = resolutionMap[resolution] || "1024x1024";

    // Build the POST payload to match the curl -d JSON
    const payload = {
      prompt,
      size,
      model: "black-forest-labs/FLUX-1.1-pro",
      n: 1,
    };

    // Send POST request using axios (same as curl)
    const response = await axios.post(
      "https://api.deepinfra.com/v1/openai/images/generations",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.DEEPINFRA_API}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error generating image with DeepInfra Flux Pro v1.1:",
      error?.response?.data || error.message || error
    );
  }
};
