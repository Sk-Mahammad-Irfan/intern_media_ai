(function () {
  // Global variable to store fetched models
  let models = {};

  // ⛔ Utility: Read ignored providers from localStorage
  function getIgnoredProviders() {
    const stored = localStorage.getItem("ignoredProviders");
    return stored ? new Set(JSON.parse(stored)) : new Set();
  }

  // ✅ Update the output displaying the ignored providers
  function updateOutput() {
    const ignoredProviders = getIgnoredProviders();
    const output = document.getElementById("ignoredProvidersOutput");
    output.innerHTML = "";

    if (ignoredProviders.size === 0) {
      output.textContent = "No providers are ignored.";
      return;
    }

    output.textContent = "Ignored providers: ";

    ignoredProviders.forEach((provider) => {
      const badge = document.createElement("span");
      badge.className = "badge bg-secondary me-1";
      badge.style.cursor = "pointer";
      badge.textContent = provider + " ✕";

      badge.onclick = function () {
        ignoredProviders.delete(provider);
        localStorage.setItem(
          "ignoredProviders",
          JSON.stringify(Array.from(ignoredProviders))
        );
        updateOutput();
        window.dispatchEvent(new Event("ignoredProvidersUpdated"));
      };

      output.appendChild(badge);
    });
  }

  // ✅ Fetch models from localStorage or backend and populate selector
  async function fetchAndPopulateModels() {
    try {
      const cachedModels = localStorage.getItem("models");
      console.log(cachedModels);
      let modelsData;
      if (cachedModels === "[]") {
        // If cached model is [], send request to fetch latest models
        const response = await fetch(`${BACKEND_URL}/api/model`);
        if (!response.ok) {
          throw new Error("Failed to fetch models");
        }
        modelsData = await response.json();
        localStorage.setItem("models", JSON.stringify(modelsData));
      } else if (cachedModels && cachedModels.length >= 1) {
        modelsData = JSON.parse(cachedModels);
        console.log("📦 Loaded models from localStorage.");
      }

      // Transform the array into an object with modelId as keys
      models = modelsData.reduce((acc, model) => {
        acc[model.modelId] = {
          id: model.modelId,
          title: model.name,
          provider: model.provider[0], // Taking first provider
          chatPage: model.chatPage || "imagemodel.html",
          assetType: model.assetType,
          credits: model.credits,
        };
        return acc;
      }, {});

      populateModelSelector();
    } catch (error) {
      console.error("Error fetching models:", error);
      const selector = document.getElementById("modelSelector");
      selector.innerHTML = "";
      const option = document.createElement("option");
      option.disabled = true;
      option.selected = true;
      option.textContent = "⚠️ Failed to load models";
      selector.appendChild(option);
    }
  }

  // ✅ Populate dropdown, skipping ignored providers
  function populateModelSelector() {
    const selector = document.getElementById("modelSelector");
    selector.innerHTML = "";

    const grouped = {
      "Text-to-Image": [],
      "Text-to-Video": [],
      "Text-to-Audio": [],
    };

    let hasUsableModels = false;

    for (const key in models) {
      const model = models[key];
      const assetType = model.assetType.toLowerCase();

      if (assetType.includes("image")) grouped["Text-to-Image"].push(model);
      else if (assetType.includes("video"))
        grouped["Text-to-Video"].push(model);
      else if (assetType.includes("audio"))
        grouped["Text-to-Audio"].push(model);

      hasUsableModels = true;
    }

    if (!hasUsableModels) {
      const option = document.createElement("option");
      option.disabled = true;
      option.selected = true;
      option.textContent = "⚠️ No models available";
      selector.appendChild(option);
      return;
    }

    for (const group in grouped) {
      if (grouped[group].length > 0) {
        const optgroup = document.createElement("optgroup");
        optgroup.label = group;

        grouped[group].forEach((model) => {
          const option = document.createElement("option");
          option.value = model.id;
          option.textContent = model.title;
          optgroup.appendChild(option);
        });

        selector.appendChild(optgroup);
      }
    }

    const selectedIdFromURL = getModelIdFromURL();
    if (selectedIdFromURL && models[selectedIdFromURL]) {
      selector.value = selectedIdFromURL;
    }
  }

  // ✅ Handle dropdown selection change
  function handleModelChange() {
    const selectedId = document.getElementById("modelSelector").value;
    if (!selectedId) return;

    const model = models[selectedId];
    if (model && model.chatPage) {
      const newUrl = `${model.chatPage}?id=${model.id}`;
      window.history.pushState({}, "", newUrl);
      window.location.href = newUrl;
    }
  }

  // ✅ Get model ID from URL
  function getModelIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
  }

  // ✅ Initialize on page load
  document.addEventListener("DOMContentLoaded", function () {
    fetchAndPopulateModels();
    updateOutput();
  });

  // ✅ Listen for changes to ignored providers and update the selector
  window.addEventListener("ignoredProvidersUpdated", function () {
    populateModelSelector();
  });

  // ✅ Handle ignored provider selection change
  const select = document.getElementById("ignoredProvidersSelect");
  if (select) {
    select.addEventListener("change", function () {
      const selected = select.value;
      if (selected && selected !== "Select a provider") {
        const ignoredProviders = getIgnoredProviders();
        ignoredProviders.add(selected);
        localStorage.setItem(
          "ignoredProviders",
          JSON.stringify(Array.from(ignoredProviders))
        );
        updateOutput();
        window.dispatchEvent(new Event("ignoredProvidersUpdated"));
      }
    });
  }

  // Multi-model mode toggle
  function toggleMultiModelMode() {
    const isChecked = document.getElementById("multiModelModeToggle").checked;
    const singleModelControlsList = document.querySelectorAll(
      ".singleModelControls"
    );
    const multiModelContainer = document.getElementById(
      "multiModelSelectionContainer"
    );
    const aspectRatioContainer =
      document.getElementById("aspectRatioSelect")?.parentElement;

    const providerSelect = document.getElementById("providerSelect");
    providerSelect.value = "auto";

    if (isChecked) {
      singleModelControlsList.forEach((control) => {
        control.classList.add("d-none");
        control.classList.remove("d-flex");
      });

      multiModelContainer.style.display = "block";
      if (aspectRatioContainer) aspectRatioContainer.style.display = "none";

      if (typeof populateModelCheckboxes === "function") {
        populateModelCheckboxes();
      }
    } else {
      singleModelControlsList.forEach((control) => {
        control.classList.remove("d-none");
        control.classList.add("d-flex");
      });

      multiModelContainer.style.display = "none";
      if (aspectRatioContainer) aspectRatioContainer.style.display = "flex";

      if (typeof selectedModels !== "undefined") {
        selectedModels = [];
      }
      updateTotalCredits();
    }
  }

  // Make functions globally accessible
  window.handleModelChange = handleModelChange;
  window.toggleMultiModelMode = toggleMultiModelMode;
})();
