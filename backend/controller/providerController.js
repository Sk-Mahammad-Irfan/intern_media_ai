import express from "express";
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

export const generateVideoforProvider = async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  const provider = body?.provider || id.toLowerCase(); // fallback if missing

  try {
    let rawData;
    let videoUrl;

    switch (id.toLowerCase()) {
      case "wan-ai-wan21-t2v-13b":
        console.log("wan-ai-wan21-t2v-13b");
        rawData = await generateVideoWan(body);
        break;
      case "luma-ray2-flash":
        console.log("luma-ray2-flash");
        rawData = await generateVideoLuma(body);
        break;
      case "pika-text-to-video-v2-1":
        console.log("pika-text-to-video-v2-1");
        rawData = await generateVideoPika(body);
        break;
      case "pixverse-v4-text-to-video":
        console.log("pixverse-v4-text-to-video");
        rawData = await generateVideoPixverse(body);
        break;
      case "lightricks-ltx-video":
        console.log("lightricks-ltx-video");
        rawData = await generateVideoLTX(body);
        break;
      default:
        return res
          .status(400)
          .json({ error: `Unknown video generator: ${id}` });
    }

    // Map to final video URL depending on provider
    switch (provider) {
      case "fal":
        videoUrl = rawData?.video?.url;
        break;
      case "replicate":
        videoUrl = rawData?.video?.url || rawData?.url || rawData;
        break;
      case "deepinfra":
        videoUrl = rawData?.video_url || rawData?.data?.video_url;
        break;
      default:
        console.warn(`Unknown provider type: ${provider}`);
        videoUrl = null;
    }

    if (!videoUrl) {
      return res.status(502).json({
        error: "Failed to extract video URL",
        rawData,
      });
    }

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
  const provider = body?.provider || id.toLowerCase(); // fallback if missing

  try {
    let rawData;
    let imageUrl;

    switch (id.toLowerCase()) {
      case "black-forest-labs-flux-1-1-pro":
        console.log("black-forest-labs-flux-1-1-pro");
        rawData = await generateImageFluxPro(body);
        break;
      case "fooocus":
        console.log("fooocus");
        rawData = await generateImageFooocus(body);
        break;
      case "hidream-i1-dev":
        console.log("hidream-i1-dev");
        rawData = await generateImageHidream(body);
        break;
      case "ideogram-v3":
        console.log("ideogram-v3");
        rawData = await generateImageIdeogram(body);
        break;
      case "recraft-v3":
        console.log("recraft-v3");
        rawData = await generateImageRecraftFAL(body);
        break;
      default:
        return res
          .status(400)
          .json({ error: `Unknown image generator: ${id}` });
    }

    // Map to final image URL depending on provider
    switch (provider) {
      case "fal":
        imageUrl = rawData?.images?.[0]?.url;
        break;
      case "replicate":
        imageUrl = rawData?.image?.url || rawData?.url || rawData;
        break;
      case "deepinfra":
        const base64 = rawData?.data?.[0]?.b64_json;
        imageUrl = base64 ? `data:image/jpeg;base64,${base64}` : null;
        break;
      default:
        console.warn(`Unknown provider type: ${provider}`);
        imageUrl = null;
    }

    if (!imageUrl) {
      return res.status(502).json({
        error: "Failed to extract image URL",
        rawData,
      });
    }

    res.json({ imageUrl });
  } catch (err) {
    console.error(`Error in /image/${id}:`, err);
    res.status(500).json({
      error: "Image generation failed.",
      details: err?.message || err,
    });
  }
};
