import { stableFal, stableReplicate } from "../services/audio/stableService.js";
import { cassetteFAL } from "../services/audio/cassetteServices.js";
import { cassatteMusic } from "../services/audio/cassettemusic.js";
import { multilingualTtsFAL } from "../services/audio/multilingualTtsServices.js";
import { americanEnglishFAL } from "../services/audio/americanEnglishServices.js";
import { soundEffectsGeneratorFAL } from "../services/audio/soundEffectsGeneratorServices.js";
import { incrementModelUsage } from "../utils/incrementModelUsage.js";
// import { incrementModelUsage } from "../utils/incrementModelUsage.js";

const wrapHandler = (handler, model) => {
  return async (...args) => {
    await incrementModelUsage(model);
    return handler(...args);
  };
};

export const audioGenerationHandlers = [
  {
    model: "stackadoc-stable-audio", // Matches your modelData key
    handler: wrapHandler(stableReplicate, "stackadoc-stable-audio"),
    credits: 1,
    type: "replicate",
  },
  {
    model: "stackadoc-stable-audio",
    handler: wrapHandler(stableFal, "stackadoc-stable-audio"),
    credits: 2,
    type: "fal",
  },
  {
    model: "cassetteai-sfx-generator",
    handler: wrapHandler(cassetteFAL, "cassetteai-sfx-generator"),
    credits: 1,
    type: "fal",
  },
  {
    model: "cassattemusic-audio",
    handler: wrapHandler(cassatteMusic, "cassattemusic-audio"),
    credits: 2,
    type: "fal",
  },
  {
    model: "multilingual-audio",
    handler: wrapHandler(multilingualTtsFAL, "multilingual-audio"),
    credits: 9,
    type: "fal",
  },
  {
    model: "american-audio",
    handler: wrapHandler(americanEnglishFAL, "american-audio"),
    credits: 2,
    type: "fal",
  },
];
