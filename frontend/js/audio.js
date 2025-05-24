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
};

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
  const provider = document.getElementById("providerSelect").value;
  let model = audioModelOptions[modelId];

  if (!model) {
    console.error("Model not found.");
    return;
  }

  const container = document.getElementById(containerId);
  container.innerHTML = "";

  // Special handling for stackadoc-stable-audio with provider-specific inputs
  let inputsToDisplay = [];

  if (
    modelId === "stackadoc-stable-audio" &&
    model.provider_custom_inputs?.[provider]
  ) {
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
    wrapper.appendChild(label);

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
        inputEl.min = input.min || "";
        inputEl.max = input.max || "";
        if (input.default !== undefined) {
          inputEl.value = input.default;
        }
        if (input.placeholder) {
          inputEl.placeholder = input.placeholder;
        }
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
        if (input.default !== undefined) {
          inputEl.value = input.default;
        }
        if (input.placeholder) {
          inputEl.placeholder = input.placeholder;
        }
        break;

      default:
        console.warn("Unknown input type:", input.type);
        return;
    }

    if (input.type !== "checkbox") {
      inputEl.id = input.id;
      inputEl.name = input.id;
      wrapper.appendChild(inputEl);
    }

    // Add description if available
    if (input.description) {
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
  if (providerSelect) {
    providerSelect.innerHTML = "";
    config.providers.forEach((provider) => {
      const option = document.createElement("option");
      option.value = provider;
      option.textContent = provider === "auto" ? "Auto (default)" : provider;
      providerSelect.appendChild(option);
    });

    providerSelect.value = "auto"; // Set default to auto
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

  async function replaceWithAudioMessageRep(el, audioUrl, durationSeconds) {
    if (!el) return;

    try {
      // Fetch and decode the audio
      const response = await fetch(audioUrl);
      const arrayBuffer = await response.arrayBuffer();

      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      // Calculate number of samples to include
      const trimmedDuration = Math.min(durationSeconds, audioBuffer.duration);
      const sampleRate = audioBuffer.sampleRate;
      const trimmedLength = Math.floor(trimmedDuration * sampleRate);

      // Create a new buffer with the trimmed length
      const trimmedBuffer = audioContext.createBuffer(
        audioBuffer.numberOfChannels,
        trimmedLength,
        sampleRate
      );

      // Copy each channel
      for (let i = 0; i < audioBuffer.numberOfChannels; i++) {
        const oldData = audioBuffer.getChannelData(i);
        const newData = trimmedBuffer.getChannelData(i);
        newData.set(oldData.subarray(0, trimmedLength));
      }

      // Encode to Blob (WAV format)
      const wavBlob = bufferToWav(trimmedBuffer);
      const trimmedAudioUrl = URL.createObjectURL(wavBlob);

      // Inject the audio player with trimmed audio
      el.innerHTML = `
        <div class="d-flex flex-column align-items-start w-100" custom-audio-player">
          <div class="mb-2 text-muted small">
            <i class="bi bi-music-note-beamed me-2"></i>Trimmed Audio (${trimmedDuration}s)
          </div>
          <audio controls class="audio-player" style="width: 250px;">
            <source src="${trimmedAudioUrl}" type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
        </div>
      `;
    } catch (err) {
      console.error("Error trimming audio:", err);
      replaceWithErrorMessage(el, "❌ Failed to trim audio.");
    }
  }

  window.generateAudio = async function generateAudio() {
    const promptInput = document.getElementById("promptInput");
    const durationInput = document.getElementById("durationInput");
    const prompt = promptInput?.value.trim();
    const duration = Number(durationInput?.value.trim());
    const userId = localStorage.getItem("userId");
    const providerSelect = document.getElementById("providerSelect");
    const provider = providerSelect?.value || "auto";
    const modelId = new URLSearchParams(window.location.search).get("id");
    const stepsInputAuto = document.getElementById("stepsInputAuto");
    let step = stepsInputAuto ? stepsInputAuto.value.trim() : "";

    if (!prompt) {
      alert("Please enter a prompt.");
      return;
    }

    appendUserMessage(prompt);
    promptInput.value = "";
    const genMsgEl = appendGeneratingMessage();

    const modelMap = {
      "stackadoc-stable-audio": "stackadoc-stable-audio",
      "cassetteai-sfx-generator": "cassetteai-sfx-generator",
      "cassattemusic-audio": "cassattemusic-audio",
      "multilingual-audio": "multilingual-audio",
      "american-audio": "american-audio",
    };

    const backendModelId = modelMap[modelId];
    const modelConfig = audioModelOptions[modelId];

    if (!backendModelId) {
      alert("Unsupported model ID in URL.");
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
        if (provider === "fal") {
          replaceWithAudioMessage(genMsgEl, data.audioUrl);
        } else if (provider === "replicate") {
          replaceWithAudioMessageRep(genMsgEl, data.audioUrl, duration);
        } else {
          replaceWithAudioMessage(genMsgEl, data.audioUrl);
        }
      } else {
        if (res.status === 402) {
          replaceWithErrorMessage(genMsgEl, "Insufficient credits.");
        } else {
          replaceWithErrorMessage(
            genMsgEl,
            `❌ Error generating audio. ${data.error}`
          );
        }
      }
    } catch (err) {
      console.error(err);
      replaceWithErrorMessage(
        genMsgEl,
        "Audio generation failed. Please try again later or use a different model."
      );
    }
  };

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

      if (selected === "fal" || selected === "replicate") {
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

  const promptFromURL = params.get("prompt");
  const input = document.getElementById("promptInput");

  if (promptFromURL && input) {
    input.value = decodeURIComponent(promptFromURL);
    generateAudio();
  }
});

window.addEventListener("DOMContentLoaded", () => {
  const selected = providerSelect.value;
  const modelId = new URLSearchParams(window.location.search).get("id");
  const outputSettingsContainer = document.getElementById(
    "outputSettingsContainer"
  );

  if (modelId) {
    displayCustomInputs(modelId, "inputsContainer");
  }
  console.log(selected);
  if (selected === "fal") {
    displayCustomInputs(modelId, "inputsContainer");
    const customInputsContainer = document.getElementById("inputsContainer");
    customInputsContainer.style.display = "block";
    outputSettingsContainer.style.display = "block";
  } else {
    const customInputsContainer = document.getElementById("inputsContainer");
    customInputsContainer.style.display = "none";
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
