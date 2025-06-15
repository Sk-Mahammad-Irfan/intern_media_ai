const baseURL = "https://media-ai-backend.vercel.app";

const modelsinfo = {
  image: {
    "black-forest-labs-flux-1-1-pro": "Black Forest Labs: FLUX-1.1 Pro",
    "black-forest-labs-flux-schnell": "Black Forest Labs: FLUX.1 [schnell]",
    "black-forest-labs-flux-1-dev": "Black Forest Labs: FLUX.1 [dev]",
    "recraft-v3": "Recraft V3: Text-to-Image",
    fooocus: "Fooocus: Base Model",
    "hidream-i1-dev": "HiDream I1 (Dev)",
    "ideogram-v3": "Ideogram V3",
    bagel: "Bagel",
    "imagen4-preview": "Imagen 4 (Preview)",
    "f-lite-standard": "F Lite (Standard)",
    "sana-v1.5-4.8b": "Sana V1.5 (4.8B)",
    "minimax-image-01": "MiniMax Image-01",
    "black-forest-labs-flux-pro": "Black Forest Labs: FLUX.pro",
    "black-forest-labs-flux-kontext-pro": "Black Forest Labs: FLUX.kontext.pro",
    "black-forest-labs-flux-kontext-max": "Black Forest Labs: FLUX.kontext.max",
    "black-forest-labs-flux-1.1-pro-ultra": "Black Forest Labs: FLUX 1.1 Pro Ultra",
    "bytedance-sdxl-lightning-4step": "ByteDance: SDXL-Lightning (4-Step)",
    "stabilityai-sd3-5": "Stability AI: SD 3.5",
    "stabilityai-sd3-5-medium": "Stability AI: SD 3.5 Medium",
    "stabilityai-sdxl-turbo": "Stability AI: SDXL Turbo",
    "hidream-i1-full": "HiDream I1 Full",
    "hidream-i1-fast": "HiDream I1 Fast"
  },
  video: {
    "wan-ai-wan21-t2v-13b": "Wan-AI: Wan2.1-T2V-1.3B",
    "pixverse-v4": "PixVerse: Text-to-Video v4",
    "pixverse-v4.5": "PixVerse: Text-to-Video v4.5",
    "lightricks-ltx-video": "Lightricks: LTX-Video",
    "pika-text-to-video-v2-1": "Pika Text to Video v2.1",
    "luma-ray2-flash": "Luma Dream Machine: Ray 2 Flash",
    "cogvideox-5b": "CogVideoX-5B",
    "kling-video-v2-master": "Kling 2.0 Master",
    magi: "MAGI-1",
    "vidu-q1": "Vidu Q1",
    veo2: "Veo 2",
    "google-veo-3": "Google Veo 3",
    "minimax-video-01": "MiniMax Video 01",
    "hunyuan-video": "Hunyuan Video",
    "wan-ai-wan21-t2v-14b": "Wan-AI: Wan2.1-T2V-14B",
    "wavespeedai-wan21-t2v-720p": "WaveSpeedAI: Wan 2.1-T2V-720P",
    "wavespeedai-wan21-t2v-480p": "WaveSpeedAI: Wan 2.1-T2V-480P",
    "pika-text-to-video-v2-2": "Pika Text to Video v2.2",
  },
  audio: {
    "stackadoc-stable-audio": "Stable Audio Open 1.0",
    "cassattemusic-audio": "CassetteAI Music Generator",
    "multilingual-audio": "Multilingual TTS",
    "american-audio": "American English TTS",
    "cassetteai-sfx-generator": "Cassette Sound Effects Generator",
    "fal-ai-lyria2": "Lyria 2 by Google DeepMind",
    "fal-ai-kokoro-hindi": "Kokoro Hindi TTS",
    "fal-ai-elevenlabs-sound-effects": "ElevenLabs Sound Effects",
    "fal-ai-mmaudio-v2-text-to-audio": "MMAudio V2 Text-to-Audio",
    "cartesia-sonic-2": "Cartesia Sonic 2",
    "fal-ai-ace-step-lyrics-to-audio": "ACE-Step Lyrics-to-Audio",
    "fal-ai-ace-step-prompt-to-audio": "ACE-Step Prompt-to-Audio"
  },
};

const modelTypeSelect = document.getElementById("modelType");
const modelSelect = document.getElementById("modelSelect");
const modelUrl = document.getElementById("modelUrl");
const copyUrlBtn = document.getElementById("copyUrlBtn");

function populateModels(type) {
  modelSelect.innerHTML = "";
  const typeModels = modelsinfo[type];
  for (const id in typeModels) {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = typeModels[id];
    modelSelect.appendChild(option);
  }
  updateUrl(); // Ensure the URL updates on load
}

function updateUrl() {
  const type = modelTypeSelect.value;
  const modelId = modelSelect.value;
  modelUrl.textContent = `${baseURL}/api/reference/generate-${type}/${modelId}`;
}

function copyToClipboard() {
  const temp = document.createElement("textarea");
  temp.value = modelUrl.textContent;
  document.body.appendChild(temp);
  temp.select();
  document.execCommand("copy");
  document.body.removeChild(temp);
  copyUrlBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
  setTimeout(() => {
    copyUrlBtn.innerHTML = '<i class="fa-solid fa-copy"></i>';
  }, 1500);
}

// Event Listeners
modelTypeSelect.addEventListener("change", () =>
  populateModels(modelTypeSelect.value)
);
modelSelect.addEventListener("change", updateUrl);
copyUrlBtn.addEventListener("click", copyToClipboard);

// Init
populateModels("image");
