// Global variable to store models
let allmodels = {
  image: [],
  video: [],
  audio: [],
};

// Function to fetch all required data from backend
async function fetchAllData() {
  const container = document.querySelector(".main-content");

  // Show loading indicator
  container.innerHTML = `
    <div id="loadingIndicator" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-3 text-muted">Loading models...</p>
    </div>
  `;

  try {
    const response = await fetch(`${backendBaseURL}/api/model`);
    if (!response.ok) throw new Error("Failed to fetch models");

    const modelsArray = await response.json();

    allmodels = {
      image: modelsArray
        .filter((model) => model.assetType.toLowerCase() === "image")
        .map((model) => ({
          ...model,
          price: model.credits ? Math.max(...model.credits) : 0,
        })),
      video: modelsArray
        .filter((model) => model.assetType.toLowerCase() === "video")
        .map((model) => ({
          ...model,
          price: model.credits ? Math.max(...model.credits) : 0,
        })),
      audio: modelsArray
        .filter((model) => model.assetType.toLowerCase() === "audio")
        .map((model) => ({
          ...model,
          price: model.credits ? Math.max(...model.credits) : 0,
        })),
    };

    renderAllModels();
  } catch (error) {
    console.error("Error fetching data:", error);

    container.innerHTML = `
      <div class="alert alert-danger" role="alert">
        Failed to load models. Please try again later.
        <button class="btn btn-sm btn-outline-danger mt-2" onclick="fetchAllData()">Retry</button>
      </div>
    `;
  }
}

