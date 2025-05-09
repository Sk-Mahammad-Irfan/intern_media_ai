import { stableFal, stableReplicate } from "../services/audio/stableService.js";
import { cassetteFAL } from "../services/audio/cassetteServices.js";
import { cassatteMusic } from "../services/audio/cassettemusic.js";
import { multilingualTtsFAL } from "../services/audio/multilingualTtsServices.js";
import { americanEnglishFAL } from "../services/audio/americanEnglishServices.js";
import { soundEffectsGeneratorFAL } from "../services/audio/soundEffectsGeneratorServices.js";

export const audioGenerationHandlers = [
  {
    model: "stackadoc-stable-audio", // Matches your modelData key
    handler: stableReplicate,
    credits: 6,
  },
  {
    model: "stackadoc-stable-audio",
    handler: stableFal,
    credits: 4,
  },
  {
    model: "cassetteai-sfx-generator",
    handler: cassetteFAL,
    credits: 6,
  },
  {
    model: "cassattemusic-audio",
    handler: cassatteMusic,
    credits: 3,
  },
  {
    model: "multilingual-audio",
    handler: multilingualTtsFAL,
    credits: 5,
  },
  {
    model: "american-audio",
    handler: americanEnglishFAL,
    credits: 4,
  },
];
