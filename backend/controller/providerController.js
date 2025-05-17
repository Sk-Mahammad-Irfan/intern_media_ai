import express from "express";
import { generateVideoWan } from "../providers/wanProviders.js";
import { generateVideoLuma } from "../providers/lumaProviders.js";
import { generateVideoPika } from "../providers/pikaProviders.js";
import { generateVideoPixverse } from "../providers/pixverseProviders.js";
import { generateVideoLTX } from "../providers/ltxProvidrs.js";

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
