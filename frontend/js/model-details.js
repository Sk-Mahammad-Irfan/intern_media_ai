document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const modelId = urlParams.get("id");

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
  };

  const modelData = {
    "black-forest-labs-flux-1-1-pro": {
      title: "Black Forest Labs: FLUX-1.1 Pro",
      description:
        "Black Forest Labs' latest state-of-the-art proprietary model offering exceptional prompt following, visual quality, detail, and output diversity.",
      link: "https://deepinfra.com/black-forest-labs/FLUX-1.1-pro",
      fullDetails:
        "FLUX-1.1 Pro by Black Forest Labs delivers top-tier text-to-image generation with industry-leading prompt alignment, visual fidelity, intricate detailing, and outstanding output variety — ideal for creative, professional, and commercial applications.",
      chatPage: "imagemodel.html",
      creditPrice: "5 credits/image",
      providers: ["fal", "replicate", "deepinfra"],
    },

    "recraft-v3": {
      title: "Recraft V3: Text-to-Image",
      description:
        "Recraft V3 is a state-of-the-art text-to-image model capable of generating long texts, vector art, images in brand styles, and much more. Proven by Hugging Face's leading Text-to-Image Benchmark by Artificial Analysis.",
      link: "https://huggingface.co",
      fullDetails:
        "Recraft V3 offers unparalleled quality in text-to-image generation, excelling in creating detailed visuals across various styles and artistic outputs. It is recognized as one of the best performing models in the industry, delivering consistent results that meet the demands of creative professionals.",
      chatPage: "imagemodel.html",
      creditPrice: "4 credits/image",
      providers: ["fal"],
    },
    fooocus: {
      title: "Fooocus: Base Model",
      description:
        "Fooocus is a powerful text-to-image model offering base parameters with automated optimizations and quality improvements for rapid and high-quality image generation.",
      link: "https://fal.ai",
      fullDetails:
        "Fooocus provides an optimized framework for rapid image generation, ensuring high visual quality with automated enhancements. It serves as a flexible solution for a wide range of creative applications, from general design to professional content creation.",
      chatPage: "imagemodel.html",
      creditPrice: "3 credits/image",
      providers: ["fal"],
    },

    // Text-to-Video
    "wan-ai-wan21-t2v-13b": {
      title: "Wan-AI: Wan2.1-T2V-1.3B",
      description:
        "A lightweight and efficient text-to-video model that delivers high-quality 480P video generation despite its compact 1.3B parameter size.",
      link: "https://huggingface.co/Wan-AI/Wan2.1-T2V-1.3B",
      fullDetails:
        "Wan2.1-T2V-1.3B is designed for fast, resource-efficient text-to-video synthesis. Ideal for developers, creators, and researchers seeking scalable video generation with high fidelity and speed.",
      chatPage: "videomodel.html",
      creditPrice: "10 credits/second",
      providers: ["fal", "replicate", "deepinfra"],
    },

    "lightricks-ltx-video": {
      title: "Lightricks: LTX-Video",
      description:
        "LTX-Video is the first DiT-based video generation model capable of producing high-quality 24 FPS videos at 768x512 resolution in real time.",
      link: "https://huggingface.co/lightricks/ltx-video",
      fullDetails:
        "Developed by Lightricks, LTX-Video leverages DiT (Denoising Diffusion Transformer) to deliver ultra-fast, high-resolution video generation. It enables real-time rendering, making it ideal for content creators, developers, and media applications requiring fast turnaround.",
      chatPage: "videomodel.html",
      creditPrice: "15 credits/second",
      providers: ["replicate"],
    },
    "pixverse-v4-text-to-video": {
      title: "PixVerse: Text-to-Video v4",
      description:
        "Generate high-quality video clips from text and image prompts using PixVerse v4, designed for advanced creative workflows.",
      link: "https://huggingface.co/pixverse/v4/text-to-video",
      fullDetails:
        "PixVerse v4 enables state-of-the-art text-to-video and image-to-video generation, offering creators the ability to produce cinematic, high-resolution video content from simple prompts. It's ideal for storytellers, designers, and multimedia developers.",
      chatPage: "videomodel.html",
      creditPrice: "12 credits/second",
      providers: ["fal"],
    },

    // Text-to-Audio
    "stackadoc-stable-audio": {
      title: "Stable Audio Open 1.0",
      description:
        "An open-source model for generating short audio samples, sound effects, and production elements using text prompts.",
      link: "https://huggingface.co/spaces/stackadoc/stable-audio-open-1.0",
      fullDetails:
        "Stable Audio Open 1.0 is designed for generating short-form audio like sound effects and musical elements. It supports creative workflows in game development, video production, and audio prototyping with natural, prompt-based sound generation.",
      chatPage: "audiomodel.html",
      creditPrice: "8 credits/second",
      providers: ["replicate", "fal"],
      providers: ["replicate", "fal"],
    },
    "cassetteai-sfx-generator": {
      title: "CassetteAI Music Generator",
      description:
        "Fast, high-quality AI music generation producing studio-ready tracks in seconds.",
      link: "https://fal.ai/models/cassetteai/music-generator",
      fullDetails:
        "CassetteAI’s music generator creates a 30-second music sample in under 2 seconds and a full 3-minute track in under 10 seconds. Operating at 44.1 kHz stereo, it ensures professional-grade consistency with no breaks, squeaks, or glitches. Ideal for producers, game developers, and content creators.",
      chatPage: "audiomodel.html",
      creditPrice: "6 credits/second",
      providers: ["fal"],
    },
    "cassattemusic-audio": {
      title: "CassetteAI Music Generator",
      description:
        "Fast, high-quality AI music generation producing studio-ready tracks in seconds.",
      link: "https://fal.ai/models/cassetteai/music-generator",
      fullDetails:
        "CassetteAI’s music generator creates a 30-second music sample in under 2 seconds and a full 3-minute track in under 10 seconds. Operating at 44.1 kHz stereo, it ensures professional-grade consistency with no breaks, squeaks, or glitches. Ideal for producers, game developers, and content creators.",
      chatPage: "audiomodel.html",
      creditPrice: "3 credits/100 characters",
      providers: ["fal"],
    },
    "multilingual-audio": {
      title: "Multilingual TTS",
      description:
        "Text-to-speech generation in multiple languages with high clarity and diverse voices.",
      link: "https://fal.ai/models/fal-ai/elevenlabs/tts/multilingual-v2",
      fullDetails:
        "Multilingual TTS by ElevenLabs supports a wide range of languages and accents, enabling natural voice generation across global content. It's a great fit for multilingual applications and localization.",
      chatPage: "audiomodel.html",
      creditPrice: "5 credits/100 characters",
      providers: ["fal"],
    },

    "american-audio": {
      title: "American English TTS",
      description:
        "Generate natural American English voices for narration, characters, and content creation.",
      link: "https://fal.ai/models/fal-ai/kokoro/american-english",
      fullDetails:
        "This American English TTS model offers high-quality, fluent, and natural-sounding speech, making it suitable for virtual assistants, video dubbing, and storytelling use cases.",
      chatPage: "audiomodel.html",
      creditPrice: "4 credits/100 characters",
      providers: ["fal"],
    },
    "pika-text-to-video-v2-1": {
      title: "Pika Text to Video v2.1",
      description:
        "Generate high-quality, cinematic videos from text prompts with Pika's advanced v2.1 model – ideal for storytelling and visual ideation.",
      link: "https://fal.ai/models/fal-ai/pika/v2.1/text-to-video",
      fullDetails:
        "Pika v2.1 transforms written prompts into cinematic video clips with impressive realism and motion dynamics. Optimized for storytelling, concept art, and idea prototyping, this model delivers fast, visually engaging outputs directly from text.",
      chatPage: "videomodel.html",
      creditPrice: "18 credits/second",
      providers: ["fal"],
    },
    "luma-ray2-flash": {
      title: "Luma Dream Machine: Ray 2 Flash",
      description:
        "Ray 2 Flash generates realistic, coherent video scenes from text prompts with high speed and cinematic motion quality.",
      link: "https://fal.ai/models/fal-ai/luma-dream-machine/ray-2-flash",
      fullDetails:
        "Luma's Dream Machine: Ray 2 Flash is a high-performance text-to-video model designed for speed and realism. It excels at generating vivid visuals with smooth, natural motion, making it ideal for creative storytelling, concept videos, and prototyping cinematic scenes.",
      chatPage: "videomodel.html",
      creditPrice: "20 credits/second",
      providers: ["fal"],
    },
    "hidream-i1-dev": {
      title: "HiDream I1 (Dev)",
      description:
        "HiDream I1 generates high-quality, imaginative images from text prompts with speed and clarity – ideal for concept art and design prototyping.",
      link: "https://fal.ai/models/fal-ai/hidream-i1-dev",
      fullDetails:
        "HiDream I1 (Dev) is a text-to-image model optimized for fast generation and visual fidelity. It excels at interpreting imaginative prompts and rendering detailed visuals, making it suitable for artists, creatives, and rapid prototyping scenarios.",
      chatPage: "imagemodel.html",
      creditPrice: "6 credits/image",
    },
    "ideogram-v3": {
      title: "Ideogram V3",
      description:
        "Turn complex, creative prompts into visually rich illustrations with Ideogram V3 – ideal for surreal, conceptual, and narrative-driven artwork.",
      link: "https://fal.ai/models/fal-ai/ideogram/v3",
      fullDetails:
        "Ideogram V3 is a next-gen text-to-image model crafted for storytelling and imaginative concepts. It excels at rendering scenes with symbolic, surreal, or fantastical elements, making it perfect for writers, concept artists, and world-builders.",
      chatPage: "imagemodel.html",
      creditPrice: "7 credits/image",
    },
  };

  const model = modelData[modelId];

  if (model) {
    document.getElementById("model-title").textContent = model.title;
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

    // Optional: Set up chat button redirection
    const chatButton = document.getElementById("chat-button");
    if (chatButton) {
      chatButton.addEventListener("click", function () {
        if (model.chatPage) {
          window.location.href = `${model.chatPage}?id=${modelId}`;
        }
      });
    }
  } else {
    document.getElementById("model-title").textContent = "Model Not Found";
    document.getElementById("model-full-details").textContent =
      "The requested model ID is invalid or not available.";
    document.getElementById("credit-price-container").style.display = "none";
  }

  const providerHeader = document.getElementById("provider-header");

  providerHeader.innerHTML = `
  <h5 class="mb-1">Providers for ${model.title}</h5>
  <p class="text-muted">
    OpenMediaFlow <a href="https://openmediaflow.netlify.app/docs" target="_blank">routes requests</a>
    to the best providers that are able to handle your prompt size and parameters, with fallbacks to maximize uptime.
    <i class="bi bi-info-circle" title="OpenRouter selects providers based on capacity and availability."></i>
  </p>
`;

  const providerSection = document.getElementById("provider-details-section");

  if (model.providers && model.providers.length > 0) {
    model.providers.forEach((providerId) => {
      const p = providers[providerId];
      if (!p) return;

      const providerHTML = `
      <div class="border-top pt-3 mt-3">
        <h5>
        ${p.name}
          <span class="badge text-bg-light ms-2"><i class="bi bi-cpu me-1"></i>${p.precision}</span>
        </h5>
        <div class="d-flex flex-wrap gap-4 text-muted mt-2">
          <div><i class="bi bi-arrows-angle-expand me-1"></i><strong>Context:</strong> ${p.context}</div>
          <div><i class="bi bi-file-earmark-text me-1"></i><strong>Max Output:</strong> ${p.maxOutput}</div>
          <div><i class="bi bi-download me-1"></i><strong>Input:</strong> ${p.inputCost}</div>
          <div><i class="bi bi-upload me-1"></i><strong>Output:</strong> ${p.outputCost}</div>
          <div><i class="bi bi-stopwatch me-1"></i><strong>Latency:</strong> ${p.latency}</div>
          <div><i class="bi bi-graph-up-arrow me-1"></i><strong>Throughput:</strong> ${p.throughput}</div>
        </div>
      </div>
    `;

      providerSection.innerHTML += providerHTML;
    });
  } else {
    providerSection.innerHTML = `<p class="text-muted">No provider data available.</p>`;
  }

  function setAvatarInitials() {
    const userData = JSON.parse(localStorage.getItem("user_data") || "{}");

    const avatars = document.querySelectorAll("#navbar-avatar");
    const userElements = {
      desktop: {
        username: document.getElementById("account-username"),
        email: document.getElementById("account-email"),
      },
      mobile: {
        username: document.getElementById("account-username-mobile"),
        email: document.getElementById("account-email-mobile"),
      },
    };

    const isLoggedIn = !!userData.username;

    if (isLoggedIn) {
      const username = userData.username;
      const firstInitial = username.trim()[0]?.toUpperCase() || "U";

      avatars.forEach((avatar) => (avatar.textContent = firstInitial));

      userElements.desktop.username &&
        (userElements.desktop.username.textContent = username);
      userElements.desktop.email &&
        (userElements.desktop.email.textContent = userData.email || "No email");

      userElements.mobile.username &&
        (userElements.mobile.username.textContent = username);
      userElements.mobile.email &&
        (userElements.mobile.email.textContent = userData.email || "No email");
    } else {
      avatars.forEach((avatar) => {
        avatar.innerHTML = `<i class="fa-solid fa-user"></i>`;
      });

      ["desktop", "mobile"].forEach((view) => {
        userElements[view].username &&
          (userElements[view].username.textContent = "Guest");
        userElements[view].email && (userElements[view].email.textContent = "");
      });
    }
  }

  setAvatarInitials();
});
