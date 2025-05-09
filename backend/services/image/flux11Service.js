import axios from "axios";
import { fal } from "@fal-ai/client";
import dotenv from "dotenv";

dotenv.config();

// Configure FAL client
fal.config({
  credentials: process.env.FAL_AI_API,
});

export const falFluxProV1_1 = async (prompt) => {
  try {
    const result = await fal.subscribe("fal-ai/flux-pro/v1.1-ultra", {
      input: { prompt },
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

export const deepFluxProV1_1 = async (prompt) => {
  try {
    const response = await axios.post(
      "https://api.deepinfra.com/v1/openai/images/generations",
      {
        prompt,
        size: "1024x1024",
        model: "black-forest-labs/FLUX-1.1-pro",
        n: 1,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.DEEPINFRA_API}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error generating image with DeepInfra Flux Pro v1.1:",
      error.message || error
    );
  }
};
