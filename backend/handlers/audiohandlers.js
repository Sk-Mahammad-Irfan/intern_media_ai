import { stableFal, stableReplicate } from "../services/audio/stableService.js";
import { cassetteFAL } from "../services/audio/cassetteServices.js";
import { cassatteMusic } from "../services/audio/cassettemusic.js";
import { multilingualTtsFAL } from "../services/audio/multilingualTtsServices.js";
import { americanEnglishFAL } from "../services/audio/americanEnglishServices.js";
import { soundEffectsGeneratorFAL } from "../services/audio/soundEffectsGeneratorServices.js";
import { incrementModelUsage } from "../utils/incrementModelUsage.js";
import { KokoroServiceFAL } from "../services/audio/kokoroService.js";
import { lyria2Audio } from "../services/audio/lyria2Services.js";
import { evenlabAudio } from "../services/audio/evenlabService.js";
import { generateMMAudio } from "../services/audio/mmaudioServices.js";
import { generateSpeechTogether } from "../services/audio/cartesisonicService.js";
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
    model: "cartesia-sonic-2",
    handler: wrapHandler(generateSpeechTogether, "cartesia-sonic-2"),
    credits: 7,
    type: "together",
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
  {
    model: "fal-ai-kokoro-hindi",
    handler: wrapHandler(KokoroServiceFAL, "fal-ai-kokoro-hindi"),
    credits: 5,
    type: "fal",
  },
  {
    model: "fal-ai-lyria2",
    handler: wrapHandler(lyria2Audio, "fal-ai-lyria2"),
    credits: 5,
    type: "fal",
  },
  {
    model: "fal-ai-elevenlabs-sound-effects",
    handler: wrapHandler(evenlabAudio, "fal-ai-elevenlabs-sound-effects"),
    credits: 5,
    type: "fal",
  },
  {
    model: "fal-ai-mmaudio-v2-text-to-audio",
    handler: wrapHandler(generateMMAudio, "fal-ai-mmaudio-v2-text-to-audio"),
    credits: 5,
    type: "fal",
  },
];
