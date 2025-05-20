import axios from "axios";
import dotenv from "dotenv";
import { fal } from "@fal-ai/client";

dotenv.config();

fal.config({
  credentials: process.env.FAL_AI_API,
});

/**
 * Generates audio using FAL
 * @param {Object} input - Input object containing prompt, seconds_start, seconds_total, steps
 */
export const generateAudioStableFal = async (input) => {
  try {
    const { prompt, duration = 10, steps = 100 } = input;

    if (!prompt) throw new Error("Prompt is required for FAL");

    const result = await fal.subscribe("fal-ai/stable-audio", {
      input: {
        prompt,
        seconds_start: 0,
        seconds_total: duration,
        steps,
      },
      logs: false,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          if (Array.isArray(update.logs)) {
            update.logs.map((log) => log.message).forEach(console.log);
          }
        }
      },
    });

    const audioUrl = result.data.audio_file?.url || result.data.audio?.url;
    if (!audioUrl) throw new Error("FAL did not return a valid audio URL");

    return audioUrl;
  } catch (error) {
    console.error("FAL handler failed:", error.message || error);
    return null;
  }
};

/**
 * Generates audio using Replicate
 * @param {Object} input - Full schema input for Replicate audio generation
 */
export const generateAudioStableReplicate = async (input) => {
  const replicateApiToken = process.env.REPLICATE_API_TOKEN;

  const {
    seed = -1,
    steps = 100,
    prompt,
    cfg_scale = 6,
    sigma_max = 500,
    sigma_min = 0.03,
    batch_size = 1,
    sampler_type = "dpmpp-3m-sde",
    duration = 10,
    negative_prompt = "",
    init_noise_level = 1,
  } = input;

  if (!prompt) throw new Error("Prompt is required for Replicate");

  const payload = {
    version: "9aff84a639f96d0f7e6081cdea002d15133d0043727f849c40abdd166b7c75a8",
    input: {
      seed,
      steps,
      prompt,
      cfg_scale,
      sigma_max,
      sigma_min,
      batch_size,
      sampler_type,
      seconds_start: 0,
      seconds_total: duration,
      negative_prompt,
      init_noise_level,
    },
  };

  try {
    const postResponse = await axios.post(
      "https://api.replicate.com/v1/predictions",
      payload,
      {
        headers: {
          Authorization: `Bearer ${replicateApiToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const getUrl = postResponse.data?.urls?.get;
    if (!getUrl) throw new Error("Missing get URL from Replicate");

    // Poll until prediction completes
    let status = postResponse.data.status;
    let output = null;

    while (!["succeeded", "failed", "canceled"].includes(status)) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const getResponse = await axios.get(getUrl, {
        headers: {
          Authorization: `Bearer ${replicateApiToken}`,
        },
      });
      status = getResponse.data.status;
      output = getResponse.data.output;
    }

    if (status !== "succeeded" || !output) {
      throw new Error(
        "Replicate audio generation failed or returned no output"
      );
    }

    return output;
  } catch (error) {
    console.error(
      "Error generating audio with Replicate:",
      error.message || error
    );
    throw error;
  }
};
