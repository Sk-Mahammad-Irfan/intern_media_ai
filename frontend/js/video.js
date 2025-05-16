const chat = document.getElementById("chat");

const modelOptions = {
  "lightricks-ltx-video": {
    resolutions: {
      "360p": 512,
      "540p": 576,
      "720p": 640,
      "768p": 704,
      "1080p": 960,
    },
    aspect_ratios: [
      "1:1", "1:2", "2:1", "2:3", "3:2", "3:4",
      "4:3", "4:5", "5:4", "9:16", "16:9", "9:21", "21:9"
    ],
  },
  "luma-ray2-flash": {
    resolutions: { "720p": null, "1080p": null },
    aspect_ratios: ["16:9", "9:16", "1:1", "4:5", "5:4", "3:2", "2:3"],
  },
  "pika-text-to-video-v2-1": {
    resolutions: { "720p": null, "1080p": null },
    aspect_ratios: ["16:9", "4:3", "1:1", "3:4", "9:16"],
  },
  "pixverse-v4-text-to-video": {
    resolutions: { "540p": null, "720p": null, "1080p": null },
    aspect_ratios: ["16:9", "9:16", "4:3", "3:4", "21:9", "9:21"],
  },
  "wan-ai-wan21-t2v-13b": {
    resolutions: { "480p": null },
    aspect_ratios: ["16:9", "9:16"],
  },
};

const resolutionSelects = document.querySelectorAll(".resolutionSelect");
const aspectRatioSelects = document.querySelectorAll(".aspectRatioSelect");

function appendUserMessage(prompt) {
  const userWrapper = document.createElement("div");
  userWrapper.className = "d-flex flex-column align-items-end mb-3 position-relative";

  userWrapper.innerHTML = `
    <div class="user-message p-3">
      ${prompt}
    </div>
    <i class="bi bi-clipboard-fill text-secondary mt-1" style="cursor: pointer; font-size: 14px;" onclick="copyToClipboard(this)" title="Copy"></i>
  `;

  chat.appendChild(userWrapper);
  chat.scrollTop = chat.scrollHeight;
}

function appendGeneratingVideoMessage() {
  const aiDiv = document.createElement("div");
  aiDiv.className = "d-flex justify-content-start mb-3 generating-video";
  aiDiv.innerHTML = `
    <div class="ai-message p-3 text-muted d-flex align-items-center">
      <i class="bi bi-camera-reels me-2"></i>
      Generating video &nbsp;
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

  const resolution = getSelectedValue(resolutionSelects) || "540p";
  const aspect_ratio = getSelectedValue(aspectRatioSelects) || "16:9";

  const messageElement = document.createElement("div");
  messageElement.classList.add("d-flex", "justify-content-start", "mb-3");

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

  const videoElement = document.createElement("video");
  videoElement.controls = true;
  videoElement.src = videoUrl;
  videoElement.style.width = "100%";
  videoElement.style.height = "100%";
  videoElement.style.display = "block";
  videoElement.style.objectFit = "contain";
  videoElement.onloadedmetadata = () => {
    wrapper.style.aspectRatio = `${videoElement.videoWidth} / ${videoElement.videoHeight}`;
  };

  wrapper.appendChild(videoElement);
  bubble.appendChild(caption);
  bubble.appendChild(meta);
  bubble.appendChild(wrapper);
  messageElement.appendChild(bubble);
  chat.appendChild(messageElement);
  chat.scrollTop = chat.scrollHeight;
}

function getSelectedValue(selects) {
  for (const s of selects) {
    if (s && s.value) return s.value;
  }
  return null;
}

async function generateVideo() {
  const prompt = document.getElementById("promptInput").value.trim();
  const resolution = getSelectedValue(resolutionSelects);
  const aspect_ratio = getSelectedValue(aspectRatioSelects);
  const userId = localStorage.getItem("userId") || "guest";

  if (!prompt) return alert("Please enter a prompt.");
  if (!resolution) return alert("Please select a resolution.");
  if (!aspect_ratio) return alert("Please select an aspect ratio.");

  appendUserMessage(prompt);
  appendGeneratingVideoMessage();

  try {
    const modelId = new URLSearchParams(window.location.search).get("id") || "pixverse-v4-text-to-video";
    const response = await fetch(`${BACKEND_URL}/api/ai/generate-video/${modelId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, resolution, aspect_ratio, userId }),
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
  const messageText = icon.previousElementSibling.innerText.trim();
  navigator.clipboard.writeText(messageText)
    .then(() => {
      icon.classList.replace("bi-clipboard-fill", "bi-clipboard-check-fill");
      setTimeout(() => icon.classList.replace("bi-clipboard-check-fill", "bi-clipboard-fill"), 1500);
    })
    .catch((err) => console.error("Copy failed:", err));
}

