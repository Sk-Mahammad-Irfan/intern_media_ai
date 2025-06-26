const chat = document.getElementById("chat");
const providerSelect = document.getElementById("providerSelect");
let selectedModels = [];
let imageModelOptions = {};
let imageModelCredits = {};
let modelsLoading = false;

// Loading State Management
function showLoading() {
  const loadingElement = document.getElementById("loadingOverlay");
  if (loadingElement) {
    loadingElement.style.display = "flex";
  }
}

function hideLoading() {
  const loadingElement = document.getElementById("loadingOverlay");
  if (loadingElement) {
    loadingElement.style.display = "none";
  }
}

function createLoadingOverlay() {
  const overlay = document.createElement("div");
  overlay.id = "loadingOverlay";
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0,0,0,0.5)";
  overlay.style.display = "none";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.zIndex = "9999";

  const spinner = document.createElement("div");
  spinner.className = "spinner-border text-primary";
  spinner.style.width = "3rem";
  spinner.style.height = "3rem";
  spinner.setAttribute("role", "status");

  const srOnly = document.createElement("span");
  srOnly.className = "visually-hidden";
  srOnly.textContent = "Loading...";

  spinner.appendChild(srOnly);
  overlay.appendChild(spinner);

  document.body.appendChild(overlay);
}

// Model Data Fetching
async function fetchImageModelOptions() {
  try {
    showLoading();
    modelsLoading = true;

    const response = await fetch("http://localhost:5000/api/model/image");
    if (!response.ok) {
      throw new Error("Failed to fetch model options");
    }
    const models = await response.json();

    const modelOptions = {};
    const modelCredits = {};

    models.forEach((model) => {
      modelOptions[model.modelId] = {
        providers: model.provider,
        custom_inputs: model.custom_inputs,
        aspect_ratios: model.aspect_ratios,
        provider_aspect_ratios: model.provider_aspect_ratios,
        credits: model.credits,
      };

      modelCredits[model.modelId] = model.credits[0] || 0;
    });

    imageModelOptions = modelOptions;
    imageModelCredits = modelCredits;
    return modelOptions;
  } catch (error) {
    console.error("Error fetching model options:", error);
    return {};
  } finally {
    modelsLoading = false;
    hideLoading();
  }
}

// UI Helper Functions
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

