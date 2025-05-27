// generateViduVideo.js
import dotenv from "dotenv";
import { fal } from "@fal-ai/client";

dotenv.config();

fal.config({
  credentials: process.env.FAL_AI_API,
});

// Supported enums for Vidu
const SUPPORTED_ASPECT_RATIOS = ["16:9", "9:16", "1:1"];
const SUPPORTED_STYLES = ["general", "anime"];

// The movement amplitude of objects in the frame Default value: "auto"
const MOVEMENT_AMPLITUDE = ["auto", "small", "medium", "large"];

// === Ratio parsing utility ===
const parseRatio = (str) => {
  const [w, h] = str.split(":").map(Number);
  return w / h;
};

// === Find closest supported aspect ratio ===
const mapToClosestSupportedAspectRatio = (input) => {
  const inputRatio = parseRatio(input);
  let closest = SUPPORTED_ASPECT_RATIOS[0];
  let minDiff = Math.abs(inputRatio - parseRatio(closest));

  for (const ratio of SUPPORTED_ASPECT_RATIOS) {
    const diff = Math.abs(inputRatio - parseRatio(ratio));
    if (diff < minDiff) {
      closest = ratio;
      minDiff = diff;
    }
  }

  console.warn(
    `Unsupported aspect ratio "${input}", using closest: "${closest}"`
  );
  return closest;
};

// === Unified Vidu Video Generator ===
export const generateVideoVidu = async (body) => {
  const {
    prompt,
    aspect_ratio = "16:9",
    style = null,
    movement_amplitude = "auto",
    seed = null,
  } = body;

  try {
    if (!prompt || typeof prompt !== "string") {
      throw new Error("Prompt is required and must be a string.");
    }

    // Final validated values
    const finalAspectRatio = SUPPORTED_ASPECT_RATIOS.includes(aspect_ratio)
      ? aspect_ratio
      : mapToClosestSupportedAspectRatio(aspect_ratio);

    if (finalAspectRatio === "16:9") {
      console.warn(`16:9 only supports 5s duration. Using 5s.`);
      finalDuration = 5;
    }

    const finalStyle = style && SUPPORTED_STYLES.includes(style) ? style : null;

    let finalMovementAmplitude = MOVEMENT_AMPLITUDE.includes(movement_amplitude)
      ? movement_amplitude
      : "auto";

    const input = {
      prompt,
      aspect_ratio: finalAspectRatio,
      negative_prompt,
      movement_amplitude: finalMovementAmplitude,
    };

    if (finalStyle) input.style = finalStyle;
    if (seed !== null) input.seed = seed;

    console.log("Vidu Input:", input);

    const result = await fal.subscribe("fal-ai/vidu/q1/text-to-video", {
      input,
      logs: false,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS" && Array.isArray(update.logs)) {
          console.log(update.logs.map((log) => log.message).join("\n"));
        }
      },
    });

    return result?.data;
  } catch (error) {
    console.error("Error generating video with Vidu (FAL):", error);

    if (error?.body?.detail) {
      console.error(
        "Validation details:",
        JSON.stringify(error.body.detail, null, 2)
      );
    }

    throw error;
  }
};
