import { cogvideoFAL } from "../services/video/cogvideoxService.js";
import {
  hunyuanFAL,
  hunyuanReplicate,
} from "../services/video/hunyuanService.js";
import { klingService } from "../services/video/klingServices.js";
import { ltxReplicate } from "../services/video/ltxServices.js";
import { lumaFAL } from "../services/video/lumaServices.js";
import { MagiFAL } from "../services/video/magiService.js";
import {
  minimaxFAL,
  minimaxReplicate,
} from "../services/video/minmax01Service.js";
import { pikaFAL } from "../services/video/pikaServices.js";
import {
  pixverse45FAL,
  pixverse45Replicate,
} from "../services/video/pixverse45Service.js";
import { pixverseFAL } from "../services/video/pixverseService.js";
import {
  generateVeo3WithFAL,
  generateVeo3WithReplicate,
} from "../services/video/veo3Service.js";
import { veoServiceFal } from "../services/video/veoService.js";
import { viduService } from "../services/video/viduService.js";
import { wan14B } from "../services/video/wan14bService.js";
import {
  wanDeepinfra,
  wanFAL,
  wanReplicate,
} from "../services/video/wanServices.js";
import { wan480Replicate } from "../services/video/wavespeedWan480.js";
import { wan720Replicate } from "../services/video/wavespeedWan720.js";
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
    model: "wan-ai-wan21-t2v-14b",
    handler: wrapHandler(wan14B, "wan-ai-wan21-t2v-14b"),
    type: "deepinfra",
    credits: 10,
  },
  {
    model: "wavespeedai-wan21-t2v-720p",
    handler: wrapHandler(wan720Replicate, "wavespeedai-wan21-t2v-720p"),
    type: "replicate",
    credits: 10,
  },
  {
    model: "wavespeedai-wan21-t2v-480p",
    handler: wrapHandler(wan480Replicate, "wavespeedai-wan21-t2v-480p"),
    type: "replicate",
    credits: 12,
  },
  {
    model: "lightricks-ltx-video",
    handler: wrapHandler(ltxReplicate, "lightricks-ltx-video"),
    type: "replicate",
    credits: 60,
  },
  {
    model: "google-veo-3",
    handler: wrapHandler(generateVeo3WithReplicate, "google-veo-3"),
    type: "replicate",
    credits: 45,
  },
  {
    model: "google-veo-3",
    handler: wrapHandler(generateVeo3WithFAL, "google-veo-3"),
    type: "fal",
    credits: 50,
  },
  {
    model: "minimax-video-01",
    handler: wrapHandler(minimaxReplicate, "minimax-video-01"),
    type: "replicate",
    credits: 50,
  },
  {
    model: "minimax-video-01",
    handler: wrapHandler(minimaxFAL, "minimax-video-01"),
    type: "fal",
    credits: 45,
  },
  {
    model: "hunyuan-video",
    handler: wrapHandler(hunyuanFAL, "hunyuan-video"),
    type: "fal",
    credits: 45,
  },
  {
    model: "hunyuan-video",
    handler: wrapHandler(hunyuanReplicate, "hunyuan-video"),
    type: "replicate",
    credits: 50,
  },
  {
    model: "pixverse-v4",
    handler: wrapHandler(pixverseFAL, "pixverse-v4"),
    type: "fal",
    credits: 12,
  },
  {
    model: "pixverse-v4.5",
    handler: wrapHandler(pixverse45Replicate, "pixverse-v4"),
    type: "replicate",
    credits: 14,
  },
  {
    model: "pixverse-v4.5",
    handler: wrapHandler(pixverse45FAL, "pixverse-v4"),
    type: "fal",
    credits: 15,
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
