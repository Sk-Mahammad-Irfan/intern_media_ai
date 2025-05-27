import {
  deepFluxProV1_1,
  falFluxProV1_1,
} from "../services/image/flux11Service.js";
import { falFooocus } from "../services/image/fooocusService.js";
import {
  falRecraftV3,
  segmindRecraftV3,
} from "../services/image/recraftv3Service.js";
import { hidreamFAL } from "../services/image/hidreamServices.js";
import { ideogramFAL } from "../services/image/ideogramServices.js";
import { incrementModelUsage } from "../utils/incrementModelUsage.js";
import { bagelFAL } from "../services/image/bagelService.js";
import { imageGenFAL } from "../services/image/imageGen4Service.js";

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
    model: "black-forest-labs-flux-1-1-pro",
    handler: wrapHandler(deepFluxProV1_1, "black-forest-labs-flux-1-1-pro"),
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
    model: "image-gen4",
    handler: wrapHandler(imageGenFAL, "image-gen4"),
    type: "fal",
    credits: 12,
  },
];
