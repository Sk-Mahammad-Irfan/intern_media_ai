const chat = document.getElementById("chat");
const providerSelect = document.getElementById("providerSelect");

const imageModelOptions = {
  "ideogram-v3": {
    providers: ["auto", "fal"],
    aspect_ratios: {
      square_hd: null,
      square: null,
      portrait_4_3: null,
      portrait_16_9: null,
      landscape_4_3: null,
      landscape_16_9: null,
    },
    custom_inputs: [
      {
        id: "renderingSpeed",
        type: "select",
        label: "Rendering Speed",
        options: ["TURBO", "BALANCED", "QUALITY"],
        default: "BALANCED",
      },
      {
        id: "colorPalette",
        type: "text",
        label: "Color Palette Name",
        placeholder: "e.g. vibrant",
      },
      {
        id: "styleCodes",
        type: "text",
        label: "Style Codes (comma-separated)",
        placeholder: "e.g. abcd1234, efgh5678",
      },
      {
        id: "style",
        type: "select",
        label: "Style",
        options: ["AUTO", "GENERAL", "REALISTIC", "DESIGN"],
      },
      {
        id: "expandPrompt",
        type: "checkbox",
        label: "Use MagicPrompt (Expand Prompt)",
        default: true,
      },
      {
        id: "numImages",
        type: "number",
        label: "Number of Images",
        default: 1,
      },
      {
        id: "seedInput",
        type: "number",
        label: "Seed",
        placeholder: "e.g. 12345",
      },
      {
        id: "negativePromptInput",
        type: "text",
        label: "Negative Prompt",
        placeholder: "e.g. blurry, low quality",
      },
    ],
  },

  "hidream-i1-dev": {
    providers: ["auto", "fal"],
    aspect_ratios: {
      square_hd: null,
      square: null,
      portrait_4_3: null,
      portrait_16_9: null,
      landscape_4_3: null,
      landscape_16_9: null,
    },
    custom_inputs: [
      {
        id: "negativePromptInput",
        type: "text",
        label: "Negative Prompt",
        placeholder: "e.g. blurry, low quality",
      },
      {
        id: "numInferenceSteps",
        type: "number",
        label: "Inference Steps",
        default: 28,
      },
      {
        id: "seedInput",
        type: "number",
        label: "Seed",
        placeholder: "e.g. 42",
      },
      {
        id: "syncMode",
        type: "checkbox",
        label: "Sync Mode (Wait for response)",
        default: true,
      },
      {
        id: "numImages",
        type: "number",
        label: "Number of Images",
        default: 1,
      },
      {
        id: "enableSafetyInput",
        type: "checkbox",
        label: "Enable Safety Checker",
        default: true,
      },
      {
        id: "outputFormat",
        type: "select",
        label: "Output Format",
        options: ["jpeg", "png"],
        default: "jpeg",
      },
    ],
  },

  "recraft-v3": {
    providers: ["auto", "fal"],
    aspect_ratios: {
      square_hd: null,
      square: null,
      portrait_4_3: null,
      portrait_16_9: null,
      landscape_4_3: null,
      landscape_16_9: null,
    },
    custom_inputs: [
      {
        id: "style",
        type: "text",
        label: "Style",
        default: "realistic_image/studio_portrait",
        placeholder: "e.g. realistic_image/studio_portrait",
      },
      {
        id: "styleId",
        type: "text",
        label: "Style ID",
        default: "",
        placeholder: "Optional",
      },
      {
        id: "colors",
        type: "text",
        label: "Colors (comma-separated RGB)",
        placeholder: "e.g. 255,0,0; 0,255,0",
      },
      {
        id: "enableSafetyInput",
        type: "checkbox",
        label: "Enable Safety Checker",
        default: true,
      },
    ],
  },

  fooocus: {
    providers: ["auto", "fal"],
    aspect_ratios: ["1024x1024", "1280x720", "1920x1080"],
    custom_inputs: [
      {
        id: "negativePromptInput",
        type: "text",
        label: "Negative Prompt",
        placeholder: "e.g. blurry, bad anatomy",
      },
      {
        id: "styles",
        type: "text",
        label: "Styles (comma-separated)",
        placeholder: "e.g. Fooocus Enhance,Fooocus Sharp",
      },
      {
        id: "performance",
        type: "select",
        label: "Performance",
        options: ["Speed", "Quality", "Extreme Speed", "Lightning"],
        default: "Extreme Speed",
      },
      {
        id: "guidanceScale",
        type: "number",
        label: "Guidance Scale",
        default: 4.0,
      },
      {
        id: "sharpness",
        type: "number",
        label: "Sharpness",
        default: 2.0,
      },
      {
        id: "refinerModel",
        type: "select",
        label: "Refiner Model",
        options: ["None", "realisticVisionV60B1_v51VAE.safetensors"],
        default: "None",
      },
      {
        id: "refinerSwitch",
        type: "number",
        label: "Refiner Switch Point",
        default: 0.8,
      },
      {
        id: "outputFormat",
        type: "select",
        label: "Output Format",
        options: ["jpeg", "png", "webp"],
        default: "jpeg",
      },
      {
        id: "syncMode",
        type: "checkbox",
        label: "Sync Mode",
        default: true,
      },
      {
        id: "seedInput",
        type: "number",
        label: "Seed",
        placeholder: "e.g. 123456",
      },
      {
        id: "enableSafetyInput",
        type: "checkbox",
        label: "Enable Safety Checker",
        default: true,
      },
    ],
  },

  "black-forest-labs-flux-1-1-pro": {
    providers: ["auto", "fal"],
    aspect_ratios: {
      // Default aspect ratios (used when provider is 'auto')
      square_hd: null,
      square: null,
      portrait_4_3: null,
      portrait_16_9: null,
      landscape_4_3: null,
      landscape_16_9: null,
    },
    // Provider-specific aspect ratios
    provider_aspect_ratios: {
      fal: {
        square_hd: null,
        square: null,
        portrait_4_3: null,
        portrait_16_9: null,
        landscape_4_3: null,
        landscape_16_9: null,
      },
      deepinfra: [
        "1024x448",
        "1024x576",
        "1024x768",
        "1024x688",
        "1024x1024",
        "688x1024",
        "768x1024",
        "576x1024",
        "448x1024",
      ],
    },
    custom_inputs: [
      {
        id: "seedInput",
        type: "number",
        label: "Seed",
        placeholder: "e.g. 777888",
      },
      {
        id: "syncMode",
        type: "checkbox",
        label: "Sync Mode",
        default: true,
      },
      {
        id: "numImages",
        type: "number",
        label: "Number of Images",
        default: 1,
      },
      {
        id: "enableSafetyInput",
        type: "checkbox",
        label: "Enable Safety Checker",
        default: true,
      },
      {
        id: "safetyTolerance",
        type: "select",
        label: "Safety Tolerance",
        options: ["1", "2", "3", "4", "5", "6"],
        default: "2",
      },
      {
        id: "outputFormat",
        type: "select",
        label: "Output Format",
        options: ["jpeg", "png"],
        default: "jpeg",
      },
      {
        id: "rawMode",
        type: "checkbox",
        label: "Raw Image (less processed)",
        default: false,
      },
    ],
  },

  "black-forest-labs-flux-1-dev": {
    providers: ["auto", "together"],
    aspect_ratios: {
      // Default aspect ratios (used when provider is 'auto')
      square_hd: "1024x1024",
      square: "768x768",
      portrait_4_3: "768x1024",
      portrait_16_9: "576x1024",
      landscape_4_3: "1024x768",
      landscape_16_9: "1024x576",
    },
    // Provider-specific aspect ratios
    provider_aspect_ratios: {
      fal: {
        square_hd: "1024x1024",
        square: "768x768",
        portrait_4_3: "768x1024",
        portrait_16_9: "576x1024",
        landscape_4_3: "1024x768",
        landscape_16_9: "1024x576",
      },
      replicate: {
        "1:1": "1:1",
        "16:9": "16:9",
        "21:9": "21:9",
        "3:2": "3:2",
        "2:3": "2:3",
        "4:5": "4:5",
        "5:4": "5:4",
        "3:4": "3:4",
        "4:3": "4:3",
        "9:16": "9:16",
        "9:21": "9:21",
      },
      together: {
        "1:1": "1:1",
        "16:9": "16:9",
        "21:9": "21:9",
        "4:3": "4:3",
        "9:16": "9:16",
      },
    },
    // UI input schema
    custom_inputs: [
      {
        id: "prompt",
        type: "textarea",
        label: "Prompt",
        placeholder: "Describe the image you want to generate",
        required: true,
      },
      {
        id: "seedInput",
        type: "number",
        label: "Seed",
        placeholder: "e.g. 777888",
        description: "Random seed. Set for reproducible generation",
      },
      {
        id: "syncMode",
        type: "checkbox",
        label: "Sync Mode",
        default: true,
      },
      {
        id: "numImages",
        type: "number",
        label: "Number of Images",
        default: 1,
        min: 1,
        max: 4,
      },
      {
        id: "enableSafetyInput",
        type: "checkbox",
        label: "Enable Safety Checker",
        default: true,
      },
      {
        id: "safetyTolerance",
        type: "select",
        label: "Safety Tolerance",
        options: ["1", "2", "3", "4", "5", "6"],
        default: "2",
      },
      {
        id: "outputFormat",
        type: "select",
        label: "Output Format",
        options: ["webp", "jpg", "png"],
        default: "webp",
      },
      {
        id: "outputQuality",
        type: "number",
        label: "Output Quality",
        default: 80,
        min: 0,
        max: 100,
        description: "Only relevant for non-PNG outputs",
      },
      {
        id: "megapixels",
        type: "select",
        label: "Megapixels",
        options: ["1", "0.25"],
        default: "1",
      },
      {
        id: "numInferenceSteps",
        type: "number",
        label: "Number of Inference Steps",
        default: 4,
        min: 1,
        max: 4,
      },
      {
        id: "goFast",
        type: "checkbox",
        label: "Go Fast Mode",
        default: true,
      },
      {
        id: "rawMode",
        type: "checkbox",
        label: "Raw Image (less processed)",
        default: false,
      },
    ],
    // Add this configuration to control UI display
    ui_config: {
      always_show_output_settings: true, // Always show output settings container
      show_custom_inputs_for: ["fal", "replicate"], // Show custom inputs for these providers
      hide_custom_inputs_for: ["auto"], // Hide custom inputs for these providers
      default_provider: "auto", // Default selected provider
    },
  },
  "black-forest-labs-flux-schnell": {
    providers: ["auto", "fal", "replicate", "together"],
    aspect_ratios: {
      // Default aspect ratios (used when provider is 'auto')
      square_hd: "1024x1024",
      square: "768x768",
      portrait_4_3: "768x1024",
      portrait_16_9: "576x1024",
      landscape_4_3: "1024x768",
      landscape_16_9: "1024x576",
    },
    // Provider-specific aspect ratios
    provider_aspect_ratios: {
      fal: {
        square_hd: "1024x1024",
        square: "768x768",
        portrait_4_3: "768x1024",
        portrait_16_9: "576x1024",
        landscape_4_3: "1024x768",
        landscape_16_9: "1024x576",
      },
      replicate: {
        "1:1": "1:1",
        "16:9": "16:9",
        "21:9": "21:9",
        "3:2": "3:2",
        "2:3": "2:3",
        "4:5": "4:5",
        "5:4": "5:4",
        "3:4": "3:4",
        "4:3": "4:3",
        "9:16": "9:16",
        "9:21": "9:21",
      },
      together: {
        "1:1": "1:1",
        "16:9": "16:9",
        "21:9": "21:9",
        "4:3": "4:3",
        "9:16": "9:16",
      },
    },
    // UI input schema
    custom_inputs: [
      {
        id: "prompt",
        type: "textarea",
        label: "Prompt",
        placeholder: "Describe the image you want to generate",
        required: true,
      },
      {
        id: "seedInput",
        type: "number",
        label: "Seed",
        placeholder: "e.g. 777888",
        description: "Random seed. Set for reproducible generation",
      },
      {
        id: "syncMode",
        type: "checkbox",
        label: "Sync Mode",
        default: true,
      },
      {
        id: "numImages",
        type: "number",
        label: "Number of Images",
        default: 1,
        min: 1,
        max: 4,
      },
      {
        id: "enableSafetyInput",
        type: "checkbox",
        label: "Enable Safety Checker",
        default: true,
      },
      {
        id: "safetyTolerance",
        type: "select",
        label: "Safety Tolerance",
        options: ["1", "2", "3", "4", "5", "6"],
        default: "2",
      },
      {
        id: "outputFormat",
        type: "select",
        label: "Output Format",
        options: ["webp", "jpg", "png"],
        default: "webp",
      },
      {
        id: "outputQuality",
        type: "number",
        label: "Output Quality",
        default: 80,
        min: 0,
        max: 100,
        description: "Only relevant for non-PNG outputs",
      },
      {
        id: "megapixels",
        type: "select",
        label: "Megapixels",
        options: ["1", "0.25"],
        default: "1",
      },
      {
        id: "numInferenceSteps",
        type: "number",
        label: "Number of Inference Steps",
        default: 4,
        min: 1,
        max: 4,
      },
      {
        id: "goFast",
        type: "checkbox",
        label: "Go Fast Mode",
        default: true,
      },
      {
        id: "rawMode",
        type: "checkbox",
        label: "Raw Image (less processed)",
        default: false,
      },
    ],
    // Add this configuration to control UI display
    ui_config: {
      always_show_output_settings: true, // Always show output settings container
      show_custom_inputs_for: ["fal", "replicate"], // Show custom inputs for these providers
      hide_custom_inputs_for: ["auto"], // Hide custom inputs for these providers
      default_provider: "auto", // Default selected provider
    },
  },

  bagel: {
    providers: ["fal", "auto"],
    aspect_ratios: {
      square_hd: null,
      square: null,
      portrait_4_3: null,
      portrait_16_9: null,
      landscape_4_3: null,
      landscape_16_9: null,
    },
    provider_aspect_ratios: {
      fal: ["1024x1024"],
    },
    custom_inputs: [
      {
        id: "seedInput",
        type: "number",
        label: "Seed",
        placeholder: "e.g. 777888",
      },
    ],
  },
  "imagen4-preview": {
    providers: ["auto", "fal"],
    aspect_ratios: {
      "1: 1": null,
      " 16: 9": null,
      "9: 16": null,
      "3: 4": null,
      "4: 3": null,
    },
    provider_aspect_ratios: {
      fal: ["1024x1024"],
    },
    custom_inputs: [
      {
        id: "negativePromptInput",
        type: "text",
        label: "Negative Prompt",
        placeholder: "What to discourage in the generated images (optional)",
        default: "",
      },
      {
        id: "seedInput",
        type: "number",
        label: "Seed",
        placeholder: "e.g. 777888",
      },
    ],
  },
  "f-lite-standard": {
    providers: ["auto", "fal"],
    aspect_ratios: {
      square_hd: null,
      square: null,
      portrait_4_3: null,
      portrait_16_9: null,
      landscape_4_3: null,
      landscape_16_9: null,
    },
    provider_aspect_ratios: {
      fal: ["1024x1024"],
    },
    custom_inputs: [
      {
        id: "seedInput",
        type: "number",
        label: "Seed",
        placeholder: "e.g. 777888",
      },
      {
        id: "negative_prompt",
        type: "text",
        label: "Negative Prompt",
        placeholder: "What to avoid in the image",
      },
      {
        id: "num_inference_steps",
        type: "number",
        label: "Inference Steps",
        placeholder: "e.g. 28",
        default: 28,
      },
      {
        id: "guidance_scale",
        type: "number",
        label: "Guidance Scale",
        placeholder: "e.g. 3.5",
        default: 3.5,
      },
      {
        id: "sync_mode",
        type: "boolean",
        label: "Sync Mode",
        default: false,
      },
      {
        id: "num_images",
        type: "number",
        label: "Number of Images",
        placeholder: "e.g. 1",
        default: 1,
      },
      {
        id: "enable_safety_checker",
        type: "boolean",
        label: "Enable Safety Checker",
        default: true,
      },
    ],
  },
  "sana-v1.5-4.8b": {
    providers: ["auto", "fal"],
    aspect_ratios: {
      square_hd: null,
      square: null,
      portrait_4_3: null,
      portrait_16_9: null,
      landscape_4_3: null,
      landscape_16_9: null,
    },
    provider_aspect_ratios: {
      fal: ["1024x1024"],
    },
    custom_inputs: [
      {
        id: "seed",
        type: "number",
        label: "Seed",
        placeholder: "e.g. 777888",
      },
      {
        id: "negative_prompt",
        type: "text",
        label: "Negative Prompt",
        placeholder: "What to avoid in the image",
      },
      {
        id: "num_inference_steps",
        type: "number",
        label: "Inference Steps",
        placeholder: "e.g. 18",
        default: 18,
      },
      {
        id: "guidance_scale",
        type: "number",
        label: "Guidance Scale",
        placeholder: "e.g. 5",
        default: 5,
      },
      {
        id: "sync_mode",
        type: "boolean",
        label: "Sync Mode",
        default: false,
      },
      {
        id: "num_images",
        type: "number",
        label: "Number of Images",
        placeholder: "e.g. 1",
        default: 1,
      },
      {
        id: "enable_safety_checker",
        type: "boolean",
        label: "Enable Safety Checker",
        default: true,
      },
      {
        id: "output_format",
        type: "select",
        label: "Output Format",
        default: "jpeg",
        options: ["jpeg", "png"],
      },
      {
        id: "style_name",
        type: "select",
        label: "Style",
        default: "(No style)",
        options: [
          "(No style)",
          "Cinematic",
          "Photographic",
          "Anime",
          "Manga",
          "Digital Art",
          "Pixel art",
          "Fantasy art",
          "Neonpunk",
          "3D Model",
        ],
      },
    ],
  },
  "minimax-image-01": {
    providers: ["auto", "fal"],
    aspect_ratios: {
      "1:1": null,
      "16:9": null,
      "4:3": null,
      "3:2": null,
      "2:3": null,
      "3:4": null,
      "9:16": null,
      "21:9": null,
    },
    provider_aspect_ratios: {
      fal: ["1:1", "16:9", "4:3", "3:2", "2:3", "3:4", "9:16", "21:9"],
    },
    custom_inputs: [],
  },
};

