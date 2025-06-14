import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const SUPPORTED_ASPECTS = ["16:9", "9:16", "1:1"];

const validateAspectRatio = (aspect) =>
  SUPPORTED_ASPECTS.includes(aspect) ? aspect : "16:9";

export const wan480Replicate = async (
  prompt,
  resolution = "720p",
  aspect_ratio = "16:9",
  seed = null
) => {
  try {
    const validatedAspect = validateAspectRatio(aspect_ratio);

    const response = await axios.post(
      "https://api.replicate.com/v1/models/wavespeedai/wan-2.1-t2v-480p/predictions",
      {
        input: {
          prompt,
          aspect_ratio: validatedAspect,
          seed,
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

    let status = response.data.status;
    let output = response.data.output;
    const getUrl = response.data.urls?.get;

    while (status !== "succeeded" && status !== "failed") {
      const pollRes = await axios.get(getUrl, {
        headers: {
          Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
        },
      });

      status = pollRes.data.status;
      output = pollRes.data.output;

      if (status === "succeeded") return pollRes.data;
      if (status === "failed") throw new Error("Video generation failed");

      await new Promise((res) => setTimeout(res, 3000));
    }
  } catch (error) {
    console.error(
      "Error generating video with Replicate Wavespeedai/wan-2.1-t2v-480p:",
      error
    );
    throw error;
  }
};
