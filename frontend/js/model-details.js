document.addEventListener("DOMContentLoaded", async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const modelId = urlParams.get("id");

  // Show loading state
  document.getElementById("model-title").textContent = "Loading model...";
  document.getElementById("model-full-details").textContent =
    "Please wait while we load the model details.";

  const providers = {
    replicate: {
      name: "Replicate",
      location: "DE",
      precision: "fp8",
      context: "41K",
      maxOutput: "41K",
      inputCost: "$0.10",
      outputCost: "$0.30",
      latency: "0.84s",
      throughput: "32.29 tps",
    },
    fal: {
      name: "Fal AI",
      location: "US",
      precision: "fp8",
      context: "128K",
      maxOutput: "128K",
      inputCost: "$0.10",
      outputCost: "$0.45",
      latency: "1.53s",
      throughput: "23.16 tps",
    },
    deepinfra: {
      name: "DeepInfra",
      location: "US",
      precision: "fp8",
      context: "41K",
      maxOutput: "41K",
      inputCost: "$0.10",
      outputCost: "$0.30",
      latency: "1.00s",
      throughput: "40.95 tps",
    },
    together: {
      name: "Together",
      location: "US",
      precision: "fp8",
      context: "23K",
      maxOutput: "23K",
      inputCost: "$0.12",
      outputCost: "$0.35",
      latency: "1.27s",
      throughput: "29.12 tps",
    },
  };

  try {
    if (!modelId) {
      throw new Error("No model ID specified in URL");
    }

    // Fetch specific model data from backend
    const response = await fetch(`${BACKEND_URL}/api/model/${modelId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch model: ${response.statusText}`);
    }

    const model = await response.json();

    // Populate model data
    document.getElementById("model-title").textContent = model.name;
    document.getElementById("model-description").textContent =
      model.description;
    document.getElementById("model-link").textContent = model.link;
    document.getElementById("model-link").href = model.link;
    document.getElementById("model-full-details").textContent =
      model.fullDetails;

    // Display credit price
    if (model.creditPrice) {
      document.getElementById("credit-price").textContent = model.creditPrice;
    } else {
      document.getElementById("credit-price-container").style.display = "none";
    }

    // Set up chat button redirection
    const chatButton = document.getElementById("chat-button");
    if (chatButton && model.chatPage) {
      chatButton.addEventListener("click", function () {
        window.location.href = `${model.chatPage}?id=${modelId}`;
      });
    }

    // Set up provider section
    const providerHeader = document.getElementById("provider-header");
    providerHeader.innerHTML = `
      <h5 class="mb-2">Providers for ${model.name}</h5>
      <p class="text-muted mb-4">
        OpenMediaFlow <a href="https://openmediaflow.netlify.app/docs" target="_blank">routes requests</a>
        to the best providers that are able to handle your prompt size and parameters, with fallbacks to maximize uptime.
        <i class="bi bi-info-circle ms-1" title="OpenRouter selects providers based on capacity and availability."></i>
      </p>
    `;

    const providerSection = document.getElementById("provider-details-section");

    if (model.provider && model.provider.length > 0) {
      model.provider.forEach((providerId) => {
        const p = providers[providerId];
        if (!p) return;

        const providerHTML = `
          <div class="card mb-4 shadow-sm border rounded-3">
            <div class="card-body">
              <h5 class="card-title d-flex align-items-center justify-content-between">
                ${p.name}
                <span class="badge bg-light text-dark border border-secondary ms-2"><i class="bi bi-cpu me-1"></i>${p.precision}</span>
              </h5>
              <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3 text-muted mt-3">
                <div><i class="bi bi-arrows-angle-expand me-2"></i><strong>Context:</strong> ${p.context}</div>
                <div><i class="bi bi-file-earmark-text me-2"></i><strong>Max Output:</strong> ${p.maxOutput}</div>
                <div><i class="bi bi-download me-2"></i><strong>Input:</strong> ${p.inputCost}</div>
                <div><i class="bi bi-upload me-2"></i><strong>Output:</strong> ${p.outputCost}</div>
                <div><i class="bi bi-stopwatch me-2"></i><strong>Latency:</strong> ${p.latency}</div>
                <div><i class="bi bi-graph-up-arrow me-2"></i><strong>Throughput:</strong> ${p.throughput}</div>
              </div>
            </div>
          </div>
        `;

        providerSection.innerHTML += providerHTML;
      });
    } else {
      providerSection.innerHTML = `<p class="text-muted">No provider data available.</p>`;
    }
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("model-title").textContent = "Error Loading Model";
    document.getElementById("model-full-details").textContent =
      error.message || "Failed to load model data. Please try again later.";
    document.getElementById("credit-price-container").style.display = "none";
    document.getElementById("provider-header").style.display = "none";
    document.getElementById("provider-details-section").style.display = "none";
  }
});
