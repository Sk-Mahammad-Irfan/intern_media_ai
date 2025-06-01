import { generateVideoWan } from "../providers/video/wanProviders.js";
import { generateVideoLuma } from "../providers/video/lumaProviders.js";
import { generateVideoPika } from "../providers/video/pikaProviders.js";
import { generateVideoPixverse } from "../providers/video/pixverseProviders.js";
import { generateVideoLTX } from "../providers/video/ltxProvidrs.js";
import { generateImageFluxPro } from "../providers/image/fluxProvider.js";
import { generateImageFooocus } from "../providers/image/fooocusProvider.js";
import { generateImageHidream } from "../providers/image/hidreamprovider.js";
import { generateImageIdeogram } from "../providers/image/ideogramProvider.js";
import { generateImageRecraftFAL } from "../providers/image/recraftv3Provider.js";
import { generateAudioCassatteMusic } from "../providers/audio/cassettemusicProvider.js";
import { generateAudioCassetteFAL } from "../providers/audio/cassetteProvider.js";
import { generateAudioMultilingualTtsFAL } from "../providers/audio/multilingualTtsProvider.js";
import {
  generateAudioStableFal,
  generateAudioStableReplicate,
} from "../providers/audio/stableProvider.js";
import { generateAudioaAmericanEnglishFAL } from "../providers/audio/americanEnglishprovider.js";
import {
  getCreditsForGeneration,
  getCreditsForImageGeneration,
} from "../helper/creditsHelper.js";
import { checkCredits, decreaseCredits } from "./creditController.js";
import { videoGenerationHandlers } from "../handlers/videohandlers.js";
import { audioGenerationHandlers } from "../handlers/audiohandlers.js";
import { deepFluxProV1_1 } from "../services/image/flux11Service.js";
import { generateVideoKling } from "../providers/video/klingProviders.js";
import { generateVideoVidu } from "../providers/video/viduProvider.js";
import { generateVideoMagi } from "../providers/video/magiProvider.js";
import { generateVideoVeo } from "../providers/video/veoProvider.js";
import { generateVideoCogvideoX } from "../providers/video/cogvideoxProvider.js";
import { generateImageBagel } from "../providers/image/bagelProvider.js";
import { generateAudioKokoroHindiFAL } from "../providers/audio/kokoroProvider.js";
import { generateImageImageGen } from "../providers/image/imageGen4Provider.js";
import { fal } from "@fal-ai/client";
import { fLiteStandardProvider } from "../providers/image/fLiteProvider.js";
import { generateImageSana } from "../providers/image/sanaProvider.js";
import { generateImageWithMinimax } from "../providers/image/minmaxProvider.js";
import { generateAudioLyria2 } from "../providers/audio/lyria2Provider.js";
import { generateAudioEvenLab } from "../providers/audio/evenlabProvider.js";
import { generateAudioMM } from "../providers/audio/mmaudioProvider.js";

export const generateVideoforProvider = async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  const { userId, provider } = body;
  const providerType = provider?.toLowerCase();

  try {
    const credits = getCreditsForGeneration(
      videoGenerationHandlers,
      id,
      providerType
    );
    if (!credits) {
      return res
        .status(400)
        .json({ error: `Unknown video generator or provider: ${id}` });
    }

    const hasEnoughCredits = await checkCredits(userId, credits);
    if (!hasEnoughCredits) {
      return res.status(402).json({ error: "Not enough credits." });
    }

    let rawData;
    switch (id.toLowerCase()) {
      case "wan-ai-wan21-t2v-13b":
        rawData = await generateVideoWan(body);
        break;
      case "luma-ray2-flash":
        rawData = await generateVideoLuma(body);
        break;
      case "pika-text-to-video-v2-1":
        rawData = await generateVideoPika(body);
        break;
      case "pixverse-v4-text-to-video":
        rawData = await generateVideoPixverse(body);
        break;
      case "lightricks-ltx-video":
        rawData = await generateVideoLTX(body);
        break;
      case "kling-video-v2-master":
        rawData = await generateVideoKling(body);
        break;
      case "vidu-q1":
        rawData = await generateVideoVidu(body);
        break;
      case "magi":
        rawData = await generateVideoMagi(body);
        break;
      case "veo2":
        rawData = await generateVideoVeo(body);
        break;
      case "cogvideox-5b":
        rawData = await generateVideoCogvideoX(body);
        break;
      default:
        return res
          .status(400)
          .json({ error: `Unknown video generator: ${id}` });
    }

    let videoUrl;
    if (providerType === "fal") {
      videoUrl = rawData?.video?.url;
    } else if (providerType === "replicate") {
      videoUrl = rawData?.video?.url || rawData?.url || rawData;
    } else if (providerType === "deepinfra") {
      videoUrl = rawData?.video_url || rawData?.data?.video_url;
    }

    if (!videoUrl) {
      return res
        .status(502)
        .json({ error: "Failed to extract video URL", rawData });
    }

    await decreaseCredits(userId, credits);
    res.json({ videoUrl });
  } catch (err) {
    console.error(`Error in /video/${id}:`, err);
    res.status(500).json({
      error: "Video generation failed.",
      details: err?.message || err,
    });
  }
};