const imageModelCredits = {
  "black-forest-labs-flux-1-1-pro": 5,
  "black-forest-labs-flux-schnell": 7,
  "black-forest-labs-flux-1-dev": 4,
  "recraft-v3": 4,
  fooocus: 3,
  "hidream-i1-dev": 4,
  "ideogram-v3": 7,
  bagel: 10,
  "imagen4-preview": 12,
  "f-lite-standard": 12,
  "sana-v1.5-4.8b": 12,
  "minimax-image-01": 12,
};

let selectedModels = [];
function prettifyModelName(modelId) {
  return modelId
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
function updateTotalCredits() {
  const creditAmountElement = document.getElementById("creditAmount");
  const creditDisplay = document.getElementById("creditDisplay");

  if (!creditAmountElement || !creditDisplay) return;

  let totalCredits = 0;

  selectedModels.forEach((model) => {
    totalCredits += imageModelCredits[model] || 0;
  });

  creditAmountElement.textContent = totalCredits;
  creditDisplay.style.display = selectedModels.length > 0 ? "block" : "none";
}
function populateModelCheckboxes() {
  const container = document.getElementById("modelCheckboxes");
  container.innerHTML = "";

  Object.keys(imageModelOptions).forEach((modelId) => {
    const col = document.createElement("div");
    col.className = "col";

    const card = document.createElement("div");
    card.className = "model-card";
    card.setAttribute("data-id", modelId);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = modelId;
    checkbox.id = `model-${modelId}`;
    checkbox.className = "hidden-checkbox";
    checkbox.addEventListener("change", updateSelectedModels);

    const label = document.createElement("label");
    label.className = "model-label";
    label.htmlFor = `model-${modelId}`;
    label.textContent = prettifyModelName(modelId);

    card.appendChild(checkbox);
    card.appendChild(label);
    card.addEventListener("click", () => {
      checkbox.checked = !checkbox.checked;
      card.classList.toggle("selected", checkbox.checked);
      updateSelectedModels();
    });

    col.appendChild(card);
    container.appendChild(col);
  });
}

function updateSelectedModels() {
  selectedModels = [];
  document
    .querySelectorAll('#modelCheckboxes input[type="checkbox"]:checked')
    .forEach((checkbox) => {
      selectedModels.push(checkbox.value);
    });

  updateTotalCredits();
}

document
  .getElementById("multiModelModeToggle")
  .addEventListener("change", toggleMultiModelMode);

function displayCustomInputs(modelId, containerId) {
  const model = imageModelOptions[modelId];
  if (!model || !model.custom_inputs) {
    console.error("Model not found or no custom inputs.");
    return;
  }

  const container = document.getElementById(containerId);
  container.innerHTML = ""; // Clear previous contents

  model.custom_inputs.forEach((input) => {
    const wrapper = document.createElement("div");
    wrapper.style.marginBottom = "15px";
    wrapper.style.fontFamily = "Arial, sans-serif";

    const label = document.createElement("label");
    label.htmlFor = input.id;
    label.textContent = input.label;
    label.style.display = "block";
    label.style.marginBottom = "5px";
    label.style.fontWeight = "bold";
    label.style.fontSize = "14px";
    wrapper.appendChild(label);

    let inputEl;

    switch (input.type) {
      case "select":
        inputEl = document.createElement("select");
        inputEl.style.padding = "8px";
        inputEl.style.border = "1px solid #ccc";
        inputEl.style.borderRadius = "4px";
        inputEl.style.width = "100%";
        inputEl.style.boxSizing = "border-box";
        input.options.forEach((option) => {
          const opt = document.createElement("option");
          opt.value = option;
          opt.textContent = option;
          if (option === input.default) opt.selected = true;
          inputEl.appendChild(opt);
        });
        break;

      case "text":
      case "number":
        inputEl = document.createElement("input");
        inputEl.type = input.type;
        inputEl.placeholder = input.placeholder || "";
        inputEl.style.padding = "8px";
        inputEl.style.border = "1px solid #ccc";
        inputEl.style.borderRadius = "4px";
        inputEl.style.width = "100%";
        inputEl.style.boxSizing = "border-box";
        if (input.type === "number" && input.default !== undefined) {
          inputEl.value = input.default;
        }
        break;

      case "checkbox":
        inputEl = document.createElement("input");
        inputEl.type = "checkbox";
        inputEl.checked = input.default || false;
        inputEl.style.marginRight = "10px";
        label.style.display = "inline-block";
        label.style.fontWeight = "normal";
        label.style.fontSize = "13px";
        label.style.marginBottom = "0";
        label.style.marginLeft = "5px";
        wrapper.innerHTML = ""; // For checkbox, reorder label/input
        wrapper.appendChild(inputEl);
        wrapper.appendChild(label);
        break;

      default:
        console.warn("Unknown input type:", input.type);
        return;
    }

    inputEl.id = input.id;
    inputEl.name = input.id;

    if (input.type !== "checkbox") {
      wrapper.appendChild(inputEl);
    }

    container.appendChild(wrapper);
  });
}

// Add event listeners for provider selection changes
providerSelect.addEventListener("change", () => {
  const selected = providerSelect.value;
  const modelId = new URLSearchParams(window.location.search).get("id");
  const outputSettingsContainer = document.getElementById(
    "outputSettingsContainer"
  );

  const customInputsContainer = document.getElementById("inputsContainer");
  customInputsContainer.innerHTML = "";

  // Always clear output settings
  outputSettingsContainer.style.display = "none";
  document.getElementById("aspectRatioSelect").innerHTML = "";

  // Handle provider logic
  if (selected === "auto") {
    renderAspectRatioOptions(modelId);
    outputSettingsContainer.style.display = "block";
    displayCustomInputs(modelId, "inputsContainer");
  } else if (
    selected === "fal" ||
    selected === "replicate" ||
    selected === "deepinfra" ||
    selected === "together"
  ) {
    displayCustomInputs(modelId, "inputsContainer");
    renderAspectRatioOptions(modelId);
    outputSettingsContainer.style.display = "block";
  } else {
    outputSettingsContainer.style.display = "none";
  }
});

function renderAspectRatioOptions(modelId) {
  const model = imageModelOptions[modelId];
  const aspectRatioSelect = document.getElementById("aspectRatioSelect");
  const provider = providerSelect.value;

  if (!model) {
    console.warn(`Model ${modelId} not found`);
    aspectRatioSelect.innerHTML =
      '<option value="" disabled selected>No aspect ratios available</option>';
    return;
  }

  aspectRatioSelect.innerHTML =
    '<option value="" disabled selected>Select Aspect Ratio</option>';

  let ratios = [];

  // Special handling for black-forest-labs-flux-1-1-pro
  if (modelId === "black-forest-labs-flux-1-1-pro") {
    if (provider === "fal" && model.provider_aspect_ratios?.fal) {
      ratios = Object.keys(model.provider_aspect_ratios.fal);
    } else if (
      provider === "deepinfra" &&
      model.provider_aspect_ratios?.deepinfra
    ) {
      ratios = model.provider_aspect_ratios.deepinfra;
    } else {
      // Default to standard aspect ratios for other cases
      ratios = Array.isArray(model.aspect_ratios)
        ? model.aspect_ratios
        : Object.keys(model.aspect_ratios);
    }
  } else {
    // Normal behavior for other models
    ratios = Array.isArray(model.aspect_ratios)
      ? model.aspect_ratios
      : Object.keys(model.aspect_ratios);
  }

  if (ratios.length === 0) {
    aspectRatioSelect.innerHTML =
      '<option value="" disabled selected>No aspect ratios available</option>';
    return;
  }

  ratios.forEach((ratio) => {
    const opt = document.createElement("option");
    opt.value = ratio;
    opt.textContent = ratio;
    aspectRatioSelect.appendChild(opt);
  });

  // Select the first option by default if available
  if (ratios.length > 0) {
    aspectRatioSelect.value = ratios[0];
  }
}

// Update the provider select change listener
providerSelect.addEventListener("change", () => {
  const selected = providerSelect.value;
  const modelId = new URLSearchParams(window.location.search).get("id");

  const outputSettingsContainer = document.getElementById(
    "outputSettingsContainer"
  );
  const customInputsContainer = document.getElementById("inputsContainer");

  // Clear aspect ratio
  document.getElementById("aspectRatioSelect").innerHTML = "";

  if (selected === "auto") {
    outputSettingsContainer.style.display = "block";
    customInputsContainer.style.display = "none";
    renderAspectRatioOptions(modelId);
  } else if (selected === "deepinfra") {
    outputSettingsContainer.style.display = "block";
    customInputsContainer.style.display = "none";
    renderAspectRatioOptions(modelId);
  } else if (selected === "fal") {
    outputSettingsContainer.style.display = "block";
    customInputsContainer.style.display = "block";
    displayCustomInputs(modelId, "inputsContainer");
    renderAspectRatioOptions(modelId);
  } else if (selected === "replicate" || selected === "together") {
    outputSettingsContainer.style.display = "block";
    customInputsContainer.style.display = "block";
    displayCustomInputs(modelId, "inputsContainer");
    renderAspectRatioOptions(modelId);
  } else {
    outputSettingsContainer.style.display = "none";
    customInputsContainer.style.display = "none";
  }
});

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed");

  const modelId = new URLSearchParams(window.location.search).get("id");

  if (modelId) {
    populateImageModelOptions(modelId);
    renderAspectRatioOptions(modelId);
  }

  // Force default provider to 'auto'
  providerSelect.value = "auto";

  const outputSettingsContainer = document.getElementById(
    "outputSettingsContainer"
  );
  const customInputsContainer = document.getElementById("inputsContainer");

  // Only show outputSettingsContainer when provider is 'auto'
  outputSettingsContainer.style.display = "block";
  customInputsContainer.style.display = "none";

  // Check if there's a prompt to auto-generate
  const params = new URLSearchParams(window.location.search);
  const prompt = params.get("prompt");
  const input = document.getElementById("promptInput");

  if (prompt && input) {
    input.value = decodeURIComponent(prompt);
    generateImage();
  }

  const selected = providerSelect.value;
  const falOptions = document.getElementById("falExtraOptions");
  const replicateOptions = document.getElementById("replicateExtraOptions");

  if (falOptions) displayCustomInputs(modelId, "inputsContainer");
  if (replicateOptions)
    replicateOptions.style.display =
      selected === "replicate" ? "block" : "none";

  // Room creation timestamp
  const roomCreatedAt = params.get("room");
  if (roomCreatedAt) {
    const date = new Date(roomCreatedAt);
    const formatted = date.toLocaleString(undefined, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    document.getElementById("roomTitle").textContent = "Room created";
    document.getElementById("roomTimestamp").textContent = formatted;
  }

  // Add click listeners for "new room" buttons
  ["newRoomBtnSidebar", "newRoomBtnMobile"].forEach((id) => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener("click", () => {
        const createdAt = new Date().toISOString();
        const url = `${window.location.origin}${
          window.location.pathname
        }?room=${encodeURIComponent(createdAt)}`;
        window.open(url, "_blank");
      });
    }
  });

  providerSelect.addEventListener("change", () => {
    const selected = providerSelect.value;
    const modelId = new URLSearchParams(window.location.search).get("id");

    const outputSettingsContainer = document.getElementById(
      "outputSettingsContainer"
    );
    const customInputsContainer = document.getElementById("inputsContainer");
    const seedInputAuto = document.getElementById("seedInputAuto");
    seedInputAuto.style.display =
      selected === "replicate" || "fal" || "together" ? "none" : "block";

    seedInputAuto.style.display = selected === "auto" ? "block" : "none";

    // Clear aspect ratio
    document.getElementById("aspectRatioSelect").innerHTML = "";

    if (selected === "auto") {
      outputSettingsContainer.style.display = "block";
      customInputsContainer.style.display = "none";
      renderAspectRatioOptions(modelId);
    } else if (selected === "deepinfra") {
      outputSettingsContainer.style.display = "block";
      customInputsContainer.style.display = "none";
      renderAspectRatioOptions(modelId);
    } else if (selected === "fal") {
      outputSettingsContainer.style.display = "block";
      customInputsContainer.style.display = "block";
      displayCustomInputs(modelId, "inputsContainer");
      renderAspectRatioOptions(modelId);
    } else if (selected === "replicate" || selected === "together") {
      outputSettingsContainer.style.display = "block";
      customInputsContainer.style.display = "block";
      displayCustomInputs(modelId, "inputsContainer");
      renderAspectRatioOptions(modelId);
    } else {
      outputSettingsContainer.style.display = "none";
      customInputsContainer.style.display = "none";
    }
  });
});

