import Replicate from "replicate";
import dotenv from "dotenv";

dotenv.config();

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const SUPPORTED_ASPECT_RATIOS = [
  "1:1",
  "1:2",
  "2:1",
  "2:3",
  "3:2",
  "3:4",
  "4:3",
  "4:5",
  "5:4",
  "9:16",
  "16:9",
  "9:21",
  "21:9",
];

const RESOLUTION_TO_TARGET_SIZE = {
  "360p": 512,
  "540p": 576,
  "720p": 640,
  "768p": 704, // just for safety, not standard
  "1080p": 960,
  // you can add more if needed
};

// Helper to validate aspect ratio or fallback to default
function validateAspectRatio(ar) {
  if (SUPPORTED_ASPECT_RATIOS.includes(ar)) return ar;
  console.warn(`Aspect ratio "${ar}" is not supported. Using default "16:9".`);
  return "16:9";
}

// Helper to map resolution string to target_size integer
function mapResolutionToTargetSize(res) {
  if (RESOLUTION_TO_TARGET_SIZE[res]) return RESOLUTION_TO_TARGET_SIZE[res];
  console.warn(
    `Resolution "${res}" is not supported. Using default target_size 640 (720p).`
  );
  return 640;
}

export const ltxReplicate = async (
  prompt,
  resolution = "720p",
  aspect_ratio = "16:9",
  seed = ""
) => {
  try {
    const validAspectRatio = validateAspectRatio(aspect_ratio);
    const targetSize = mapResolutionToTargetSize(resolution);

    const output = await replicate.run(
      "lightricks/ltx-video:8c47da666861d081eeb4d1261853087de23923a268a69b63febdf5dc1dee08e4",
      {
        input: {
          cfg: 3,
          model: "0.9.1",
          steps: 30,
          length: 97,
          prompt,
          seed,
          target_size: targetSize,
          aspect_ratio: validAspectRatio,
          negative_prompt:
            "low quality, worst quality, deformed, distorted, watermark",
          image_noise_scale: 0.15,
        },
      }
    );

    if (Array.isArray(output) && typeof output[0]?.url === "function") {
      const videoUrl = await output[0].url();
      return { video: { url: videoUrl } };
    }

    return output;
  } catch (error) {
    console.error("Error generating video with Replicate (LTX):", error);
    throw error;
  }
};
