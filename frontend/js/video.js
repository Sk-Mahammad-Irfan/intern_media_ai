let selectedModels = [];
let modelOptions = {};
let videoModelCredits = {};

// Fetch model options from backend
async function fetchModelOptions() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/model/video`);
    const models = await response.json();

    // Transform the backend data into the format expected by the frontend
    models.forEach((model) => {
      modelOptions[model.modelId] = {
        name: model.name,
        providers: model.provider,
        resolutions: model.resolutions.reduce((acc, res) => {
          acc[res] = true;
          return acc;
        }, {}),
        aspect_ratios: model.aspect_ratios,
        provider_aspect_ratios: model.provider_aspect_ratios || {},
        custom_inputs: model.custom_inputs || [],
      };

      // Create credits mapping (assuming credits array matches provider order)
      model.provider.forEach((provider, index) => {
        videoModelCredits[`${model.modelId}-${provider}`] =
          model.credits[index] || 0;
      });
    });

    return modelOptions;
  } catch (error) {
    console.error("Failed to fetch model options:", error);
    return {};
  }
}

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
    const config = modelOptions[model];
    if (config) {
      config.providers.forEach((provider) => {
        totalCredits += videoModelCredits[`${model}-${provider}`] || 0;
      });
    }
  });

  creditAmountElement.textContent = totalCredits;
  creditDisplay.style.display = selectedModels.length > 0 ? "block" : "none";
}

async function populateModelCheckboxes() {
  const container = document.getElementById("modelCheckboxes");
  if (!container) return;

  container.innerHTML = "";

  // Ensure model options are loaded
  if (Object.keys(modelOptions).length === 0) {
    await fetchModelOptions();
  }

  Object.keys(modelOptions).forEach((modelId) => {
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
    label.textContent =
      modelOptions[modelId].name || prettifyModelName(modelId);

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

function getSelectedValue(select) {
  return select?.value || null;
}

function appendUserMessage(prompt) {
  const chat = document.getElementById("chat");
  if (!chat) return;

  const wrapper = document.createElement("div");
  wrapper.className =
    "d-flex flex-column align-items-end mb-3 position-relative";
  wrapper.innerHTML = `
    <div class="user-message p-3">${prompt}</div>
    <i class="bi bi-clipboard-fill text-secondary mt-1" style="cursor: pointer; font-size: 14px;" onclick="copyToClipboard(this)" title="Copy"></i>
  `;
  chat.appendChild(wrapper);
  chat.scrollTop = chat.scrollHeight;
}

function appendGeneratingVideoMessage() {
  const chat = document.getElementById("chat");
  if (!chat) return;

  const aiDiv = document.createElement("div");
  aiDiv.className = "d-flex justify-content-start mb-3 generating-video";
  aiDiv.innerHTML = `
    <div class="ai-message p-3 text-muted d-flex align-items-center">
      <i class="bi bi-camera-reels me-2"></i>
      Generating video&nbsp;
      <div class="spinner-border spinner-border-sm text-secondary me-2" role="status"></div>
    </div>`;
  chat.appendChild(aiDiv);
  chat.scrollTop = chat.scrollHeight;
}

function appendErrorMessage(message) {
  const chat = document.getElementById("chat");
  if (!chat) return;

  const errorDiv = document.createElement("div");
  errorDiv.className = "d-flex justify-content-start mb-3";
  errorDiv.innerHTML = `
    <div class="ai-message p-3 text-danger border border-danger">
      <i class="bi bi-exclamation-triangle me-2"></i>${message}
    </div>`;
  chat.appendChild(errorDiv);
  chat.scrollTop = chat.scrollHeight;
}

function appendGeneratedVideo(videoUrl) {
  const chat = document.getElementById("chat");
  if (!chat) return;

  const loadingMessage = document.querySelector(".generating-video");
  if (loadingMessage) loadingMessage.remove();

  const resolution = getSelectedValue(resolutionSelect) || "480p";
  const aspect_ratio = getSelectedValue(aspectRatioSelect) || "16:9";

  const message = document.createElement("div");
  message.className = "d-flex justify-content-start mb-3";

  const bubble = document.createElement("div");
  bubble.className = "ai-message p-3";

  const caption = document.createElement("div");
  caption.textContent = "Generated Video:";
  caption.classList.add("mb-2");

  const meta = document.createElement("div");
  meta.className = "text-muted mb-2";
  meta.style.fontSize = "0.9em";
  meta.textContent = `Resolution: ${resolution}, Aspect Ratio: ${aspect_ratio}`;

  const wrapper = document.createElement("div");
  wrapper.className = "video-wrapper rounded shadow";
  wrapper.style.maxWidth = "500px";
  wrapper.style.width = "100%";
  wrapper.style.overflow = "hidden";
  wrapper.style.backgroundColor = "#000";

  const video = document.createElement("video");
  video.controls = true;
  video.src = videoUrl;
  video.style.width = "100%";
  video.style.height = "100%";
  video.style.objectFit = "contain";
  video.onloadedmetadata = () => {
    wrapper.style.aspectRatio = `${video.videoWidth} / ${video.videoHeight}`;
  };

  wrapper.appendChild(video);
  bubble.appendChild(caption);
  bubble.appendChild(meta);
  bubble.appendChild(wrapper);
  message.appendChild(bubble);
  chat.appendChild(message);
  chat.scrollTop = chat.scrollHeight;
}

async function generateVideo() {
  if (!checkLogin()) {
    alert("You must be logged in to generate video.");
    window.location.href = "auth.html";
    return;
  }

  const prompt = document.getElementById("promptInput")?.value.trim();
  const isMultiModel = document.getElementById("multiModelModeToggle")?.checked;
  const userId = localStorage.getItem("userId") || "guest";

  if (!prompt) {
    return alert("Please enter a prompt.");
  }

  if (isMultiModel && selectedModels.length === 0) {
    return alert("Please select at least one model in multi-model mode.");
  }

  appendUserMessage(prompt);

  const ignoredProviders =
    JSON.parse(localStorage.getItem("ignoredProviders")) || [];

  if (isMultiModel) {
    // Fire off all model requests in parallel
    const tasks = selectedModels.map((modelId) => {
      const availableProviders = modelOptions[modelId]?.providers
        ?.filter((provider) => !ignoredProviders.includes(provider))
        ?.filter((provider) => provider !== "auto");

      if (!availableProviders || availableProviders.length === 0) {
        appendErrorMessage(`No available providers for model "${modelId}"`);
        return Promise.resolve(); // skip this one
      }

      // Use default provider selection logic: prefer 'auto' if available
      const provider = availableProviders.includes("auto")
        ? "auto"
        : availableProviders[0];

      return generateSingleVideo({
        modelId,
        prompt,
        userId,
        provider,
        isMultiModel: true,
      });
    });

    // Let them resolve independently
    tasks.forEach((p) =>
      p?.catch((err) => {
        console.error("Multi-model error:", err);
        appendErrorMessage(`Error from a model: ${err.message || err}`);
      })
    );
    return;
  }

  // Single model path
  const modelId = getModelIdFromURL() || "wan";
  const availableProviders = modelOptions[modelId]?.providers
    ?.filter((provider) => !ignoredProviders.includes(provider))
    ?.filter((provider) => provider !== "auto");

  if (!availableProviders || availableProviders.length === 0) {
    appendErrorMessage(
      `No available providers for model "${modelId}". Cannot generate video.`
    );
    return;
  }

  const resolution = getSelectedValue(resolutionSelect) || "480p";
  const aspect_ratio = getSelectedValue(aspectRatioSelect) || "16:9";
  const provider = providerSelect?.value;

  await generateSingleVideo({
    modelId,
    prompt,
    resolution,
    aspect_ratio,
    provider,
    userId,
    isMultiModel: false,
  });
}

async function generateSingleVideo({
  modelId,
  prompt,
  resolution = "720p",
  aspect_ratio = "16:9",
  provider = "auto",
  userId,
  isMultiModel,
}) {
  appendGeneratingVideoMessage();

  try {
    let requestUrl = "";
    let requestBody = {};

    const config = modelOptions[modelId];
    if (!config) throw new Error("Model configuration not found");

    if (provider === "auto") {
      requestUrl = `${BACKEND_URL}/api/ai/generate-video/${modelId}`;
      const seedInputAuto = document.getElementById("seedInputAuto");
      const seed = seedInputAuto ? seedInputAuto.value.trim() : "";
      const parsedSeed =
        seed !== "" && !isNaN(seed) ? parseInt(seed, 10) : 1234;

      requestBody = {
        prompt,
        resolution,
        aspect_ratio,
        seed: parsedSeed,
        userId,
      };
    } else {
      requestUrl = `${BACKEND_URL}/api/provider/video/${modelId}`;
      requestBody = {
        provider,
        prompt,
        resolution,
        aspect_ratio,
        userId,
      };

      // Add all custom inputs for this provider
      const inputsToInclude = config.custom_inputs.filter((input) => {
        if (input.providers && Array.isArray(input.providers)) {
          return input.providers.includes(provider);
        }
        return true;
      });

      inputsToInclude.forEach((input) => {
        const element = document.getElementById(input.id);
        if (!element) return;

        let value;
        if (input.type === "checkbox") {
          value = element.checked;
        } else if (input.type === "number") {
          value = element.value !== "" ? Number(element.value) : null;
        } else {
          value = element.value;
        }

        if (value !== null && value !== undefined) {
          // Convert the input ID to the expected parameter name if needed
          const paramName = input.paramName || input.id;
          requestBody[paramName] = value;
        }
      });
    }

    const response = await fetch(requestUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    if (!response.ok) {
      appendErrorMessage(data.error || "Server error.");
      return;
    }

    if (data.videoUrl) {
      appendGeneratedVideo(data.videoUrl);
    } else {
      appendErrorMessage("No video URL returned.");
    }
  } catch (err) {
    console.error(err);
    appendErrorMessage("Failed to generate video. Try again.");
  }
}

function copyToClipboard(icon) {
  const message = icon.previousElementSibling.innerText.trim();
  navigator.clipboard
    .writeText(message)
    .then(() => {
      icon.classList.replace("bi-clipboard-fill", "bi-clipboard-check-fill");
      setTimeout(() => {
        icon.classList.replace("bi-clipboard-check-fill", "bi-clipboard-fill");
      }, 1500);
    })
    .catch((err) => console.error("Copy failed:", err));
}

async function populateModelOptions(modelId) {
  // Ensure model options are loaded
  if (Object.keys(modelOptions).length === 0) {
    await fetchModelOptions();
  }

  const config = modelOptions[modelId];
  if (!config) return;

  // Populate providers
  const ignoredProviders =
    JSON.parse(localStorage.getItem("ignoredProviders")) || [];

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

  // Always select "auto" if available and not ignored
  if (availableProviders.includes("auto")) {
    providerSelect.value = "auto";
    // Hide custom inputs when auto is selected initially
    const customInputsContainer = document.getElementById(
      "customInputsContainer"
    );
    if (customInputsContainer) {
      customInputsContainer.style.display = "none";
    }
  } else {
    providerSelect.value = availableProviders[0] || "";
  }

  // Populate resolutions
  resolutionSelect.innerHTML = `<option value="" disabled selected>Resolution</option>`;
  Object.keys(config.resolutions).forEach((res) => {
    const option = document.createElement("option");
    option.value = res;
    option.textContent = res;
    resolutionSelect.appendChild(option);
  });
  if (config.resolutions["720p"] !== undefined) resolutionSelect.value = "720p";

  // Populate aspect ratios - use provider-specific if available
  const currentProvider = providerSelect.value;
  const aspectRatios = config.provider_aspect_ratios?.[currentProvider] ||
    config.aspect_ratios || ["16:9"];

  aspectRatioSelect.innerHTML = `<option value="" disabled selected>Aspect Ratio</option>`;
  aspectRatios.forEach((ratio) => {
    const option = document.createElement("option");
    option.value = ratio;
    option.textContent = ratio;
    aspectRatioSelect.appendChild(option);
  });
  if (aspectRatios.includes("16:9")) aspectRatioSelect.value = "16:9";

  // Update custom inputs based on provider
  updateCustomInputs(modelId, providerSelect.value);
}

function updateCustomInputs(modelId, provider) {
  const config = modelOptions[modelId];
  if (!config) return;

  const customInputsContainer = document.getElementById(
    "customInputsContainer"
  );
  if (!customInputsContainer) return;

  customInputsContainer.innerHTML = ""; // Clear previous inputs

  // Hide custom inputs if provider is "auto"
  if (provider === "auto") {
    customInputsContainer.style.display = "none";
    return;
  }

  // Filter custom inputs that should be shown for this provider
  const inputsToShow = config.custom_inputs.filter((input) => {
    // If input has a providers property, check if it includes current provider
    if (input.providers && Array.isArray(input.providers)) {
      return input.providers.includes(provider);
    }
    // Otherwise show for all providers (except auto which we already handled)
    return true;
  });

  if (inputsToShow.length === 0) {
    customInputsContainer.style.display = "none";
    return;
  }

  customInputsContainer.style.display = "block";

  inputsToShow.forEach((input) => {
    const inputGroup = document.createElement("div");
    inputGroup.className = "mb-3";

    const label = document.createElement("label");
    label.className = "form-label";
    label.htmlFor = input.id;
    label.textContent = input.label;

    inputGroup.appendChild(label);

    if (input.type === "number") {
      const numberInput = document.createElement("input");
      numberInput.type = "number";
      numberInput.className = "form-control";
      numberInput.id = input.id;
      numberInput.placeholder = input.placeholder || "";
      numberInput.value =
        input.default !== null && input.default !== undefined
          ? input.default
          : "";
      inputGroup.appendChild(numberInput);
    } else if (input.type === "checkbox") {
      const checkboxDiv = document.createElement("div");
      checkboxDiv.className = "form-check";

      const checkboxInput = document.createElement("input");
      checkboxInput.type = "checkbox";
      checkboxInput.className = "form-check-input";
      checkboxInput.id = input.id;
      checkboxInput.checked =
        input.default !== null && input.default !== undefined
          ? input.default
          : false;

      const checkboxLabel = document.createElement("label");
      checkboxLabel.className = "form-check-label";
      checkboxLabel.htmlFor = input.id;
      checkboxLabel.textContent = input.label;

      checkboxDiv.appendChild(checkboxInput);
      checkboxDiv.appendChild(checkboxLabel);
      inputGroup.innerHTML = ""; // Remove the label we added earlier
      inputGroup.appendChild(checkboxDiv);
    } else if (input.type === "select") {
      const select = document.createElement("select");
      select.className = "form-select";
      select.id = input.id;

      // Handle both array of strings and array of objects for options
      let options = [];
      if (Array.isArray(input.options)) {
        if (input.options.length > 0 && typeof input.options[0] === "object") {
          // Options are objects with value/label properties
          options = input.options;
        } else {
          // Options are simple strings - convert to {value, label} objects
          options = input.options.map((option) => ({
            value: option,
            label: option,
          }));
        }
      }

      // Add options to select
      options.forEach((option) => {
        const optElement = document.createElement("option");
        optElement.value = option.value;
        optElement.textContent = option.label;
        if (option.value === input.default || option.label === input.default) {
          optElement.selected = true;
        }
        select.appendChild(optElement);
      });

      inputGroup.appendChild(select);
    } else {
      // Default to text input
      const textInput = document.createElement("input");
      textInput.type = "text";
      textInput.className = "form-control";
      textInput.id = input.id;
      textInput.placeholder = input.placeholder || "";
      textInput.value =
        input.default !== null && input.default !== undefined
          ? input.default
          : "";
      inputGroup.appendChild(textInput);
    }

    customInputsContainer.appendChild(inputGroup);
  });
}

function updateAspectRatioOptions() {
  const modelId = getModelIdFromURL();
  const config = modelOptions[modelId];
  if (!config) return;

  const aspectRatioSelect = document.getElementById("aspectRatioSelect");
  if (!aspectRatioSelect) return;

  const currentProvider = providerSelect?.value;

  // Get aspect ratios for current provider or fallback to default
  const aspectRatios = config.provider_aspect_ratios?.[currentProvider] ||
    config.aspect_ratios || ["16:9"];

  aspectRatioSelect.innerHTML = `<option value="" disabled selected>Aspect Ratio</option>`;
  aspectRatios.forEach((ratio) => {
    const option = document.createElement("option");
    option.value = ratio;
    option.textContent = ratio;
    aspectRatioSelect.appendChild(option);
  });

  // Set default to 16:9 if available
  if (aspectRatios.includes("16:9")) {
    aspectRatioSelect.value = "16:9";
  }

  // Also update custom inputs when provider changes
  updateCustomInputs(modelId, currentProvider);
}

function getModelIdFromURL() {
  return new URLSearchParams(window.location.search).get("id");
}

function toggleMultiModelMode() {
  const isMultiModel = document.getElementById("multiModelModeToggle")?.checked;
  const modelCheckboxesContainer = document.getElementById(
    "modelCheckboxesContainer"
  );
  const singleModelOptions = document.getElementById("singleModelOptions");

  if (modelCheckboxesContainer) {
    modelCheckboxesContainer.style.display = isMultiModel ? "block" : "none";
  }
  if (singleModelOptions) {
    singleModelOptions.style.display = isMultiModel ? "none" : "block";
  }
}

// Initialize the application
window.addEventListener("DOMContentLoaded", async () => {
  // Initialize DOM elements
  const providerSelect = document.getElementById("providerSelect");
  const resolutionSelect = document.getElementById("resolutionSelect");
  const aspectRatioSelect = document.getElementById("aspectRatioSelect");
  const multiModelToggle = document.getElementById("multiModelModeToggle");

  // Add null checks for critical elements
  if (
    !providerSelect ||
    !resolutionSelect ||
    !aspectRatioSelect ||
    !multiModelToggle
  ) {
    console.error("Critical elements not found in DOM");
    return;
  }

  // Fetch model options first
  await fetchModelOptions();

  const params = new URLSearchParams(window.location.search);
  const prompt = params.get("prompt");
  const modelId = getModelIdFromURL();

  // Initialize multi-model mode
  multiModelToggle.addEventListener("change", toggleMultiModelMode);
  multiModelToggle.checked = false;
  toggleMultiModelMode();

  if (modelId) {
    await populateModelOptions(modelId);
    updateAspectRatioOptions();
  }

  if (prompt) {
    const promptInput = document.getElementById("promptInput");
    if (promptInput) {
      promptInput.value = decodeURIComponent(prompt);
      generateVideo();
    }
  }

  // Provider change handler
  providerSelect.addEventListener("change", () => {
    const modelId = getModelIdFromURL();
    updateAspectRatioOptions();
    updateCustomInputs(modelId, providerSelect.value);
  });

  // Apply options button handler
  const applyOptionsBtn = document.getElementById("applyOptionsBtn");
  if (applyOptionsBtn) {
    applyOptionsBtn.addEventListener("click", async () => {
      const modelId = getModelIdFromURL();
      const config = modelOptions[modelId];
      if (!config) return;

      // Get basic options
      const resolution = getSelectedValue(resolutionSelect);
      const aspectRatio = getSelectedValue(aspectRatioSelect);
      const seed = document.getElementById("seedInputAuto")?.value || "";

      // Update basic options
      if (resolutionSelect) resolutionSelect.value = resolution;
      if (aspectRatioSelect) aspectRatioSelect.value = aspectRatio;

      const seedInputAuto = document.getElementById("seedInputAuto");
      if (seedInputAuto) {
        seedInputAuto.value = seed;
      }

      // Get all custom inputs and save their values
      const inputsToInclude = config.custom_inputs.filter((input) => {
        const currentProvider = providerSelect.value;
        if (input.providers && Array.isArray(input.providers)) {
          return input.providers.includes(currentProvider);
        }
        return true;
      });

      inputsToInclude.forEach((input) => {
        const element = document.getElementById(input.id);
        if (!element) return;

        // For checkboxes, we want to preserve the checked state
        if (input.type === "checkbox") {
          const isChecked = element.checked;
          // Update the checkbox in the main form if it exists
          const mainFormCheckbox = document.getElementById(input.id);
          if (mainFormCheckbox) {
            mainFormCheckbox.checked = isChecked;
          }
        } else {
          // For other inputs, preserve the value
          const value = element.value;
          const mainFormInput = document.getElementById(input.id);
          if (mainFormInput) {
            mainFormInput.value = value;
          }
        }
      });

      // Close modal
      const modalElement = document.getElementById("modelOptionsModal");
      if (modalElement) {
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
          modal.hide();
        }

        // Manually remove backdrop just in case
        document
          .querySelectorAll(".modal-backdrop")
          .forEach((backdrop) => backdrop.remove());
        document.body.classList.remove("modal-open");
        document.body.style = "";
      }
    });
  }

  // Populate model checkboxes
  await populateModelCheckboxes();
});

// Global variables for select elements
const providerSelect = document.getElementById("providerSelect");
const resolutionSelect = document.getElementById("resolutionSelect");
const aspectRatioSelect = document.getElementById("aspectRatioSelect");
