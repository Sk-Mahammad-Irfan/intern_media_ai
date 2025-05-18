import dotenv from "dotenv";
import { fal } from "@fal-ai/client";

dotenv.config();

fal.config({
  credentials: process.env.FAL_AI_API,
});

// === Supported Ideogram Configuration ===
const SUPPORTED_IMAGE_SIZES = [
  "square_hd",
  "square",
  "portrait_4_3",
  "portrait_16_9",
  "landscape_4_3",
  "landscape_16_9",
];

const SUPPORTED_RENDERING_SPEEDS = ["TURBO", "BALANCED", "QUALITY"];
const SUPPORTED_IMAGE_STYLES = ["AUTO", "GENERAL", "REALISTIC", "DESIGN"];

// === Unified Ideogram Image Generator ===
export const generateImageIdeogram = async (body) => {
  const {
    prompt,
    resolution = "square_hd",
    negative_prompt = "",
    seed,
    expandPrompt = true,
    style = "AUTO",
    renderingSpeed = "BALANCED",
  } = body;

  try {
    if (!prompt || typeof prompt !== "string") {
      throw new Error("Prompt is required and must be a string.");
    }

    // Validate resolution
    const finalResolution = SUPPORTED_IMAGE_SIZES.includes(resolution)
      ? resolution
      : "square_hd";
    if (!SUPPORTED_IMAGE_SIZES.includes(resolution)) {
      console.warn(
        `Invalid resolution "${resolution}", defaulting to "square_hd"`
      );
    }

    // Validate style
    const finalStyle = SUPPORTED_IMAGE_STYLES.includes(style) ? style : "AUTO";
    if (!SUPPORTED_IMAGE_STYLES.includes(style)) {
      console.warn(`Invalid style "${style}", defaulting to "AUTO"`);
    }

    // Validate rendering speed
    const finalRenderingSpeed = SUPPORTED_RENDERING_SPEEDS.includes(
      renderingSpeed
    )
      ? renderingSpeed
      : "BALANCED";
    if (!SUPPORTED_RENDERING_SPEEDS.includes(renderingSpeed)) {
      console.warn(
        `Invalid renderingSpeed "${renderingSpeed}", defaulting to "BALANCED"`
      );
    }

    // Validate expandPrompt
    const finalExpandPrompt =
      typeof expandPrompt === "boolean" ? expandPrompt : true;

    // Validate negative_prompt
    const finalNegativePrompt =
      typeof negative_prompt === "string" ? negative_prompt : "";

    // Validate seed
    const finalSeed = typeof seed === "number" && seed >= 0 ? seed : undefined;

    const result = await fal.subscribe("fal-ai/ideogram/v3", {
      input: {
        prompt,
        image_size: finalResolution,
        negative_prompt: finalNegativePrompt,
        expand_prompt: finalExpandPrompt,
        style: finalStyle,
        rendering_speed: finalRenderingSpeed,
        ...(finalSeed !== undefined && { seed: finalSeed }),
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
    console.error(
      "Error generating image with Ideogram V3:",
      error.message || error
    );
    throw error;
  }
};
