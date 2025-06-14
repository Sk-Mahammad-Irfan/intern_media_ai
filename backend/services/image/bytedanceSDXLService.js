import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const resolutionToSize = {
  "21:9": { width: 1280, height: 720 },
  "16:9": { width: 1280, height: 720 },
  "3:2": { width: 1024, height: 683 },
  "4:3": { width: 1024, height: 768 },
  "5:4": { width: 1024, height: 819 },
  "1:1": { width: 1024, height: 1024 },
  "4:5": { width: 819, height: 1024 },
  "3:4": { width: 768, height: 1024 },
  "2:3": { width: 683, height: 1024 },
  "9:16": { width: 720, height: 1280 },
  "9:21": { width: 720, height: 1680 },
};

export const SDXLLightningImage = async (prompt, resolution, seed) => {
  try {
    const { width, height } = resolutionToSize[resolution] || {
      width: 1024,
      height: 1024,
    };

    const payload = {
      version:
        "bytedance/sdxl-lightning-4step:6f7a773af6fc3e8de9d5a3c00be77c17308914bf67772726aff83496ba1e3bbe",
      input: {
        prompt:
          prompt || "self-portrait of a woman, lightning in the background",
        width,
        height,
        seed: seed || 0,
        guidance_scale: guidanceScale || 0,
        num_outputs: numOutputs || 1,
        scheduler: scheduler || "K_EULER",
        num_inference_steps: numInferenceSteps || 4,
        negative_prompt: negativePrompt || "worst quality, low quality",
      },
    };

    const headers = {
      Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
      "Content-Type": "application/json",
      Prefer: "wait",
    };

    const response = await axios.post(
      "https://api.replicate.com/v1/predictions",
      payload,
      { headers }
    );

    return response.data;
  } catch (error) {
    const status = error?.response?.status || "unknown";
    const detail = error?.response?.data || error.message || "Unknown error";
    console.error(
      `SDXL-Lightning image generation failed [${status}]:`,
      detail
    );
    throw new Error(
      `SDXL-Lightning generation failed [${status}]: ${JSON.stringify(detail)}`
    );
  }
};
