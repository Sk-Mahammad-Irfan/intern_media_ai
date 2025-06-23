const providers = ["auto"];
const credits = [0];
const providerFields = {};
const customInputs = [];
const providerAspectRatios = {
  auto: [], // dummy entry to match "auto"
};

document.addEventListener("DOMContentLoaded", () => {
  const resolutionsContainer = document.getElementById("resolutionsContainer");
  const assetTypeSelect = document.getElementById("assetType");

  assetTypeSelect.addEventListener("change", () => {
    const type = assetTypeSelect.value;
    resolutionsContainer.style.display = type === "video" ? "block" : "none";
  });

  assetTypeSelect.dispatchEvent(new Event("change"));
});

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
    credits: credits,
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

  console.log("Request Body:", body);

  const res = await fetch("http://localhost:5000/api/model", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  alert("Model added: " + JSON.stringify(data));
});

function addProvider() {
  const provider = document.getElementById("provider").value;

  if (providers.includes(provider)) {
    alert("Provider already added.");
    return;
  }

  const credit = parseInt(prompt(`Enter credit for ${provider}:`));
  const aspectInput = prompt(
    `Enter aspect ratios for ${provider} (comma separated):`
  );
  const aspectRatios = aspectInput
    .split(",")
    .map((r) => r.trim())
    .filter((r) => r);

  let specificFieldValue = "";
  if (provider === "replicate") {
    specificFieldValue = prompt("Enter endpoint URL:");
    providerFields["replicate"] = { endpoint: specificFieldValue };
  } else if (provider === "fal") {
    specificFieldValue = prompt("Enter Fal ID:");
    providerFields["fal"] = { falid: specificFieldValue };
  } else if (provider === "together") {
    specificFieldValue = prompt("Enter Together ID:");
    providerFields["together"] = { togetherid: specificFieldValue };
  } else if (provider === "deepinfra") {
    specificFieldValue = prompt("Enter Deepinfra ID:");
    providerFields["deepinfra"] = { deepid: specificFieldValue };
  }

  providers.push(provider);
  credits.push(credit);
  providerAspectRatios[provider] = aspectRatios;

  // UI Preview (not editable)
  const html = `
    <div class="provider-section mb-3 p-3 border rounded bg-light">
      <strong class="d-block mb-2">${provider}</strong>
      <p><strong>Credit:</strong> ${credit}</p>
      <p><strong>Aspect Ratios:</strong> ${aspectRatios.join(", ")}</p>
      <p><strong>${
        provider === "replicate"
          ? "Endpoint"
          : provider === "fal"
          ? "Fal ID"
          : provider === "together"
          ? "Together ID"
          : "Deepinfra ID"
      }:</strong> ${specificFieldValue}</p>
    </div>
  `;
  document.getElementById("providerFields").innerHTML += html;
}

function addCustomInput() {
  const id = prompt("Input ID:");
  const type = prompt("Type (text, number, checkbox, select):");
  const label = prompt("Label:");
  const placeholder = prompt("Placeholder (optional):");
  const options =
    type === "select" ? prompt("Options (comma separated):").split(",") : [];
  const def = prompt("Default Value (match type):");

  const input = {
    id,
    type,
    label,
    placeholder,
    default: def === "null" ? null : def,
    options: options.map((o) => o.trim()),
  };
  customInputs.push(JSON.stringify(input));

  const html = `
    <div class="custom-input-section mb-3 p-3 border rounded bg-light">
      <strong class="d-block mb-2">${id}</strong>
      <p><strong>Type:</strong> ${type}</p>
      <p><strong>Label:</strong> ${label}</p>
      <p><strong>Placeholder:</strong> ${placeholder || "none"}</p>
      <p><strong>Default:</strong> ${def || "none"}</p>
      <p><strong>Options:</strong> ${options.join(", ")}</p>
    </div>
  `;
  document.getElementById("customInputs").innerHTML += html;
}
