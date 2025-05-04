import { ltxReplicate } from "../services/ltxServices.js";
import { lumaFAL } from "../services/lumaServices.js";
import { pikaFAL } from "../services/pikaServices.js";
import { pixverseFAL } from "../services/pixverseService.js";
import { wanDeepinfra, wanFAL, wanReplicate } from "../services/wanServices.js"; // Adjust path as needed

export const videoGenerationHandlers = [
  {
    model: "wan21-t2v",
    handler: wanFAL,
    credits: 4,
  },
  {
    model: "wan21-t2v",
    handler: wanReplicate,
    credits: 6,
  },
  {
    model: "wan21-t2v",
    handler: wanDeepinfra,
    credits: 3,
  },
  {
    model: "ltx-video",
    handler: ltxReplicate,
    credits: 3,
  },
  {
    model: "pixverse-v4",
    handler: pixverseFAL,
    credits: 3,
  },
  {
    model: "pika-video",
    handler: pikaFAL,
    credits: 6,
  },
  {
    model: "luma-video",
    handler: lumaFAL,
    credits: 6,
  },
];