function populateModelOptions(modelId) {
  const config = modelOptions[modelId];
  if (!config) return console.warn("No config found for model:", modelId);

  resolutionSelects.forEach(select => {
    select.innerHTML = `<option value="" selected>Resolution</option>`;
    Object.keys(config.resolutions).forEach(res => {
      const option = document.createElement("option");
      option.value = res;
      option.textContent = res;
      select.appendChild(option);
    });
    if (config.resolutions["720p"] !== undefined) select.value = "720p";
  });

  aspectRatioSelects.forEach(select => {
    select.innerHTML = `<option value="" selected>Aspect Ratio</option>`;
    config.aspect_ratios.forEach(ratio => {
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
  const input = document.getElementById("promptInput");
  const modelId = getModelIdFromURL();

  if (modelId) populateModelOptions(modelId);

  if (prompt && input) {
    const decodedPrompt = decodeURIComponent(prompt);
    input.value = decodedPrompt;
    appendUserMessage(decodedPrompt);
    appendGeneratingVideoMessage();
    generateVideo();
  }
});

["newRoomBtnSidebar", "newRoomBtnMobile"].forEach((id) => {
  const btn = document.getElementById(id);
  if (btn) {
    btn.addEventListener("click", () => {
      const createdAt = new Date().toISOString();
      const url = `${window.location.origin}${window.location.pathname}?room=${encodeURIComponent(createdAt)}`;
      window.open(url, "_blank");
    });
  }
});

const params = new URLSearchParams(window.location.search);
const roomCreatedAt = params.get("room");
if (roomCreatedAt) {
  const date = new Date(roomCreatedAt);
  const formatted = date.toLocaleString(undefined, {
    weekday: "short", year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit"
  });
  document.getElementById("roomTitle").textContent = "Room created";
  document.getElementById("roomTimestamp").textContent = formatted;
}

document.addEventListener("DOMContentLoaded", () => {
  const userData = JSON.parse(localStorage.getItem("user_data") || "{}");
  const avatars = document.querySelectorAll("#navbar-avatar");
  const userElements = {
    desktop: {
      username: document.getElementById("account-username"),
      email: document.getElementById("account-email"),
    },
    mobile: {
      username: document.getElementById("account-username-mobile"),
      email: document.getElementById("account-email-mobile"),
    },
  };
  const isLoggedIn = !!userData.username;

  if (isLoggedIn) {
    const username = userData.username;
    const firstInitial = username.trim()[0]?.toUpperCase() || "U";
    avatars.forEach(avatar => avatar.textContent = firstInitial);
    userElements.desktop.username && (userElements.desktop.username.textContent = username);
    userElements.desktop.email && (userElements.desktop.email.textContent = userData.email || "No email");
    userElements.mobile.username && (userElements.mobile.username.textContent = username);
    userElements.mobile.email && (userElements.mobile.email.textContent = userData.email || "No email");
  } else {
    avatars.forEach(avatar => avatar.innerHTML = `<i class="fa-solid fa-user"></i>`);
    ["desktop", "mobile"].forEach(view => {
      userElements[view].username && (userElements[view].username.textContent = "Guest");
      userElements[view].email && (userElements[view].email.textContent = "");
    });
  }
});
