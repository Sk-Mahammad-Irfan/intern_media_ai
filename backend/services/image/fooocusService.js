import { fal } from "@fal-ai/client";
import dotenv from "dotenv";

dotenv.config();

// Configure FAL client
fal.config({
  credentials: process.env.FAL_AI_API,
});
const IMAGE_STYLES = ["Fooocus Enhance", "Fooocus V2", "Fooocus Sharp"];
const IMAGE_PERFORMANCE = ["Speed", "Quality", "Extreme Speed", "Lightning"];
const IMAGE_REFERENCES = ["None", "realisticVisionV60B1_v51VAE.safetensors"];
const IMAGE_OUTPUT_FORMATS = ["png", "jpeg", "webp"];
const IMAGE_CONTROL_TYPES = ["ImagePrompt", "PyraCanny", "CPDS", "FaceSwap"];

export const falFooocus = async (
  prompt,
  negative_prompt = "",
  seed = null,
  styles = "Fooocus Enhance",
  performance = "Extreme Speed",
  sharpness = "2",
  aspect_ratio = "1024x1024",
  references = "None",
  output_format = "png",
  control_type = "PyraCanny",
  enable_safety_checker = true
) => {
  try {
    // Validate styles
    if (!IMAGE_STYLES.includes(styles)) {
      console.warn(
        `Invalid styles "${styles}", defaulting to "Fooocus Enhance"`
      );
      styles = "Fooocus Enhance";
    }

    // Validate performance
    if (!IMAGE_PERFORMANCE.includes(performance)) {
      console.warn(
        `Invalid performance "${performance}", defaulting to "Extreme Speed"`
      );
      performance = "Extreme Speed";
    }

    // Validate sharpness
    //The sharpness of the generated image. Use it to control how sharp the generated image should be. Higher value means image and texture are sharper. Default value: 2
    if (typeof sharpness !== "string" || isNaN(sharpness)) {
      console.warn(`Invalid sharpness "${sharpness}", defaulting to "2"`);
      sharpness = "2";
    } else {
      sharpness = parseFloat(sharpness);
      if (sharpness < 0 || sharpness > 10) {
        console.warn(`Invalid sharpness "${sharpness}", defaulting to "2"`);
        sharpness = 2;
      }
    }

    // Validate aspect_ratio
    //The size of the generated image. You can choose between some presets or custom height and width that must be multiples of 8. Default value: "1024x1024"
    const aspectRatioRegex = /^\d{1,4}x\d{1,4}$/;
    if (!aspect_ratio.match(aspectRatioRegex)) {
      console.warn(
        `Invalid aspect_ratio "${aspect_ratio}", defaulting to "1024x1024"`
      );
      aspect_ratio = "1024x1024";
    } else {
      const [width, height] = aspect_ratio.split("x").map(Number);
      if (width % 8 !== 0 || height % 8 !== 0) {
        console.warn(
          `Invalid aspect_ratio "${aspect_ratio}", defaulting to "1024x1024"`
        );
        aspect_ratio = "1024x1024";
      }
    }

    // Validate references
    if (!IMAGE_REFERENCES.includes(references)) {
      console.warn(`Invalid references "${references}", defaulting to "None"`);
      references = "None";
    }
    // Validate output_format
    if (!IMAGE_OUTPUT_FORMATS.includes(output_format)) {
      console.warn(
        `Invalid output_format "${output_format}", defaulting to "png"`
      );
      output_format = "png";
    }
    // Validate control_type
    if (!IMAGE_CONTROL_TYPES.includes(control_type)) {
      console.warn(
        `Invalid control_type "${control_type}", defaulting to "PyraCanny"`
      );
      control_type = "PyraCanny";
    }

    // Validate enable_safety_checker
    if (typeof enable_safety_checker !== "boolean") {
      console.warn(
        `Invalid enable_safety_checker "${enable_safety_checker}", defaulting to true`
      );
      enable_safety_checker = true;
    }
    // Validate negative_prompt
    if (typeof negative_prompt !== "string") {
      console.warn(
        `Invalid negative_prompt "${negative_prompt}", defaulting to ""`
      );
      negative_prompt = "";
    }
    // Validate seed
    if (seed && (typeof seed !== "number" || seed < 0)) {
      console.warn(`Invalid seed "${seed}", defaulting to null`);
      seed = null;
    }
    const input = {
      prompt,
      negative_prompt,
      seed,
      styles,
      performance,
      sharpness,
      aspect_ratio,
      references,
      output_format,
      control_type,
      enable_safety_checker,
    };

    if (seed !== null) input.seed = seed;
    // Validate input
    const result = await fal.subscribe("fal-ai/fooocus", {
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
      "Error generating image with FAL Fooocus:",
      error.message || error
    );
  }
};
