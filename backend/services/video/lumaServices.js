// lumaFAL.js
import dotenv from "dotenv";
import { fal } from "@fal-ai/client";

dotenv.config();

fal.config({
  credentials: process.env.FAL_AI_API,
});

// === Supported values for luma-dream-machine ===
const SUPPORTED_ASPECT_RATIOS = ["16:9", "9:16", "4:3", "3:4", "21:9", "9:21"];

const SUPPORTED_RESOLUTIONS = ["540p", "720p", "1080p"];
const SUPPORTED_DURATIONS = ["5s", "9s"];

// === Ratio parsing utility ===
const parseRatio = (ratioStr) => {
  const [w, h] = ratioStr.split(":").map(Number);
  return w / h;
};

// === Find closest supported aspect ratio ===
const mapToClosestSupportedAspectRatio = (inputRatioStr) => {
  const inputRatio = parseRatio(inputRatioStr);

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
    `Aspect ratio "${inputRatioStr}" is unsupported. Using closest: "${closest}"`
  );
  return closest;
};

export const lumaFAL = async (
  prompt,
  resolution = "720p",
  aspect_ratio = "16:9",
  duration = "5s",
  loop = false,
  seed = ""
) => {
  try {
    // Validate resolution
    if (!SUPPORTED_RESOLUTIONS.includes(resolution)) {
      console.warn(
        `Invalid resolution "${resolution}", falling back to "540p"`
      );
      resolution = "720p";
    }

    // Validate duration
    if (!SUPPORTED_DURATIONS.includes(duration)) {
      console.warn(`Invalid duration "${duration}", falling back to "5s"`);
      duration = "5s";
    }

    // Validate aspect_ratio
    if (!SUPPORTED_ASPECT_RATIOS.includes(aspect_ratio)) {
      aspect_ratio = mapToClosestSupportedAspectRatio(aspect_ratio);
    }

    const result = await fal.subscribe(
      "fal-ai/luma-dream-machine/ray-2-flash",
      {
        input: {
          prompt,
          resolution,
          aspect_ratio,
          duration,
          loop,
          seed,
        },
        logs: false,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS" && Array.isArray(update.logs)) {
            console.log(update.logs.map((log) => log.message).join("\n"));
          }
        },
      }
    );

    return result?.data;
  } catch (error) {
    console.error("Error generating video with Luma Ray 2 Flash:", error);

    if (error?.body?.detail) {
      console.error(
        "Validation details:",
        JSON.stringify(error.body.detail, null, 2)
      );
    }
  }
};
