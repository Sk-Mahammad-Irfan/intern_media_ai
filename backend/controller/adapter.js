import axios from "axios";
import ModelConfig from "../models/genmodelModel.js";
import { checkCredits, decreaseCredits } from "./creditController.js";
import dotenv from "dotenv";

import { fal } from "@fal-ai/client";

dotenv.config();

fal.config({
  credentials: process.env.FAL_AI_API,
});

export const generateImage = async (req, res) => {
  const { id } = req.params;
  const { prompt, userId, resolution, seed } = req.body;

  if (!userId) {
    return res.status(401).json({ error: "Please login to generate images." });
  }
  if (!prompt) {
    return res.status(400).json({ error: "Please enter a prompt." });
  }

  try {
    // Fetch the model from database
    const model = await ModelConfig.findOne({ modelId: id });

    if (!model || !model.isActive) {
      return res.status(400).json({ error: "Invalid or inactive model ID." });
    }

    // Prepare providers with their credits, sorted by cheapest first
    const providers = model.provider
      .map((provider, index) => ({
        name: provider,
        credits: model.credits[index] || 0, // Default to 0 if credits not specified
      }))
      .sort((a, b) => a.credits - b.credits);

    console.log(providers);

    // Try each provider in order of increasing cost
    for (const { name: provider, credits } of providers) {
      try {
        // Check if user has enough credits
        console.log(provider);
        const hasEnoughCredits = await checkCredits(userId, credits);
        if (!hasEnoughCredits) {
          continue;
        }

        // Prepare request body based on provider
        let requestBody = {
          prompt,
          resolution: resolution,
          seed,
        };

        // Add custom inputs if they exist in the request
        if (model.custom_inputs) {
          model.custom_inputs.forEach((input) => {
            if (req.body[input.id] !== undefined) {
              requestBody[input.id] = req.body[input.id];
            } else if (input.default !== undefined) {
              requestBody[input.id] = input.default;
            }
          });
        }

        console.log(requestBody);

        // Call the appropriate provider endpoint
        let imageUrl;
        switch (provider) {
          case "replicate":
            const replicateResponse = await callReplicate(
              model.endpoint,
              requestBody
            );
            imageUrl =
              replicateResponse.output || replicateResponse.output?.[0];
            break;

          case "fal":
            const falResponse = await callFal(model.falid, requestBody);
            imageUrl = falResponse?.images?.[0]?.url;
            break;

          case "together":
            console.log(model.togetherid);
            const togetherResponse = await callTogether(
              model.togetherid,
              requestBody
            );
            imageUrl = togetherResponse?.data?.[0]?.url;
            break;

          case "deepinfra":
            const deepinfraResponse = await callDeepInfra(
              model.deepid,
              requestBody
            );
            console.log(deepinfraResponse);
            imageUrl = `data:image/jpeg;base64,${deepinfraResponse.data[0].b64_json}`;
            break;

          default:
            // For 'auto' or unknown providers, use the default endpoint
            const defaultResponse = await callDefaultProvider(
              model.endpoint,
              requestBody
            );
            if (defaultResponse?.data?.[0]?.b64_json) {
              imageUrl = `data:image/jpeg;base64,${defaultResponse.data[0].b64_json}`;
            } else {
              imageUrl =
                defaultResponse?.output || defaultResponse?.output?.[0];
            }
        }

        if (!imageUrl) {
          console.warn(
            `No image URL returned from provider ${provider}, trying next one...`
          );
          continue;
        }

        // Deduct credits if we got a successful response
        await decreaseCredits(userId, credits);

        return res.status(200).json({ imageUrl });
      } catch (error) {
        console.error(
          `Error with provider ${provider}:`,
          error.message || error
        );
        // Continue to next provider
      }
    }

    // If we've tried all providers without success
    return res.status(500).json({
      error: "All available providers failed to generate image.",
      suggestion: "Please try again later or with different parameters.",
    });
  } catch (error) {
    console.error("Server error:", error.message || error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Helper functions for different providers
async function callReplicate(endpoint, body) {
  const headers = {
    Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
    "Content-Type": "application/json",
    Prefer: "wait",
  };
  try {
    const response = await axios.post(endpoint, body, headers);
    return await response.data;
  } catch (error) {
    console.error("Error in callReplicate:", error.message || error);
    throw error;
  }
}

async function callFal(modelId, body) {
  try {
    const attemptSubscription = async (input) => {
      console.log(input);
      return await fal.subscribe(modelId, {
        input,
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS" && Array.isArray(update.logs)) {
            update.logs.map((log) => log.message).forEach(console.log);
          }
        },
      });
    };

    let result;

    try {
      result = await attemptSubscription({
        ...body,
        image_size: body.resolution,
      });
    } catch (firstAttemptError) {
      console.warn(
        `First attempt failed with image_size: ${
          firstAttemptError.message || firstAttemptError
        }`
      );
      result = await attemptSubscription({
        ...body,
        aspect_ratio: body.resolution,
      });
    }

    return result.data;
  } catch (error) {
    console.error(
      `FAL handler failed for model ${modelId}:`,
      error.message || error
    );
    throw error;
  }
}

async function callTogether(modelId, body) {
  try {
    const getDimensionsFromAspectRatio = (aspectRatio, targetHeight = 768) => {
      const [w, h] = aspectRatio.split(":").map(Number);
      if (!w || !h) throw new Error("Invalid aspect ratio format.");
      const ratio = w / h;
      const width = Math.round(targetHeight * ratio);
      return { width, height: targetHeight };
    };
    const { width, height } = getDimensionsFromAspectRatio(body.resolution);

    const input = {
      model: modelId,
      prompt: body.prompt,
      width,
      height,
      seed: body.seed || 1245,
    };
    console.log(input);
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
    return response.data;
  } catch (error) {
    console.error(
      `Error with Together provider ${modelId}:`,
      error.message || error
    );
    throw error;
  }
}

async function callDeepInfra(modelId, body) {
  try {
    const { resolution, ...rest } = body;
    console.log(resolution);
    const response = await axios.post(
      "https://api.deepinfra.com/v1/openai/images/generations",
      {
        model: modelId,
        size: resolution,
        ...rest,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.DEEPINFRA_API}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error with DeepInfra call for model ${modelId}:`, error);
    throw error;
  }
}

async function callDefaultProvider(endpoint, body) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return await response.json();
}

export const generateVideo = async (req, res) => {
  console.log("aat aala");
  const { id } = req.params;
  const { prompt, userId, aspect_ratio, resolution, seed } = req.body;

  if (!userId) {
    return res.status(401).json({ error: "Please login to generate videos." });
  }
  if (!prompt) {
    return res.status(400).json({ error: "Please enter a prompt." });
  }

  try {
    // Fetch the video model from database
    const model = await ModelConfig.findOne({ modelId: id });

    if (!model || !model.isActive) {
      return res.status(400).json({ error: "Invalid or inactive model ID." });
    }

    // Prepare providers with their credits, sorted by cheapest first
    const providers = model.provider
      .map((provider, index) => ({
        name: provider,
        credits: model.credits[index] || 0, // Default to 0 if credits not specified
      }))
      .sort((a, b) => a.credits - b.credits);

    console.log(providers);

    // Try each provider in order of increasing cost
    for (const { name: provider, credits } of providers) {
      try {
        // Check if user has enough credits
        const hasEnoughCredits = await checkCredits(userId, credits);
        if (!hasEnoughCredits) {
          continue; // Try next provider
        }

        // Prepare request body based on provider
        let requestBody = {
          prompt,
          resolution: resolution || aspect_ratio, // Handle both resolution and aspect_ratio
          seed,
        };

        // Add custom inputs if they exist in the request
        if (model.custom_inputs) {
          model.custom_inputs.forEach((input) => {
            if (req.body[input.id] !== undefined) {
              requestBody[input.id] = req.body[input.id];
            } else if (input.default !== undefined) {
              requestBody[input.id] = input.default;
            }
          });
        }

        // Call the appropriate provider endpoint
        let videoUrl;
        switch (provider) {
          case "replicate":
            const replicateResponse = await callReplicateVideo(
              model.endpoint,
              requestBody
            );
            videoUrl = replicateResponse.output || replicateResponse;
            break;

          case "fal":
            const falResponse = await callFalVideo(model.falid, requestBody);
            videoUrl = falResponse?.video?.url;
            break;

          case "deepinfra":
            console.log("ky bolti public");
            const deepinfraResponse = await callDeepInfraVideo(
              model.deepid,
              requestBody
            );
            videoUrl =
              deepinfraResponse?.video_url ||
              deepinfraResponse?.data?.video_url ||
              deepinfraResponse?.url;
            break;

          case "together":
            const togetherResponse = await callTogetherVideo(
              model.togetherid,
              requestBody
            );
            videoUrl =
              togetherResponse?.video_url || togetherResponse?.data?.video_url;
            break;

          default:
            // For 'auto' or unknown providers, use the default endpoint
            const defaultResponse = await callDefaultVideoProvider(
              model.endpoint,
              requestBody
            );
            videoUrl =
              defaultResponse?.output ||
              defaultResponse?.video_url ||
              defaultResponse;
        }

        if (!videoUrl) {
          console.warn(
            `No video URL returned from provider ${provider}, trying next one...`
          );
          continue;
        }

        // Deduct credits if we got a successful response
        await decreaseCredits(userId, credits);

        return res.status(200).json({ videoUrl });
      } catch (error) {
        console.error(
          `Error with provider ${provider}:`,
          error.message || error
        );
        // Continue to next provider
      }
    }

    // If we've tried all providers without success
    return res.status(500).json({
      error: "All available providers failed to generate video.",
      suggestion: "Please try again later or with different parameters.",
    });
  } catch (error) {
    console.error("Server error:", error.message || error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

async function callReplicateVideo(endpoint, body) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
    },
    body: JSON.stringify({
      input: body,
    }),
  });
  return await response.json();
}

async function callFalVideo(modelId, body) {
  const response = await fetch(`https://fal.run/fal-ai/${modelId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Key ${process.env.FAL_API_KEY}`,
    },
    body: JSON.stringify(body),
  });
  return await response.json();
}

