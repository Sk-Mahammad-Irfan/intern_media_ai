import axios from "axios";
import ModelConfig from "../models/genmodelModel.js";
import { checkCredits, decreaseCredits } from "./creditController.js";
import { fal } from "@fal-ai/client";
import dotenv from "dotenv";

dotenv.config();

fal.config({
  credentials: process.env.FAL_AI_API,
});
export const generateImageForProvider = async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  const { userId, provider } = body;

  if (!userId || !provider) {
    return res
      .status(400)
      .json({ error: "User ID and provider are required." });
  }

  try {
    // Get model config from DB
    const model = await ModelConfig.findOne({ modelId: id });

    if (!model || !model.isActive) {
      return res.status(404).json({ error: "Model not found or inactive." });
    }

    const providerType = provider.toLowerCase();
    const providerIndex = model.provider.findIndex(
      (p) => p.toLowerCase() === providerType
    );

    if (providerIndex === -1) {
      return res.status(400).json({
        error: `Provider '${provider}' is not supported for model '${id}'.`,
      });
    }

    const credits = model.credits[providerIndex] || 0;
    const hasEnoughCredits = await checkCredits(userId, credits);

    if (!hasEnoughCredits) {
      return res.status(402).json({ error: "Not enough credits." });
    }

    // Prepare request body
    const requestBody = {
      prompt: body.prompt,
      seed: body.seed || 1234,
    };

    // Apply custom inputs
    if (model.custom_inputs) {
      model.custom_inputs.forEach((input) => {
        if (body[input.id] !== undefined) {
          requestBody[input.id] = body[input.id];
        } else if (input.default !== undefined) {
          requestBody[input.id] = input.default;
        }
      });
    }

    let rawData;
    switch (providerType) {
      case "replicate":
        rawData = await callReplicate(model.endpoint, requestBody);
        break;
      case "fal":
        console.log(requestBody);
        rawData = await callFal(model.falid, requestBody);
        console.log(rawData);
        break;
      case "together":
        rawData = await callTogether(model.togetherid, requestBody);
        break;
      case "deepinfra":
      case "base64":
        rawData = await callDeepInfra(model.deepid, requestBody);
        break;
      default:
        rawData = await callDefaultProvider(model.endpoint, requestBody);
    }

    // Extract image URL
    let imageUrl;
    if (providerType === "fal") {
      imageUrl = rawData?.images?.[0]?.url;
    } else if (providerType === "replicate") {
      imageUrl = rawData?.output || rawData?.output?.[0];
    } else if (providerType === "together") {
      imageUrl = rawData?.data?.[0]?.url;
    } else if (providerType === "deepinfra" || providerType === "base64") {
      const base64 = rawData?.data?.[0]?.b64_json || rawData?.image_url;
      imageUrl = base64 ? `data:image/jpeg;base64,${base64}` : null;
    } else {
      imageUrl = rawData?.output || rawData?.output?.[0];
    }

    if (!imageUrl) {
      return res
        .status(502)
        .json({ error: "Failed to extract image URL", rawData });
    }

    // Deduct credits and return response
    await decreaseCredits(userId, credits);
    res.json({ imageUrl });
  } catch (err) {
    console.error(`Error generating image for ${id} with ${provider}:`, err);
    res.status(500).json({
      error: "Image generation failed.",
      details: err?.message || err,
    });
  }
};

