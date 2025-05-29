import dotenv from "dotenv";
import { fal } from "@fal-ai/client";

dotenv.config();

fal.config({
  credentials: process.env.FAL_AI_API,
});

// Supported enums for Pixverse v4
const SUPPORTED_ASPECT_RATIOS = ["16:9", "9:16"];
const SUPPORTED_DURATIONS = ["5s", "6s", "7s", "8s"];

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

export const generateVideoVeo = async (
  prompt,
  aspect_ratio = "16:9",
  duration = 5
) => {
  try {
    // Convert duration to string and validate
    const durationStr = `${duration}s`;
    const finalDuration = SUPPORTED_DURATIONS.includes(durationStr)
      ? durationStr
      : "5s";

    if (durationStr !== finalDuration) {
      console.warn(
        `Invalid or unsupported duration "${durationStr}", defaulting to "${finalDuration}"`
      );
    }

    // Validate or map aspect ratio
    const finalAspectRatio = SUPPORTED_ASPECT_RATIOS.includes(aspect_ratio)
      ? aspect_ratio
      : mapToClosestSupportedAspectRatio(aspect_ratio);

    const input = {
      prompt,
      aspect_ratio: finalAspectRatio,
      duration: finalDuration,
    };

    console.log("Veo Input:", input);

    const result = await fal.subscribe("fal-ai/veo2", {
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
    if (error?.body?.detail) {
      const validationDetails = error.body.detail
        .map((d) => `${d.loc?.join(".") || "unknown"}: ${d.msg}`)
        .join("\n");
      console.error("Validation error(s) from FAL:\n", validationDetails);
      throw new Error(`Validation failed:\n${validationDetails}`);
    }

    console.error("Error generating video:", error);
    throw new Error(`Failed to generate video: ${error.message || error}`);
  }
};
