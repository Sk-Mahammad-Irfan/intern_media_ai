import { fal } from "@fal-ai/client";
import dotenv from "dotenv";

dotenv.config();

fal.config({
  credentials: process.env.FAL_AI_API,
});

// Mapping from FAL resolution keywords to standard aspect ratios
const ASPECT_RATIO_MAP = {
  square_hd: "1:1",
  square: "1:1",
  portrait_4_3: "3:4",
  portrait_16_9: "9:16",
  landscape_4_3: "4:3",
  landscape_16_9: "16:9",
  cinematic: "21:9",
};

// Set of allowed direct ratio strings
const VALID_RATIOS = new Set([
  "1:1",
  "16:9",
  "4:3",
  "3:2",
  "2:3",
  "3:4",
  "9:16",
  "21:9",
]);

export const minimaxGenerate = async (
  prompt,
  resolution = "square_hd",
  seed
) => {
  try {
    // Normalize aspect ratio: convert keywords, or allow direct ratios
    const normalizedAspectRatio = ASPECT_RATIO_MAP[resolution] || aspect_ratio;

    if (!VALID_RATIOS.has(normalizedAspectRatio)) {
      throw new Error(
        `Invalid aspect_ratio: "${aspect_ratio}". Must be a known keyword or one of: ${Array.from(
          VALID_RATIOS
        ).join(", ")}`
      );
    }

    const result = await fal.subscribe("fal-ai/minimax/image-01", {
      input: {
        prompt,
        aspect_ratio: resolution,
        num_images,
        prompt_optimizer,
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    });
    console.log(result.data);
    return result?.data;
  } catch (error) {
    if (error?.body?.detail) {
      const validationDetails = error.body.detail
        .map((d) => `${d.loc?.join(".") || "unknown"}: ${d.msg}`)
        .join("\n");
      console.error("Validation error(s) from FAL:\n", validationDetails);
      throw new Error(`Validation failed:\n${validationDetails}`);
    }

    console.error("Error generating image:", error);
    throw new Error(`Failed to generate image: ${error.message || error}`);
  }
};