export const generateVideoForProvider = async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  const { userId, provider, prompt, resolution, aspect_ratio, seed } = body;

  if (!userId || !provider) {
    return res.status(400).json({
      error: "User ID and provider are required.",
    });
  }

  if (!prompt) {
    return res.status(400).json({
      error: "Prompt is required.",
    });
  }

  try {
    // Get model config from DB
    const model = await ModelConfig.findOne({ modelId: id });

    if (!model || !model.isActive) {
      return res.status(404).json({
        error: "Model not found or inactive.",
      });
    }

    const providerType = provider.toLowerCase();
    const providerIndex = model.provider.findIndex(
      (p) => p.toLowerCase() === providerType
    );

    if (providerIndex === -1) {
      return res.status(400).json({
        error: `Provider '${provider}' is not supported for model '${id}'.`,
        availableProviders: model.provider,
      });
    }

    // Base per-second credit cost
    let credits = model.credits[providerIndex] || 0;
    let totalCost = credits * 6; // 6 seconds base

    console.log(`Base cost: ${totalCost.toFixed(4)}`);

    const resValue =
      typeof resolution === "string" ? parseInt(resolution) : resolution;
    if (resValue && resValue > 480) {
      totalCost *= 2; // double cost for high res
      console.log(
        `High resolution (${resValue}) - cost doubled to: ${totalCost.toFixed(
          4
        )}`
      );
    }

    totalCost = parseFloat(totalCost.toFixed(4));

    // Check for credit availability
    const hasEnoughCredits = await checkCredits(userId, totalCost);
    if (!hasEnoughCredits) {
      return res.status(402).json({
        error: "Not enough credits.",
        requiredCredits: totalCost,
      });
    }

    // Prepare request body
    const requestBody = {
      prompt,
      resolution: resolution || aspect_ratio,
      seed: seed ?? 1234,
    };

    // Apply custom inputs
    model?.custom_inputs?.forEach(({ id, default: defaultValue }) => {
      let inputValue = body[id] ?? defaultValue;

      if (id === "duration") {
        if (
          typeof inputValue === "string" &&
          inputValue.trim().toLowerCase().endsWith("s")
        ) {
          // Keep as string if it ends with 's', e.g. "5s"
          requestBody[id] = inputValue.trim();
        } else {
          // Convert to integer if it's a numeric string like "5" or number
          requestBody[id] = parseInt(inputValue);
        }
      } else {
        requestBody[id] = inputValue;
      }
    });

    console.log("Prepared request body:", requestBody);

    // Call appropriate provider function
    let rawData;
    switch (providerType) {
      case "replicate":
        rawData = await callReplicateVideo(model.endpoint, requestBody);
        break;
      case "fal":
        rawData = await callFalVideo(model.falid, requestBody);
        break;
      case "together":
        rawData = await callTogetherVideo(model.togetherid, requestBody);
        break;
      case "deepinfra":
        rawData = await callDeepInfraVideo(model.deepid, requestBody);
        break;
      default:
        rawData = await callDefaultVideoProvider(model.endpoint, requestBody);
    }

    // Extract video URL
    let videoUrl;
    switch (providerType) {
      case "replicate":
        videoUrl = rawData?.output || rawData;
        break;
      case "fal":
        videoUrl = rawData?.video?.url;
        break;
      case "together":
        videoUrl = rawData?.video_url || rawData?.data?.video_url;
        break;
      case "deepinfra":
        videoUrl =
          rawData?.video_url || rawData?.data?.video_url || rawData?.url;
        break;
      default:
        videoUrl = rawData?.output || rawData?.video_url || rawData;
    }

    if (!videoUrl) {
      return res.status(502).json({
        error: "Failed to extract video URL",
        provider: providerType,
        rawData,
      });
    }

    // Deduct dynamic credits
    await decreaseCredits(userId, totalCost);

    return res.status(200).json({
      videoUrl,
      provider: providerType,
      creditsDeducted: totalCost,
    });
  } catch (err) {
    console.error(`Error generating video for ${id} with ${provider}:`, err);
    return res.status(500).json({
      error: "Video generation failed.",
      provider: provider,
      details: err?.message || err,
    });
  }
};

// Helper functions for different video providers
async function callReplicateVideo(endpoint, body) {
  try {
    const response = await axios.post(
      endpoint,
      {
        input: body,
      },
      {
        headers: {
          Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
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
          Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        },
      });
      status = pollRes.data.status;
      output = pollRes.data.output;
      if (status === "succeeded") return pollRes.data;
      if (status === "failed") throw new Error("Video generation failed");
      await new Promise((res) => setTimeout(res, 3000));
    }
  } catch (error) {
    console.error(`Error generating video with Replicate ${endpoint}:`, error);
    throw error;
  }
}

async function callFalVideo(modelId, body) {
  try {
    const result = await fal.subscribe(modelId, {
      input: body,
      logs: false,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS" && Array.isArray(update.logs)) {
          update.logs.map((log) => log.message).forEach(console.log);
        }
      },
    });
    return result.data;
  } catch (err) {
    console.error(`Error calling FAL video for ${modelId}:`, err);
    throw err;
  }
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

