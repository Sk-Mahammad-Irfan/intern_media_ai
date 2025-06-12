import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// Constants
const SUPPORTED_IMAGE_FORMATS = ["jpeg", "png", "webp"];

const STANDARD_ASPECT_RATIOS = [
  "1:1",
  "16:9",
  "21:9",
  "3:2",
  "2:3",
  "4:5",
  "5:4",
  "3:4",
  "4:3",
  "9:16",
  "9:21",
];

const FAL_ASPECT_RATIOS = [
  "square_hd",
  "square",
  "portrait_4_3",
  "portrait_16_9",
  "landscape_4_3",
  "landscape_16_9",
];

// Bi-directional aspect ratio conversion
const falToStandardAspectRatio = {
  square_hd: "1:1",
  square: "1:1",
  portrait_4_3: "3:4",
  portrait_16_9: "9:16",
  landscape_4_3: "4:3",
  landscape_16_9: "16:9",
};

const standardToFalAspectRatio = {
  "1:1": "square",
  "3:4": "portrait_4_3",
  "9:16": "portrait_16_9",
  "4:3": "landscape_4_3",
  "16:9": "landscape_16_9",
  "21:9": "landscape_16_9",
  "3:2": "landscape_4_3",
  "2:3": "portrait_4_3",
  "4:5": "portrait_4_3",
  "5:4": "landscape_4_3",
  "9:21": "portrait_16_9",
};

// Helpers
const validateFormat = (format) =>
  SUPPORTED_IMAGE_FORMATS.includes(format) ? format : "webp";

const validateReplicateAspectRatio = (ratio) =>
  STANDARD_ASPECT_RATIOS.includes(ratio) ? ratio : "1:1";

const validateFalAspectRatio = (ratio) =>
  FAL_ASPECT_RATIOS.includes(ratio)
    ? ratio
    : standardToFalAspectRatio[ratio] || "square";

// Normalize FAL-specific resolution to standard format like "4:3"
const normalizeToStandardAspectRatio = (resolution) => {
  if (STANDARD_ASPECT_RATIOS.includes(resolution)) return resolution;
  return falToStandardAspectRatio[resolution] || "1:1";
};

// Convert standard aspect ratio to width/height
const getDimensionsFromAspectRatio = (aspectRatio, targetHeight = 768) => {
  const [w, h] = aspectRatio.split(":").map(Number);
  if (!w || !h) throw new Error("Invalid aspect ratio format.");
  const ratio = w / h;
  const width = Math.round(targetHeight * ratio);
  return { width, height: targetHeight };
};

export const generateImageFluxDevTogether = async (
  prompt,
  resolution = "square_hd",
  steps = 10,
  seed = 42
) => {
  if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
    throw new Error("Prompt is required for image generation.");
  }

  const normalizedRatio = normalizeToStandardAspectRatio(resolution);
  const { width, height } = getDimensionsFromAspectRatio(normalizedRatio);

  const input = {
    model: "black-forest-labs/FLUX.1-dev",
    prompt,
    width,
    height,
    steps,
    seed,
  };

  try {
    const response = await axios.post(
      "https://api.together.xyz/v1/images/generations",
      input,
      {
        headers: {
          Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Together.xyz FLUX.1-dev response:", response.data);
    return response.data;
  } catch (error) {
    handleGenerationError(error, "together.xyz-dev", prompt);
  }
};
