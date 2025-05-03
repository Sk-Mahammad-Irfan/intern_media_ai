import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const ltxReplicate = async (prompt) => {
  try {
    const response = await axios.post(
      "https://api.replicate.com/v1/predictions",
      {
        version:
          "8c47da666861d081eeb4d1261853087de23923a268a69b63febdf5dc1dee08e4",
        input: {
          cfg: 3,
          model: "0.9.1",
          steps: 30,
          length: 97,
          prompt: prompt,
          target_size: 640,
          aspect_ratio: "16:9",
          negative_prompt:
            "low quality, worst quality, deformed, distorted, watermark",
          image_noise_scale: 0.15,
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

    console.log("Raw replicate video generated");
    return response.data;
  } catch (error) {
    console.error("Error generating video with raw Replicate call:", error);
  }
};
