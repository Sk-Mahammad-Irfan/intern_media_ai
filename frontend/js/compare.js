document.addEventListener("DOMContentLoaded", () => {
  initComparePage();
});

// Global model cache
let allModels = {};

// Initialize Compare Page
function initComparePage() {
  fetchModels();
  setupDropdownListener();
}

// Fetch models from backend
async function fetchModels() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/model`);
    if (!response.ok) throw new Error("Failed to fetch models");
    const data = await response.json();

    // Store models by modelId
    data.forEach((model) => {
      allModels[model.modelId] = model;
    });

    const urlParams = new URLSearchParams(window.location.search);
    const model1Id = urlParams.get("id");

    if (model1Id) {
      renderModel(model1Id, "model1");

      const model1Type = allModels[model1Id]?.assetType;
      if (model1Type) populateDropdown(model1Type, model1Id);
    }
  } catch (error) {
    console.error("Failed to fetch models:", error);
  }
}

// Render model card in a container
function renderModel(id, containerId) {
  const container = document.getElementById(containerId);
  const model = allModels[id];

  if (!container) {
    console.warn(`Container with ID "${containerId}" not found.`);
    return;
  }

  if (!model) {
    container.innerHTML = `<div class="alert alert-warning">Model ID "${id}" not found.</div>`;
    return;
  }

  container.innerHTML = `
    <div class="model-column border rounded-4 p-4 shadow-sm bg-white h-100">
      <div class="model-header d-flex justify-content-between align-items-start mb-3">
        <h4 class="fw-semibold mb-0 text-primary">${model.name}</h4>
        <div class="text-muted fs-5">
          ${(model.tags || [])
            .map((tag) => `<i class="bi bi-star me-2" title="${tag}"></i>`)
            .join("")}
        </div>
      </div>

      <p class="text-muted mb-2"><strong>Type:</strong> ${model.assetType}</p>
      <p class="mb-3">${model.description}</p>

      <p class="mb-2 model-price fw-medium">
        <i class="bi bi-coin text-warning me-1"></i> ${model.creditPrice}
      </p>

      <p class="text-muted mb-3">
        <strong>Source:</strong>
        <a href="${model.link}" target="_blank" class="text-decoration-none">${
    model.link
  }</a>
      </p>

      <div class="performance-metrics border-top pt-3 mb-4">
        <div class="metric mb-2 d-flex justify-content-between">
          <span><strong>Latency:</strong></span> <span>~150ms</span>
        </div>
        <div class="metric mb-2 d-flex justify-content-between">
          <span><strong>Resolution:</strong></span> <span>${
            (model.resolutions || []).join(", ") || "1024x1024"
          }</span>
        </div>
        <div class="metric d-flex justify-content-between">
          <span><strong>Output Quality:</strong></span> <span>High</span>
        </div>
      </div>

      <a href="model-details.html?id=${id}" class="btn btn-outline-primary w-100">View Details</a>
    </div>
  `;
}

// Populate second model dropdown
function populateDropdown(modelType, excludeId) {
  const dropdown = document.getElementById("secondModelSelect");
  const categoryHeading = document.getElementById("categoryHeading");

  if (!dropdown || !categoryHeading) return;

  dropdown.innerHTML = "<option value=''>Select Another Model</option>";

  for (const key in allModels) {
    const model = allModels[key];
    if (model.assetType === modelType && key !== excludeId) {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = model.name;
      dropdown.appendChild(option);
    }
  }

  categoryHeading.innerHTML = `<strong>Category:</strong> <span class="text-dark">${modelType}</span>`;
}

// Setup dropdown change listener
function setupDropdownListener() {
  const dropdown = document.getElementById("secondModelSelect");
  if (!dropdown) return;

  dropdown.addEventListener("change", function () {
    const selectedId = this.value;
    const model2Container = document.getElementById("model2");

    if (!model2Container) return;

    if (selectedId) {
      renderModel(selectedId, "model2");
    } else {
      model2Container.innerHTML = "";
    }
  });
}
