// models.js
const allmodels = {
  image: [
    {
      id: "black-forest-labs-flux-1-1-pro",
      name: "Black Forest Labs: FLUX-1.1 Pro",
      type: "image",
      icon: "image",
      iconColor: "danger",
      description:
        "Black Forest Labs' latest state-of-the-art proprietary model, offering exceptional prompt following, visual quality, detail, and output diversity.",
      source: "blackforestlabs.ai",
      sourceUrl: "https://deepinfra.com/black-forest-labs/FLUX-1.1-pro",
      tags: ["pro", "high-quality"],
    },
    {
      id: "black-forest-labs-flux-schnell",
      name: "Black Forest Labs: FLUX.1 [schnell]",
      type: "image",
      icon: "image",
      iconColor: "danger",
      description:
        "FLUX.1 [schnell] is a 12B-parameter flow transformer for rapid, high-quality text-to-image generation in just 1–4 steps — optimized for both personal and commercial use.",
      source: "blackforestlabs.ai",
      sourceUrl: "https://deepinfra.com/black-forest-labs/flux-schnell",
      tags: ["fast", "high-quality", "efficient"],
    },
    {
      id: "google-veo-3",
      name: "Google Veo 3",
      type: "video",
      icon: "video",
      iconColor: "primary",
      description:
        "A cutting-edge model for generating photorealistic, cinematic video with synchronized audio and advanced control over motion and camera dynamics.",
      source: "deepmind.google",
      sourceUrl: "https://deepmind.google/technologies/veo/",
      tags: ["photorealistic", "cinematic", "audio", "advanced-controls"],
    },
    {
      id: "recraft-v3",
      name: "Recraft V3: Text-to-Image",
      type: "image",
      icon: "image-alt",
      iconColor: "primary",
      description:
        "Recraft V3 is a text-to-image model with the ability to generate long texts, vector art, images in brand style, and much more. It is SOTA in image generation, proven by Hugging Face's industry-leading benchmark.",
      source: "Hugging Face",
      sourceUrl: "https://huggingface.co",
      tags: ["vector", "brand-style"],
    },
    {
      id: "fooocus",
      name: "Fooocus: Base Model",
      type: "image",
      icon: "image-alt",
      iconColor: "primary",
      description:
        "Fooocus is a text-to-image model offering base parameters with automated optimizations and quality improvements, providing a solid foundation for various creative outputs.",
      source: "FAL AI",
      sourceUrl: "https://fal.ai",
      tags: ["base-model", "optimized"],
    },
    {
      id: "hidream-i1-dev",
      name: "HiDream I1 (Dev)",
      type: "image",
      icon: "image",
      iconColor: "info",
      description:
        "HiDream I1 generates high-quality, imaginative images from text prompts with speed and clarity – ideal for concept art and design prototyping.",
      source: "FAL AI",
      sourceUrl: "https://fal.ai/models/fal-ai/hidream-i1-dev",
      tags: ["fast", "concept-art"],
    },
    {
      id: "bagel",
      name: "Bagel",
      type: "image",
      icon: "image",
      iconColor: "info",
      description:
        "Bagel is a 7B parameter multimodal model by Bytedance-Seed that generates both text and high-quality images from prompts.",
      source: "FAL AI",
      sourceUrl: "https://fal.ai/models/fal-ai/bagel",
      tags: ["multimodal", "7B"],
    },
    {
      id: "imagen4-preview",
      name: "Imagen 4 (Preview)",
      type: "image",
      icon: "image",
      iconColor: "info",
      description:
        "Imagen 4 is Google's highest quality image generation model, known for photorealism and prompt accuracy.",
      source: "FAL AI",
      sourceUrl: "https://fal.ai/models/fal-ai/imagen4/preview",
      tags: ["photorealistic", "google"],
    },
    {
      id: "f-lite-standard",
      name: "F Lite (Standard)",
      type: "image",
      icon: "image",
      iconColor: "info",
      description:
        "F Lite is a 10B parameter diffusion model by Fal and Freepik, trained on copyright-safe and SFW content.",
      source: "FAL AI",
      sourceUrl: "https://fal.ai/models/fal-ai/f-lite/standard",
      tags: ["copyright-safe", "10B"],
    },
    {
      id: "sana-v1.5-4.8b",
      name: "Sana V1.5 (4.8B)",
      type: "image",
      icon: "image",
      iconColor: "info",
      description:
        "Sana v1.5 4.8B is a powerful text-to-image model that generates ultra-high quality 4K images with remarkable detail.",
      source: "FAL AI",
      sourceUrl: "https://fal.ai/models/fal-ai/sana/v1.5/4.8b",
      tags: ["4K", "high-detail"],
    },
    {
      id: "minimax-image-01",
      name: "MiniMax Image-01",
      type: "image",
      icon: "image",
      iconColor: "info",
      description:
        "Generate high quality images from text prompts using MiniMax Image-01. Longer text prompts improve image quality.",
      source: "FAL AI",
      sourceUrl: "https://fal.ai/models/fal-ai/minimax/image-01",
      tags: ["text-prompt", "quality"],
    },
    {
      id: "ideogram-v3",
      name: "Ideogram V3",
      type: "image",
      icon: "brush",
      iconColor: "purple",
      description:
        "Turn complex, creative prompts into visually rich illustrations with Ideogram V3 – ideal for surreal, conceptual, and narrative-driven artwork.",
      source: "FAL AI",
      sourceUrl: "https://fal.ai/models/fal-ai/ideogram/v3",
      tags: ["illustration", "creative"],
    },
  ],
  video: [
    {
      id: "wan-ai-wan21-t2v-13b",
      name: "Wan-AI: Wan2.1-T2V-1.3B",
      type: "video",
      icon: "film",
      iconColor: "info",
      description:
        "The Wan2.1 1.3B model is a lightweight, efficient text-to-video generator. Despite its compact size, it delivers impressive performance across benchmarks and generates high-quality 480P videos.",
      source: "huggingface.co",
      sourceUrl: "https://huggingface.co/Wan-AI/Wan2.1-T2V-1.3B",
      tags: ["lightweight", "480p"],
    },
    {
      id: "pixverse-v4",
      name: "PixVerse: Text-to-Video v4",
      type: "video",
      icon: "film",
      iconColor: "info",
      description:
        "Generate high-quality video clips from text and image prompts using PixVerse v4, designed for advanced creative workflows.",
      source: "huggingface.co",
      sourceUrl: "https://huggingface.co/pixverse/v4/text-to-video",
      tags: ["high-quality", "advanced"],
    },
    {
      id: "pixverse-v4.5",
      name: "PixVerse: Text-to-Video v4.5",
      type: "video",
      icon: "film",
      iconColor: "info",
      description:
        "Quickly make 5s or 8s videos at 540p, 720p or 1080p. Enhanced motion and better handling of complex prompts.",
      source: "huggingface.co",
      sourceUrl: "https://huggingface.co/pixverse/v4.5/text-to-video",
      tags: ["fast-generation", "enhanced-motion", "short-form"],
    },
    {
      id: "lightricks-ltx-video",
      name: "Lightricks: LTX-Video",
      type: "video",
      icon: "film",
      iconColor: "info",
      description:
        "LTX-Video is the first DiT-based video generation model capable of producing high-quality 24 FPS videos at 768x512 resolution in real time.",
      source: "huggingface.co",
      sourceUrl: "https://huggingface.co/lightricks/ltx-video",
      tags: ["real-time", "DiT"],
    },
    {
      id: "pika-text-to-video-v2-1",
      name: "Pika Text to Video v2.1",
      type: "video",
      icon: "camera-reels",
      iconColor: "primary",
      description:
        "Generate high-quality, cinematic videos from text prompts with Pika's advanced v2.1 model – ideal for storytelling and visual ideation.",
      source: "FAL AI",
      sourceUrl: "https://fal.ai/models/fal-ai/pika/v2.1/text-to-video",
      tags: ["cinematic", "storytelling"],
    },
    {
      id: "luma-ray2-flash",
      name: "Luma Dream Machine: Ray 2 Flash",
      type: "video",
      icon: "camera-reels",
      iconColor: "primary",
      description:
        "Ray 2 Flash generates realistic, coherent video scenes from text prompts with high speed and cinematic motion quality.",
      source: "FAL AI",
      sourceUrl: "https://fal.ai/models/fal-ai/luma-dream-machine/ray-2-flash",
      tags: ["realistic", "fast"],
    },
    {
      id: "cogvideox-5b",
      name: "CogVideoX-5B",
      type: "video",
      icon: "camera-reels",
      iconColor: "primary",
      description:
        "Generate videos from prompts using CogVideoX-5B – a powerful model designed for text-to-video synthesis with detailed visuals and smooth motion.",
      source: "FAL AI",
      sourceUrl: "https://fal.ai/models/fal-ai/cogvideox-5b",
      tags: ["detailed", "smooth-motion"],
    },
    {
      id: "kling-video-v2-master",
      name: "Kling 2.0 Master",
      type: "video",
      icon: "camera-reels",
      iconColor: "primary",
      description:
        "Generate video clips from your prompts using Kling 2.0 Master – high-speed, cinematic text-to-video generation with exceptional motion quality.",
      source: "FAL AI",
      sourceUrl:
        "https://fal.ai/models/fal-ai/kling-video/v2/master/text-to-video",
      tags: ["high-speed", "cinematic"],
    },
    {
      id: "minimax-video-01",
      name: "MiniMax Video 01",
      type: "video",
      icon: "camera-reels",
      iconColor: "primary",
      description:
        "Generate video clips from your prompts using MiniMax model – fast and creative text-to-video generation with solid visual fidelity.",
      source: "MiniMax",
      sourceUrl: "https://minimax.com/models/video-01/text-to-video",
      tags: ["fast", "creative"],
    },
    {
      id: "magi",
      name: "MAGI-1",
      type: "video",
      icon: "camera-reels",
      iconColor: "primary",
      description:
        "MAGI-1 is a video generation model with exceptional understanding of physical interactions and cinematic prompts.",
      source: "FAL AI",
      sourceUrl: "https://fal.ai/models/fal-ai/magi",
      tags: ["physical-interactions", "cinematic"],
    },
    {
      id: "vidu-q1",
      name: "Vidu Q1",
      type: "video",
      icon: "camera-reels",
      iconColor: "primary",
      description:
        "Vidu Q1 Text to Video generates high-quality 1080p videos with exceptional visual quality and motion diversity.",
      source: "FAL AI",
      sourceUrl: "https://fal.ai/models/fal-ai/vidu/q1/text-to-video",
      tags: ["1080p", "high-quality"],
    },
    {
      id: "veo2",
      name: "Veo 2",
      type: "video",
      icon: "camera-reels",
      iconColor: "primary",
      description:
        "Veo 2 creates videos with realistic motion and high quality output. Explore different styles and find your own with extensive camera controls.",
      source: "FAL AI",
      sourceUrl: "https://fal.ai/models/fal-ai/veo2",
      tags: ["realistic", "camera-controls"],
    },
  ],
  audio: [
    {
      id: "stackadoc-stable-audio",
      name: "Stable Audio Open 1.0",
      type: "audio",
      icon: "soundwave",
      iconColor: "success",
      description:
        "An open-source model for generating short audio samples, sound effects, and production elements using text prompts.",
      source: "Hugging Face",
      sourceUrl:
        "https://huggingface.co/spaces/stackadoc/stable-audio-open-1.0",
      tags: ["open-source", "sound-effects"],
    },
    {
      id: "fal-ai-lyria2",
      name: "Lyria 2 by Google DeepMind",
      type: "audio",
      icon: "soundwave",
      iconColor: "success",
      description:
        "Google's latest state-of-the-art music generation model capable of producing diverse, high-quality music tracks from text prompts.",
      source: "Hugging Face",
      sourceUrl: "https://huggingface.co/fal-ai/lyria2",
      tags: ["music", "high-quality"],
    },
    {
      id: "fal-ai-kokoro-hindi",
      name: "Kokoro Hindi TTS",
      type: "audio",
      icon: "voice-overplay",
      iconColor: "primary",
      description:
        "A fast and expressive Hindi text-to-speech model with clear pronunciation and accurate intonation.",
      source: "Hugging Face",
      sourceUrl: "https://huggingface.co/fal-ai/kokoro/hindi",
      tags: ["hindi", "tts"],
    },
    {
      id: "fal-ai-elevenlabs-sound-effects",
      name: "ElevenLabs Sound Effects",
      type: "audio",
      icon: "magic",
      iconColor: "warning",
      description:
        "Generate sound effects using ElevenLabs' advanced sound effects model.",
      source: "Hugging Face",
      sourceUrl: "https://huggingface.co/fal-ai/elevenlabs/sound-effects",
      tags: ["sound-effects", "elevenlabs"],
    },
    {
      id: "fal-ai-mmaudio-v2-text-to-audio",
      name: "MMAudio V2 Text-to-Audio",
      type: "audio",
      icon: "file-music",
      iconColor: "info",
      description:
        "MMAudio generates synchronized audio from text prompts, enabling realistic sound creation based on descriptions.",
      source: "Hugging Face",
      sourceUrl: "https://huggingface.co/fal-ai/mmaudio-v2/text-to-audio",
      tags: ["synchronized", "realistic"],
    },
    {
      id: "cassattemusic-audio",
      name: "CassetteAI Music Generator",
      type: "audio",
      icon: "music-note-beamed",
      iconColor: "success",
      description:
        "Generate professional-quality music in seconds with CassetteAI's ultra-fast and consistent AI music engine.",
      source: "CassetteAI",
      sourceUrl: "https://fal.ai/models/cassetteai/music-generator",
      tags: ["music", "fast"],
    },
    {
      id: "multilingual-audio",
      name: "Multilingual TTS",
      type: "audio",
      icon: "soundwave",
      iconColor: "success",
      description:
        "Generate speech in multiple languages with ElevenLabs multilingual TTS powered by FAL – clear, natural, and diverse voices.",
      source: "FAL AI",
      sourceUrl: "https://fal.ai/models/fal-ai/elevenlabs/tts/multilingual-v2",
      tags: ["multilingual", "tts"],
    },
    {
      id: "american-audio",
      name: "American English TTS",
      type: "audio",
      icon: "soundwave",
      iconColor: "success",
      description:
        "A high-quality American English TTS model for creating clear, friendly, and professional-sounding voices from text.",
      source: "FAL AI",
      sourceUrl: "https://fal.ai/models/fal-ai/kokoro/american-english",
      tags: ["english", "tts"],
    },
    {
      id: "cassetteai-sfx-generator",
      name: "Cassette Sound Effects Generator",
      type: "audio",
      icon: "soundwave",
      iconColor: "success",
      description:
        "Generate creative sound effects and ambient audio using Cassette AI's open-source sound design model.",
      source: "FAL AI",
      sourceUrl: "https://fal.ai/models/cassetteai/sound-effects-generator",
      tags: ["sound-effects", "open-source"],
    },
  ],
};