function appendUserMessage(prompt) {
  const userWrapper = document.createElement("div");
  userWrapper.className =
    "d-flex flex-column align-items-end mb-3 position-relative";
  userWrapper.innerHTML = `             
    <div class="bg-primary text-white p-3 rounded" style="max-width: 80%; border-radius: 1rem;">
      ${prompt}             
    </div>             
    <i class="bi bi-clipboard-fill text-secondary mt-1" style="cursor: pointer; font-size: 14px;" onclick="copyToClipboard(this)" title="Copy"></i>
  `;
  chat.appendChild(userWrapper);
}

function appendGeneratingMessage() {
  const aiDiv = document.createElement("div");
  aiDiv.className = "d-flex justify-content-start mb-3";

  // Unique ID based on timestamp
  const genId = "generating-msg-" + Date.now();

  aiDiv.innerHTML = `
    <div class="ai-message p-3" id="${genId}">             
      <i class="bi bi-image-fill me-2"></i>Generating image&nbsp;
      <div class="spinner-border spinner-border-sm text-secondary me-2" role="status"></div>           
    </div>`;

  chat.appendChild(aiDiv);
  chat.scrollTop = chat.scrollHeight;

  return genId;
}

function replaceWithErrorMessage(msg, genMsgId = null) {
  const genMsg = genMsgId ? document.getElementById(genMsgId) : null;
  const html = `<i class="bi bi-exclamation-triangle-fill text-danger me-2"></i><span class="text-danger fw-semibold">${msg}</span>`;

  if (genMsg) {
    genMsg.innerHTML = html;
  } else {
    const fallbackError = document.createElement("div");
    fallbackError.className = "text-danger my-3";
    fallbackError.innerHTML = html;
    chat.appendChild(fallbackError);
    chat.scrollTop = chat.scrollHeight;
  }
}

