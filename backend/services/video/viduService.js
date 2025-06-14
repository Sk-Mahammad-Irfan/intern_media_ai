import dotenv from "dotenv";
import { fal } from "@fal-ai/client";

dotenv.config();

fal.config({
  credentials: process.env.FAL_AI_API,
});

// Supported enums for Pixverse v4
const SUPPORTED_ASPECT_RATIOS = ["16:9", " 9:16", "1:1"];
const SUPPORTED_STYLES = ["general", "anime"];

// The movement amplitude of objects in the frame Default value: "auto"
const MOVEMENT_AMPLITUDE = ["auto", "small", "medium", "large"];

// Helper to convert "21:9" to numeric ratio
const parseRatio = (str) => {
  const [w, h] = str.split(":").map(Number);
  return w / h;
};

// Find closest supported aspect ratio
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

export const viduService = async (prompt, resolution, aspect_ratio, seed) => {
  try {
    // Validate aspect ratio
    if (!SUPPORTED_ASPECT_RATIOS.includes(aspect_ratio)) {
      aspect_ratio = mapToClosestSupportedAspectRatio(aspect_ratio);
    }

    // Validate style
    if (style && !SUPPORTED_STYLES.includes(style)) {
      console.warn(`Invalid style "${style}", ignoring it.`);
      style = null;
    }

    // Prepare input
    const input = {
      prompt,
      aspect_ratio,
      style: style || "general",
    };

    if (style) input.style = style;
    if (typeof seed === "number" && Number.isInteger(seed) && seed >= 0) {
      input.seed = seed;
    }

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
    // Custom error message extraction for ValidationError
    if (error?.body?.detail) {
      const validationDetails = error.body.detail
        .map((d) => `${d.loc?.join(".") || "unknown"}: ${d.msg}`)
        .join("\n");
      console.error("Validation error(s) from FAL:\n", validationDetails);
      throw new Error(`Validation failed:\n${validationDetails}`);
    }

    // Generic fallback error
    console.error("Error generating cog Video:", error);
    throw new Error(`Failed to generate Video: ${error.message || error}`);
  }
};
