import axios from "axios";
import { fal } from "@fal-ai/client";
import dotenv from "dotenv";

dotenv.config();

// Configure FAL client
fal.config({
  credentials: process.env.FAL_AI_API,
});

// The size of the generated image. Default value: landscape_4_3

// Possible enum values: square_hd, square, portrait_4_3, portrait_16_9, landscape_4_3, landscape_16_9
const IMAGE_OUTPUT_FORMATS = ["jpeg", "png"];
const IMAGE_ASPECT_RATIOS = [
  "21:9",
  "16:9",
  "4:3",
  "3:2",
  "1:1",
  "2:3",
  "3:4",
  "9:16",
  "9:21",
];
const IMAGE_SAFETY_TOLERANCE = [1, 2, 3, 4, 5, 6];

export const falFluxProV1_1 = async (
  prompt,
  resolution = "landscape_4_3",
  seed = null,
  enable_safety_checker = true,
  safety_tolerance = 2,
  output_format = "jpeg",
  aspect_ratio = "16:9",
  raw = false
) => {
  try {
    // Validate resolution
    if (!IMAGE_OUTPUT_FORMATS.includes(resolution)) {
      console.warn(
        `Invalid resolution "${resolution}", defaulting to "landscape_4_3"`
      );
      resolution = "landscape_4_3";
    }

    // Validate aspect_ratio
    if (!IMAGE_ASPECT_RATIOS.includes(aspect_ratio)) {
      console.warn(
        `Invalid aspect_ratio "${aspect_ratio}", defaulting to "16:9"`
      );
      aspect_ratio = "16:9";
    }

    // Validate output_format
    if (!IMAGE_OUTPUT_FORMATS.includes(output_format)) {
      console.warn(
        `Invalid output_format "${output_format}", defaulting to "jpeg"`
      );
      output_format = "jpeg";
    }

    // Validate safety_tolerance
    if (!IMAGE_SAFETY_TOLERANCE.includes(safety_tolerance)) {
      console.warn(
        `Invalid safety_tolerance "${safety_tolerance}", defaulting to "2"`
      );
      safety_tolerance = 2;
    }

    // Validate enable_safety_checker
    if (typeof enable_safety_checker !== "boolean") {
      console.warn(
        `Invalid enable_safety_checker "${enable_safety_checker}", defaulting to true`
      );
      enable_safety_checker = true;
    }

    // Validate seed
    if (seed && (typeof seed !== "number" || seed < 0)) {
      console.warn(`Invalid seed "${seed}", defaulting to null`);
      seed = null;
    }

    // Validate raw
    if (typeof raw !== "boolean") {
      console.warn(`Invalid raw "${raw}", defaulting to false`);
      raw = false;
    }
    const input = {
      prompt,
      image_size: resolution,
      seed,
      enable_safety_checker,
      safety_tolerance,
      output_format,
      aspect_ratio,
      raw,
    };
    if (seed !== null) input.seed = seed;
    if (enable_safety_checker !== null)
      input.enable_safety_checker = enable_safety_checker;
    if (safety_tolerance !== null) input.safety_tolerance = safety_tolerance;
    if (output_format !== null) input.output_format = output_format;
    if (aspect_ratio !== null) input.aspect_ratio = aspect_ratio;
    if (raw !== null) input.raw = raw;
    if (resolution !== null) input.image_size = resolution;
    
    // Call the FAL API
    const result = await fal.subscribe("fal-ai/flux-pro/v1.1-ultra", {
      input,
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    });

    return result?.data;
  } catch (error) {
    console.error(
      "Error generating image with FAL Flux Pro v1.1:",
      error.message || error
    );
  }
};

export const deepFluxProV1_1 = async (prompt) => {
  try {
    const response = await axios.post(
      "https://api.deepinfra.com/v1/openai/images/generations",
      {
        prompt,
        size: "1024x1024",
        model: "black-forest-labs/FLUX-1.1-pro",
        n: 1,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.DEEPINFRA_API}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error generating image with DeepInfra Flux Pro v1.1:",
      error.message || error
    );
  }
};