function populateImageModelOptions(modelId) {
  const config = imageModelOptions[modelId];
  if (!config) return;

  const ignoredProviders =
    JSON.parse(localStorage.getItem("ignoredProviders")) || [];

  if (providerSelect) {
    providerSelect.innerHTML = "";

    const availableProviders = config.providers.filter(
      (provider) => !ignoredProviders.includes(provider)
    );

    availableProviders.forEach((provider) => {
      const option = document.createElement("option");
      option.value = provider;
      option.textContent =
        provider === "auto"
          ? "Auto (default)"
          : provider.charAt(0).toUpperCase() + provider.slice(1);
      providerSelect.appendChild(option);
    });

    providerSelect.value = availableProviders.includes("auto")
      ? "auto"
      : availableProviders[0] || "";
  }

  // Populate resolution select if needed (left as-is)
}

function appendErrorMessage(message) {
  const errorDiv = document.createElement("div");
  errorDiv.className = "ai-message p-3 text-danger border border-danger mb-3";
  errorDiv.innerHTML = `
    <i class="bi bi-exclamation-triangle me-2"></i>${message}
  `;
  chat.appendChild(errorDiv);
  chat.scrollTop = chat.scrollHeight;
}

async function generateImage() {
  const promptInput = document.getElementById("promptInput");
  const prompt = promptInput.value.trim();
  const isMultiModel = document.getElementById("multiModelModeToggle").checked;
  const userId = localStorage.getItem("userId") || "guest";

  if (!prompt) {
    alert("Please enter a prompt.");
    return;
  }

  if (isMultiModel && selectedModels.length === 0) {
    return alert("Please select at least one model in multi-model mode.");
  }

  appendUserMessage(prompt);
  promptInput.value = "";

  const ignoredProviders =
    JSON.parse(localStorage.getItem("ignoredProviders")) || [];

  if (isMultiModel) {
    const tasks = selectedModels.map((modelId) => {
      const availableProviders = imageModelOptions[modelId].providers
        .filter((provider) => !ignoredProviders.includes(provider))
        .filter((provider) => provider !== "auto");

      if (availableProviders.length === 0) {
        appendErrorMessage(`No available providers for model "${modelId}"`);
        return Promise.resolve();
      }

      const provider = availableProviders.includes("auto")
        ? "auto"
        : availableProviders[0];

      return generateSingleImage({
        modelId,
        prompt,
        userId,
        provider,
        isMultiModel: true,
      });
    });

    tasks.forEach((p) =>
      p?.catch((err) => {
        console.error("Multi-model error:", err);
        appendErrorMessage(`Error from a model: ${err.message || err}`);
      })
    );
    return;
  }

  const modelId =
    new URLSearchParams(window.location.search).get("id") || "default";
  const availableProviders = imageModelOptions[modelId].providers
    .filter((provider) => !ignoredProviders.includes(provider))
    .filter((provider) => provider !== "auto");

  if (availableProviders.length === 0) {
    appendErrorMessage(
      `No available providers for model "${modelId}". Cannot generate image.`
    );
    return;
  }

  const provider =
    document.getElementById("providerSelect")?.value || availableProviders[0];

  await generateSingleImage({
    modelId,
    prompt,
    userId,
    provider,
    isMultiModel: false,
  });
}

