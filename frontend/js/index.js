  // Set default selected model ID and name
  let selectedModel = "wan-ai-wan21-t2v-13b"; // default ID
  const modelNames = {
    "wan-ai-wan21-t2v-13b": "Wan-AI: Wan2.1-T2V-1.3B",
    "black-forest-labs-flux-1-1-pro": "Black Forest Labs: FLUX-1.1 Pro",
    "pixverse-v4-text-to-video": "PixVerse: v4",
    "stackadoc-stable-audio": "Stable Audio Open 1.0",
  };

  // Utility to update status text
  function updateModelStatus(isDefault = false) {
    const statusEl = document.getElementById("modelStatus");
    const modelName = modelNames[selectedModel] || selectedModel;
    statusEl.innerHTML = `You can select one of the models from the featured models. Currently it's set to <strong>${modelName}${isDefault ? " (default)" : ""}</strong>.`;
  }

  // Apply 'selected' class to the default model card
  const defaultCard = document.querySelector(`.model-card[data-model="${selectedModel}"]`);
  if (defaultCard) {
    defaultCard.classList.add("selected");
  }

  // Initial status update
  updateModelStatus(true);

  // Add click listeners to model cards
  document.querySelectorAll('.model-card').forEach(card => {
    card.addEventListener('click', function () {
      selectedModel = card.getAttribute('data-model');

      // Highlight selected card
      document.querySelectorAll('.model-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');

      // Update status (not default anymore)
      updateModelStatus(false);
    });
  });

  // Handle prompt submission
  document.getElementById("submitPrompt").addEventListener("click", function () {
  const prompt = document.querySelector(".model-prompt-box input").value.trim();

  if (!selectedModel) {
    alert("Please select a model first.");
    return;
  }

  if (!prompt) {
    alert("Please enter a prompt.");
    return;
  }

  // Determine the correct page based on model type
  let page = "imagemodel.html"; // Default
  const selectedCard = document.querySelector(`.model-card[data-model="${selectedModel}"]`);
  if (selectedCard.classList.contains("video-model")) {
    page = "videomodel.html";
  } else if (selectedCard.classList.contains("audio-model")) {
    page = "audiomodel.html";
  }

  // Redirect
  window.location.href = `${page}?id=${selectedModel}&prompt=${encodeURIComponent(prompt)}`;
});

// Add click listeners to prompt badges (THIS MUST BE OUTSIDE submitPrompt handler)
document.querySelectorAll('.carousel-item .badge').forEach(badge => {
  badge.style.cursor = 'pointer';  // Make it clear they are clickable
  badge.addEventListener('click', () => {
    const promptInput = document.querySelector(".model-prompt-box input");
    if (promptInput) {
      promptInput.value = badge.textContent;
    }
  });
});