// Modified renderAllModels to work with backend data structure
function renderAllModels() {
  const container = document.querySelector(".main-content");
  container.innerHTML = ""; // Clear existing content

  // Create filter controls
  const filterControls = document.createElement("div");
  filterControls.className = "filter-controls mb-5 p-3 rounded";
  filterControls.innerHTML = `
    <div class="container-fluid px-0">
      <div class="row g-3 align-items-end">
        <div class="col-md-4">
          <label for="model-search" class="form-label fw-bold">Search Models</label>
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-search"></i></span>
            <input 
              type="text" 
              id="model-search" 
              class="form-control" 
              placeholder="Search by name, description or tags..."
            >
          </div>
        </div>
        <div class="col-md-3">
          <label for="category-filter" class="form-label fw-bold">Category</label>
          <select id="category-filter" class="form-select">
            <option value="all">All Categories</option>
            <option value="image">Image Models</option>
            <option value="video">Video Models</option>
            <option value="audio">Audio Models</option>
          </select>
        </div>
        <div class="col-md-3">
          <label for="sort-by" class="form-label fw-bold">Sort By</label>
          <select id="sort-by" class="form-select">
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
          </select>
        </div>
        <div class="col-md-2 d-flex align-items-end">
          <button id="reset-filters" class="btn btn-outline-secondary w-100">
            <i class="bi bi-arrow-counterclockwise"></i> Reset
          </button>
        </div>
      </div>
    </div>
  `;
  container.appendChild(filterControls);

  // Models container
  const modelsContainer = document.createElement("div");
  modelsContainer.id = "models-container";
  container.appendChild(modelsContainer);

  function filterAndRenderModels() {
    const searchTerm = document
      .getElementById("model-search")
      .value.toLowerCase();
    const categoryFilter = document.getElementById("category-filter").value;
    const sortBy = document.getElementById("sort-by").value;

    modelsContainer.innerHTML = "";

    const filteredCategories = {};

    Object.entries(allmodels).forEach(([category, modelList]) => {
      if (categoryFilter !== "all" && category !== categoryFilter) return;

      const filteredModels = modelList.filter((model) => {
        const matchesSearch =
          model.name.toLowerCase().includes(searchTerm) ||
          (model.description &&
            model.description.toLowerCase().includes(searchTerm)) ||
          (model.tags &&
            model.tags.some((tag) => tag.toLowerCase().includes(searchTerm)));

        return matchesSearch;
      });

      if (filteredModels.length > 0) {
        filteredModels.sort((a, b) => {
          switch (sortBy) {
            case "name-asc":
              return a.name.localeCompare(b.name);
            case "name-desc":
              return b.name.localeCompare(a.name);
            case "price-asc":
              return (a.price || 0) - (b.price || 0);
            case "price-desc":
              return (b.price || 0) - (a.price || 0);
            default:
              return 0;
          }
        });

        filteredCategories[category] = filteredModels;
      }
    });

    // Render filtered and sorted models
    Object.entries(filteredCategories).forEach(([category, modelList]) => {
      const categoryTitle =
        category.charAt(0).toUpperCase() + category.slice(1);
      const section = document.createElement("section");
      section.className = "model-section mb-5";
      section.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h4 class="section-title m-0">
            <i class="fa-solid fa-${getCategoryIcon(
              category
            )} me-2 text-primary"></i>
            <span>${categoryTitle} Models</span>
            <span class="badge bg-primary rounded-pill">${
              modelList.length
            }</span>
          </h4>
        </div>
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4" id="${category}-models"></div>
        <hr class="my-4">
      `;

      modelsContainer.appendChild(section);

      const grid = document.getElementById(`${category}-models`);
      modelList.forEach((model) => {
        const card = document.createElement("div");
        card.className = "col";
        card.innerHTML = `
          <div class="card h-100 d-flex flex-column model-card shadow-sm" data-id="${
            model.modelId
          }">
            <div class="card-body flex-grow-1 d-flex flex-column justify-content-between">
              <div>
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <h5 class="card-title mb-1">${model.name}</h5>
                  <div class="model-icons">
                    <i class="bi bi-${
                      model.isActive
                        ? "check-circle-fill text-success"
                        : "x-circle-fill text-danger"
                    }"></i>
                  </div>
                </div>
                <p class="card-text text-muted small">${
                  model.description || "No description available"
                }</p>
              </div>

              <div class="d-flex justify-content-between align-items-center mt-3">
                <span class="badge bg-light text-dark border rounded-pill">
                  <i class="bi bi-coin me-1"></i>
                  ${model.price || "?"} credits
                </span>
                ${
                  model.link
                    ? `
                <a href="${model.link}" target="_blank" class="text-decoration-none small" onclick="event.stopPropagation()">
                  <i class="bi bi-box-arrow-up-right"></i> Details
                </a>
                `
                    : ""
                }
              </div>
            </div>

            ${
              model.tags && model.tags.length > 0
                ? `
            <div class="card-footer bg-transparent border-top-0 pt-0">
              <div class="model-tags d-flex flex-wrap gap-1">
                ${model.tags
                  .map(
                    (tag) => `<span class="badge bg-secondary">${tag}</span>`
                  )
                  .join("")}
              </div>
            </div>
            `
                : ""
            }
          </div>
        `;

        card.querySelector(".model-card").addEventListener("click", () => {
          window.location.href = `model-details.html?id=${model.modelId}`;
        });

        grid.appendChild(card);
      });
    });

    // Show message if no models found
    if (Object.keys(filteredCategories).length === 0) {
      modelsContainer.innerHTML = `
        <div class="text-center py-5">
          <i class="bi bi-search display-5 text-muted mb-3"></i>
          <h4 class="text-muted">No models found</h4>
          <p class="text-muted">Try adjusting your search or filters</p>
          <button id="reset-all-filters" class="btn btn-primary mt-3">
            <i class="bi bi-arrow-counterclockwise"></i> Reset all filters
          </button>
        </div>
      `;

      document
        .getElementById("reset-all-filters")
        .addEventListener("click", () => {
          document.getElementById("model-search").value = "";
          document.getElementById("category-filter").value = "all";
          document.getElementById("sort-by").value = "name-asc";
          filterAndRenderModels();
        });
    }
  }

  // Initial render
  filterAndRenderModels();

  // Event listeners for filters
  document
    .getElementById("model-search")
    .addEventListener("input", filterAndRenderModels);
  document
    .getElementById("category-filter")
    .addEventListener("change", filterAndRenderModels);
  document
    .getElementById("sort-by")
    .addEventListener("change", filterAndRenderModels);
  document.getElementById("reset-filters").addEventListener("click", () => {
    document.getElementById("model-search").value = "";
    document.getElementById("category-filter").value = "all";
    document.getElementById("sort-by").value = "name-asc";
    filterAndRenderModels();
  });
}

function getCategoryIcon(category) {
  const icons = {
    image: "images",
    video: "film",
    audio: "podcast",
  };
  return icons[category] || "box";
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", fetchAllData);
