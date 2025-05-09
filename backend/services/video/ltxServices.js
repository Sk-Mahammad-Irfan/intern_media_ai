import Replicate from "replicate";
import dotenv from "dotenv";

dotenv.config();

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export const ltxReplicate = async (prompt) => {
  try {
    const output = await replicate.run(
      "lightricks/ltx-video:8c47da666861d081eeb4d1261853087de23923a268a69b63febdf5dc1dee08e4",
      {
        input: {
          cfg: 3,
          model: "0.9.1",
          steps: 30,
          length: 97,
          prompt,
          target_size: 640,
          aspect_ratio: "16:9",
          negative_prompt:
            "low quality, worst quality, deformed, distorted, watermark",
          image_noise_scale: 0.15,
        },
      }
    );

    // output is likely an array with items that have a `.url()` method
    if (Array.isArray(output) && typeof output[0]?.url === "function") {
      const videoUrl = await output[0].url();
      return { video: { url: videoUrl } };
    }

    // fallback if output is not as expected
    return output;
  } catch (error) {
    console.error("Error generating video with Replicate (LTX):", error);
    throw error;
  }
};
