let selectedModels = [];
let modelOptions = {};
let videoModelCredits = {};

// Fetch model options from backend
async function fetchModelOptions() {
  try {
    const response = await fetch("http://localhost:5000/api/model/video");
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
  const loadingMessage = document.querySelector(".generating-video");
  if (loadingMessage) loadingMessage.remove();

  const resolution = getSelectedValue(resolutionSelect) || "720p";
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

  const prompt = document.getElementById("promptInput").value.trim();
  const isMultiModel = document.getElementById("multiModelModeToggle").checked;
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
      const availableProviders = modelOptions[modelId].providers
        .filter((provider) => !ignoredProviders.includes(provider))
        .filter((provider) => provider !== "auto");

      if (availableProviders.length === 0) {
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
  const availableProviders = modelOptions[modelId].providers
    .filter((provider) => !ignoredProviders.includes(provider))
    .filter((provider) => provider !== "auto");

  if (availableProviders.length === 0) {
    appendErrorMessage(
      `No available providers for model "${modelId}". Cannot generate video.`
    );
    return;
  }

  const resolution = getSelectedValue(resolutionSelect) || "480p";
  const aspect_ratio = getSelectedValue(aspectRatioSelect) || "16:9";
  const provider = providerSelect.value;

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
    } else if (provider === "fal") {
      const shift = Number(document.getElementById("shiftInput")?.value || 0);
      const steps = Number(document.getElementById("stepsInput")?.value || 1);
      const guidance = Number(
        document.getElementById("guidanceInput")?.value || 1
      );
      const negativePrompt =
        document.getElementById("negativePromptInput")?.value || "";
      const seed = document.getElementById("seedInput")?.value;
      const frameNum = Number(
        document.getElementById("frameNumInput")?.value || 81
      );
      const enableExpansion =
        document.getElementById("enableExpansion")?.checked || false;
      const enableSafety =
        document.getElementById("enableSafety")?.checked || false;

      requestUrl = `${BACKEND_URL}/api/provider/video/${modelId}`;
      requestBody = {
        provider: "fal",
        prompt,
        resolution,
        aspect_ratio,
        shift,
        sampler: "unipc",
        num_inference_steps: steps,
        guidance_scale: guidance,
        negative_prompt: negativePrompt,
        seed: seed ? Number(seed) : undefined,
        enable_prompt_expansion: enableExpansion,
        enable_safety_checker: enableSafety,
        frame_num: frameNum,
        userId,
      };
    } else if (provider === "replicate") {
      const guidanceInput = document.getElementById("replicateCfgInput");
      const stepsInput = document.getElementById("replicateStepsInput");
      const lengthInput = document.getElementById("replicateLengthInput");
      const negativePromptInput = document.getElementById(
        "replicateNegativePromptInput"
      );
      const seedInput = document.getElementById("replicateSeedInput");
      const noiseScaleInput = document.getElementById(
        "replicateImageNoiseScaleInput"
      );

      const guidance = guidanceInput
        ? Number(guidanceInput.value.trim()) || 3
        : 3;
      const steps = stepsInput ? Number(stepsInput.value.trim()) || 30 : 30;

      if (steps < 10) {
        appendErrorMessage("Replicate: Inference steps must be at least 10.");
        return;
      }

      const frameNum = lengthInput
        ? Number(lengthInput.value.trim()) || 81
        : 81;
      const negativePrompt = negativePromptInput
        ? negativePromptInput.value.trim()
        : "";
      const seed = seedInput ? Number(seedInput.value) : 1234;
      const imageNoiseScale = noiseScaleInput
        ? Number(noiseScaleInput.value)
        : undefined;

      requestUrl = `${BACKEND_URL}/api/provider/video/${modelId}`;
      requestBody = {
        provider: "replicate",
        prompt,
        resolution,
        aspect_ratio,
        num_inference_steps: steps,
        guidance_scale: guidance,
        frame_num: frameNum,
        negative_prompt: negativePrompt,
        seed: seed || 1234,
        image_noise_scale: imageNoiseScale,
        userId,
      };
    } else {
      requestUrl = `${BACKEND_URL}/api/provider/video/${modelId}`;
      requestBody = {
        provider: "deepinfra",
        prompt,
        resolution,
        aspect_ratio,
        userId,
      };
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
      const loadingMessage = document.querySelector(".generating-video");
      if (loadingMessage) loadingMessage.remove();

      const message = document.createElement("div");
      message.className = "d-flex justify-content-start mb-3";

      const bubble = document.createElement("div");
      bubble.className = "ai-message p-3";

      const caption = document.createElement("div");
      caption.textContent = isMultiModel
        ? `Generated Video (${modelId}):`
        : "Generated Video:";
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
      video.src = data.videoUrl;
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
      document.getElementById("chat").appendChild(message);
      document.getElementById("chat").scrollTop =
        document.getElementById("chat").scrollHeight;
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
}

function updateAspectRatioOptions() {
  const modelId = getModelIdFromURL();
  const config = modelOptions[modelId];
  if (!config) return;

  const currentProvider = providerSelect.value;

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
}

function getModelIdFromURL() {
  return new URLSearchParams(window.location.search).get("id");
}

function toggleMultiModelMode() {
  const isMultiModel = document.getElementById("multiModelModeToggle").checked;
  document.getElementById("modelCheckboxesContainer").style.display =
    isMultiModel ? "block" : "none";
  document.getElementById("singleModelOptions").style.display = isMultiModel
    ? "none"
    : "block";
}

// Initialize the application
window.addEventListener("DOMContentLoaded", async () => {
  // Initialize DOM elements
  const providerSelect = document.getElementById("providerSelect");
  const resolutionSelect = document.getElementById("resolutionSelect");
  const aspectRatioSelect = document.getElementById("aspectRatioSelect");

  // Fetch model options first
  await fetchModelOptions();

  const params = new URLSearchParams(window.location.search);
  const prompt = params.get("prompt");
  const modelId = getModelIdFromURL();

  // Initialize multi-model mode
  document
    .getElementById("multiModelModeToggle")
    .addEventListener("change", toggleMultiModelMode);
  document.getElementById("multiModelModeToggle").checked = false;
  toggleMultiModelMode();

  if (modelId) {
    await populateModelOptions(modelId);
    updateAspectRatioOptions();
  }

  if (prompt) {
    document.getElementById("promptInput").value = decodeURIComponent(prompt);
    generateVideo();
  }

  // Show/hide extra options based on initial provider selection
  const selected = providerSelect.value;
  const falOptions = document.getElementById("falExtraOptions");
  falOptions.style.display = selected === "fal" ? "block" : "none";
  const replicateOptions = document.getElementById("replicateExtraOptions");
  replicateOptions.style.display = selected === "replicate" ? "block" : "none";

  // Populate model checkboxes
  await populateModelCheckboxes();

  // Provider change handler
  providerSelect.addEventListener("change", () => {
    const selected = providerSelect.value;
    const falOptions = document.getElementById("falExtraOptions");
    falOptions.style.display = selected === "fal" ? "block" : "none";
    const replicateOptions = document.getElementById("replicateExtraOptions");
    replicateOptions.style.display =
      selected === "replicate" ? "block" : "none";

    const seedInputAuto = document.getElementById("seedInputAuto");
    seedInputAuto.style.display = selected === "auto" ? "block" : "none";

    // Update aspect ratios after provider changes
    updateAspectRatioOptions();
  });

  // Apply options button handler
  document
    .getElementById("applyOptionsBtn")
    .addEventListener("click", async () => {
      // Get values
      const resolution = getSelectedValue(resolutionSelect);
      const aspectRatio = getSelectedValue(aspectRatioSelect);

      const shift = document.getElementById("shiftInput").value || "5";
      const steps = document.getElementById("stepsInput").value || "10";
      const guidance = document.getElementById("guidanceInput").value || "7";
      const negativePrompt =
        document.getElementById("negativePromptInput").value || "";
      const seed = document.getElementById("seedInput").value || "";
      const expansion = document.getElementById("enableExpansion").checked;
      const safety = document.getElementById("enableSafety").checked;

      // Update values if needed
      document.getElementById("shiftInput").value = shift;
      document.getElementById("stepsInput").value = steps;
      document.getElementById("guidanceInput").value = guidance;
      document.getElementById("negativePromptInput").value = negativePrompt;
      document.getElementById("seedInput").value = seed;
      document.getElementById("enableExpansion").checked = expansion;
      document.getElementById("enableSafety").checked = safety;

      // Close modal
      const modalElement = document.getElementById("modelOptionsModal");
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal.hide();

      // Manually remove backdrop just in case
      document
        .querySelectorAll(".modal-backdrop")
        .forEach((backdrop) => backdrop.remove());
      document.body.classList.remove("modal-open");
      document.body.style = "";
    });
});
