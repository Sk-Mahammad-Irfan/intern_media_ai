const audioModelOptions = {
  "stackadoc-stable-audio": {
    providers: ["auto", "fal", "replicate"],
    // Default custom inputs (used when provider is 'auto')
    custom_inputs: [
      {
        id: "steps",
        type: "number",
        label: "Steps",
        default: 100,
        description:
          "The number of steps to denoise the audio for. Default value: 100",
      },
    ],
    // Provider-specific custom inputs
    provider_custom_inputs: {
      fal: [
        {
          id: "steps",
          type: "number",
          label: "Steps",
          default: 100,
          description:
            "The number of steps to denoise the audio for. Default value: 100",
        },
      ],
      replicate: [
        {
          id: "seed",
          type: "number",
          label: "Seed",
          default: -1,
        },
        {
          id: "steps",
          type: "number",
          label: "Steps",
          default: 100,
        },
        {
          id: "cfg_scale",
          type: "number",
          label: "CFG Scale",
          default: 6,
        },
        {
          id: "sigma_max",
          type: "number",
          label: "Sigma Max",
          default: 500,
        },
        {
          id: "sigma_min",
          type: "number",
          label: "Sigma Min",
          default: 0.03,
        },
        {
          id: "batch_size",
          type: "number",
          label: "Batch Size",
          default: 1,
        },
        {
          id: "sampler_type",
          type: "select",
          label: "Sampler Type",
          default: "dpmpp-3m-sde",
          options: [
            "dpmpp-3m-sde",
            "euler",
            "heun",
            "lms",
            "dpm2",
            "dpm2-a",
            "dpm++-2m",
            "dpm++-2m-sde",
          ],
        },
        {
          id: "seconds_start",
          type: "number",
          label: "Seconds Start",
          default: 0,
        },
        {
          id: "seconds_total",
          type: "number",
          label: "Seconds Total",
          default: 8,
        },
        {
          id: "negative_prompt",
          type: "text",
          label: "Negative Prompt",
          default: "",
        },
        {
          id: "init_noise_level",
          type: "number",
          label: "Init Noise Level",
          default: 1,
        },
      ],
    },
  },
  "cassetteai-sfx-generator": {
    providers: ["auto", "fal"],
    custom_inputs: [],
  },
  "cassattemusic-audio": {
    providers: ["auto", "fal"],
    custom_inputs: [],
  },
  "multilingual-audio": {
    providers: ["auto", "fal"],
    custom_inputs: [
      {
        id: "steps",
        type: "number",
        label: "Steps",
        default: 100,
      },
      {
        id: "language",
        type: "select",
        label: "Language",
        options: ["en", "es", "fr", "de", "ja"],
        default: "en",
      },
    ],
  },
  "american-audio": {
    providers: ["auto", "fal"],
    custom_inputs: [
      {
        id: "voice",
        type: "select",
        label: "Voice",
        options: ["af_heart"],
        default: "af_heart",
      },
      {
        id: "speed",
        type: "number",
        label: "Speed",
        default: 1.0,
        min: 0.5,
        max: 2,
      },
    ],
  },
  "fal-ai-lyria2": {
    providers: ["auto", "fal"],
    custom_inputs: [],
  },
  "fal-ai-kokoro-hindi": {
    providers: ["auto", "fal"],
    custom_inputs: [],
  },
  "fal-ai-elevenlabs-sound-effects": {
    providers: ["auto", "fal"],
    custom_inputs: [],
  },
  "fal-ai-mmaudio-v2-text-to-audio": {
    providers: ["auto", "fal"],
    custom_inputs: [
      {
        id: "negative_prompt",
        type: "text",
        label: "Negative Prompt",
        default: "",
      },
      {
        id: "seed",
        type: "number",
        label: "Seed",
        placeholder: "Leave empty for random",
      },
      {
        id: "num_steps",
        type: "number",
        label: "Steps",
        default: 25,
      },
      {
        id: "cfg_strength",
        type: "number",
        label: "CFG Strength",
        default: 4.5,
        step: 0.1,
      },
      {
        id: "mask_away_clip",
        type: "boolean",
        label: "Mask Away Clip",
        default: false,
      },
    ],
  },
  "cartesia-sonic-2": {
    providers: ["auto", "together"],
    custom_inputs: [
      {
        id: "voice",
        type: "select",
        label: "Voice",
        help: "Choose the desired voice for the generated audio",
        default: "sweet lady",
        options: [
          "sweet lady",
          "friendly sidekick",
          "french narrator lady",
          "german reporter woman",
          "indian lady",
          "british reading lady",
          "british narration lady",
          "hindi calm man",
          "hindi narrator man",
          "polish narrator man",
          "polish young man",
          "alabama male",
          "australian male",
          "anime girl",
          "japanese man book",
        ],
      },
      {
        id: "sample_rate",
        type: "select",
        label: "Sample Rate",
        help: "Select the sample rate for output audio",
        default: 44100,
        options: [16000, 24000, 44100, 48000],
      },
      {
        id: "response_format",
        type: "select",
        label: "Response Format",
        help: "Choose the audio file format for the result",
        default: "wav",
        options: ["wav", "mp3"],
      },
      {
        id: "language",
        type: "select",
        label: "Language",
        help: "Select the language for speech synthesis",
        default: "en",
        options: ["en", "hi"],
      },
    ],
  },
};

