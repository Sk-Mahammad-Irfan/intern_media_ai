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
    inner.innerHTML = `<i class="bi bi-music-note-beamed me-2"></i>Generating audio...`;

    wrapper.appendChild(inner);
    chat.appendChild(wrapper);
    chat.scrollTop = chat.scrollHeight;

    return inner; // return reference to the specific message
  }

  function replaceWithErrorMessage(el, msg) {
    if (!el) return;
    el.innerHTML = `<span class="text-danger">${msg}</span>`;
  }

  function replaceWithAudioMessage(el, audioUrl) {
    if (!el) return;
    el.innerHTML = `
      <div class="p-3 rounded-4 shadow-sm bg-white w-100">
        <div class="mb-2 text-muted d-flex align-items-center">
          <i class="bi bi-music-note-beamed me-2"></i>
          <span class="fw-semibold small">Generated Audio</span>
        </div>
        <audio controls class="w-100 rounded">
          <source src="${audioUrl}" type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
    `;
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

    if (!prompt) {
      alert("Please enter a prompt.");
      return;
    }

    appendUserMessage(prompt);
    promptInput.value = "";
    const genMsgEl = appendGeneratingMessage(); // store reference

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

      // Get the appropriate custom inputs based on provider
      let inputsToProcess = [];
      if (
        modelId === "stackadoc-stable-audio" &&
        modelConfig.provider_custom_inputs?.[provider]
      ) {
        inputsToProcess = modelConfig.provider_custom_inputs[provider];
      } else if (modelConfig.custom_inputs) {
        inputsToProcess = modelConfig.custom_inputs;
      }

      // Process all custom inputs
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
        replaceWithAudioMessage(genMsgEl, data.audioUrl);
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

      if (modelId) {
        displayCustomInputs(modelId, "inputsContainer");
      }

      if (selected === "fal" || selected === "replicate") {
        customInputsContainer.style.display = "block";
        outputSettingsContainer.style.display = "block";
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
