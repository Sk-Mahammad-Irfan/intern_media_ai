function handleModelChange() {
  const selectedId = document.getElementById("modelSelector").value;
  if (!selectedId) return;

  const model = models[selectedId];
  if (model && model.chatPage) {
    const newUrl = `${model.chatPage}?id=${model.id}`;

    // Update URL in address bar without reloading
    window.history.pushState({}, "", newUrl);

    // Optionally, navigate to the page
    window.location.href = newUrl;
  }
}

function getModelIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function populateModelSelector() {
  const selector = document.getElementById("modelSelector");
  selector.innerHTML = ""; // Clear existing options

  const grouped = {
    "Text-to-Image": [],
    "Text-to-Video": [],
    "Text-to-Audio": [],
  };

  for (const key in models) {
    const model = models[key];
    const page = model.chatPage;

    if (page.includes("image")) grouped["Text-to-Image"].push(model);
    else if (page.includes("video")) grouped["Text-to-Video"].push(model);
    else if (page.includes("audio")) grouped["Text-to-Audio"].push(model);
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

  // Set selected model based on URL
  const selectedIdFromURL = getModelIdFromURL();
  if (selectedIdFromURL && models[selectedIdFromURL]) {
    selector.value = selectedIdFromURL;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  populateModelSelector();
});
