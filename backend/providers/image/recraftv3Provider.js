import dotenv from "dotenv";
import { fal } from "@fal-ai/client";
import axios from "axios";
import FormData from "form-data";

dotenv.config();

fal.config({
  credentials: process.env.FAL_AI_API,
});

// === Constants ===
const SUPPORTED_RESOLUTIONS = [
  "square_hd",
  "square",
  "portrait_4_3",
  "portrait_16_9",
  "landscape_4_3",
  "landscape_16_9",
];

const IMAGE_STYLES = [
  "any",
  "realistic_image",
  "digital_illustration",
  "digital_illustration/pixel_art",
  "digital_illustration/hand_drawn",
  "digital_illustration/grain",
  "digital_illustration/infantile_sketch",
  "digital_illustration/2d_art_poster",
  "digital_illustration/handmade_3d",
  "digital_illustration/hand_drawn_outline",
  "digital_illustration/engraving_color",
  "digital_illustration/2d_art_poster_2",
  "realistic_image/b_and_w",
  "realistic_image/hard_flash",
  "realistic_image/hdr",
  "realistic_image/natural_light",
  "realistic_image/studio_portrait",
  "realistic_image/enterprise",
  "realistic_image/motion_blur",
];

// === FAL Recraft Generator ===
export const generateImageRecraftFAL = async (body) => {
  const {
    prompt,
    resolution = "square_hd",
    enable_safety_checker = true,
    style = "realistic_image",
  } = body;

  try {
    if (!prompt || typeof prompt !== "string") {
      throw new Error("Prompt is required and must be a string.");
    }

    const finalResolution = SUPPORTED_RESOLUTIONS.includes(resolution)
      ? resolution
      : "square_hd";
    if (!SUPPORTED_RESOLUTIONS.includes(resolution)) {
      console.warn(
        `Invalid resolution "${resolution}", defaulting to "square_hd"`
      );
    }

    const finalStyle = IMAGE_STYLES.includes(style) ? style : "realistic_image";
    if (!IMAGE_STYLES.includes(style)) {
      console.warn(`Invalid style "${style}", defaulting to "realistic_image"`);
    }

    const finalSafety =
      typeof enable_safety_checker === "boolean" ? enable_safety_checker : true;
    if (typeof enable_safety_checker !== "boolean") {
      console.warn(
        `Invalid enable_safety_checker "${enable_safety_checker}", defaulting to true`
      );
    }

    const result = await fal.subscribe("fal-ai/recraft-v3", {
      input: {
        prompt,
        image_size: finalResolution,
        enable_safety_checker: finalSafety,
        style: finalStyle,
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS" && Array.isArray(update.logs)) {
          console.log(update.logs.map((log) => log.message).join("\n"));
        }
      },
    });

    return result?.data;
  } catch (error) {
    console.error(
      "Error generating image with FAL Recraft V3:",
      error.message || error
    );
    throw error;
  }
};

// === Segmind Recraft Generator ===
export const generateImageRecraftSegmind = async (body) => {
  const { prompt, size = "1024x1024", style = "any" } = body;

  try {
    if (!prompt || typeof prompt !== "string") {
      throw new Error("Prompt is required and must be a string.");
    }

    const formData = new FormData();
    formData.append("size", size);
    formData.append("style", style);
    formData.append("prompt", prompt);

    const response = await axios.post(
      "https://api.segmind.com/v1/recraft-v3",
      formData,
      {
        headers: {
          "x-api-key": process.env.SEGMIND_API,
          ...formData.getHeaders(),
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error generating image with Segmind Recraft V3:",
      error.message || error
    );
    throw error;
  }
};

// === Replicate Recraft Generator ===
export const generateImageRecraftV3Replicate = async (body) => {
  const {
    prompt,
    resolution = "square_hd",
    seed,
    style = "realistic_image",
  } = body;
  try {
    const resolutionMap = {
      square_hd: "1024x1024",
      square: "1024x1024",
      portrait_4_3: "1024x1365",
      portrait_16_9: "1024x1820",
      landscape_4_3: "1365x1024",
      landscape_16_9: "1820x1024",
    };

    const size = resolutionMap[resolution];
    if (!size) {
      throw new Error(
        `Invalid resolution keyword "${resolution}". Use one of: ${Object.keys(
          resolutionMap
        ).join(", ")}`
      );
    }

    if (!prompt || typeof prompt !== "string") {
      throw new Error("Prompt is required and must be a string.");
    }

    const body = {
      input: {
        prompt,
        size,
        style,
      },
    };

    if (seed !== undefined) {
      body.input.seed = seed;
    }

    const response = await axios.post(
      "https://api.replicate.com/v1/models/recraft-ai/recraft-v3/predictions",
      body,
      {
        headers: {
          Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json",
          Prefer: "wait",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error generating image with Replicate Recraft V3:",
      error.response?.data || error.message
    );
    throw error;
  }
};
