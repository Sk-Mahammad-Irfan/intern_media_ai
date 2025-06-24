let models = {}; // This will store our fetched models

// Function to fetch models from backend
async function fetchModels() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/model`);
    if (!response.ok) throw new Error("Failed to fetch models");
    const modelsArray = await response.json();

    // Convert array to object with modelId as key
    models = modelsArray.reduce((acc, model) => {
      acc[model.modelId] = {
        id: model.modelId,
        title: model.name,
        description: model.description,
        link: model.link,
        fullDetails: model.fullDetails,
        chatPage: model.chatPage,
        creditPrice: model.creditPrice,
        providers: Array.isArray(model.provider)
          ? model.provider
          : [model.provider],
        tags: model.tags || [],
        isActive: model.isActive,
      };
      return acc;
    }, {});

    // Initialize search functionality after data is loaded
    initSearch();
  } catch (error) {
    console.error("Error fetching models:", error);
    // Show error to user
    const searchContainers = [
      document.getElementById("navbarSearch")?.parentNode,
      document.getElementById("mobileSearchResults"),
    ];

    searchContainers.forEach((container) => {
      if (container) {
        container.innerHTML = `
          <div class="alert alert-danger" role="alert">
            Failed to load models. Please try again later.
            <button class="btn btn-sm btn-outline-danger mt-2" onclick="fetchModels()">Retry</button>
          </div>
        `;
      }
    });
  }
}

// Search functionality
function initSearch() {
  // ===================== DESKTOP SEARCH =====================
  const searchInput = document.getElementById("navbarSearch");
  const searchResultsContainer = document.createElement("div");

  searchResultsContainer.className =
    "search-results position-absolute bg-white border rounded shadow mt-1 w-100";
  searchResultsContainer.style.zIndex = "1050";
  searchResultsContainer.style.maxHeight = "300px";
  searchResultsContainer.style.overflowY = "auto";

  searchInput?.parentNode?.appendChild(searchResultsContainer);

  searchInput?.addEventListener("input", function () {
    const query = this.value.toLowerCase().trim();
    searchResultsContainer.innerHTML = "";

    if (query.length === 0) {
      searchResultsContainer.style.display = "none";
      return;
    }

    const filtered = Object.values(models).filter(
      (model) =>
        model.title.toLowerCase().includes(query) ||
        (model.description &&
          model.description.toLowerCase().includes(query)) ||
        (model.tags &&
          model.tags.some((tag) => tag.toLowerCase().includes(query)))
    );

    if (filtered.length === 0) {
      searchResultsContainer.innerHTML =
        "<div class='p-2 text-muted'>No results found</div>";
      searchResultsContainer.style.display = "block";
      return;
    }

    filtered.forEach((model) => {
      const resultItem = document.createElement("a");
      resultItem.href = `model-details.html?id=${encodeURIComponent(model.id)}`;
      resultItem.className =
        "d-block px-3 py-2 text-decoration-none text-dark search-result-item";
      resultItem.innerHTML = `<strong>${model.title}</strong><br><small>${
        model.description || "No description available"
      }</small>`;
      searchResultsContainer.appendChild(resultItem);
    });

    searchResultsContainer.style.display = "block";
  });

  // Hide results on outside click
  document.addEventListener("click", function (e) {
    if (
      !searchResultsContainer.contains(e.target) &&
      e.target !== searchInput
    ) {
      searchResultsContainer.style.display = "none";
    }
  });

  // ===================== MOBILE SEARCH =====================
  const mobileSearchInput = document.getElementById("mobileSearchInput");
  const searchResultsMobile = document.getElementById("mobileSearchResults");

  mobileSearchInput?.addEventListener("input", function () {
    const query = this.value.toLowerCase().trim();
    searchResultsMobile.innerHTML = "";

    if (query.length === 0) {
      searchResultsMobile.style.display = "none";
      return;
    }

    const filtered = Object.values(models).filter(
      (model) =>
        model.title.toLowerCase().includes(query) ||
        (model.description &&
          model.description.toLowerCase().includes(query)) ||
        (model.tags &&
          model.tags.some((tag) => tag.toLowerCase().includes(query)))
    );

    if (filtered.length === 0) {
      searchResultsMobile.innerHTML =
        "<div class='p-2 text-muted'>No results found</div>";
      searchResultsMobile.style.display = "block";
      return;
    }

    filtered.forEach((model) => {
      const resultItem = document.createElement("a");
      resultItem.href = `model-details.html?id=${encodeURIComponent(model.id)}`;
      resultItem.className =
        "d-block px-3 py-2 text-decoration-none text-dark search-result-item";
      resultItem.innerHTML = `<strong>${model.title}</strong><br><small>${
        model.description || "No description available"
      }</small>`;
      searchResultsMobile.appendChild(resultItem);
    });

    searchResultsMobile.style.display = "block";
  });

  // Hide mobile results on outside click
  document.addEventListener("click", function (e) {
    if (
      !searchResultsMobile.contains(e.target) &&
      e.target !== mobileSearchInput
    ) {
      searchResultsMobile.style.display = "none";
    }
  });
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", fetchModels);
