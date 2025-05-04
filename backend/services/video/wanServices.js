import axios from "axios";
import { fal } from "@fal-ai/client";
import Replicate from "replicate";
import dotenv from "dotenv";

dotenv.config();

// Configure FAL client
fal.config({
  credentials: process.env.FAL_AI_API,
});

// Initialize Replicate client
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export const wanDeepinfra = async (prompt) => {
  try {
    const response = await axios.post(
      "https://api.deepinfra.com/v1/inference/Wan-AI/Wan2.1-T2V-1.3B",
      { prompt },
      {
        headers: {
          Authorization: `Bearer ${process.env.DEEPINFRA_API}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("deep");
    return response.data;
  } catch (error) {
    console.error("Error generating video with DeepInfra:", error);
  }
};

export const wanReplicate = async (prompt) => {
  try {
    const input = {
      prompt,
      frame_num: 81,
      resolution: "480p",
      aspect_ratio: "16:9",
      sample_shift: 8,
      sample_steps: 30,
      sample_guide_scale: 6,
    };
    console.log("helooo");
    const output = await replicate.run("wan-video/wan-2.1-1.3b", { input });
    return output;
  } catch (error) {
    console.error("Error generating video with Replicate:", error);
  }
};

export const wanFAL = async (prompt) => {
  try {
    const result = await fal.subscribe("fal-ai/wan/v2.1/1.3b/text-to-video", {
      input: { prompt },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          console.log(update.logs.map((log) => log.message).join("\n"));
        }
      },
    });
    console.log("fall");
    return result.data;
  } catch (error) {
    console.error("Error generating video with FAL:", error);
  }
};
