// generateMinimaxVideo.js
import axios from "axios";
import { fal } from "@fal-ai/client";
import dotenv from "dotenv";

dotenv.config();
fal.config({ credentials: process.env.FAL_AI_API });

const REPLICATE_URL =
  "https://api.replicate.com/v1/models/minimax/video-01/predictions";

export const generateMinimaxVideo = async (body) => {
  const {
    provider = "fal",
    prompt = "A woman walking in Tokyo at night wearing sunglasses",
    prompt_optimizer = true,
  } = body;

  switch (provider) {
    case "fal": {
      try {
        const result = await fal.subscribe("fal-ai/minimax/video-01", {
          input: {
            prompt,
            prompt_optimizer,
          },
          logs: true,
          onQueueUpdate: (update) => {
            if (update.status === "IN_PROGRESS" && Array.isArray(update.logs)) {
              console.log(update.logs.map((log) => log.message).join("\n"));
            }
          },
        });

        return result?.data;
      } catch (error) {
        console.error("❌ FAL Minimax error:", error);
        throw error;
      }
    }

    case "replicate": {
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
    }

    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
};