async function callReplicate(endpoint, body) {
  const headers = {
    Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
    "Content-Type": "application/json",
    Prefer: "wait",
  };

  const input = { input: body };

  try {
    const response = await axios.post(endpoint, input, {
      headers, // Correctly wrapped in an object
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error in callReplicate:",
      error.response?.data || error.message || error
    );
    throw error;
  }
}

async function callFal(modelId, body) {
  try {
    const attemptSubscription = async (input) => {
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
    const { width, height } = getDimensionsFromAspectRatio(
      body.resolution || "1:1"
    );

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
    console.log(rest);
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

export const generateAudioForProvider = async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  const { userId, provider } = body;

  if (!userId || !provider) {
    return res.status(400).json({
      error: "User ID and provider are required.",
    });
  }

  try {
    // Get model config from DB
    const model = await ModelConfig.findOne({ modelId: id });

    if (!model || !model.isActive) {
      return res.status(404).json({
        error: "Model not found or inactive.",
      });
    }

    const providerType = provider.toLowerCase();
    const providerIndex = model.provider.findIndex(
      (p) => p.toLowerCase() === providerType
    );

    if (providerIndex === -1) {
      return res.status(400).json({
        error: `Provider '${provider}' is not supported for model '${id}'.`,
        availableProviders: model.provider,
      });
    }

    const credits = model.credits[providerIndex] || 0;
    const hasEnoughCredits = await checkCredits(userId, credits);

    if (!hasEnoughCredits) {
      return res.status(402).json({
        error: "Not enough credits.",
        requiredCredits: credits,
      });
    }

    const text = body.prompt;

    // Prepare request body
    const requestBody = {
      text: text || body.prompt,
      prompt: body.prompt,
      duration: body.duration,
      step: body.step,
      // Add any other standard audio parameters
    };

    // Apply custom inputs
    if (model.custom_inputs) {
      model.custom_inputs.forEach((input) => {
        if (body[input.id] !== undefined) {
          requestBody[input.id] = body[input.id];
        } else if (input.default !== undefined) {
          requestBody[input.id] = input.default;
        }
      });
    }

    let rawData;
    let lyrics;
    switch (providerType) {
      case "replicate":
        console.log(model.endpoint);
        rawData = await callReplicateAudio(model.endpoint, requestBody);
        break;
      case "fal":
        if (id === "fal-ai-ace-step-prompt-to-audio") {
          const result = await callFalAudioAceStep(model.falid, requestBody);
          rawData = result;
          lyrics = result.lyrics;
        } else {
          rawData = await callFalAudio(model.falid, requestBody);
        }
        break;
      case "together":
        rawData = await callTogetherAudio(model.togetherid, requestBody);
        break;
      case "deepinfra":
        rawData = await callDeepInfraAudio(model.deepid, requestBody);
        break;
      default:
        rawData = await callDefaultAudioProvider(model.endpoint, requestBody);
    }

    // Extract audio URL based on provider and model
    let audioUrl;
    switch (id.toLowerCase()) {
      case "fal-ai-ace-step-prompt-to-audio":
        audioUrl = rawData?.audioUrl || rawData?.audio?.url;
        break;
      case "multilingual-audio":
        audioUrl = rawData?.audio_url || rawData?.output;
        break;
      case "stackadoc-stable-audio":
        audioUrl = rawData?.audio_url || rawData?.output;
        break;
      default:
        if (providerType === "fal") {
          console.log(rawData);
          audioUrl = rawData?.audio?.url;
        } else if (providerType === "replicate") {
          audioUrl = rawData?.output;
        } else {
          audioUrl = rawData?.audio_url || rawData?.output || rawData?.url;
        }
    }

    if (!audioUrl) {
      return res.status(502).json({
        error: "Failed to extract audio URL",
        provider: providerType,
        rawData,
      });
    }

    // Deduct credits and return response
    await decreaseCredits(userId, credits);

    const response = {
      audioUrl,
      provider: providerType,
      creditsDeducted: credits,
    };

    if (lyrics) {
      response.lyrics = lyrics;
    }

    res.json(response);
  } catch (err) {
    console.error(`Error generating audio for ${id} with ${provider}:`, err);
    res.status(500).json({
      error: "Audio generation failed.",
      provider: provider,
      details: err?.message || err,
    });
  }
};

// Helper functions for different audio providers
async function callReplicateAudio(endpoint, body) {
  console.log(endpoint);
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
    return result.data;
  } catch (error) {
    console.error(
      `FAL handler failed for model ${modelId}:`,
      error.response?.data?.error || error.message || error
    );
    console.error("Error details:", {
      status: error.body || "Unknown status",
      body: error.body?.detail[0] || "No body available",
    });
    if (error.response && error.response.data) {
      console.error("Error details:", error.response.data);
    }
    throw error;
  }
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
