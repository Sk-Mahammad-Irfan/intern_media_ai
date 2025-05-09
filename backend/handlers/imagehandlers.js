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

export const imageGenerationHandlers = [
  {
    model: "black-forest-labs-flux-1-1-pro",
    handler: falFluxProV1_1,
    type: "fal",
    credits: 5,
  },
  {
    model: "black-forest-labs-flux-1-1-pro",
    handler: deepFluxProV1_1,
    type: "base64",
    credits: 7,
  },
  {
    model: "recraft-v3",
    handler: falRecraftV3,
    type: "fal",
    credits: 4,
  },
  {
    model: "fooocus",
    handler: falFooocus,
    type: "fal",
    credits: 3,
  },
  {
    model: "hidream-i1-dev",
    handler: hidreamFAL,
    type: "fal",
    credits: 6,
  },
  {
    model: "ideogram-v3",
    handler: ideogramFAL,
    type: "fal",
    credits: 7,
  },
];
