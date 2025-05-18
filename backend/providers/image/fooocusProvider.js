import dotenv from "dotenv";
import { fal } from "@fal-ai/client";

dotenv.config();

// Configure FAL client
fal.config({
  credentials: process.env.FAL_AI_API,
});

// === Supported Fooocus Configuration ===
const SUPPORTED_STYLES = ["Fooocus Enhance", "Fooocus V2", "Fooocus Sharp"];
const SUPPORTED_PERFORMANCE = [
  "Speed",
  "Quality",
  "Extreme Speed",
  "Lightning",
];
const SUPPORTED_REFERENCES = [
  "None",
  "realisticVisionV60B1_v51VAE.safetensors",
];
const SUPPORTED_OUTPUT_FORMATS = ["png", "jpeg", "webp"];
const SUPPORTED_CONTROL_TYPES = [
  "ImagePrompt",
  "PyraCanny",
  "CPDS",
  "FaceSwap",
];

// === Unified Fooocus Image Generator ===
export const generateImageFooocus = async (body) => {
  const {
    prompt,
    resolution = "1024x1024",
    performance = "Extreme Speed",
    guidanceScale = 4,
    sharpness = 2,
    refinerModel = "None",
    refinerSwitch = 0.8,
    outputFormat = "jpeg",
    syncMode = true,
    enableSafetyInput = true,
    styles = "Fooocus Enhance",
    aspect_ratio = resolution,
    references = "None",
    output_format = outputFormat,
    control_type = "PyraCanny",
    negative_prompt = "",
    enable_safety_checker = enableSafetyInput,
    seed,
  } = body;

  try {
    if (!prompt || typeof prompt !== "string") {
      throw new Error("Prompt is required and must be a string.");
    }

    const finalStyles = SUPPORTED_STYLES.includes(styles)
      ? styles
      : "Fooocus Enhance";

    const finalPerformance = SUPPORTED_PERFORMANCE.includes(performance)
      ? performance
      : "Extreme Speed";

    let finalSharpness = parseFloat(sharpness);
    if (isNaN(finalSharpness) || finalSharpness < 0 || finalSharpness > 10) {
      console.warn(`Invalid sharpness "${sharpness}", defaulting to 2`);
      finalSharpness = 2;
    }

    let finalAspectRatio = "1024x1024";
    const aspectRegex = /^\d{1,4}x\d{1,4}$/;
    if (aspect_ratio.match(aspectRegex)) {
      const [w, h] = aspect_ratio.split("x").map(Number);
      if (w % 8 === 0 && h % 8 === 0) {
        finalAspectRatio = aspect_ratio;
      } else {
        console.warn(
          `Aspect ratio must be multiple of 8. Defaulting to 1024x1024.`
        );
      }
    } else {
      console.warn(
        `Invalid aspect_ratio "${aspect_ratio}", defaulting to "1024x1024"`
      );
    }

    const finalReferences = SUPPORTED_REFERENCES.includes(references)
      ? references
      : "None";

    const finalOutputFormat = SUPPORTED_OUTPUT_FORMATS.includes(output_format)
      ? output_format
      : "png";

    const finalControlType = SUPPORTED_CONTROL_TYPES.includes(control_type)
      ? control_type
      : "PyraCanny";

    const finalNegativePrompt =
      typeof negative_prompt === "string" ? negative_prompt : "";

    const finalSafetyChecker =
      typeof enable_safety_checker === "boolean" ? enable_safety_checker : true;

    const finalSeed = typeof seed === "number" && seed >= 0 ? seed : undefined;

    const result = await fal.subscribe("fal-ai/fooocus", {
      input: {
        prompt,
        negative_prompt: finalNegativePrompt,
        seed: finalSeed,
        styles: finalStyles,
        performance: finalPerformance,
        sharpness: finalSharpness,
        aspect_ratio: finalAspectRatio,
        references: finalReferences,
        output_format: finalOutputFormat,
        control_type: finalControlType,
        enable_safety_checker: finalSafetyChecker,
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
      "Error generating image with Fooocus:",
      error.message || error
    );
    throw error;
  }
};
