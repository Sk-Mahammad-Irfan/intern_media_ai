// generatePixverse.js
import { fal } from "@fal-ai/client";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
fal.config({ credentials: process.env.FAL_AI_API });

const REPLICATE_URL =
  "https://api.replicate.com/v1/models/pixverse/pixverse-v4.5/predictions";

const SUPPORTED_ASPECTS = ["16:9", "9:16", "1:1"];
const SUPPORTED_DURATIONS = [5, 8];
const SUPPORTED_QUALITIES = ["360p", "540p", "720p", "1080p"];
const SUPPORTED_STYLES = [
  "None",
  "anime",
  "3d_animation",
  "clay",
  "cyberpunk",
  "comic",
];
const SUPPORTED_EFFECTS = [
  "None",
  "Let's YMCA!",
  "Subject 3 Fever",
  "Ghibli Live!",
  "Suit Swagger",
  "Muscle Surge",
  "360° Microwave",
  "Warmth of Jesus",
  "Emergency Beat",
  "Anything, Robot",
  "Kungfu Club",
  "Mint in Box",
  "Retro Anime Pop",
  "Vogue Walk",
  "Mega Dive",
  "Evil Trigger",
];
const SUPPORTED_MOTIONS = ["normal", "smooth"];

const validate = (value, list, fallback) =>
  list.includes(value) ? value : fallback;

export const generatePixverseVideo = async (body) => {
  const {
    provider = "fal",
    prompt = "A futuristic skyline at dusk",
    aspect_ratio = "16:9",
    duration = 5,
    resolution = "720p",
    quality = "720p", // replicate uses "quality"
    negative_prompt = "",
    style = "None",
    effect = "None",
    motion_mode = "normal",
    seed,
  } = body;

  switch (provider) {
    case "fal": {
      try {
        const result = await fal.subscribe(
          "fal-ai/pixverse/v4.5/text-to-video",
          {
            input: {
              prompt,
              aspect_ratio: validate(aspect_ratio, SUPPORTED_ASPECTS, "16:9"),
              duration: validate(duration, SUPPORTED_DURATIONS, 5),
              resolution: validate(resolution, SUPPORTED_QUALITIES, "720p"),
              negative_prompt,
              ...(seed !== undefined && { seed }), // only include seed if provided
            },
            logs: true,
            onQueueUpdate: (update) => {
              if (
                update.status === "IN_PROGRESS" &&
                Array.isArray(update.logs)
              ) {
                console.log(update.logs.map((log) => log.message).join("\n"));
              }
            },
          }
        );

        return result?.data;
      } catch (error) {
        // Enhanced logging for 422 error
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
            // Detail is not in expected format
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

        // Log and rethrow any other errors
        console.error("🔥 Unexpected error from FAL:", error);
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
              aspect_ratio: validate(aspect_ratio, SUPPORTED_ASPECTS, "16:9"),
              quality: validate(quality, SUPPORTED_QUALITIES, "720p"),
              duration: validate(duration, SUPPORTED_DURATIONS, 5),
              negative_prompt,
              style: validate(style, SUPPORTED_STYLES, "None"),
              effect: validate(effect, SUPPORTED_EFFECTS, "None"),
              motion_mode: validate(motion_mode, SUPPORTED_MOTIONS, "normal"),
              seed,
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
        console.error("Error generating video with Replicate:", error);
        throw error;
      }
    }

    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
};