// Model Selection Management
async function populateModelCheckboxes() {
  const container = document.getElementById("modelCheckboxes");
  container.innerHTML = "";

  if (modelsLoading) {
    await new Promise((resolve) => {
      const check = setInterval(() => {
        if (!modelsLoading) {
          clearInterval(check);
          resolve();
        }
      }, 100);
    });
  }

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

// Custom Inputs and Settings
function displayCustomInputs(modelId, containerId) {
  const model = imageModelOptions[modelId];
  if (!model || !model.custom_inputs || model.custom_inputs.length === 0) {
    console.log("No custom inputs for this model/provider combination");
    return;
  }

  const container = document.getElementById(containerId);
  container.innerHTML = "";

  // Add a title for the custom inputs section
  const title = document.createElement("h6");
  title.className = "fw-bold text-secondary mt-3";
  title.textContent = "Model Parameters";
  container.appendChild(title);

  // Check if aspect ratio or image size is already in custom inputs
  const hasAspectRatio = model.custom_inputs.some(
    (input) =>
      input.id.toLowerCase().includes("aspectratio") ||
      input.id.toLowerCase().includes("aspect_ratio")
  );
  const hasImageSize = model.custom_inputs.some(
    (input) =>
      input.id.toLowerCase().includes("imagesize") ||
      input.id.toLowerCase().includes("size") ||
      input.id.toLowerCase().includes("resolution")
  );

  model.custom_inputs.forEach((input) => {
    // Skip if it's an aspect ratio or image size input (we'll handle these separately)
    if (
      input.id.toLowerCase().includes("aspectratio") ||
      input.id.toLowerCase().includes("aspect_ratio") ||
      input.id.toLowerCase().includes("imagesize") ||
      input.id.toLowerCase().includes("size") ||
      input.id.toLowerCase().includes("resolution")
    ) {
      return;
    }

    const formGroup = document.createElement("div");
    formGroup.className = "mb-3";

    const label = document.createElement("label");
    label.className = "form-label";
    label.htmlFor = input.id;
    label.textContent = input.label;

    let inputElement;

    switch (input.type) {
      case "select":
        inputElement = document.createElement("select");
        inputElement.className = "form-select";
        input.options.forEach((option) => {
          const opt = document.createElement("option");
          opt.value = option;
          opt.textContent = option;
          if (option === input.default) opt.selected = true;
          inputElement.appendChild(opt);
        });
        break;

      case "number":
        inputElement = document.createElement("input");
        inputElement.type = "number";
        inputElement.className = "form-control";
        inputElement.value = input.default || "";
        if (input.placeholder) inputElement.placeholder = input.placeholder;
        break;

      case "checkbox":
        formGroup.className = "form-check mb-3";
        inputElement = document.createElement("input");
        inputElement.type = "checkbox";
        inputElement.className = "form-check-input";
        inputElement.checked = input.default || false;
        label.className = "form-check-label";
        formGroup.appendChild(inputElement);
        formGroup.appendChild(label);
        container.appendChild(formGroup);
        break;

      default:
        inputElement = document.createElement("input");
        inputElement.type = "text";
        inputElement.className = "form-control";
        inputElement.value = input.default || "";
        if (input.placeholder) inputElement.placeholder = input.placeholder;
    }

    inputElement.id = input.id;
    inputElement.name = input.id;

    if (input.type !== "checkbox") {
      formGroup.appendChild(label);
      formGroup.appendChild(inputElement);
    }

    container.appendChild(formGroup);
  });

  // If aspect ratio or image size is in custom inputs, move them to output settings
  if (hasAspectRatio || hasImageSize) {
    const outputSettingsContainer = document.getElementById(
      "outputSettingsContainer"
    );
    outputSettingsContainer.style.display = "block";

    // Add a separator if there are already elements
    if (outputSettingsContainer.children.length > 0) {
      const hr = document.createElement("hr");
      outputSettingsContainer.appendChild(hr);
    }

    model.custom_inputs.forEach((input) => {
      if (
        input.id.toLowerCase().includes("aspectratio") ||
        input.id.toLowerCase().includes("aspect_ratio") ||
        input.id.toLowerCase().includes("imagesize") ||
        input.id.toLowerCase().includes("size") ||
        input.id.toLowerCase().includes("resolution")
      ) {
        const formGroup = document.createElement("div");
        formGroup.className = "mb-3";

        const label = document.createElement("label");
        label.className = "form-label";
        label.htmlFor = input.id;
        label.textContent = input.label;

        let inputElement;

        switch (input.type) {
          case "select":
            inputElement = document.createElement("select");
            inputElement.className = "form-select";
            input.options.forEach((option) => {
              const opt = document.createElement("option");
              opt.value = option;
              opt.textContent = option;
              if (option === input.default) opt.selected = true;
              inputElement.appendChild(opt);
            });
            break;

          case "number":
            inputElement = document.createElement("input");
            inputElement.type = "number";
            inputElement.className = "form-control";
            inputElement.value = input.default || "";
            if (input.placeholder) inputElement.placeholder = input.placeholder;
            break;

          default:
            inputElement = document.createElement("input");
            inputElement.type = "text";
            inputElement.className = "form-control";
            inputElement.value = input.default || "";
            if (input.placeholder) inputElement.placeholder = input.placeholder;
        }

        inputElement.id = input.id;
        inputElement.name = input.id;

        formGroup.appendChild(label);
        formGroup.appendChild(inputElement);
        outputSettingsContainer.appendChild(formGroup);
      }
    });
  }
}

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

  if (model.provider_aspect_ratios && model.provider_aspect_ratios[provider]) {
    ratios = model.provider_aspect_ratios[provider];
  } else {
    ratios = model.aspect_ratios || [];
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

  if (ratios.length > 0) {
    aspectRatioSelect.value = ratios[0];
  }
}

// Provider Selection Handling
function handleProviderChange() {
  const selectedProvider = providerSelect.value;
  const modelId = new URLSearchParams(window.location.search).get("id");
  const outputSettingsContainer = document.getElementById(
    "outputSettingsContainer"
  );
  const customInputsContainer = document.getElementById("inputsContainer");
  const seedInputAuto = document.getElementById("seedInputAuto");
  const aspectRatioSelect = document.getElementById("aspectRatioSelect");
  aspectRatioSelect.style.display = "none";
  // Clear aspect ratio options
  document.getElementById("aspectRatioSelect").innerHTML = "";

  // Show/hide seed input based on provider
  seedInputAuto.style.display = selectedProvider === "auto" ? "block" : "none";

  // Reset containers
  outputSettingsContainer.style.display = "none";
  customInputsContainer.style.display = "none";
  customInputsContainer.innerHTML = "";

  if (!modelId) return;

  // Handle display logic for each provider type
  if (selectedProvider === "auto") {
    outputSettingsContainer.style.display = "block";
    renderAspectRatioOptions(modelId);
  } else if (
    selectedProvider === "fal" ||
    selectedProvider === "replicate" ||
    selectedProvider === "deepinfra" ||
    selectedProvider === "together"
  ) {
    outputSettingsContainer.style.display = "block";
    customInputsContainer.style.display = "block";
    displayCustomInputs(modelId, "inputsContainer");
    renderAspectRatioOptions(modelId);
  }
}

// Chat Message Functions
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

function appendErrorMessage(message) {
  const errorDiv = document.createElement("div");
  errorDiv.className = "ai-message p-3 text-danger border border-danger mb-3";
  errorDiv.innerHTML = `
    <i class="bi bi-exclamation-triangle me-2"></i>${message}
  `;
  chat.appendChild(errorDiv);
  chat.scrollTop = chat.scrollHeight;
}

// Image Generation
async function generateImage() {
  if (!checkLogin()) {
    alert("You must be logged in to generate images.");
    window.location.href = "auth.html";
    return;
  }

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
      return generateSingleImage({
        modelId,
        prompt,
        userId,
        provider: "auto", // Always use auto provider in multi-model mode
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

    // Get the resolution from custom inputs if available
    const resolutionInput =
      document.getElementById("resolution") ||
      document.getElementById("size") ||
      document.getElementById("image_size");
    const resolution = resolutionInput ? resolutionInput.value : null;

    const seedInputAuto = document.getElementById("seedInputAuto");
    let seed = seedInputAuto ? seedInputAuto.value.trim() : "";

    // Always use the auto endpoint for multi-model mode
    if (isMultiModel || provider === "auto") {
      requestUrl = `${BACKEND_URL}/api/ai/generate-image/${backendModelId}`;
      const parsedSeed =
        seed !== "" && !isNaN(seed) ? parseInt(seed, 10) : 1234;
      if (aspectRatio) requestBody.resolution = aspectRatio;
      if (parsedSeed) requestBody.seed = parsedSeed;
    } else {
      const parsedSeed =
        seed !== "" && !isNaN(seed) ? parseInt(seed, 10) : 1234;

      if (parsedSeed) requestBody.seed = parsedSeed;
      requestUrl = `${BACKEND_URL}/api/provider/image/${backendModelId}`;
      requestBody.provider = provider;

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

        // Create display text for resolution info
        let resolutionInfo = "";
        if (aspectRatio && resolution) {
          resolutionInfo = `${aspectRatio} (${resolution})`;
        } else if (aspectRatio) {
          resolutionInfo = aspectRatio;
        } else if (resolution) {
          resolutionInfo = resolution;
        } else {
          resolutionInfo = "default";
        }

        messageDiv.innerHTML = `
          <div class="ai-message p-2">
            <div class="d-flex flex-column align-items-start">
              <div class="mb-2 text-muted small">
                <i class="bi bi-image-fill me-2"></i>Generated Image${modelLabel} (${resolutionInfo})
              </div>
              <div class="position-relative border rounded overflow-hidden" style="max-width: 512px;">
                <img src="${data.imageUrl}" alt="Generated Image" class="img-fluid" style="width: 100%; height: auto;" />
                <a href="${data.imageUrl}" target="_blank" class="btn btn-sm btn-light position-absolute top-0 end-0 m-2" title="Open in new tab">
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

// Utility Functions
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

// Initialization
async function initializePage() {
  const modelId = new URLSearchParams(window.location.search).get("id");

  // Load model options first
  await fetchImageModelOptions();

  if (modelId) {
    await populateImageModelOptions(modelId);

    // Set default provider to auto if available
    const modelConfig = imageModelOptions[modelId];
    if (modelConfig) {
      const availableProviders = modelConfig.providers;
      providerSelect.value = availableProviders.includes("auto")
        ? "auto"
        : availableProviders[0];
    }

    // Force initial render of inputs and aspect ratios
    handleProviderChange();
  }

  // Check for prompt in URL
  const prompt = new URLSearchParams(window.location.search).get("prompt");
  const input = document.getElementById("promptInput");
  if (prompt && input) {
    input.value = decodeURIComponent(prompt);
  }
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  createLoadingOverlay();
  // Remove any duplicate event listeners
  providerSelect.removeEventListener("change", handleProviderChange);
  // Add the unified handler
  providerSelect.addEventListener("change", handleProviderChange);
  initializePage();

  document
    .getElementById("applyOptionsBtn")
    .addEventListener("click", async () => {
      const modalElement = document.getElementById("modelOptionsModal");
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal.hide();

      document
        .querySelectorAll(".modal-backdrop")
        .forEach((backdrop) => backdrop.remove());
      document.body.classList.remove("modal-open");
      document.body.style = "";
    });
});

// Model Options Population
async function populateImageModelOptions(modelId) {
  await fetchImageModelOptions();

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
      option.textContent = provider.charAt(0).toUpperCase() + provider.slice(1);
      providerSelect.appendChild(option);
    });

    providerSelect.value = availableProviders.includes("auto")
      ? "auto"
      : availableProviders[0] || "";
  }
}

function toggleMultiModelMode() {
  const toggleElement = document.getElementById("multiModelModeToggle");
  const multiModelSection = document.getElementById(
    "multiModelSelectionContainer"
  );
  const singleModelSection = document.querySelector(".singleModelControls");

  if (!toggleElement || !multiModelSection || !singleModelSection) {
    console.error("One or more required elements are missing in the DOM.");
    return;
  }

  const isMultiModel = toggleElement.checked;

  multiModelSection.style.display = isMultiModel ? "block" : "none";
  singleModelSection.style.display = isMultiModel ? "none" : "flex";
}

async function initializeApp() {
  await initializePage();
  await populateModelCheckboxes();

  const toggle = document.getElementById("multiModelModeToggle");
  if (toggle) {
    toggle.addEventListener("change", toggleMultiModelMode);
    toggleMultiModelMode(); // Set initial state
  } else {
    console.error("Toggle checkbox not found.");
  }
}

document.addEventListener("DOMContentLoaded", initializeApp);
