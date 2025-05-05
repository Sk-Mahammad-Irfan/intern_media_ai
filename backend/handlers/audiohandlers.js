import { stableFal, stableReplicate } from "../services/audio/stableService.js";
import { cassetteFAL } from "../services/audio/cassetteServices.js";
import { diaTtsFAL } from "../services/audio/diaTtsServices.js";
import { multilingualTtsFAL } from "../services/audio/multilingualTtsServices.js";
import { americanEnglishFAL } from "../services/audio/americanEnglishServices.js";

export const audioGenerationHandlers = [
  {
    model: "stackadoc-stable-audio", // Matches your modelData key
    handler: stableReplicate,
    credits: 6,
  },
  {
    model: "stackadoc-stable-audio",
    handler: stableFal,
    credits: 8,
  },
  {
    model: "cassetteai-sfx-generator",
    handler: cassetteFAL,
    credits: 6,
  },
  {
    model: "dia-audio",
    handler: diaTtsFAL,
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
