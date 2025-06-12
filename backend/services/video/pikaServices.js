import { fal } from "@fal-ai/client";

// resolution options:default: "720p", "1080p"
//Possible enum values: 16:9, 9:16, 1:1, 4:5, 5:4, 3:2, 2:3
const SUPPORTED_ASPECT_RATIOS = [
  "16:9",
  "9:16",
  "1:1",
  "4:5",
  "5:4",
  "3:2",
  "2:3",
];

// Helper to convert string like "21:9" to numeric ratio (21/9)
const parseRatio = (ratioStr) => {
  const [w, h] = ratioStr.split(":").map(Number);
  return w / h;
};

// Find the closest supported ratio
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

export const pikaFAL = async (
  prompt,
  resolution = "720p",
  aspect_ratio = "16:9",
  seed = ""
) => {
  try {
    if (!SUPPORTED_ASPECT_RATIOS.includes(aspect_ratio)) {
      aspect_ratio = mapToClosestSupportedAspectRatio(aspect_ratio);
    }

    const result = await fal.subscribe("fal-ai/pika/v2.1/text-to-video", {
      input: { prompt, resolution, aspect_ratio, seed },
      logs: false,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS" && Array.isArray(update.logs)) {
          console.log(update.logs.map((log) => log.message).join("\n"));
        }
      },
    });

    return result?.data;
  } catch (error) {
    console.error("Error generating video with Pika:", error);
    if (error?.body?.detail) {
      console.error(
        "Validation details:",
        JSON.stringify(error.body.detail, null, 2)
      );
    }
  }
};
