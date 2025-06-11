// veo3.js
import axios from "axios";
import { fal } from "@fal-ai/client";
import dotenv from "dotenv";

dotenv.config();

// Configure FAL API
fal.config({ credentials: process.env.FAL_AI_API });

// Replicate Veo3 endpoint
const REPLICATE_URL =
  "https://api.replicate.com/v1/models/google/veo-3/predictions";

// --------- Utility Functions ----------
const validateAspectRatio = (value) =>
  ["16:9", "9:16", "1:1"].includes(value) ? value : "16:9";
const validateDuration = (value) => (["8s"].includes(value) ? value : "8s");

// --------- FAL Implementation ----------
export const generateVeo3WithFAL = async (
  prompt = "A futuristic skyline at dusk",
  aspect_ratio = "16:9",
  duration = "8s",
  negative_prompt = "",
  enhance_prompt = true,
  seed,
  generate_audio = true
) => {
  try {
    const result = await fal.subscribe("fal-ai/veo3", {
      input: {
        prompt,
        aspect_ratio: validateAspectRatio(aspect_ratio),
        duration: validateDuration(duration),
        negative_prompt,
        enhance_prompt,
        generate_audio,
        ...(seed !== undefined && { seed }),
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
    console.error("Error generating video with FAL Veo3:", error);
    throw error;
  }
};

// --------- Replicate Implementation ----------
const getRandomSeed = () => Math.floor(1000 + Math.random() * 9000);

export const generateVeo3WithReplicate = async (
  prompt = "A futuristic skyline at dusk",
  seed
) => {
  try {
    let parsedSeed = seed !== undefined ? parseInt(seed, 10) : undefined;

    if (isNaN(parsedSeed)) {
      parsedSeed = getRandomSeed();
      console.log(`Invalid seed provided. Using random seed: ${parsedSeed}`);
    }

    const input = {
      prompt,
      seed: parsedSeed,
    };

    const response = await axios.post(
      REPLICATE_URL,
      { input },
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
    console.error("Error generating video with Replicate:", error);
    throw error;
  }
};
