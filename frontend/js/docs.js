const baseURL = "https://media-ai-backend.vercel.app";

const modelsinfo = {
  image: {
    "black-forest-labs-flux-1-1-pro": "Black Forest Labs: FLUX-1.1 Pro",
    "recraft-v3": "Recraft V3: Text-to-Image",
    fooocus: "Fooocus: Base Model",
    "hidream-i1-dev": "HiDream I1 (Dev)",
    "ideogram-v3": "Ideogram V3",
  },
  video: {
    "wan-ai-wan21-t2v-13b": "Wan-AI: Wan2.1-T2V-1.3B",
    "lightricks-ltx-video": "Lightricks: LTX-Video",
    "pixverse-v4-text-to-video": "PixVerse: Text-to-Video v4",
    "pika-text-to-video-v2-1": "Pika Text to Video v2.1",
    "luma-ray2-flash": "Luma Dream Machine: Ray 2 Flash",
  },
  audio: {
    "stackadoc-stable-audio": "Stable Audio Open 1.0",
    "cassattemusic-audio": "CassetteAI Music Generator",
    "multilingual-audio": "Multilingual TTS",
    "american-audio": "American English TTS",
    "cassetteai-sfx-generator": "CassetteAI SFX Generator",
  },
};

const modelTypeSelect = document.getElementById("modelType");
const modelSelect = document.getElementById("modelSelect");
const modelUrl = document.getElementById("modelUrl");

// Populate model dropdown based on type
function populateModels(type) {
  modelSelect.innerHTML = "";
  const typeModels = modelsinfo[type];
  for (const id in typeModels) {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = typeModels[id];
    modelSelect.appendChild(option);
  }
  updateUrl(); // Show initial URL after population
}

// Update the generated URL
function updateUrl() {
  const type = modelTypeSelect.value;
  const modelId = modelSelect.value;
  modelUrl.textContent = `${baseURL}/api/reference/generate-${type}/${modelId}`;
}

// Initialize
modelTypeSelect.addEventListener("change", () =>
  populateModels(modelTypeSelect.value)
);
modelSelect.addEventListener("change", updateUrl);

// Load initial values
populateModels("image");
