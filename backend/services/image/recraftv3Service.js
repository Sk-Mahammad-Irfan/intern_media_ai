import axios from "axios";
import { fal } from "@fal-ai/client";
import dotenv from "dotenv";

dotenv.config();

// Configure FAL client
fal.config({
  credentials: process.env.FAL_AI_API,
});

// Default value: square_hd

// Possible enum values: square_hd, square, portrait_4_3, portrait_16_9, landscape_4_3, landscape_16_9

export const falRecraftV3 = async (prompt, resolution = "square_hd", seed) => {
  try {
    const result = await fal.subscribe("fal-ai/recraft-v3", {
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
      "Error generating image with FAL Recraft V3:",
      error.message || error
    );
  }
};

export const replicateRecraftV3 = async (
  prompt,
  resolution = "square_hd",
  seed
) => {
  try {
    // Valid sizes supported by Replicate
    const resolutionMap = {
      square_hd: "1024x1024",
      square: "1024x1024",
      portrait_4_3: "1024x1365",
      portrait_16_9: "1024x1820",
      landscape_4_3: "1365x1024",
      landscape_16_9: "1820x1024",
    };

    const size = resolutionMap[resolution];
    if (!size) {
      throw new Error(
        `Invalid resolution keyword "${resolution}". Use one of: ${Object.keys(
          resolutionMap
        ).join(", ")}`
      );
    }

    const body = {
      input: {
        prompt,
        size,
      },
    };

    if (seed !== undefined) {
      body.input.seed = seed;
    }

    const response = await axios.post(
      "https://api.replicate.com/v1/models/recraft-ai/recraft-v3/predictions",
      body,
      {
        headers: {
          Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json",
          Prefer: "wait",
        },
      }
    );
    console.log(response.data);

    return response.data;
  } catch (error) {
    console.error(
      "Error generating image with Replicate Recraft V3:",
      error.response?.data || error.message
    );
    throw error;
  }
};
