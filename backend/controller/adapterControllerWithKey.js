// controller/adapterControllerWithKey.js
import { fal } from "@fal-ai/client";
import dotenv from "dotenv";
import axios from "axios";
import { checkCredits, decreaseCredits } from "./creditController.js";
import ModelConfig from "../models/genmodelModel.js";
import ApiKeyModel from "../models/apikeyModel.js";

dotenv.config();
fal.config({ credentials: process.env.FAL_AI_API });

const getUserByApiKey = async (req) => {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey) throw new Error("API key missing");

  const userDoc = await ApiKeyModel.findOne({ "keys.key": apiKey });
  if (!userDoc) throw new Error("Invalid API key");

  const keyInfo = userDoc.keys.find((k) => k.key === apiKey);

  return {
    userId: userDoc.userId,
    key: keyInfo,
    _id: userDoc._id,
  };
};

// Common handler for all generation types
const handleGeneration = async (req, res, generationType) => {
  const { id } = req.params;
  const { prompt } = req.body;

  if (!prompt) return res.status(400).json({ error: "Please enter a prompt." });

  let user;
  try {
    user = await getUserByApiKey(req);
  } catch (err) {
    return res.status(401).json({ error: err.message });
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
        credits: model.credits[index] || 0,
      }))
      .sort((a, b) => a.credits - b.credits);

    // Try each provider in order of increasing cost
    for (const { name: provider, credits } of providers) {
      try {
        // Check if user has enough credits
        const hasEnough = await checkCredits(user.userId, credits);
        if (!hasEnough) continue;

        // Prepare request body based on generation type
        let requestBody;
        switch (generationType) {
          case "image":
            requestBody = {
              prompt,
            };
            break;
          case "video":
            requestBody = {
              prompt,
            };
            break;
          case "audio":
            requestBody = {
              prompt,
            };
            break;
        }

        console.log(requestBody);
        // Call the appropriate provider handler
        let result;
        switch (generationType) {
          case "image":
            result = await handleImageGeneration(provider, model, requestBody);
            break;
          case "video":
            result = await handleVideoGeneration(provider, model, requestBody);
            break;
          case "audio":
            result = await handleAudioGeneration(provider, model, requestBody);
            break;
        }

        if (!result) continue;

        await decreaseCredits(user.userId, credits, "api");
        return res.status(200).json(result);
      } catch (err) {
        console.error(
          `${generationType} handler error (${provider}):`,
          err.message || err
        );
      }
    }

    return res.status(500).json({
      error: `All providers failed to generate ${generationType}.`,
      suggestion: "Please try again later or with different parameters.",
    });
  } catch (error) {
    console.error("Server error:", error.message || error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Image generation handler
async function handleImageGeneration(provider, model, body) {
  let imageUrl;

  switch (provider) {
    case "fal":
      const falResponse = await fal.subscribe(model.falid, {
        input: {
          prompt: body.prompt,
        },
      });
      imageUrl = falResponse?.images?.[0]?.url;
      break;

    case "replicate":
      const replicateResponse = await callReplicate(model.endpoint, {
        prompt: body.prompt,
      });
      imageUrl = replicateResponse?.output || replicateResponse?.output?.[0];
      break;

    case "together":
      const togetherResponse = await callTogether(model.togetherid, {
        prompt: body.prompt,
      });
      imageUrl = togetherResponse?.data?.[0]?.url;
      break;

    case "deepinfra":
      const deepinfraResponse = await callDeepInfra(model.deepid, {
        prompt: body.prompt,
      });
      imageUrl = `data:image/jpeg;base64,${deepinfraResponse.data[0].b64_json}`;
      break;

    default:
      const defaultResponse = await callDefaultProvider(model.endpoint, {
        prompt: body.prompt,
      });
      if (defaultResponse?.data?.[0]?.b64_json) {
        imageUrl = `data:image/jpeg;base64,${defaultResponse.data[0].b64_json}`;
      } else {
        imageUrl = defaultResponse?.output || defaultResponse?.output?.[0];
      }
  }

  return imageUrl ? { imageUrl } : null;
}

// Video generation handler
async function handleVideoGeneration(provider, model, body) {
  let videoUrl;

  switch (provider) {
    case "fal":
      const falResponse = await fal.subscribe(model.falid, {
        input: {
          prompt: body.prompt,
        },
      });
      videoUrl = falResponse?.video?.url;
      break;

    case "replicate":
      const replicateResponse = await callReplicateVideo(model.endpoint, {
        prompt: body.prompt,
      });
      videoUrl = replicateResponse?.output || replicateResponse;
      break;

    case "deepinfra":
      const deepinfraResponse = await callDeepInfraVideo(model.deepid, {
        prompt: body.prompt,
      });
      videoUrl =
        deepinfraResponse?.video_url ||
        deepinfraResponse?.data?.video_url ||
        deepinfraResponse?.url;
      break;

    case "together":
      const togetherResponse = await callTogetherVideo(model.togetherid, {
        prompt: body.prompt,
      });
      videoUrl =
        togetherResponse?.video_url || togetherResponse?.data?.video_url;
      break;

    default:
      const defaultResponse = await callDefaultVideoProvider(model.endpoint, {
        prompt: body.prompt,
      });
      videoUrl =
        defaultResponse?.output ||
        defaultResponse?.video_url ||
        defaultResponse;
  }

  return videoUrl ? { videoUrl } : null;
}

// Audio generation handler
async function handleAudioGeneration(provider, model, body) {
  let audioUrl;
  let lyrics;

  switch (provider) {
    case "fal":
      if (model.modelId === "fal-ai-ace-step-prompt-to-audio") {
        const result = await callFalAudioAceStep(model.falid, {
          prompt: body.prompt,
          duration: body.duration,
          seed: body.seed,
        });
        audioUrl = result.audioUrl;
        lyrics = result.lyrics;
      } else {
        const falResponse = await callFalAudio(model.falid, {
          prompt: body.prompt,
          duration: body.duration,
          seed: body.seed,
        });
        audioUrl = falResponse?.audio?.url;
      }
      break;

    case "replicate":
      const replicateResponse = await callReplicateAudio(model.endpoint, {
        prompt: body.prompt,
        duration: body.duration,
        seed: body.seed,
      });
      audioUrl = replicateResponse?.output || replicateResponse;
      break;

    case "deepinfra":
      const deepinfraResponse = await callDeepInfraAudio(model.deepid, {
        prompt: body.prompt,
        duration: body.duration,
        seed: body.seed,
      });
      audioUrl =
        deepinfraResponse?.audio_url ||
        deepinfraResponse?.data?.audio_url ||
        deepinfraResponse?.url;
      break;

    case "together":
      const togetherResponse = await callTogetherAudio(model.togetherid, {
        prompt: body.prompt,
        duration: body.duration,
        seed: body.seed,
      });
      audioUrl =
        togetherResponse?.audio_url || togetherResponse?.data?.audio_url;
      break;

    default:
      const defaultResponse = await callDefaultAudioProvider(model.endpoint, {
        prompt: body.prompt,
        duration: body.duration,
        seed: body.seed,
      });
      audioUrl =
        defaultResponse?.output ||
        defaultResponse?.audio_url ||
        defaultResponse;
  }

  const result = { audioUrl };
  if (lyrics) result.lyrics = lyrics;
  return audioUrl ? result : null;
}

// -------- EXPORTED CONTROLLERS --------
export const generateImageWithKey = async (req, res) => {
  return handleGeneration(req, res, "image");
};

export const generateVideoWithKey = async (req, res) => {
  return handleGeneration(req, res, "video");
};

export const generateAudioWithKey = async (req, res) => {
  return handleGeneration(req, res, "audio");
};

// -------- PROVIDER HELPER FUNCTIONS --------
async function callReplicate(endpoint, body) {
  const headers = {
    Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
    "Content-Type": "application/json",
    Prefer: "wait",
  };
  const response = await axios.post(endpoint, body, { headers });
  return response.data;
}

async function callTogether(modelId, body) {
  const input = {
    model: modelId,
    prompt: body.prompt,
  };

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
}

async function callDeepInfra(modelId, body) {
  const response = await axios.post(
    "https://api.deepinfra.com/v1/openai/images/generations",
    {
      model: modelId,
      prompt: body.prompt,
      size: body.size,
      seed: body.seed,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DEEPINFRA_API}`,
      },
    }
  );
  return response.data;
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
      prompt: body.prompt,
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
  return await response.json();
}

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
}

async function callFalAudioAceStep(modelId, body) {
  const response = await fal.subscribe(`${modelId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Key ${process.env.FAL_API_KEY}`,
    },
    body: JSON.stringify({
      prompt: body.prompt,
      duration: body.duration,
      seed: body.seed,
    }),
  });
  const data = await response.json();
  return {
    audioUrl: data?.audio?.url,
    lyrics: data?.lyrics,
  };
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
      prompt: body.prompt,
      duration: body.duration,
      seed: body.seed,
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
