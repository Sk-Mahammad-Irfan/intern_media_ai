import { fal } from "@fal-ai/client";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
fal.config({ credentials: process.env.FAL_AI_API });

// Replicate veo3 model endpoint
const REPLICATE_VEO3_URL =
  "https://api.replicate.com/v1/models/google/veo-3/predictions";

const SUPPORTED_ASPECTS = ["16:9", "9:16", "1:1"];
const SUPPORTED_DURATIONS = ["8s"]; // veo3 on FAL supports only "8s"

const validate = (value, list, fallback) =>
  list.includes(value) ? value : fallback;

export const generateVeo3Video = async (body) => {
  const {
    provider = "fal",
    prompt = "A casual street interview on a busy New York City sidewalk in the afternoon.",
    aspect_ratio = "16:9",
    duration = "8s", // veo3 default duration
    negative_prompt = "", // veo3 might not support this but kept for consistency
    seed,
  } = body;

  switch (provider) {
    case "fal": {
      try {
        const result = await fal.subscribe("fal-ai/veo3", {
          input: {
            prompt,
            aspect_ratio: validate(aspect_ratio, SUPPORTED_ASPECTS, "16:9"),
            duration: validate(duration, SUPPORTED_DURATIONS, "8s"),
            negative_prompt,
            ...(seed !== undefined && { seed }),
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
        if (error?.response?.status === 422) {
          const detail = error.response?.data?.detail;

          if (Array.isArray(detail)) {
            const validationDetails = detail
              .map((d) => {
                const loc = Array.isArray(d.loc) ? d.loc.join(".") : "unknown";
                return `${loc}: ${d.msg}`;
              })
              .join("\n");

            console.error(
              "🛑 Validation error(s) from FAL:\n",
              validationDetails
            );
            throw new Error(`Validation failed:\n${validationDetails}`);
          } else {
            console.error(
              "🛑 Unexpected 422 error format:",
              error.response?.data
            );
            throw new Error(
              `Unexpected 422 error format: ${JSON.stringify(
                error.response?.data,
                null,
                2
              )}`
            );
          }
        }
        console.error("🔥 Unexpected error from FAL:", error);
        throw error;
      }
    }

    case "replicate": {
      try {
        const response = await axios.post(
          REPLICATE_VEO3_URL,
          {
            input: {
              prompt,
              // veo3 replicate model currently accepts only prompt and seed
              ...(seed !== undefined && { seed }),
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

        return response.data;
      } catch (error) {
        console.error("Error generating video with Replicate (veo3):", error);
        throw error;
      }
    }

    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
};
