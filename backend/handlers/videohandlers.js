import { cogvideoFAL } from "../services/video/cogvideoxService.js";
import { klingService } from "../services/video/klingServices.js";
import { ltxReplicate } from "../services/video/ltxServices.js";
import { lumaFAL } from "../services/video/lumaServices.js";
import { MagiFAL } from "../services/video/magiService.js";
import { pikaFAL } from "../services/video/pikaServices.js";
import { pixverseFAL } from "../services/video/pixverseService.js";
import { veoServiceFal } from "../services/video/veoService.js";
import { viduService } from "../services/video/viduService.js";
import {
  wanDeepinfra,
  wanFAL,
  wanReplicate,
} from "../services/video/wanServices.js";
import { incrementModelUsage } from "../utils/incrementModelUsage.js";

const wrapHandler = (handler, model) => {
  return async (...args) => {
    await incrementModelUsage(model);
    return handler(...args);
  };
};

export const videoGenerationHandlers = [
  {
    model: "wan-ai-wan21-t2v-13b",
    handler: wrapHandler(wanFAL, "wan-ai-wan21-t2v-13b"),
    type: "fal",
    credits: 18,
  },
  {
    model: "wan-ai-wan21-t2v-13b",
    handler: wrapHandler(wanReplicate, "wan-ai-wan21-t2v-13b"),
    type: "replicate",
    credits: 17,
  },
  {
    model: "wan-ai-wan21-t2v-13b",
    handler: wrapHandler(wanDeepinfra, "wan-ai-wan21-t2v-13b"),
    type: "deepinfra",
    credits: 10,
  },
  {
    model: "lightricks-ltx-video",
    handler: wrapHandler(ltxReplicate, "lightricks-ltx-video"),
    type: "replicate",
    credits: 60,
  },
  {
    model: "pixverse-v4-text-to-video",
    handler: wrapHandler(pixverseFAL, "pixverse-v4-text-to-video"),
    type: "fal",
    credits: 12,
  },
  {
    model: "pika-text-to-video-v2-1",
    handler: wrapHandler(pikaFAL, "pika-text-to-video-v2-1"),
    type: "fal",
    credits: 40,
  },
  {
    model: "luma-ray2-flash",
    handler: wrapHandler(lumaFAL, "luma-ray2-flash"),
    type: "fal",
    credits: 25,
  },
  {
    model: "kling-video-v2-master",
    handler: wrapHandler(klingService, "kling-video-v2-master"),
    type: "fal",
    credits: 20,
  },
  {
    model: "vidu-q1",
    handler: wrapHandler(viduService, "vidu-q1"),
    type: "fal",
    credits: 18,
  },
  {
    model: "magi",
    handler: wrapHandler(MagiFAL, "magi"),
    type: "fal",
    credits: 22,
  },
  {
    model: "veo2",
    handler: wrapHandler(veoServiceFal, "veo2"),
    type: "fal",
    credits: 18,
  },
  {
    model: "cogvideox-5b",
    handler: wrapHandler(cogvideoFAL, "CogVideoX"),
    type: "fal",
    credits: 25,
  },
];