async function callDeepInfraVideo(modelId, body) {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.DEEPINFRA_API}`,
  };
  console.log(headers);
  const response = await fetch(
    `https://api.deepinfra.com/v1/inference/${modelId}`,
    {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    }
  );
  return await response.json();
}

async function callTogetherVideo(modelId, body) {
  const response = await fetch(`https://api.together.xyz/inference`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
    },
    body: JSON.stringify({
      model: modelId,
      ...body,
    }),
  });
  return await response.json();
}

async function callDefaultVideoProvider(endpoint, body) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}
export const generateAudio = async (req, res) => {
  const { id } = req.params;
  const { prompt, userId, duration, step } = req.body;

  if (!userId) {
    return res.status(401).json({ error: "Please login to generate audio." });
  }
  if (!prompt) {
    return res.status(400).json({ error: "Please enter a prompt." });
  }

  try {
    // Fetch the audio model from database
    const model = await ModelConfig.findOne({ modelId: id });

    if (!model || !model.isActive) {
      return res.status(400).json({ error: "Invalid or inactive model ID." });
    }

    // Prepare providers with their credits, sorted by cheapest first
    const providers = model.provider
      .map((provider, index) => ({
        name: provider,
        credits: model.credits[index] || 0, // Default to 0 if credits not specified
      }))
      .sort((a, b) => a.credits - b.credits);

    // Try each provider in order of increasing cost
    for (const { name: provider, credits } of providers) {
      try {
        // Check if user has enough credits
        const hasEnoughCredits = await checkCredits(userId, credits);
        if (!hasEnoughCredits) {
          continue; // Try next provider
        }

        // Prepare request body based on provider
        let requestBody = {
          prompt,
          duration,
          step,
        };

        // Add custom inputs if they exist in the request
        if (model.custom_inputs) {
          model.custom_inputs.forEach((input) => {
            if (req.body[input.id] !== undefined) {
              requestBody[input.id] = req.body[input.id];
            } else if (input.default !== undefined) {
              requestBody[input.id] = input.default;
            }
          });
        }

        // Call the appropriate provider endpoint
        let audioUrl;
        let lyrics;
        switch (provider) {
          case "replicate":
            const replicateResponse = await callReplicateAudio(
              model.endpoint,
              requestBody
            );
            audioUrl = replicateResponse.output || replicateResponse;
            break;

          case "fal":
            if (id === "fal-ai-ace-step-prompt-to-audio") {
              const result = await callFalAudioAceStep(
                model.falid,
                requestBody
              );
              audioUrl = result.audioUrl;
              lyrics = result.lyrics;
            } else {
              const falResponse = await callFalAudio(model.falid, requestBody);
              console.log(falResponse);
              audioUrl = falResponse?.audio?.url;
            }
            break;

          case "together":
            const togetherResponse = await callTogetherAudio(
              model.togetherid,
              requestBody
            );
            audioUrl =
              togetherResponse?.audio_url || togetherResponse?.data?.audio_url;
            break;

          case "deepinfra":
            const deepinfraResponse = await callDeepInfraAudio(
              model.deepid,
              requestBody
            );
            audioUrl =
              deepinfraResponse?.audio_url ||
              deepinfraResponse?.data?.audio_url ||
              deepinfraResponse?.url;
            break;

          default:
            // For 'auto' or unknown providers, use the default endpoint
            const defaultResponse = await callDefaultAudioProvider(
              model.endpoint,
              requestBody
            );
            audioUrl =
              defaultResponse?.output ||
              defaultResponse?.audio_url ||
              defaultResponse;
        }

        if (!audioUrl) {
          console.warn(
            `No audio URL returned from provider ${provider}, trying next one...`
          );
          continue;
        }

        // Deduct credits if we got a successful response
        await decreaseCredits(userId, credits);

        const response = { audioUrl };
        if (lyrics) {
          response.lyrics = lyrics;
        }

        return res.status(200).json(response);
      } catch (error) {
        console.error(
          `Error with provider ${provider}:`,
          error.message || error
        );
        // Continue to next provider
      }
    }

    // If we've tried all providers without success
    return res.status(500).json({
      error: "All available providers failed to generate audio.",
      suggestion: "Please try again later or with different parameters.",
    });
  } catch (error) {
    console.error("Server error:", error.message || error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Helper functions for different audio providers
async function callReplicateAudio(endpoint, body) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
    },
    body: JSON.stringify({
      input: body,
    }),
  });
  return await response.json();
}

