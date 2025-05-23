import axios from "axios";
import { fal } from "@fal-ai/client";
import dotenv from "dotenv";
import FormData from "form-data";

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

export const segmindRecraftV3 = async (prompt) => {
  try {
    const formData = new FormData();
    formData.append("size", "1024x1024");
    formData.append("style", "any");
    formData.append("prompt", prompt);

    const response = await axios.post(
      "https://api.segmind.com/v1/recraft-v3",
      formData,
      {
        headers: {
          "x-api-key": process.env.SEGMIND_API,
          ...formData.getHeaders(),
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error generating image with Segmind Recraft V3:",
      error.message || error
    );
  }
};