async function generateSingleImage({
  modelId,
  prompt,
  userId,
  provider = "auto",
  isMultiModel,
}) {
  // Create a unique message container for this model
  const messageId = `generating-image-${modelId}-${Date.now()}`;
  const aiDiv = document.createElement("div");
  aiDiv.id = messageId;
  aiDiv.className = "d-flex justify-content-start mb-3 generating-image";
  aiDiv.innerHTML = `
    <div class="ai-message p-3 text-muted d-flex align-items-center">
      <i class="bi bi-image-fill me-2"></i>
      Generating image (${modelId})&nbsp;
      <div class="spinner-border spinner-border-sm text-secondary me-2" role="status"></div>
    </div>`;
  chat.appendChild(aiDiv);
  chat.scrollTop = chat.scrollHeight;

  const backendModelId = modelId;
  const modelConfig = imageModelOptions[modelId];

  if (!backendModelId || !modelConfig) {
    const errorDiv = document.getElementById(messageId);
    if (errorDiv) {
      errorDiv.innerHTML = `
        <div class="ai-message p-3 text-danger border border-danger">
          <i class="bi bi-exclamation-triangle me-2"></i>Unsupported model ID (${modelId})
        </div>`;
    }
    return;
  }

  try {
    let requestUrl = "";
    let requestBody = {
      prompt,
      userId,
    };

    const aspectRatioSelect = document.getElementById("aspectRatioSelect");
    const aspectRatio = aspectRatioSelect?.value || null;

    const seedInputAuto = document.getElementById("seedInputAuto");
    let seed = seedInputAuto ? seedInputAuto.value.trim() : "";

    if (provider === "auto") {
      requestUrl = `${BACKEND_URL}/api/ai/generate-image/${backendModelId}`;
      const parsedSeed =
        seed !== "" && !isNaN(seed) ? parseInt(seed, 10) : undefined;
      if (aspectRatio) requestBody.resolution = aspectRatio;
      if (parsedSeed) requestBody.seed = parsedSeed;
    } else {
      requestUrl = `${BACKEND_URL}/api/provider/image/${backendModelId}`;
      requestBody.provider = provider;

      if (aspectRatio) requestBody.resolution = aspectRatio;

      modelConfig.custom_inputs?.forEach((inputConfig) => {
        const { id, type } = inputConfig;
        const el = document.getElementById(id);
        if (!el) return;

        let value;
        switch (type) {
          case "checkbox":
            value = el.checked;
            break;
          case "number":
            value = el.value === "" ? undefined : Number(el.value);
            break;
          default:
            value = el.value;
        }

        if (value !== undefined && value !== "") {
          requestBody[id] = value;
        }
      });
    }

    const res = await fetch(requestUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const data = await res.json();

    if (res.status === 402) {
      const errorDiv = document.getElementById(messageId);
      if (errorDiv) {
        errorDiv.innerHTML = `
          <div class="ai-message p-3 text-danger border border-danger">
            <i class="bi bi-exclamation-triangle me-2"></i>Insufficient credits (${modelId})
          </div>`;
      }
      return;
    }

    if (!res.ok) {
      const errorDiv = document.getElementById(messageId);
      if (errorDiv) {
        errorDiv.innerHTML = `
          <div class="ai-message p-3 text-danger border border-danger">
            <i class="bi bi-exclamation-triangle me-2"></i>Server error (${modelId}): ${
          data.error || "Unknown error"
        }
          </div>`;
      }
      return;
    }

    if (data.imageUrl) {
      const messageDiv = document.getElementById(messageId);
      if (messageDiv) {
        const modelLabel = isMultiModel ? ` (${modelId})` : "";

        messageDiv.innerHTML = `
          <div class="ai-message p-2">
            <div class="d-flex flex-column align-items-start">
              <div class="mb-2 text-muted small">
                <i class="bi bi-image-fill me-2"></i>Generated Image${modelLabel} (${
          aspectRatio || "default"
        })
              </div>
              <div class="position-relative border rounded overflow-hidden" style="max-width: 512px;">
                <img src="${
                  data.imageUrl
                }" alt="Generated Image" class="img-fluid" style="width: 100%; height: auto;" />
                <a href="${
                  data.imageUrl
                }" target="_blank" class="btn btn-sm btn-light position-absolute top-0 end-0 m-2" title="Open in new tab">
                  <i class="bi bi-box-arrow-up-right"></i>
                </a>
              </div>
            </div>
          </div>`;
      }
    } else {
      const errorDiv = document.getElementById(messageId);
      if (errorDiv) {
        errorDiv.innerHTML = `
          <div class="ai-message p-3 text-danger border border-danger">
            <i class="bi bi-exclamation-triangle me-2"></i>No image URL returned (${modelId})
          </div>`;
      }
    }
  } catch (err) {
    console.error("Network or server error:", err);
    const errorDiv = document.getElementById(messageId);
    if (errorDiv) {
      errorDiv.innerHTML = `
        <div class="ai-message p-3 text-danger border border-danger">
          <i class="bi bi-exclamation-triangle me-2"></i>Image generation failed (${modelId}). Please try again.
        </div>`;
    }
  }
}

function copyToClipboard(icon) {
  const messageText = icon.previousElementSibling.innerText.trim();
  navigator.clipboard
    .writeText(messageText)
    .then(() => {
      icon.classList.replace("bi-clipboard-fill", "bi-clipboard-check-fill");
      setTimeout(() => {
        icon.classList.replace("bi-clipboard-check-fill", "bi-clipboard-fill");
      }, 1500);
    })
    .catch((err) => {
      console.error("Copy failed:", err);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const modelId = new URLSearchParams(window.location.search).get("id");

  document.getElementById("multiModelModeToggle").checked = false;

  providerSelect.value = "auto";

  if (modelId) {
    populateImageModelOptions(modelId); // sets "auto" as default
    displayCustomInputs(modelId, "inputsContainer");

    const selected = providerSelect.value;
    if (
      selected === "auto" ||
      selected === "fal" ||
      selected === "replicate" ||
      selected === "together"
    ) {
      renderAspectRatioOptions(modelId);
      document.getElementById("outputSettingsContainer").style.display =
        "block";
    }
    if (selected === "auto")
      document.getElementById("inputsContainer").style.display = "none";
  }
  populateModelCheckboxes();
});

document
  .getElementById("applyOptionsBtn")
  .addEventListener("click", async () => {
    const modalElement = document.getElementById("modelOptionsModal");
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();

    // Manually remove backdrop just in case
    document
      .querySelectorAll(".modal-backdrop")
      .forEach((backdrop) => backdrop.remove());
    document.body.classList.remove("modal-open");
    document.body.style = ""; // clear
  });
