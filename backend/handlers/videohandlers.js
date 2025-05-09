import { ltxReplicate } from "../services/video/ltxServices.js";
import { lumaFAL } from "../services/video/lumaServices.js";
import { pikaFAL } from "../services/video/pikaServices.js";
import { pixverseFAL } from "../services/video/pixverseService.js";
import {
  wanDeepinfra,
  wanFAL,
  wanReplicate,
} from "../services/video/wanServices.js";

export const videoGenerationHandlers = [
  {
    model: "wan-ai-wan21-t2v-13b",
    handler: wanFAL,
    type: "fal",
    credits: 8,
  },
  {
    model: "wan-ai-wan21-t2v-13b",
    handler: wanReplicate,
    type: "replicate",
    credits: 10,
  },
  {
    model: "wan-ai-wan21-t2v-13b",
    handler: wanDeepinfra,
    type: "deepinfra",
    credits: 14,
  },
  {
    model: "lightricks-ltx-video",
    handler: ltxReplicate,
    type: "replicate",
    credits: 15,
  },
  {
    model: "pixverse-v4-text-to-video",
    handler: pixverseFAL,
    type: "fal",
    credits: 12,
  },
  {
    model: "pika-text-to-video-v2-1",
    handler: pikaFAL,
    type: "fal",
    credits: 18,
  },
  {
    model: "luma-ray2-flash",
    handler: lumaFAL,
    type: "fal",
    credits: 20,
  },
];