function renderAllModels() {
  const container = document.querySelector(".main-content");

  Object.entries(allmodels).forEach(([category, modelList]) => {
    const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);

    const section = document.createElement("section");
    section.className = "model-section";
    section.innerHTML = `
          <h4 class="section-title">
            <i class="fa-solid fa-${getCategoryIcon(category)}"></i>
            <span>${categoryTitle} Models</span>
          </h4>
          <div class="model-grid" id="${category}-models"></div>
          <hr class="model-divider">
        `;

    container.appendChild(section);

    const grid = document.getElementById(`${category}-models`);
    modelList.forEach((model) => {
      const card = document.createElement("div");
      card.className = "model-card";
      card.dataset.id = model.id;
      card.innerHTML = `
            <div class="model-header">
              <h5 class="model-name">${model.name}</h5>
              <div class="model-icons">&nbsp;
                <i class="bi bi-${model.icon} text-${model.iconColor}"></i>
                <i class="bi bi-box-arrow-up-right text-secondary"></i>
              </div>
            </div>
            <p class="model-description">${model.description}</p>
            <div class="model-footer">
              <span class="model-source">Source: <a href="${
                model.sourceUrl
              }" target="_blank">${model.source}</a></span>
              <div class="model-tags">
                &nbsp;${model.tags
                  .map((tag) => `<span class="model-tag">${tag}</span>`)
                  .join("")}
              </div>
            </div>
          `;

      card.addEventListener("click", () => {
        window.location.href = `model-details.html?id=${model.id}`;
      });

      grid.appendChild(card);
    });
  });
}

function getCategoryIcon(category) {
  const icons = {
    image: "images",
    video: "video",
    audio: "podcast",
  };
  return icons[category] || "box";
}

document.addEventListener("DOMContentLoaded", renderAllModels);
