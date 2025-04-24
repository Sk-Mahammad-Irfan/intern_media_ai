import axios from "axios";
import { fal } from "@fal-ai/client";
import dotenv from "dotenv";

dotenv.config();

// Configure FAL client
fal.config({
  credentials: process.env.FAL_AI_API,
});

export const generateWithFALImage = async (prompt) => {
  try {
    const result = await fal.subscribe("fal-ai/fooocus", {
      input: { prompt },
      logs: true,
    });

    return result?.data;
  } catch (error) {
    console.error("Error generating image with FAL:", error.message || error);
  }
};

export const generateWithDeepInfraImage = async (prompt) => {
  try {
    const response = await axios.post(
      "https://api.deepinfra.com/v1/openai/images/generations",
      {
        prompt,
        size: "1024x1024",
        model: "stabilityai/sd3.5",
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
      "Error generating image with DeepInfra:",
      error.message || error
    );
  }
};