const audioModelCredits = {
  "stackadoc-stable-audio": 2, // replicate: 1, fal: 2 → use 2
  "cassetteai-sfx-generator": 1,
  "cassattemusic-audio": 2,
  "multilingual-audio": 9,
  "american-audio": 2,
  "cartesia-sonic-2": 7,
  "fal-ai-kokoro-hindi": 5,
  "fal-ai-lyria2": 5,
  "fal-ai-elevenlabs-sound-effects": 5,
  "fal-ai-mmaudio-v2-text-to-audio": 5,
};

let selectedAudioModels = [];

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

  selectedAudioModels.forEach((model) => {
    totalCredits += audioModelCredits[model] || 0;
  });

  creditAmountElement.textContent = totalCredits;
  creditDisplay.style.display =
    selectedAudioModels.length > 0 ? "block" : "none";
}

function populateModelCheckboxes() {
  const container = document.getElementById("modelCheckboxes");
  container.innerHTML = "";

  Object.keys(audioModelOptions).forEach((modelId) => {
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

/**
 * Updates the list of selected audio models based on the checked checkboxes
 * in the modelCheckboxes container. Calls updateTotalCredits to refresh the
 * total credits display according to the selected models.
 */

function updateSelectedModels() {
  selectedAudioModels = [];
  document
    .querySelectorAll('#modelCheckboxes input[type="checkbox"]:checked')
    .forEach((checkbox) => {
      selectedAudioModels.push(checkbox.value);
    });
  updateTotalCredits();
}

function toggleAudioMultiModelMode() {
  const isMultiModel = document.getElementById("multiModelModeToggle").checked;
  const multiModelContainer = document.getElementById(
    "multiModelSelectionContainer"
  );
  const providerContainer =
    document.getElementById("providerSelect").parentElement;
  const durationContainer =
    document.getElementById("durationInput").parentElement;

  if (isMultiModel) {
    multiModelContainer.style.display = "block";
    providerContainer.style.display = "none";
    durationContainer.style.display = "none";
    populateModelCheckboxes();
    updateTotalCredits();
  } else {
    multiModelContainer.style.display = "none";
    providerContainer.style.display = "block";
    durationContainer.style.display = "block";
    selectedAudioModels = [];
    updateTotalCredits();
    // Restore default model options
    const modelId = new URLSearchParams(window.location.search).get("id");
    if (modelId) populateAudioModelOptions(modelId);
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

function displayCustomInputs(modelId, containerId) {
  const provider = document.getElementById("providerSelect")?.value || "auto";
  const model = audioModelOptions[modelId];

  if (!model) {
    console.error("Model not found.");
    return;
  }

  const container = document.getElementById(containerId);
  container.innerHTML = "";

  let inputsToDisplay = [];

  // Prefer provider-specific custom inputs if available
  if (model.provider_custom_inputs?.[provider]) {
    inputsToDisplay = model.provider_custom_inputs[provider];
  } else if (model.custom_inputs) {
    inputsToDisplay = model.custom_inputs;
  }

  if (inputsToDisplay.length === 0) {
    console.log("No custom inputs to display for this model/provider");
    return;
  }

  inputsToDisplay.forEach((input) => {
    const wrapper = document.createElement("div");
    wrapper.className = "mb-3";
    wrapper.style.fontFamily = "Arial, sans-serif";

    const label = document.createElement("label");
    label.htmlFor = input.id;
    label.textContent = input.label;
    label.className = "form-label";
    label.style.display = "block";
    label.style.marginBottom = "5px";

    if (input.help || input.description) {
      label.title = input.help || input.description;
    }

    let inputEl;

    switch (input.type) {
      case "select":
        inputEl = document.createElement("select");
        inputEl.className = "form-select";
        input.options.forEach((option) => {
          const opt = document.createElement("option");
          opt.value = option;
          opt.textContent = option;
          if (option === input.default) opt.selected = true;
          inputEl.appendChild(opt);
        });
        break;

      case "number":
        inputEl = document.createElement("input");
        inputEl.type = "number";
        inputEl.className = "form-control";
        if (input.min !== undefined) inputEl.min = input.min;
        if (input.max !== undefined) inputEl.max = input.max;
        if (input.step !== undefined) inputEl.step = input.step;
        if (input.default !== undefined) inputEl.value = input.default;
        if (input.placeholder) inputEl.placeholder = input.placeholder;
        break;

      case "checkbox":
        inputEl = document.createElement("input");
        inputEl.type = "checkbox";
        inputEl.className = "form-check-input me-2";
        inputEl.checked = input.default || false;
        label.className = "form-check-label";
        label.style.display = "inline";
        wrapper.className = "form-check mb-3";
        wrapper.innerHTML = "";
        wrapper.appendChild(inputEl);
        wrapper.appendChild(label);
        break;

      case "text":
        inputEl = document.createElement("input");
        inputEl.type = "text";
        inputEl.className = "form-control";
        if (input.default !== undefined) inputEl.value = input.default;
        if (input.placeholder) inputEl.placeholder = input.placeholder;
        break;

      default:
        console.warn("Unknown input type:", input.type);
        return;
    }

    if (input.type !== "checkbox") {
      inputEl.id = input.id;
      inputEl.name = input.id;
      wrapper.appendChild(label);
      wrapper.appendChild(inputEl);
    }

    // Optional description shown below input
    if (input.description && input.type !== "checkbox") {
      const desc = document.createElement("small");
      desc.className = "form-text text-muted";
      desc.textContent = input.description;
      wrapper.appendChild(desc);
    }

    container.appendChild(wrapper);
  });
}

function populateAudioModelOptions(modelId) {
  const config = audioModelOptions[modelId];
  if (!config) return;

  const providerSelect = document.getElementById("providerSelect");

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

    // Default to "auto" if available, otherwise first available
    providerSelect.value = availableProviders.includes("auto")
      ? "auto"
      : availableProviders[0] || "";
  }
}

window.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed");

  const chat = document.getElementById("chat");

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
    const chat = document.getElementById("chat");
    const wrapper = document.createElement("div");
    wrapper.className = "d-flex justify-content-start mb-3";

    const inner = document.createElement("div");
    inner.className = "ai-message p-3 text-muted small bg-light";
    inner.innerHTML = `<i class="bi bi-music-note-beamed me-2"></i>Generating audio&nbsp;
      <div class="spinner-border spinner-border-sm text-secondary me-2" role="status"></div>`;

    wrapper.appendChild(inner);
    chat.appendChild(wrapper);
    chat.scrollTop = chat.scrollHeight;

    return inner; // return reference to the specific message
  }

  function replaceWithErrorMessage(el, msg) {
    if (!el) return;
    el.innerHTML = `<span class="text-danger">${msg}</span>`;
  }

  function bufferToWav(buffer) {
    const numOfChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;

    const samples = buffer.length;
    const blockAlign = (numOfChannels * bitDepth) / 8;
    const byteRate = sampleRate * blockAlign;
    const dataSize = samples * blockAlign;

    const bufferLength = 44 + dataSize;
    const arrayBuffer = new ArrayBuffer(bufferLength);
    const view = new DataView(arrayBuffer);

    var offset = 0;

    const writeString = (str) => {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset++, str.charCodeAt(i));
      }
    };

    // RIFF chunk descriptor
    writeString("RIFF");
    view.setUint32(offset, 36 + dataSize, true);
    offset += 4;
    writeString("WAVE");

    // fmt subchunk
    writeString("fmt ");
    view.setUint32(offset, 16, true);
    offset += 4;
    view.setUint16(offset, format, true);
    offset += 2;
    view.setUint16(offset, numOfChannels, true);
    offset += 2;
    view.setUint32(offset, sampleRate, true);
    offset += 4;
    view.setUint32(offset, byteRate, true);
    offset += 4;
    view.setUint16(offset, blockAlign, true);
    offset += 2;
    view.setUint16(offset, bitDepth, true);
    offset += 2;

    // data subchunk
    writeString("data");
    view.setUint32(offset, dataSize, true);
    offset += 4;

    // Write interleaved PCM samples
    const interleaved = new Int16Array(dataSize / 2);
    for (let i = 0; i < samples; i++) {
      for (let channel = 0; channel < numOfChannels; channel++) {
        const sample = buffer.getChannelData(channel)[i];
        const intSample = Math.max(-1, Math.min(1, sample));
        interleaved[i * numOfChannels + channel] =
          intSample < 0 ? intSample * 0x8000 : intSample * 0x7fff;
      }
    }

    new DataView(arrayBuffer, 44).setInt16(0, interleaved[0], true);
    for (let i = 0; i < interleaved.length; i++) {
      view.setInt16(offset, interleaved[i], true);
      offset += 2;
    }

    return new Blob([view], { type: "audio/wav" });
  }

  async function replaceWithAudioMessage(el, audioUrl) {
    if (!el) return;

    try {
      // Directly inject the audio URL without re-decoding and encoding it
      el.innerHTML = `
        <div class="d-flex flex-column align-items-start w-100" custom-audio-player>
          <div class="mb-2 text-muted small">
            <i class="bi bi-music-note-beamed me-2"></i>Audio
          </div>
          <audio controls class="audio-player" style="width: 250px;">
            <source src="${audioUrl}" type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
        </div>
      `;
    } catch (err) {
      console.error("Error loading audio:", err);
      replaceWithErrorMessage(el, "❌ Failed to load audio.");
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

  window.generateAudio = async function generateAudio() {
    const promptInput = document.getElementById("promptInput");
    const prompt = promptInput?.value.trim();
    const isMultiModel = document.getElementById(
      "multiModelModeToggle"
    ).checked;
    const userId = localStorage.getItem("userId") || "guest";

    if (!prompt) {
      alert("Please enter a prompt.");
      return;
    }

    if (isMultiModel && selectedAudioModels.length === 0) {
      return alert("Please select at least one model in multi-model mode.");
    }

    appendUserMessage(prompt);
    promptInput.value = "";

    const ignoredProviders =
      JSON.parse(localStorage.getItem("ignoredProviders")) || [];

    if (isMultiModel) {
      const tasks = selectedAudioModels.map((modelId) => {
        const availableProviders = audioModelOptions[modelId].providers
          .filter((provider) => !ignoredProviders.includes(provider))
          .filter((provider) => provider !== "auto");

        if (availableProviders.length === 0) {
          appendErrorMessage(`No available providers for model "${modelId}"`);
          return Promise.resolve();
        }

        const provider = availableProviders.includes("auto")
          ? "auto"
          : availableProviders[0];

        return generateSingleAudio({
          modelId,
          prompt,
          provider,
          userId,
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

    const durationInput = document.getElementById("durationInput");
    const duration = Number(durationInput?.value.trim() || 10);
    if (isNaN(duration) || duration <= 0) {
      return alert("Please enter a valid duration.");
    }

    const modelId =
      new URLSearchParams(window.location.search).get("id") || "default";
    const availableProviders = audioModelOptions[modelId].providers
      .filter((provider) => !ignoredProviders.includes(provider))
      .filter((provider) => provider !== "auto");

    if (availableProviders.length === 0) {
      appendErrorMessage(
        `No available providers for model "${modelId}". Cannot generate audio.`
      );
      return;
    }

    const provider =
      document.getElementById("providerSelect")?.value || availableProviders[0];

    await generateSingleAudio({
      modelId,
      prompt,
      duration,
      provider,
      userId,
      isMultiModel: false,
    });
  };

  async function generateSingleAudio({
    modelId,
    prompt,
    duration = 10, // Default duration if not provided
    provider = "auto",
    userId,
    isMultiModel,
  }) {
    // Create a unique message container for this model
    const messageId = `generating-audio-${modelId}-${Date.now()}`;
    const aiDiv = document.createElement("div");
    aiDiv.id = messageId;
    aiDiv.className = "d-flex justify-content-start mb-3 generating-audio";
    aiDiv.innerHTML = `
      <div class="ai-message p-3 text-muted d-flex align-items-center">
        <i class="bi bi-music-note-beamed me-2"></i>
        Generating audio (${modelId})&nbsp;
        <div class="spinner-border spinner-border-sm text-secondary me-2" role="status"></div>
      </div>`;
    chat.appendChild(aiDiv);
    chat.scrollTop = chat.scrollHeight;

    const modelMap = {
      "stackadoc-stable-audio": "stackadoc-stable-audio",
      "cassetteai-sfx-generator": "cassetteai-sfx-generator",
      "cassattemusic-audio": "cassattemusic-audio",
      "multilingual-audio": "multilingual-audio",
      "american-audio": "american-audio",
      "fal-ai-kokoro-hindi": "fal-ai-kokoro-hindi",
      "fal-ai-lyria2": "fal-ai-lyria2",
      "cartesia-sonic-2": "cartesia-sonic-2",
      "fal-ai-elevenlabs-sound-effects": "fal-ai-elevenlabs-sound-effects",
      "fal-ai-mmaudio-v2-text-to-audio": "fal-ai-mmaudio-v2-text-to-audio",
    };

    const backendModelId = modelMap[modelId];
    const modelConfig = audioModelOptions[modelId];

    if (!backendModelId) {
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
      let requestBody = {
        prompt,
        userId,
        duration,
      };

      let inputsToProcess = [];
      if (
        modelId === "stackadoc-stable-audio" &&
        modelConfig.provider_custom_inputs?.[provider]
      ) {
        inputsToProcess = modelConfig.provider_custom_inputs[provider];
      } else if (modelConfig.custom_inputs) {
        inputsToProcess = modelConfig.custom_inputs;
      }

      inputsToProcess.forEach((input) => {
        const el = document.getElementById(input.id);
        if (!el) return;

        let value;
        switch (input.type) {
          case "checkbox":
            value = el.checked;
            break;
          case "number":
            value = el.value === "" ? undefined : Number(el.value);
            break;
          default:
            value = el.value;
            break;
        }

        if (value !== undefined && value !== "") {
          requestBody[input.id] = value;
        }
      });

      let endpoint;
      if (provider === "auto") {
        endpoint = `${BACKEND_URL}/api/ai/generate-audio/${backendModelId}`;
        const stepsInputAuto = document.getElementById("stepsInputAuto");
        const step = stepsInputAuto ? stepsInputAuto.value.trim() : "";
        const parsedStep =
          step !== "" && !isNaN(step) ? parseInt(step, 10) : undefined;
        requestBody.step = parsedStep;
      } else {
        endpoint = `${BACKEND_URL}/api/provider/audio/${backendModelId}`;
        requestBody.provider = provider;
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();

      if (res.ok && data.audioUrl) {
        const messageDiv = document.getElementById(messageId);
        if (messageDiv) {
          messageDiv.innerHTML = `
            <div class="ai-message p-3">
              <div class="d-flex flex-column align-items-start w-100">
                <div class="mb-2 text-muted small">
                  <i class="bi bi-music-note-beamed me-2"></i>
                  ${
                    isMultiModel
                      ? `Generated Audio (${modelId})`
                      : "Generated Audio"
                  }
                </div>
                <audio controls class="audio-player" style="width: 250px;">
                  <source src="${data.audioUrl}" type="audio/wav" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            </div>
          `;
        }
      } else {
        const errorDiv = document.getElementById(messageId);
        if (errorDiv) {
          errorDiv.innerHTML = `
            <div class="ai-message p-3 text-danger border border-danger">
              <i class="bi bi-exclamation-triangle me-2"></i>
              ${
                res.status === 402
                  ? "Insufficient credits"
                  : `Error generating audio (${modelId})`
              }
            </div>`;
        }
      }
    } catch (err) {
      console.error(err);
      const errorDiv = document.getElementById(messageId);
      if (errorDiv) {
        errorDiv.innerHTML = `
          <div class="ai-message p-3 text-danger border border-danger">
            <i class="bi bi-exclamation-triangle me-2"></i>
            Audio generation failed (${modelId}). Please try again.
          </div>`;
      }
    }
  }

  const providerSelect = document.getElementById("providerSelect");
  if (providerSelect) {
    providerSelect.addEventListener("change", () => {
      const selected = providerSelect.value;
      const modelId = new URLSearchParams(window.location.search).get("id");
      const customInputsContainer = document.getElementById("inputsContainer");
      const outputSettingsContainer = document.getElementById(
        "outputSettingsContainer"
      );
      const stepsInputAuto = document.getElementById("stepsInputAuto");

      if (modelId) {
        displayCustomInputs(modelId, "inputsContainer");
      }

      if (
        selected === "fal" ||
        selected === "replicate" ||
        selected === "together"
      ) {
        customInputsContainer.style.display = "block";
        outputSettingsContainer.style.display = "block";
        stepsInputAuto.style.display = "none";
      } else {
        customInputsContainer.style.display = "none";
        outputSettingsContainer.style.display = "block";
      }
    });

    providerSelect.value = "auto"; // Default value
  }

  const modelId = new URLSearchParams(window.location.search).get("id");
  if (modelId) {
    populateAudioModelOptions(modelId);
    displayCustomInputs(modelId, "inputsContainer");
  }

  const params = new URLSearchParams(window.location.search);
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
});

window.addEventListener("DOMContentLoaded", () => {
  // Initialize multi-model mode
  document
    .getElementById("multiModelModeToggle")
    .addEventListener("change", toggleAudioMultiModelMode);
  document.getElementById("multiModelModeToggle").checked = false;

  const params = new URLSearchParams(window.location.search);
  const prompt = params.get("prompt");
  const modelId = params.get("id");

  if (modelId) {
    populateAudioModelOptions(modelId);
    displayCustomInputs(modelId, "inputsContainer");
  }

  if (prompt) {
    const input = document.getElementById("promptInput");
    if (input) {
      input.value = decodeURIComponent(prompt);
      generateAudio();
    }
  }

  // Populate model checkboxes (hidden until multi-model mode is enabled)
  populateModelCheckboxes();

  // Show/hide extra options based on initial provider selection
  const selected = document.getElementById("providerSelect")?.value || "auto";
  const falOptions = document.getElementById("inputsContainer");
  const outputSettingsContainer = document.getElementById(
    "outputSettingsContainer"
  );
  const stepsInputAuto = document.getElementById("stepsInputAuto");

  if (
    selected === "fal" ||
    selected === "replicate" ||
    selected === "together"
  ) {
    if (falOptions) falOptions.style.display = "block";
    if (outputSettingsContainer)
      outputSettingsContainer.style.display = "block";
    if (stepsInputAuto) stepsInputAuto.style.display = "none";
  } else {
    if (falOptions) falOptions.style.display = "none";
    if (outputSettingsContainer)
      outputSettingsContainer.style.display = "block";
  }
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

document.getElementById("providerSelect")?.addEventListener("change", () => {
  const selected = document.getElementById("providerSelect").value;
  const modelId = new URLSearchParams(window.location.search).get("id");
  const customInputsContainer = document.getElementById("inputsContainer");
  const outputSettingsContainer = document.getElementById(
    "outputSettingsContainer"
  );
  const stepsInputAuto = document.getElementById("stepsInputAuto");

  if (modelId) {
    displayCustomInputs(modelId, "inputsContainer");
  }

  if (
    selected === "fal" ||
    selected === "replicate" ||
    selected === "together"
  ) {
    customInputsContainer.style.display = "block";
    outputSettingsContainer.style.display = "block";
    if (stepsInputAuto) stepsInputAuto.style.display = "none";
  } else {
    customInputsContainer.style.display = "none";
    outputSettingsContainer.style.display = "block";
    if (stepsInputAuto) stepsInputAuto.style.display = "block";
  }
});
