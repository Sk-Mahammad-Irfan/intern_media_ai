const providers = ["auto"];
const credits = [0];
const providerFields = {};
const customInputs = [];
const providerAspectRatios = {
  auto: []
};

document.addEventListener("DOMContentLoaded", () => {
  const assetTypeSelect = document.getElementById("assetType");
  const resolutionsContainer = document.getElementById("resolutionsContainer");

  assetTypeSelect.addEventListener("change", () => {
    resolutionsContainer.style.display = assetTypeSelect.value === "video" ? "block" : "none";
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

  const customInputsFormatted = customInputs.map(input => JSON.parse(input));

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
    aspect_ratios: document.getElementById("aspectRatios").value.split(",").map(a => a.trim()),
    resolutions: assetType === "video"
      ? document.getElementById("resolutions").value.split(",").map(r => r.trim())
      : [],
    provider_aspect_ratios: providerAspectRatios,
    tags: document.getElementById("tags").value.split(",").map(t => t.trim())
  };

  console.log("🔁 Submitting Model with data:", body);

  try {
    const res = await fetch("http://localhost:5000/api/model", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    alert("✅ Model added successfully!");
    console.log("🟢 Response:", data);
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
    deepinfra: "Deepinfra ID"
  };
  document.getElementById("specificFieldLabel").textContent = labelMap[provider] || "Provider Info";

  // Show modal
  const modal = new bootstrap.Modal(document.getElementById("providerModal"));
  modal.show();

  document.getElementById("providerModalSave").onclick = () => {
    const credit = parseInt(document.getElementById("providerCredit").value, 10);
    const aspectRatiosRaw = document.getElementById("providerAspectRatiosInput").value;
    const aspectRatios = aspectRatiosRaw.split(",").map(r => r.trim()).filter(Boolean);
    const specificFieldValue = document.getElementById("specificFieldValue").value;

    if (!credit || !specificFieldValue) {
      alert("Please fill all provider details.");
      return;
    }

    // Update state
    providers.push(provider);
    credits.push(credit);
    providerAspectRatios[provider] = aspectRatios;

    if (provider === "replicate") providerFields[provider] = { endpoint: specificFieldValue };
    if (provider === "fal") providerFields[provider] = { falid: specificFieldValue };
    if (provider === "together") providerFields[provider] = { togetherid: specificFieldValue };
    if (provider === "deepinfra") providerFields[provider] = { deepid: specificFieldValue };

    // UI update
    const html = `
      <div class="provider-section mb-3 p-3 border rounded bg-light">
        <strong class="d-block text-primary">${provider}</strong>
        <p><strong>Credit:</strong> ${credit}</p>
        <p><strong>Aspect Ratios:</strong> ${aspectRatios.join(", ") || "N/A"}</p>
        <p><strong>${labelMap[provider]}:</strong> ${specificFieldValue}</p>
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
  const modal = new bootstrap.Modal(document.getElementById("customInputModal"));
  modal.show();

  const typeSelect = document.getElementById("customInputType");
  const optionsContainer = document.getElementById("customInputOptionsContainer");

  typeSelect.onchange = () => {
    optionsContainer.style.display = typeSelect.value === "select" ? "block" : "none";
  };

  document.getElementById("customInputModalSave").onclick = () => {
    const id = document.getElementById("customInputId").value.trim();
    const type = typeSelect.value;
    const label = document.getElementById("customInputLabel").value.trim();
    const placeholder = document.getElementById("customInputPlaceholder").value.trim();
    const def = document.getElementById("customInputDefault").value.trim();
    const options = type === "select"
      ? document.getElementById("customInputOptions").value.split(",").map(o => o.trim())
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
      options
    };
    customInputs.push(JSON.stringify(inputObj));

    // Preview
    const html = `
      <div class="custom-input-section mb-3 p-3 border rounded bg-light">
        <strong class="d-block text-secondary">${id}</strong>
        <p><strong>Type:</strong> ${type}</p>
        <p><strong>Label:</strong> ${label}</p>
        <p><strong>Placeholder:</strong> ${placeholder || "-"}</p>
        <p><strong>Default:</strong> ${def || "-"}</p>
        <p><strong>Options:</strong> ${options.length > 0 ? options.join(", ") : "-"}</p>
      </div>
    `;
    document.getElementById("customInputs").innerHTML += html;

    modal.hide();
    document.getElementById("customInputModalForm").reset();
    console.log(`🟡 Added custom input: ${id}`);
  };
}
