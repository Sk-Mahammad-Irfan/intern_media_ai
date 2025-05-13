
// Helper to get ignored providers from localStorage
function getIgnoredProviders() {
  const stored = localStorage.getItem("ignoredProviders");
  return stored ? new Set(JSON.parse(stored)) : new Set();
}

// Function to update the ignored providers display (show badges)
function updateOutput() {
  const ignoredProviders = getIgnoredProviders();
  const output = document.getElementById("ignoredProvidersOutput");
  output.innerHTML = ""; // Reset output

  if (ignoredProviders.size === 0) {
    output.textContent = "No providers are ignored.";
    return;
  }

  output.textContent = "Ignored providers: ";

  // Show badges for ignored providers
  Array.from(ignoredProviders).forEach(provider => {
    const badge = document.createElement("span");
    badge.className = "badge bg-secondary me-1";
    badge.style.cursor = "pointer";
    badge.textContent = provider + " ✕";

    // When badge is clicked, un-ignore the provider
    badge.onclick = function () {
      ignoredProviders.delete(provider);
      localStorage.setItem("ignoredProviders", JSON.stringify(Array.from(ignoredProviders)));
      updateOutput(); // Update the output
      updateUsableProviders(); // Update the UI for models
    };

    output.appendChild(badge);
  });
}

// Function to update the UI (hide or show model cards based on ignored providers)
function updateUsableProviders() {
  const ignoredProviders = getIgnoredProviders();
  
  // Hide model cards or buttons associated with ignored providers
  document.querySelectorAll("[data-provider]").forEach((el) => {
    const providerId = el.getAttribute("data-provider");
    if (ignoredProviders.has(providerId)) {
      el.style.display = "none"; // Or: el.classList.add("disabled");
    } else {
      el.style.display = ""; // Reset to visible
    }
  });
}

// Example dynamic rendering logic (You can replace this with your own API logic)
async function renderModels(modelsFromApi) {
  const container = document.getElementById("modelContainer");
  container.innerHTML = ""; // Clear previous models

  const ignoredProviders = getIgnoredProviders();
  modelsFromApi.forEach(model => {
    if (ignoredProviders.has(model.provider)) {
      return; // Skip rendering ignored provider
    }

    const card = document.createElement("div");
    card.className = "model-card";
    card.setAttribute("data-provider", model.provider);
    card.innerHTML = `<h5>${model.name}</h5><p>${model.description}</p>`;
    container.appendChild(card);
  });
}

// Example of dynamically fetching models and rendering them (replace with actual API call)
document.addEventListener("DOMContentLoaded", function () {
  const modelsFromApi = [
    { provider: "replicate", name: "Replicate – Text to Image", description: "Generate images from text." },
    { provider: "fal", name: "FAL AI – Text to Video", description: "Generate videos from text." },
    { provider: "deepinfra", name: "DeepInfra – Text to Audio", description: "Generate audio from text." },
    { provider: "huggingface", name: "HuggingFace – Text Model", description: "Text processing with HuggingFace." },
  ];

  // Render models
  renderModels(modelsFromApi);
  // Update UI to hide models associated with ignored providers
  updateUsableProviders();
  // Update the ignored providers display (badges)
  updateOutput();
});

