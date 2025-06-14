import {
  deepFluxProV1_1,
  falFluxProV1_1,
} from "../services/image/flux11Service.js";
import { falFooocus } from "../services/image/fooocusService.js";
import {
  falRecraftV3,
  replicateRecraftV3,
} from "../services/image/recraftv3Service.js";
import { hidreamFAL } from "../services/image/hidreamServices.js";
import { ideogramFAL } from "../services/image/ideogramServices.js";
import { incrementModelUsage } from "../utils/incrementModelUsage.js";
import { bagelFAL } from "../services/image/bagelService.js";
import { imageGenFAL } from "../services/image/imageGen4Service.js";
import { fLiteStandard } from "../services/image/fliteService.js";
import { sanaGenerate } from "../services/image/sanaService.js";
import { minimaxGenerate } from "../services/image/minmaxService.js";
import {
  generateImageFluxSchnellFal,
  generateImageFluxSchnellReplicate,
  generateImageFluxSchnellTogether,
} from "../services/image/fluxschnellService.js";
import { generateImageFluxDevTogether } from "../services/image/flux1devService.js";
import { deepFluxPro } from "../services/image/fluxProService.js";
import { stabilitySD3_5 } from "../services/image/stability35Service.js";
import { stability35Mid } from "../services/image/stability35midService.js";
import { stability35SDXL } from "../services/image/stabilitySdxlService.js";
import { replicateFluxKontext } from "../services/image/fluxKontextProService.js";

const wrapHandler = (handler, model) => {
  return async (...args) => {
    await incrementModelUsage(model);
    return handler(...args);
  };
};

export const imageGenerationHandlers = [
  {
    model: "black-forest-labs-flux-1-1-pro",
    handler: wrapHandler(falFluxProV1_1, "black-forest-labs-flux-1-1-pro"),
    type: "fal",
    credits: 5,
  },
  {
    model: "black-forest-labs-flux-schnell",
    handler: wrapHandler(
      generateImageFluxSchnellReplicate,
      "black-forest-labs-flux-schnell"
    ),
    type: "replicate",
    credits: 5,
  },
  {
    model: "black-forest-labs-flux-schnell",
    handler: wrapHandler(
      generateImageFluxSchnellFal,
      "black-forest-labs-flux-schnell"
    ),
    type: "fal",
    credits: 7,
  },
  {
    model: "black-forest-labs-flux-schnell",
    handler: wrapHandler(
      generateImageFluxSchnellTogether,
      "black-forest-labs-flux-schnell"
    ),
    type: "together",
    credits: 4,
  },
  {
    model: "black-forest-labs-flux-1-dev",
    handler: wrapHandler(
      generateImageFluxDevTogether,
      "black-forest-labs-flux-schnell"
    ),
    type: "together",
    credits: 4,
  },
  {
    model: "black-forest-labs-flux-1-1-pro",
    handler: wrapHandler(deepFluxProV1_1, "black-forest-labs-flux-1-1-pro"),
    type: "base64",
    credits: 4,
  },
  {
    model: "black-forest-labs-flux-pro",
    handler: wrapHandler(deepFluxPro, "black-forest-labs-flux-pro"),
    type: "base64",
    credits: 4,
  },
  {
    model: "black-forest-labs-flux-kontext-pro",
    handler: wrapHandler(
      replicateFluxKontext,
      "black-forest-labs-flux-kontext-pro"
    ),
    type: "replicate",
    credits: 4,
  },
  {
    model: "stabilityai-sd3-5",
    handler: wrapHandler(stabilitySD3_5, "stabilityai-sd3-5"),
    type: "base64",
    credits: 4,
  },
  {
    model: "stabilityai-sd3-5-medium",
    handler: wrapHandler(stability35Mid, "stabilityai-sd3-5-medium"),
    type: "base64",
    credits: 4,
  },
  {
    model: "stabilityai-sdxl-turbo",
    handler: wrapHandler(stability35SDXL, "stabilityai-sdxl-turbo"),
    type: "base64",
    credits: 4,
  },
  {
    model: "recraft-v3",
    handler: wrapHandler(falRecraftV3, "recraft-v3"),
    type: "fal",
    credits: 4,
  },
  {
    model: "recraft-v3",
    handler: wrapHandler(replicateRecraftV3, "recraft-v3"),
    type: "replicate",
    credits: 2,
  },
  {
    model: "fooocus",
    handler: wrapHandler(falFooocus, "fooocus"),
    type: "fal",
    credits: 3,
  },
  {
    model: "hidream-i1-dev",
    handler: wrapHandler(hidreamFAL, "hidream-i1-dev"),
    type: "fal",
    credits: 4,
  },
  {
    model: "ideogram-v3",
    handler: wrapHandler(ideogramFAL, "ideogram-v3"),
    type: "fal",
    credits: 7,
  },
  {
    model: "bagel",
    handler: wrapHandler(bagelFAL, "bagel"),
    type: "fal",
    credits: 10,
  },
  {
    model: "imagen4-preview",
    handler: wrapHandler(imageGenFAL, "imagen4-preview"),
    type: "fal",
    credits: 12,
  },
  {
    model: "f-lite-standard",
    handler: wrapHandler(fLiteStandard, "f-lite-standard"),
    type: "fal",
    credits: 12,
  },
  {
    model: "sana-v1.5-4.8b",
    handler: wrapHandler(sanaGenerate, "sana-v1.5-4.8b"),
    type: "fal",
    credits: 12,
  },
  {
    model: "minimax-image-01",
    handler: wrapHandler(minimaxGenerate, "minimax-image-01"),
    type: "fal",
    credits: 12,
  },
];
