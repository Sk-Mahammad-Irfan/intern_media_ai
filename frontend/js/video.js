const chat = document.getElementById("chat");
const providerSelect = document.getElementById("providerSelect");
const resolutionSelects = document.querySelectorAll(".resolutionSelect");
const aspectRatioSelects = document.querySelectorAll(".aspectRatioSelect");

const modelOptions = {
  "lightricks-ltx-video": {
    providers: ["replicate", "auto"],
    resolutions: {
      "360p": 512,
      "540p": 576,
      "720p": 640,
      "768p": 704,
      "1080p": 960,
    },
    aspect_ratios: [
      "1:1",
      "1:2",
      "2:1",
      "2:3",
      "3:2",
      "3:4",
      "4:3",
      "4:5",
      "5:4",
      "9:16",
      "16:9",
      "9:21",
      "21:9",
    ],
  },
  "luma-ray2-flash": {
    providers: ["fal", "auto"],
    resolutions: { "720p": null, "1080p": null },
    aspect_ratios: ["16:9", "9:16", "4:3", "3:4", "21:9", "9:21"],
  },
  "pika-text-to-video-v2-1": {
    providers: ["fal", "auto"],
    resolutions: { "720p": null, "1080p": null },
    aspect_ratios: ["16:9", "9:16", "4:3", "3:4", "21:9", "9:21"],
  },
  "pixverse-v4-text-to-video": {
    providers: ["fal", "auto"],
    resolutions: { "540p": null, "720p": null, "1080p": null },
    aspect_ratios: ["16:9", "4:3", "1:1", "3:4", "9:16"],
  },
  "wan-ai-wan21-t2v-13b": {
    providers: ["fal", "replicate", "deepinfra", "auto"],
    resolutions: { "480p": null },
    aspect_ratios: ["16:9", "9:16"],
  },
};

function getSelectedValue(selects) {
  for (const s of selects) {
    if (s.offsetParent !== null && s.value) return s.value;
  }
  return null;
}

function appendUserMessage(prompt) {
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
  const loadingMessage = document.querySelector(".generating-video");
  if (loadingMessage) loadingMessage.remove();

  const resolution = getSelectedValue(resolutionSelects) || "720p";
  const aspect_ratio = getSelectedValue(aspectRatioSelects) || "16:9";

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
  const prompt = document.getElementById("promptInput").value.trim();
  const resolution = getSelectedValue(resolutionSelects);
  const aspect_ratio = getSelectedValue(aspectRatioSelects);
  const provider = providerSelect.value;
  const modelId =
    new URLSearchParams(window.location.search).get("id") || "wan";
  const userId = localStorage.getItem("userId") || "guest";

  if (!prompt || !resolution || !aspect_ratio) {
    return alert("Please complete all required fields.");
  }

  appendUserMessage(prompt);
  appendGeneratingVideoMessage();

  try {
    let requestUrl = "";
    let requestBody = {};

    if (provider === "auto") {
      // Auto Mode (Basic Input)
      requestUrl = `${BACKEND_URL}/api/ai/generate-video/${modelId}`;
      requestBody = {
        prompt,
        resolution,
        aspect_ratio,
        userId,
      };
    } else if (provider === "fal") {
      // FAL Mode (Advanced)
      requestUrl = `${BACKEND_URL}/api/provider/video/${modelId}`;
      requestBody = {
        provider: "fal",
        prompt,
        resolution,
        aspect_ratio,
        shift: Number(document.getElementById("shiftInput").value) || 4,
        sampler: "unipc",
        num_inference_steps:
          Number(document.getElementById("stepsInput").value) || 30,
        guidance_scale:
          Number(document.getElementById("guidanceInput").value) || 7,
        negative_prompt:
          document.getElementById("negativePromptInput").value || "",
        seed: Number(document.getElementById("seedInput").value) || undefined,
        enable_prompt_expansion:
          document.getElementById("enableExpansion").checked,
        enable_safety_checker: document.getElementById("enableSafety").checked,
        frame_num: 81,
        userId,
      };
    } else if (provider === "replicate") {
      // FAL Mode (Advanced)
      requestUrl = `${BACKEND_URL}/api/provider/video/${modelId}`;
      requestBody = {
        provider: "replicate",
        prompt,
        resolution,
        aspect_ratio,
        shift: Number(document.getElementById("shiftInput").value) || 4,
        sampler: "unipc",
        num_inference_steps:
          Number(document.getElementById("stepsInput").value) || 30,
        guidance_scale:
          Number(document.getElementById("guidanceInput").value) || 7,
        negative_prompt:
          document.getElementById("negativePromptInput").value || "",
        seed: Number(document.getElementById("seedInput").value) || undefined,
        enable_prompt_expansion:
          document.getElementById("enableExpansion").checked,
        enable_safety_checker: document.getElementById("enableSafety").checked,
        frame_num: 81,
        userId,
      };
    } else {
      // Other providers like replicate, deepinfra
      requestUrl = `${BACKEND_URL}/api/provider/video/${modelId}`;
      requestBody = {
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
    if (!response.ok) return appendErrorMessage(data.error || "Server error.");
    if (data.videoUrl) appendGeneratedVideo(data.videoUrl);
    else appendErrorMessage("No video URL returned.");
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

function populateModelOptions(modelId) {
  const config = modelOptions[modelId];
  if (!config) return;

  // Populate providers
  providerSelect.innerHTML = `<option value="auto">Select Provider</option>`;
  config.providers.forEach((provider) => {
    const option = document.createElement("option");
    option.value = provider;
    option.textContent = provider;
    providerSelect.appendChild(option);
  });
  providerSelect.value = config.providers[0];

  // Populate resolutions
  resolutionSelects.forEach((select) => {
    select.innerHTML = `<option value="" disabled selected>Resolution</option>`;
    Object.keys(config.resolutions).forEach((res) => {
      const option = document.createElement("option");
      option.value = res;
      option.textContent = res;
      select.appendChild(option);
    });
    if (config.resolutions["720p"] !== undefined) select.value = "720p";
  });

  // Populate aspect ratios
  aspectRatioSelects.forEach((select) => {
    select.innerHTML = `<option value="" disabled selected>Aspect Ratio</option>`;
    config.aspect_ratios.forEach((ratio) => {
      const option = document.createElement("option");
      option.value = ratio;
      option.textContent = ratio;
      select.appendChild(option);
    });
    if (config.aspect_ratios.includes("16:9")) select.value = "16:9";
  });
}

function getModelIdFromURL() {
  return new URLSearchParams(window.location.search).get("id");
}

window.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const prompt = params.get("prompt");
  const modelId = getModelIdFromURL();
  if (modelId) populateModelOptions(modelId);

  if (prompt) {
    document.getElementById("promptInput").value = decodeURIComponent(prompt);
    appendUserMessage(prompt);
    appendGeneratingVideoMessage();
    generateVideo();
  }
});

providerSelect.addEventListener("change", () => {
  const selected = providerSelect.value;
  const falOptions = document.getElementById("falExtraOptions");
  falOptions.style.display = selected === "fal" ? "block" : "none";
  const replicateOptions = document.getElementById("replicateExtraOptions");
  replicateOptions.style.display = selected === "replicate" ? "block" : "none";
});
