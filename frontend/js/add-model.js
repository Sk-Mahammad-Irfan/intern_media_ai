const providers = ["auto"];
const credits = [0];
const providerFields = {};
const customInputs = [];
const providerAspectRatios = {
  auto: [],
};

document.addEventListener("DOMContentLoaded", () => {
  const assetTypeSelect = document.getElementById("assetType");
  const resolutionsContainer = document.getElementById("resolutionsContainer");

  assetTypeSelect.addEventListener("change", () => {
    resolutionsContainer.style.display =
      assetTypeSelect.value === "video" ? "block" : "none";
  });

  assetTypeSelect.dispatchEvent(new Event("change"));
});

// Main form submission
document.getElementById("modelForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const assetType = document.getElementById("assetType").value;
  const modelId = name.toLowerCase().replace(/\s+/g, "-");
  const chatPage = assetType + "model.html";

  const customInputsFormatted = customInputs.map((input) => JSON.parse(input));

  const body = {
    modelId,
    name,
    assetType,
    provider: providers,
    credits,
    endpoint: providerFields["replicate"]?.endpoint || "",
    falid: providerFields["fal"]?.falid || "",
    togetherid: providerFields["together"]?.togetherid || "",
    deepid: providerFields["deepinfra"]?.deepid || "",
    description: document.getElementById("description").value,
    link: document.getElementById("link").value,
    fullDetails: document.getElementById("fullDetails").value,
    chatPage,
    creditPrice: document.getElementById("creditPrice").value,
    isActive: true,
    custom_inputs: customInputsFormatted,
    aspect_ratios: document
      .getElementById("aspectRatios")
      .value.split(",")
      .map((a) => a.trim()),
    resolutions:
      assetType === "video"
        ? document
            .getElementById("resolutions")
            .value.split(",")
            .map((r) => r.trim())
        : [],
    provider_aspect_ratios: providerAspectRatios,
    tags: document
      .getElementById("tags")
      .value.split(",")
      .map((t) => t.trim()),
  };

  console.log("🔁 Submitting Model with data:", body);

  try {
    const res = await fetch(`${BACKEND_URL}/api/model`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    localStorage.setItem("models", JSON.stringify(data));
    console.log("🌐 Fetched models from backend and cached.");
    alert("✅ Model added successfully!");
  } catch (error) {
    console.error("❌ Submission failed:", error);
    alert("Failed to submit model. Check console.");
  }
});

// Add Provider via Modal
function addProvider() {
  const provider = document.getElementById("provider").value;

  if (providers.includes(provider)) {
    alert("⚠️ Provider already added.");
    return;
  }

  const labelMap = {
    replicate: "Endpoint URL",
    fal: "FAL ID",
    together: "Together ID",
    deepinfra: "Deepinfra ID",
  };
  document.getElementById(
    "specificFieldLabel"
  ).innerHTML = `<i class="fas fa-key me-1"></i>${
    labelMap[provider] || "Provider Info"
  }`;

  // Show modal
  const modal = new bootstrap.Modal(document.getElementById("providerModal"));
  modal.show();

  document.getElementById("providerModalSave").onclick = () => {
    const creditInput = document.getElementById("providerCredit").value;
    const credit = parseFloat(creditInput); // Changed from parseInt to parseFloat
    const aspectRatiosRaw = document.getElementById(
      "providerAspectRatiosInput"
    ).value;
    const aspectRatios = aspectRatiosRaw
      .split(",")
      .map((r) => r.trim())
      .filter(Boolean);
    const specificFieldValue =
      document.getElementById("specificFieldValue").value;

    if (isNaN(credit) || !specificFieldValue) {
      alert("Please fill all provider details.");
      return;
    }

    // Update state
    providers.push(provider);
    credits.push(credit);
    providerAspectRatios[provider] = aspectRatios;

    if (provider === "replicate")
      providerFields[provider] = { endpoint: specificFieldValue };
    if (provider === "fal")
      providerFields[provider] = { falid: specificFieldValue };
    if (provider === "together")
      providerFields[provider] = { togetherid: specificFieldValue };
    if (provider === "deepinfra")
      providerFields[provider] = { deepid: specificFieldValue };

    // UI update
    const html = `
                  <div class="provider-section">
                      <strong class="d-block mb-2">
                          <i class="fas fa-server me-2"></i>${provider.toUpperCase()}
                      </strong>
                      <p class="mb-1"><strong><i class="fas fa-coins me-1"></i>Credit:</strong> ${credit}</p>
                      <p class="mb-1"><strong><i class="fas fa-expand-arrows-alt me-1"></i>Aspect Ratios:</strong> ${
                        aspectRatios.join(", ") || "N/A"
                      }</p>
                      <p class="mb-0"><strong><i class="fas fa-key me-1"></i>${
                        labelMap[provider]
                      }:</strong> ${specificFieldValue}</p>
                  </div>
              `;
    document.getElementById("providerFields").innerHTML += html;

    modal.hide();
    document.getElementById("providerModalForm").reset();
    console.log(`✅ Added provider: ${provider}`);
  };
}

// Add Custom Input via Modal
function addCustomInput() {
  const modal = new bootstrap.Modal(
    document.getElementById("customInputModal")
  );
  modal.show();

  const typeSelect = document.getElementById("customInputType");
  const optionsContainer = document.getElementById(
    "customInputOptionsContainer"
  );

  typeSelect.onchange = () => {
    optionsContainer.style.display =
      typeSelect.value === "select" ? "block" : "none";
  };

  document.getElementById("customInputModalSave").onclick = () => {
    const id = document.getElementById("customInputId").value.trim();
    const type = typeSelect.value;
    const label = document.getElementById("customInputLabel").value.trim();
    const placeholder = document
      .getElementById("customInputPlaceholder")
      .value.trim();
    const def = document.getElementById("customInputDefault").value.trim();
    const options =
      type === "select"
        ? document
            .getElementById("customInputOptions")
            .value.split(",")
            .map((o) => o.trim())
        : [];

    if (!id || !type || !label) {
      alert("Please fill required custom input fields.");
      return;
    }

    const inputObj = {
      id,
      type,
      label,
      placeholder,
      default: def === "null" ? null : def,
      options,
    };
    customInputs.push(JSON.stringify(inputObj));

    // Preview
    const typeIcons = {
      text: "fas fa-font",
      number: "fas fa-hashtag",
      checkbox: "fas fa-check-square",
      select: "fas fa-list",
    };

    const html = `
                    <div class="custom-input-section">
                        <strong class="d-block mb-2">
                            <i class="${typeIcons[type]} me-2"></i>${id}
                        </strong>
                        <p class="mb-1"><strong><i class="fas fa-tag me-1"></i>Type:</strong> ${type}</p>
                        <p class="mb-1"><strong><i class="fas fa-label me-1"></i>Label:</strong> ${label}</p>
                        <p class="mb-1"><strong><i class="fas fa-edit me-1"></i>Placeholder:</strong> ${
                          placeholder || "-"
                        }</p>
                        <p class="mb-1"><strong><i class="fas fa-star me-1"></i>Default:</strong> ${
                          def || "-"
                        }</p>
                        <p class="mb-0"><strong><i class="fas fa-list-ul me-1"></i>Options:</strong> ${
                          options.length > 0 ? options.join(", ") : "-"
                        }</p>
                    </div>
                `;
    document.getElementById("customInputs").innerHTML += html;

    modal.hide();
    document.getElementById("customInputModalForm").reset();
    console.log(`🟡 Added custom input: ${id}`);
  };
}