async function callFalAudio(modelId, body) {
  try {
    const result = await fal.subscribe(modelId, {
      input: body,
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS" && Array.isArray(update.logs)) {
          update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    });
    return result;
  } catch (error) {
    console.error(
      `FAL handler failed for model ${modelId}:`,
      error.message || error
    );
    throw error;
  }
}

async function callFalAudioAceStep(modelId, body) {
  try {
    const response = await fal.subscribe(`${modelId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Key ${process.env.FAL_API_KEY}`,
      },
      body: JSON.stringify({
        prompt: body.prompt,
        duration: body.duration,
        step: body.step,
      }),
    });
    const data = await response.json();
    return {
      audioUrl: data?.audio?.url,
      lyrics: data?.lyrics,
    };
  } catch (error) {
    console.error(`Error with FAL provider ${modelId}:`, error);
    throw error;
  }
}

async function callTogetherAudio(modelId, body) {
  const response = await fetch(`https://api.together.xyz/inference`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
    },
    body: JSON.stringify({
      model: modelId,
      ...body,
    }),
  });
  return await response.json();
}

async function callDeepInfraAudio(modelId, body) {
  const response = await fetch(
    `https://api.deepinfra.com/v1/inference/${modelId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DEEPINFRA_API_KEY}`,
      },
      body: JSON.stringify(body),
    }
  );
  return await response.json();
}

async function callDefaultAudioProvider(endpoint, body) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return await response.json();
}
