const baseURL = "https://media-ai-backend.vercel.app";

let modelsinfo = {
  image: {},
  video: {},
  audio: {},
};

const modelTypeSelect = document.getElementById("modelType");
const modelSelect = document.getElementById("modelSelect");
const modelUrl = document.getElementById("modelUrl");
const copyUrlBtn = document.getElementById("copyUrlBtn");

async function fetchModels() {
  try {
    const cached = localStorage.getItem("models");
    let modelsArray = [];

    if (cached && cached !== "undefined") {
      modelsArray = JSON.parse(cached);
      console.log("📦 Loaded models from localStorage.");
    } else {
      const response = await fetch(`${BACKEND_URL}/api/model`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      modelsArray = await response.json();
      localStorage.setItem("models", JSON.stringify(modelsArray));
      console.log("🌐 Fetched models from backend and cached.");
    }

    // Transform the array into the required structure
    modelsinfo = {
      image: {},
      video: {},
      audio: {},
    };

    modelsArray.forEach((model) => {
      if (model.isActive) {
        const type = model.assetType.toLowerCase();
        if (modelsinfo[type]) {
          modelsinfo[type][model.modelId] = model.name;
        }
      }
    });

    populateModels("image"); // Default to image models
  } catch (error) {
    console.error("Error fetching models:", error);
    modelSelect.innerHTML = '<option value="">Failed to load models</option>';
  }
}

function populateModels(type) {
  modelSelect.innerHTML = "";

  const typeModels = modelsinfo[type] || {};

  if (Object.keys(typeModels).length === 0) {
    modelSelect.innerHTML =
      '<option value="">No models available for this type</option>';
    return;
  }

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select a Model";
  defaultOption.selected = true;
  defaultOption.disabled = true;
  modelSelect.appendChild(defaultOption);

  for (const id in typeModels) {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = typeModels[id];
    modelSelect.appendChild(option);
  }

  updateUrl();
}

function updateUrl() {
  const type = modelTypeSelect.value;
  const modelId = modelSelect.value;
  if (modelId) {
    modelUrl.textContent = `${baseURL}/api/reference/generate-${type}/${modelId}`;
  } else {
    modelUrl.textContent = "Select a model to generate URL";
  }
}

function copyToClipboard() {
  if (modelSelect.value) {
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
}

// Event Listeners
modelTypeSelect.addEventListener("change", () => {
  populateModels(modelTypeSelect.value);
});
modelSelect.addEventListener("change", updateUrl);
copyUrlBtn.addEventListener("click", copyToClipboard);

// Initialize
fetchModels();
