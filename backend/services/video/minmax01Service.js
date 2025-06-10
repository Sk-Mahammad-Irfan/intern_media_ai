// minimax.js
import axios from "axios";
import { fal } from "@fal-ai/client";
import dotenv from "dotenv";

dotenv.config();
fal.config({ credentials: process.env.FAL_AI_API });

const REPLICATE_URL =
  "https://api.replicate.com/v1/models/minimax/video-01/predictions";

// Optional: Define allowed values for validation
const SUPPORTED_ASPECTS = ["16:9", "9:16", "1:1"];

const validateAspectRatio = (aspect) =>
  SUPPORTED_ASPECTS.includes(aspect) ? aspect : "16:9";

// ------------------- FAL -------------------
export const minimaxFAL = async (
  prompt,
  resolution,
  aspect_ratio,
  seed,
  prompt_optimizer = true
) => {
  try {
    const result = await fal.subscribe("fal-ai/minimax/video-01", {
      input: {
        prompt: prompt,
        prompt_optimizer: prompt_optimizer,
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS" && Array.isArray(update.logs)) {
          console.log(update.logs.map((log) => log.message).join("\n"));
        }
      },
    });

    console.log(result?.data);
    return result?.data;
  } catch (error) {
    console.error("Error generating video with FAL Minimax:", error);
    throw error;
  }
};

// ------------------- Replicate -------------------
export const minimaxReplicate = async (
  prompt,
  resolution,
  aspect_ratio,
  seed,
  prompt_optimizer = true
) => {
  try {
    const response = await axios.post(
      REPLICATE_URL,
      {
        input: {
          prompt,
          prompt_optimizer,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json",
          Prefer: "wait",
        },
      }
    );

    let status = response.data.status;
    let output = response.data.output;

    const getUrl = response.data.urls?.get;

    while (status !== "succeeded" && status !== "failed") {
      console.log(`Status: ${status}, Output: ${output}`);
      const pollRes = await axios.get(getUrl, {
        headers: {
          Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
        },
      });

      status = pollRes.data.status;
      output = pollRes.data.output;

      if (status === "succeeded") return pollRes.data;
      if (status === "failed") throw new Error("Video generation failed");

      await new Promise((res) => setTimeout(res, 3000));
    }
  } catch (error) {
    console.error("Error generating video with Replicate Minimax:", error);
    throw error;
  }
};