export const generateImageForProvider = async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  const { userId, provider } = body;
  const providerType = provider?.toLowerCase();

  const imageGenerationHandlers = {
    "black-forest-labs-flux-1-1-pro": {
      fal: 5,
      deepinfra: 4,
    },
    "recraft-v3": {
      fal: 4,
    },
    fooocus: {
      fal: 3,
    },
    "hidream-i1-dev": {
      fal: 4,
    },
    "ideogram-v3": {
      fal: 7,
    },
    bagel: {
      fal: 10,
    },
    "imagen4-preview": {
      fal: 12,
    },
    "f-lite-standard": {
      fal: 14,
    },
    "sana-v1.5-4.8b": {
      fal: 15,
    },
  };

  try {
    const credits = getCreditsForImageGeneration(
      imageGenerationHandlers,
      id,
      providerType
    );
    if (!credits) {
      return res
        .status(400)
        .json({ error: `Unknown image generator or provider: ${id}` });
    }

    const hasEnoughCredits = await checkCredits(userId, credits);
    if (!hasEnoughCredits) {
      return res.status(402).json({ error: "Not enough credits." });
    }

    let rawData;
    switch (id.toLowerCase()) {
      case "black-forest-labs-flux-1-1-pro":
        if (provider === "fal") {
          rawData = await generateImageFluxPro(body);
        }
        // if (provider === "deepinfra" || provider === "base64") {
        //   rawData = await generateImageFluxPro(body);
        // }
        break;
      case "fooocus":
        rawData = await generateImageFooocus(body);
        break;
      case "hidream-i1-dev":
        rawData = await generateImageHidream(body);
        break;
      case "ideogram-v3":
        rawData = await generateImageIdeogram(body);
        break;
      case "recraft-v3":
        rawData = await generateImageRecraftFAL(body);
        break;
      case "imagen4-preview":
        rawData = await generateImageImageGen(body);
        break;
      case "f-lite-standard":
        rawData = await fLiteStandardProvider(body);
        break;
      case "bagel":
        rawData = await generateImageBagel(body);
        break;
      case "sana-v1.5-4.8b":
        rawData = await generateImageSana(body);
        break;
      case "minimax-image-01":
        rawData = await generateImageWithMinimax(body);
        break;
      default:
        return res
          .status(400)
          .json({ error: `Unknown image generator: ${id}` });
    }

    let imageUrl;
    if (providerType === "fal") {
      imageUrl = rawData?.images?.[0]?.url;
    } else if (providerType === "replicate") {
      imageUrl = rawData?.image?.url || rawData?.url || rawData;
    } else if (providerType === "deepinfra" || providerType === "base64") {
      const base64 = rawData?.data?.[0]?.b64_json;
      imageUrl = base64 ? `data:image/jpeg;base64,${base64}` : null;
    }

    if (!imageUrl) {
      return res
        .status(502)
        .json({ error: "Failed to extract image URL", rawData });
    }

    await decreaseCredits(userId, credits);
    res.json({ imageUrl });
  } catch (err) {
    console.error(`Error in /image/${id}:`, err);
    res.status(500).json({
      error: "Image generation failed.",
      details: err?.message || err,
    });
  }
};

export const generateAudioForProvider = async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  const { userId, provider } = body;
  const providerType = provider?.toLowerCase();

  try {
    const credits = getCreditsForGeneration(
      audioGenerationHandlers,
      id,
      providerType
    );
    if (!credits) {
      return res
        .status(400)
        .json({ error: `Unknown audio generator or provider: ${id}` });
    }

    const hasEnoughCredits = await checkCredits(userId, credits);
    if (!hasEnoughCredits) {
      return res.status(402).json({ error: "Not enough credits." });
    }

    let audioUrl;
    switch (id.toLowerCase()) {
      case "cassattemusic-audio":
        audioUrl = await generateAudioCassatteMusic(body);
        break;
      case "cassetteai-sfx-generator":
        audioUrl = await generateAudioCassetteFAL(body);
        break;
      case "multilingual-audio":
        audioUrl = await generateAudioMultilingualTtsFAL(body);
        break;
      case "stackadoc-stable-audio":
        audioUrl =
          provider === "fal"
            ? await generateAudioStableFal(body)
            : await generateAudioStableReplicate(body);
        break;
      case "american-audio":
        audioUrl = await generateAudioaAmericanEnglishFAL(body);
        break;
      case "fal-ai-kokoro-hindi":
        audioUrl = await generateAudioKokoroHindiFAL(body);
        break;
      case "fal-ai-lyria2":
        audioUrl = await generateAudioLyria2(body);
        break;
      case "fal-ai-elevenlabs-sound-effects":
        audioUrl = await generateAudioEvenLab(body);
        break;
      case "fal-ai-mmaudio-v2-text-to-audio":
        audioUrl = await generateAudioMM(body);
        break;
      default:
        return res
          .status(400)
          .json({ error: `Unknown audio generator: ${id}` });
    }

    if (!audioUrl) {
      return res.status(502).json({ error: "Failed to extract audio URL" });
    }

    await decreaseCredits(userId, credits);
    res.status(200).json({ audioUrl });
  } catch (err) {
    console.error(`Error in /audio/${id}:`, err);
    res.status(500).json({
      error: "Audio generation failed.",
      details: err?.message || err,
    });
  }
};
