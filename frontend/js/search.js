// ===================== MODEL DATA =====================
const models = {
  "black-forest-labs-flux-1-1-pro": {
    id: "black-forest-labs-flux-1-1-pro",
    title: "Black Forest Labs: FLUX-1.1 Pro",
    description:
      "Black Forest Labs' latest state-of-the-art proprietary model offering exceptional prompt following, visual quality, detail, and output diversity.",
    link: "https://deepinfra.com/black-forest-labs/FLUX-1.1-pro",
    fullDetails:
      "FLUX-1.1 Pro by Black Forest Labs delivers top-tier text-to-image generation with industry-leading prompt alignment, visual fidelity, intricate detailing, and outstanding output variety — ideal for creative, professional, and commercial applications.",
    chatPage: "imagemodel.html",
  },

  "recraft-v3": {
    id: "recraft-v3",
    title: "Recraft V3: Text-to-Image",
    description:
      "Recraft V3 is a state-of-the-art text-to-image model capable of generating long texts, vector art, images in brand styles, and much more.",
    link: "https://huggingface.co",
    fullDetails:
      "Recraft V3 offers unparalleled quality in text-to-image generation, excelling in creating detailed visuals across various styles and artistic outputs.",
    chatPage: "imagemodel.html",
  },

  fooocus: {
    id: "fooocus",
    title: "Fooocus: Base Model",
    description:
      "Fooocus is a powerful text-to-image model offering base parameters with automated optimizations and quality improvements for rapid and high-quality image generation.",
    link: "https://fal.ai",
    fullDetails:
      "Fooocus provides an optimized framework for rapid image generation, ensuring high visual quality with automated enhancements.",
    chatPage: "imagemodel.html",
  },

  // Text-to-Video
  "wan-ai-wan21-t2v-13b": {
    id: "wan-ai-wan21-t2v-13b",
    title: "Wan-AI: Wan2.1-T2V-1.3B",
    description:
      "A lightweight and efficient text-to-video model that delivers high-quality 480P video generation despite its compact 1.3B parameter size.",
    link: "https://huggingface.co/Wan-AI/Wan2.1-T2V-1.3B",
    fullDetails:
      "Wan2.1-T2V-1.3B is designed for fast, resource-efficient text-to-video synthesis.",
    chatPage: "videomodel.html",
  },

  "lightricks-ltx-video": {
    id: "lightricks-ltx-video",
    title: "Lightricks: LTX-Video",
    description:
      "LTX-Video is the first DiT-based video generation model capable of producing high-quality 24 FPS videos at 768x512 resolution in real time.",
    link: "https://huggingface.co/lightricks/ltx-video",
    fullDetails:
      "Developed by Lightricks, LTX-Video leverages DiT to deliver ultra-fast, high-resolution video generation.",
    chatPage: "videomodel.html",
  },

  "pixverse-v4-text-to-video": {
    id: "pixverse-v4-text-to-video",
    title: "PixVerse: Text-to-Video v4",
    description:
      "Generate high-quality video clips from text and image prompts using PixVerse v4.",
    link: "https://huggingface.co/pixverse/v4/text-to-video",
    fullDetails:
      "PixVerse v4 enables state-of-the-art text-to-video and image-to-video generation.",
    chatPage: "videomodel.html",
  },

  // Text-to-Audio
  "stackadoc-stable-audio": {
    id: "stackadoc-stable-audio",
    title: "Stable Audio Open 1.0",
    description:
      "An open-source model for generating short audio samples, sound effects, and production elements using text prompts.",
    link: "https://huggingface.co/spaces/stackadoc/stable-audio-open-1.0",
    fullDetails:
      "Stable Audio Open 1.0 is designed for generating short-form audio like sound effects and musical elements.",
    chatPage: "audiomodel.html",
  },
};

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

  const filtered = Object.values(models).filter((model) =>
    model.title.toLowerCase().includes(query)
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
    resultItem.innerHTML = `<strong>${model.title}</strong><br><small>${model.description}</small>`;
    searchResultsContainer.appendChild(resultItem);
  });

  searchResultsContainer.style.display = "block";
});

// Hide results on outside click
document.addEventListener("click", function (e) {
  if (!searchResultsContainer.contains(e.target) && e.target !== searchInput) {
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

  const filtered = Object.values(models).filter((model) =>
    model.title.toLowerCase().includes(query)
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
    resultItem.innerHTML = `<strong>${model.title}</strong><br><small>${model.description}</small>`;
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
