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
      creditPrice: "4-5 credits/image",
      providers: ["fal", "deepinfra"],
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
      creditPrice: "10-18 credits/second",
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
      creditPrice: "5 credits/second",
      providers: ["replicate"],
    },
    "kling-video-v2-master": {
      title: "Kling 2.0 Master",
      description:
        "Generate video clips from your prompts using Kling 2.0 Master – high-speed, cinematic text-to-video generation with exceptional motion quality.",
      link: "https://fal.ai/models/fal-ai/kling-video/v2/master/text-to-video",
      fullDetails:
        "Kling 2.0 Master delivers ultra-fast and visually compelling video generation from natural language prompts. Optimized for storytelling, content creation, and idea visualization, this model offers smooth motion, cinematic aesthetics, and creative flexibility.",
      chatPage: "videomodel.html",
      creditPrice: "40 credits/second",
      providers: ["fal"],
    },
    magi: {
      title: "MAGI-1",
      description:
        "MAGI-1 is a video generation model with exceptional understanding of physical interactions and cinematic prompts.",
      link: "https://fal.ai/models/fal-ai/magi",
      fullDetails:
        "MAGI-1 stands out for its advanced reasoning around physics, spatial dynamics, and cinematic structure. From simple text prompts, it creates visually rich video clips that excel in realism and motion logic. Ideal for simulations, storytelling, and creative ideation.",
      chatPage: "videomodel.html",
      creditPrice: "40 credits/second",
      providers: ["fal"],
    },
    "vidu-q1": {
      title: "Vidu Q1",
      description:
        "Vidu Q1 Text to Video generates high-quality 1080p videos with exceptional visual quality and motion diversity.",
      link: "https://fal.ai/models/fal-ai/vidu/q1/text-to-video",
      fullDetails:
        "Vidu Q1 is engineered for producing crisp 1080p video from natural language prompts. With outstanding clarity, diverse motion, and cinematic realism, it’s tailored for creators seeking professional results in visual storytelling, ideation, and content production.",
      chatPage: "videomodel.html",
      creditPrice: "40 credits/second",
      providers: ["fal"],
    },
    veo2: {
      id: "veo2",
      title: "Veo 2",
      description:
        "Veo 2 creates videos with realistic motion and high quality output. Explore different styles and find your own with extensive camera controls.",
      link: "https://fal.ai/models/fal-ai/veo2",
      fullDetails:
        "Veo 2 is a powerful text-to-video model that emphasizes stylistic flexibility, cinematic quality, and precise motion control. With advanced camera options and support for a range of visual aesthetics, it’s ideal for creators looking to produce polished, professional-grade video content directly from text.",
      chatPage: "videomodel.html",
      creditPrice: "40 credits/second",
      providers: ["fal"],
    },
    "pixverse-v4-text-to-video": {
      title: "PixVerse: Text-to-Video v4",
      description:
        "Generate high-quality video clips from text and image prompts using PixVerse v4, designed for advanced creative workflows.",
      link: "https://huggingface.co/pixverse/v4/text-to-video",
      fullDetails:
        "PixVerse v4 enables state-of-the-art text-to-video and image-to-video generation, offering creators the ability to produce cinematic, high-resolution video content from simple prompts. It's ideal for storytellers, designers, and multimedia developers.",
      chatPage: "videomodel.html",
      creditPrice: "27-70 credits/second",
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
      creditPrice: "1 credits/generation",
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
      creditPrice: "1 credits/generation",
      providers: ["fal"],
    },
    "fal-ai-lyria2": {
      title: "Lyria 2 by Google DeepMind",
      description:
        "Advanced AI model for generating a wide range of music genres using natural language prompts.",
      link: "https://huggingface.co/fal-ai/lyria2",
      fullDetails:
        "Lyria 2 is Google DeepMind’s latest music generation model, offering high-fidelity, versatile musical compositions with natural instrument simulation and multi-track support. Ideal for artists, developers, and creatives seeking AI-generated music.",
      chatPage: "audiomodel.html",
      creditPrice: "1 credits/generation",
      providers: ["fal"],
    },
    "fal-ai-kokoro-hindi": {
      title: "Kokoro Hindi TTS",
      description:
        "A fast and expressive Hindi text-to-speech model with clear pronunciation and accurate intonation.",
      link: "https://huggingface.co/fal-ai/kokoro/hindi",
      fullDetails:
        "Kokoro Hindi is an advanced TTS model from fal.ai designed to deliver expressive and natural-sounding Hindi speech. Optimized for clarity, prosody, and speed, it's ideal for voice apps, narration, and accessibility tools.",
      chatPage: "audiomodel.html",
      creditPrice: "1 credits/generation",
      providers: ["fal"],
    },
    "fal-ai-elevenlabs-sound-effects": {
      title: "ElevenLabs Sound Effects",
      description:
        "Generate sound effects using ElevenLabs' advanced sound effects model.",
      link: "https://huggingface.co/fal-ai/elevenlabs/sound-effects",
      fullDetails:
        "This sound effects generator from ElevenLabs enables high-quality, AI-generated audio snippets across a variety of themes and use cases. Perfect for games, films, and multimedia projects needing immersive sound design.",
      chatPage: "audiomodel.html",
      creditPrice: "1 credits/generation",
      providers: ["fal"],
    },
    "fal-ai-mmaudio-v2-text-to-audio": {
      title: "MMAudio V2 Text-to-Audio",
      description:
        "MMAudio generates synchronized audio from text inputs, creating sounds directly from descriptive prompts.",
      link: "https://huggingface.co/fal-ai/mmaudio-v2/text-to-audio",
      fullDetails:
        "MMAudio V2 is a powerful text-to-audio generation model capable of producing synchronized, realistic audio clips from natural language prompts. Ideal for sound design, multimedia content, and accessibility solutions.",
      chatPage: "audiomodel.html",
      creditPrice: "1 credits/generation",
      providers: ["huggingface"],
    },
    "cassattemusic-audio": {
      title: "CassetteAI Music Generator",
      description:
        "Fast, high-quality AI music generation producing studio-ready tracks in seconds.",
      link: "https://fal.ai/models/cassetteai/music-generator",
      fullDetails:
        "CassetteAI’s music generator creates a 30-second music sample in under 2 seconds and a full 3-minute track in under 10 seconds. Operating at 44.1 kHz stereo, it ensures professional-grade consistency with no breaks, squeaks, or glitches. Ideal for producers, game developers, and content creators.",
      chatPage: "audiomodel.html",
      creditPrice: "2 credits/generation",
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
      creditPrice: "9 credits/generation",
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
      creditPrice: "2 credits/generation",
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
      creditPrice: "40 credits/second",
      providers: ["fal"],
    },
    "cogvideox-5b": {
      title: "CogVideoX-5B",
      description:
        "Generate videos from prompts using CogVideoX-5B – a powerful model designed for text-to-video synthesis with detailed visuals and smooth motion.",
      link: "https://fal.ai/models/fal-ai/cogvideox-5b",
      fullDetails:
        "CogVideoX-5B leverages advanced generative architecture to produce dynamic video content from natural language prompts. Designed for creative applications such as concept development, visualization, and storytelling, it delivers rich detail and temporal consistency.",
      chatPage: "videomodel.html",
      creditPrice: "40 credits/second",
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
      creditPrice: "25 credits/second",
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
      creditPrice: "4 credits/image",
    },
    bagel: {
      title: "Bagel",
      description:
        "Bagel is a 7B parameter multimodal model by Bytedance-Seed that generates both text and high-quality images from prompts.",
      link: "https://fal.ai/models/fal-ai/bagel",
      fullDetails:
        "Bagel is a powerful 7B parameter model developed by Bytedance-Seed that can generate both natural language and visual content from text prompts. It is designed for multimodal applications, offering balanced performance in both image synthesis and text generation.",
      chatPage: "imagemodel.html",
      creditPrice: "4 credits/image",
    },
    "imagen4-preview": {
      title: "Imagen 4 (Preview)",
      description:
        "Imagen 4 is Google’s highest quality image generation model, known for photorealism and prompt accuracy.",
      link: "https://fal.ai/models/fal-ai/imagen4/preview",
      fullDetails:
        "Imagen 4 (Preview) represents Google's cutting-edge in text-to-image generation. It delivers state-of-the-art visual quality, high prompt fidelity, and realism, making it ideal for photorealistic renders, marketing visuals, and creative content generation.",
      chatPage: "imagemodel.html",
      creditPrice: "4 credits/image",
    },
    "f-lite-standard": {
      title: "F Lite (Standard)",
      description:
        "F Lite is a 10B parameter diffusion model by Fal and Freepik, trained on copyright-safe and SFW content.",
      link: "https://fal.ai/models/fal-ai/f-lite/standard",
      fullDetails:
        "F Lite (Standard) is a powerful 10B parameter diffusion model co-developed by Fal and Freepik. It is optimized for generating safe-for-work, copyright-compliant imagery across a wide range of commercial and creative applications.",
      chatPage: "imagemodel.html",
      creditPrice: "4 credits/image",
    },
    "sana-v1.5-4.8b": {
      title: "Sana V1.5 (4.8B)",
      description:
        "Sana v1.5 4.8B is a powerful text-to-image model that generates ultra-high quality 4K images with remarkable detail.",
      link: "https://fal.ai/models/fal-ai/sana/v1.5/4.8b",
      fullDetails:
        "Sana V1.5 (4.8B) is a state-of-the-art text-to-image model designed for high-resolution generation. With support for 4K image outputs and fine visual fidelity, it's ideal for digital art, detailed product mockups, and visually rich storytelling.",
      chatPage: "imagemodel.html",
      creditPrice: "4 credits/image",
    },
    "minimax-image-01": {
      title: "MiniMax Image-01",
      description:
        "Generate high quality images from text prompts using MiniMax Image-01. Longer text prompts improve image quality.",
      link: "https://fal.ai/models/fal-ai/minimax/image-01",
      fullDetails:
        "MiniMax Image-01 is a text-to-image generation model capable of creating high-quality visuals from natural language descriptions. It performs best with longer, more detailed prompts, and is suitable for general-purpose visual content creation.",
      chatPage: "imagemodel.html",
      creditPrice: "4 credits/image",
    },
    "ideogram-v3": {
      title: "Ideogram V3",
      description:
        "Turn complex, creative prompts into visually rich illustrations with Ideogram V3 – ideal for surreal, conceptual, and narrative-driven artwork.",
      link: "https://fal.ai/models/fal-ai/ideogram/v3",
      fullDetails:
        "Ideogram V3 is a next-gen text-to-image model crafted for storytelling and imaginative concepts. It excels at rendering scenes with symbolic, surreal, or fantastical elements, making it perfect for writers, concept artists, and world-builders.",
      chatPage: "imagemodel.html",
      creditPrice: "5-8 credits/image",
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
  <p class="text-muted mb-3">
    OpenMediaFlow <a href="https://openmediaflow.netlify.app/docs" target="_blank">routes requests</a>
    to the best providers that are able to handle your prompt size and parameters, with fallbacks to maximize uptime.
    <i class="bi bi-info-circle ms-1" title="OpenRouter selects providers based on capacity and availability."></i>
  </p>
`;

  providerHeader.innerHTML = `
  <h5 class="mb-1 text-light">Providers for ${model.title}</h5>
  <p class="text-secondary mb-3">
    OpenMediaFlow <a href="https://openmediaflow.netlify.app/docs" target="_blank" class="text-info">routes requests</a>
    to the best providers that are able to handle your prompt size and parameters, with fallbacks to maximize uptime.
    <i class="bi bi-info-circle ms-1" title="OpenRouter selects providers based on capacity and availability."></i>
  </p>
`;

  providerHeader.innerHTML = `
  <h5 class="mb-2">Providers for ${model.title}</h5>
  <p class="text-muted mb-4">
    OpenMediaFlow <a href="https://openmediaflow.netlify.app/docs" target="_blank">routes requests</a>
    to the best providers that are able to handle your prompt size and parameters, with fallbacks to maximize uptime.
    <i class="bi bi-info-circle ms-1" title="OpenRouter selects providers based on capacity and availability."></i>
  </p>
`;

  const providerSection = document.getElementById("provider-details-section");

  if (model.providers && model.providers.length > 0) {
    model.providers.forEach((providerId) => {
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
});
