import { generateVideoWan } from "../providers/video/wanProviders.js";
import { generateVideoLuma } from "../providers/video/lumaProviders.js";
import { generateVideoPika } from "../providers/video/pikaProviders.js";
import { generateVideoPixverse } from "../providers/video/pixverseProviders.js";
import { generateVideoLTX } from "../providers/video/ltxProvidrs.js";
import { generateImageFlux11Pro } from "../providers/image/fluxProvider.js";
import { generateImageFooocus } from "../providers/image/fooocusProvider.js";
import { generateImageHidream } from "../providers/image/hidreamprovider.js";
import { generateImageIdeogram } from "../providers/image/ideogramProvider.js";
import {
  generateImageRecraftFAL,
  generateImageRecraftV3Replicate,
} from "../providers/image/recraftv3Provider.js";
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
import { generateImageFluxSchnell } from "../providers/image/flux-schnellProvider.js";
import { generatePixverseVideo } from "../providers/video/pixverse45Provider.js";
import { generateVeo3Video } from "../providers/video/veo3provider.js";
import { generateMinimaxVideo } from "../providers/video/minmax01Provider.js";
import { generateHunyuanVideo } from "../providers/video/hunyuanProvider.js";
import { generateSpeechTogetherProvider } from "../providers/audio/cartesisonicProvider.js";
import { generateImageFluxDev } from "../providers/image/fluxdevProvider.js";
import { generateImageFluxPro } from "../providers/image/fluxProProvider.js";
import { generateImageStability35 } from "../providers/image/stability35Provider.js";
import { generateImageStability35Mid } from "../providers/image/stability35midProvider.js";
import { generateImageStability35SDXL } from "../providers/image/stabilitySdxlProvider.js";
import { generateVideoWan14B } from "../providers/video/wan14bProvider.js";
import { generateImageFluxKontextPro } from "../providers/image/fluxKontextProProvider.js";
import { generateImageFluxKontextMax } from "../providers/image/fluxKontextMaxProvider.js";
import { generateImageFluxUltra } from "../providers/image/fluxUltraProvider.js";
import { generateImageBytedanceProvider } from "../providers/image/bytedanceSDXLProvider.js";
import { generateWan720Video } from "../providers/video/wavespeedWan720Provider.js";
import { generateWan480Video } from "../providers/video/wavespeedWan480Provider.js";
import { generateAudioAceStep } from "../providers/audio/aceStepProvider.js";
import { generateAudioAceStepPrompt } from "../providers/audio/aceStepPromptProvider.js";
import { generateImageHidreamFull } from "../providers/image/hidreamFullProvider.js";
import { generateImageHidreamFast } from "../providers/image/hidreamFastProvider.js";

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
      case "wan-ai-wan21-t2v-14b":
        rawData = await generateVideoWan14B(body);
        break;
      case "wavespeedai-wan21-t2v-720p":
        rawData = await generateWan720Video(body);
        break;
      case "wavespeedai-wan21-t2v-480p":
        rawData = await generateWan480Video(body);
        break;
      case "luma-ray2-flash":
        rawData = await generateVideoLuma(body);
        break;
      case "pika-text-to-video-v2-1":
        rawData = await generateVideoPika(body);
        break;
      case "pixverse-v4":
        rawData = await generateVideoPixverse(body);
        break;
      case "pixverse-v4.5":
        rawData = await generatePixverseVideo(body);
        break;
      case "lightricks-ltx-video":
        rawData = await generateVideoLTX(body);
        break;
      case "kling-video-v2-master":
        rawData = await generateVideoKling(body);
        break;
      case "google-veo-3":
        rawData = await generateVeo3Video(body);
        break;
      case "minimax-video-01":
        rawData = await generateMinimaxVideo(body);
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
      case "hunyuan-video":
        rawData = await generateHunyuanVideo(body);
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
      videoUrl = rawData?.output || rawData?.url || rawData;
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
    "black-forest-labs-flux-schnell": {
      fal: 7,
      replicate: 5,
      together: 4,
    },
    "black-forest-labs-flux-1-dev": {
      together: 7,
    },
    "black-forest-labs-flux-pro": {
      deepinfra: 5,
    },
    "black-forest-labs-flux-kontext-pro": {
      replicate: 5,
    },
    "black-forest-labs-flux-kontext-max": {
      replicate: 7,
    },
    "black-forest-labs-flux-1.1-pro-ultra": {
      replicate: 7,
    },
    "bytedance-sdxl-lightning-4step": {
      replicate: 7,
    },
    "stabilityai-sd3-5": {
      deepinfra: 4,
    },
    "stabilityai-sd3-5-medium": {
      deepinfra: 5,
    },
    "stabilityai-sdxl-turbo": {
      deepinfra: 5,
    },
    "recraft-v3": {
      fal: 4,
      replicate: 2,
    },
    fooocus: {
      fal: 3,
    },
    "hidream-i1-dev": {
      fal: 4,
    },
    "hidream-i1-full": {
      fal: 6,
    },
    "hidream-i1-fast": {
      fal: 8,
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
          rawData = await generateImageFlux11Pro(body);
        }
        if (provider === "deepinfra" || provider === "base64") {
          rawData = await generateImageFlux11Pro(body);
        }
        if (provider === "replicate") {
          rawData = await generateImageFlux11Pro(body);
        }
        break;
      case "black-forest-labs-flux-schnell":
        rawData = await generateImageFluxSchnell(body);
        break;
      case "black-forest-labs-flux-1-dev":
        rawData = await generateImageFluxDev(body);
        break;
      case "black-forest-labs-flux-pro":
        rawData = await generateImageFluxPro(body);
        break;
      case "black-forest-labs-flux-kontext-pro":
        rawData = await generateImageFluxKontextPro(body);
        break;
      case "black-forest-labs-flux-kontext-max":
        rawData = await generateImageFluxKontextMax(body);
        break;
      case "black-forest-labs-flux-1.1-pro-ultra":
        rawData = await generateImageFluxUltra(body);
        break;
      case "bytedance-sdxl-lightning-4step":
        rawData = await generateImageBytedanceProvider(body);
        break;
      case "stabilityai-sd3-5":
        rawData = await generateImageStability35(body);
        break;
      case "stabilityai-sd3-5-medium":
        rawData = await generateImageStability35Mid(body);
        break;
      case "stabilityai-sdxl-turbo":
        rawData = await generateImageStability35SDXL(body);
        break;
      case "fooocus":
        rawData = await generateImageFooocus(body);
        break;
      case "hidream-i1-dev":
        rawData = await generateImageHidream(body);
        break;
      case "hidream-i1-full":
        rawData = await generateImageHidreamFull(body);
        break;
      case "hidream-i1-fast":
        rawData = await generateImageHidreamFast(body);
        break;
      case "ideogram-v3":
        rawData = await generateImageIdeogram(body);
        break;
      case "recraft-v3":
        if (providerType === "fal") {
          console.log("fal");
          rawData = await generateImageRecraftFAL(body);
        } else if (providerType === "replicate") {
          console.log("replicate");
          rawData = await generateImageRecraftV3Replicate(body);
        }
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
      imageUrl = rawData?.image?.url || rawData?.output || rawData;
    } else if (providerType === "together") {
      imageUrl =
        rawData?.data?.[0]?.url ||
        rawData?.image?.url ||
        rawData?.url ||
        rawData;
    } else if (providerType === "deepinfra" || providerType === "base64") {
      const base64 = rawData?.data?.[0]?.b64_json || rawData?.image_url;
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
    let lyrics;

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

      case "fal-ai-ace-step-lyrics-to-audio":
        audioUrl = await generateAudioAceStep(body);
        break;

      case "fal-ai-ace-step-prompt-to-audio": {
        const result = await generateAudioAceStepPrompt(body);
        audioUrl = result.audioUrl;
        lyrics = result.lyrics;
        break;
      }

      case "cartesia-sonic-2":
        audioUrl = await generateSpeechTogetherProvider(body);
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

    // Return with or without lyrics
    const response = { audioUrl };
    if (id.toLowerCase() === "fal-ai-ace-step-prompt-to-audio") {
      response.lyrics = lyrics;
    }

    res.status(200).json(response);
  } catch (err) {
    console.error(`Error in /audio/${id}:`, err);
    res.status(500).json({
      error: "Audio generation failed.",
      details: err?.message || err,
    });
  }
};
