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
  "vector_illustration",
  "realistic_image/b_and_w",
  "realistic_image/hard_flash",
  "realistic_image/hdr",
  "realistic_image/natural_light",
  "realistic_image/studio_portrait",
  "realistic_image/enterprise",
  "realistic_image/motion_blur",
  "realistic_image/evening_light",
  "realistic_image/faded_nostalgia",
  "realistic_image/forest_life",
  "realistic_image/mystic_naturalism",
  "realistic_image/natural_tones",
  "realistic_image/organic_calm",
  "realistic_image/real_life_glow",
  "realistic_image/retro_realism",
  "realistic_image/retro_snapshot",
  "realistic_image/urban_drama",
  "realistic_image/village_realism",
  "realistic_image/warm_folk",
  "digital_illustration/pixel_art",
  "digital_illustration/hand_drawn",
  "digital_illustration/grain",
  "digital_illustration/infantile_sketch",
  "digital_illustration/2d_art_poster",
  "digital_illustration/handmade_3d",
  "digital_illustration/hand_drawn_outline",
  "digital_illustration/engraving_color",
  "digital_illustration/2d_art_poster_2",
  "digital_illustration/antiquarian",
  "digital_illustration/bold_fantasy",
  "digital_illustration/child_book",
  "digital_illustration/child_books",
  "digital_illustration/cover",
  "digital_illustration/crosshatch",
  "digital_illustration/digital_engraving",
  "digital_illustration/expressionism",
  "digital_illustration/freehand_details",
  "digital_illustration/grain_20",
  "digital_illustration/graphic_intensity",
  "digital_illustration/hard_comics",
  "digital_illustration/long_shadow",
  "digital_illustration/modern_folk",
  "digital_illustration/multicolor",
  "digital_illustration/neon_calm",
  "digital_illustration/noir",
  "digital_illustration/nostalgic_pastel",
  "digital_illustration/outline_details",
  "digital_illustration/pastel_gradient",
  "digital_illustration/pastel_sketch",
  "digital_illustration/pop_art",
  "digital_illustration/pop_renaissance",
  "digital_illustration/street_art",
  "digital_illustration/tablet_sketch",
  "digital_illustration/urban_glow",
  "digital_illustration/urban_sketching",
  "digital_illustration/vanilla_dreams",
  "digital_illustration/young_adult_book",
  "digital_illustration/young_adult_book_2",
  "vector_illustration/bold_stroke",
  "vector_illustration/chemistry",
  "vector_illustration/colored_stencil",
  "vector_illustration/contour_pop_art",
  "vector_illustration/cosmics",
  "vector_illustration/cutout",
  "vector_illustration/depressive",
  "vector_illustration/editorial",
  "vector_illustration/emotional_flat",
  "vector_illustration/infographical",
  "vector_illustration/marker_outline",
  "vector_illustration/mosaic",
  "vector_illustration/naivector",
  "vector_illustration/roundish_flat",
  "vector_illustration/segmented_colors",
  "vector_illustration/sharp_contrast",
  "vector_illustration/thin",
  "vector_illustration/vector_photo",
  "vector_illustration/vivid_shapes",
  "vector_illustration/engraving",
  "vector_illustration/line_art",
  "vector_illustration/line_circuit",
  "vector_illustration/linocut",
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
