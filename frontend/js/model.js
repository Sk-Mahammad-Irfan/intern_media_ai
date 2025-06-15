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
      sourceUrl: "https://fal.ai/models/fal-ai/flux/schnell",
      tags: ["fast", "high-quality", "efficient"],
    },

    {
      id: "black-forest-labs-flux-1-dev",
      name: "Black Forest Labs: FLUX.1 [dev]",
      type: "image",
      icon: "image",
      iconColor: "warning",
      description:
        "12B parameter transformer for prompt-driven high-quality image generation.",
      source: "blackforestlabs.ai",
      sourceUrl: "https://fal.ai/models/fal-ai/flux/dev",
      tags: ["text-to-image", "high-quality", "experimental"],
    },
    {
      id: "black-forest-labs-flux-pro",
      name: "Black Forest Labs: FLUX.pro",
      type: "image",
      icon: "image",
      iconColor: "warning",
      description:
        "Flagship latent flow transformer for photorealistic text-to-image synthesis.",
      source: "blackforestlabs.ai",
      sourceUrl: "https://bfl.ai/models/flux-pro",
      tags: ["text-to-image", "flagship", "high-quality"],
    },
    {
      id: "black-forest-labs-flux-kontext-pro",
      name: "Black Forest Labs: FLUX.kontext.pro",
      type: "image",
      icon: "image",
      iconColor: "warning",
      description:
        "Text-based image editing using natural language with high consistency and control.",
      source: "blackforestlabs.ai",
      sourceUrl: "https://bfl.ai/models/flux-kontext",
      tags: [
        "image-editing",
        "text-to-image",
        "high-quality",
        "natural-language",
      ],
    },
    {
      id: "black-forest-labs-flux-kontext-max",
      name: "Black Forest Labs: FLUX.kontext.max",
      type: "image",
      icon: "image",
      iconColor: "warning",
      description:
        "Premium text-based image editing with enhanced prompt fidelity and improved typography generation.",
      source: "blackforestlabs.ai",
      sourceUrl: "https://replicate.com/black-forest-labs/flux-kontext-max",
      tags: [
        "image-editing",
        "text-to-image",
        "premium",
        "typography",
        "natural-language",
      ],
    },
    {
      id: "black-forest-labs-flux-1.1-pro-ultra",
      name: "Black Forest Labs: FLUX 1.1 Pro Ultra",
      type: "image",
      icon: "image",
      iconColor: "warning",
      description:
        "High-resolution image generation (up to 4MP) with realism-focused 'raw' mode and visually enhanced 'ultra' mode.",
      source: "blackforestlabs.ai",
      sourceUrl: "https://replicate.com/black-forest-labs/flux-1.1-pro-ultra",
      tags: [
        "image-generation",
        "high-resolution",
        "realism",
        "raw-mode",
        "ultra-mode",
        "photorealism",
      ],
    },
    {
      id: "bytedance-sdxl-lightning-4step",
      name: "ByteDance: SDXL-Lightning (4-Step)",
      type: "image",
      icon: "image",
      iconColor: "info",
      description:
        "Fast and high-quality text-to-image generation using SDXL-Lightning in just four steps.",
      source: "bytedance.com",
      sourceUrl: "https://replicate.com/bytedance/sdxl-lightning-4step",
      tags: [
        "text-to-image",
        "lightning",
        "fast-generation",
        "sdxl",
        "4-step",
        "high-quality",
      ],
    },
    {
      id: "stabilityai-sd3-5",
      name: "Stability AI: SD 3.5",
      type: "image",
      icon: "image",
      iconColor: "primary",
      description:
        "8B parameter base model for photorealistic text-to-image generation.",
      source: "stability.ai",
      sourceUrl: "https://deepinfra.com/stabilityai/sd3.5",
      tags: ["text-to-image", "stable-diffusion", "professional"],
    },
    {
      id: "stabilityai-sd3-5-medium",
      name: "Stability AI: SD 3.5 Medium",
      type: "image",
      icon: "image",
      iconColor: "success",
      description:
        "2.5B parameter MMDiT-X model for lightweight, high-quality text-to-image generation.",
      source: "stability.ai",
      sourceUrl: "https://deepinfra.com/stabilityai/sd3.5-medium",
      tags: [
        "text-to-image",
        "stable-diffusion",
        "efficient",
        "consumer-friendly",
      ],
    },
    {
      id: "stabilityai-sdxl-turbo",
      name: "Stability AI: SDXL Turbo",
      type: "image",
      icon: "image",
      iconColor: "info",
      description:
        "Distilled, fast SDXL model with ADD for low-latency high-fidelity generation.",
      source: "stability.ai",
      sourceUrl: "https://stability.ai/news/stability-ai-sdxl-turbo",
      tags: ["text-to-image", "stable-diffusion", "fast", "turbo", "ADD"],
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
      sourceUrl: "https://replicate.com/recraft-ai/recraft-v3",
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
      sourceUrl: "https://fal.ai/models/fal-ai/fooocus",
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
      id: "hidream-i1-full",
      name: "HiDream I1 Full",
      type: "image",
      icon: "image",
      iconColor: "info",
      description:
        "HiDream I1 Full is a powerful 17B parameter model for top-tier, imaginative image generation in seconds.",
      source: "FAL AI",
      sourceUrl: "https://fal.ai/models/fal-ai/hidream-i1-full",
      tags: ["foundation-model", "high-quality", "open-source"],
    },
    {
      id: "hidream-i1-fast",
      name: "HiDream I1 Fast",
      type: "image",
      icon: "image",
      iconColor: "success",
      description:
        "HiDream I1 Fast is a high-speed 17B parameter model that delivers stunning images in just 16 steps.",
      source: "FAL AI",
      sourceUrl: "https://fal.ai/models/fal-ai/hidream-i1-fast",
      tags: ["fast", "foundation-model", "open-source"],
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
      sourceUrl: "https://deepinfra.com/Wan-AI/Wan2.1-T2V-1.3B",
      tags: ["lightweight", "480p"],
    },
    {
      id: "wan-ai-wan21-t2v-14b",
      name: "Wan-AI: Wan2.1-T2V-14B",
      type: "video",
      icon: "film",
      iconColor: "info",
      description:
        "The Wan2.1 14B model is a powerful text-to-video generator that produces high-quality 480P and 720P videos. Designed for complex prompts and detailed scene synthesis.",
      source: "huggingface.co",
      sourceUrl: "https://deepinfra.com/Wan-AI/Wan2.1-T2V-14B",
      tags: ["high-capacity", "480p", "720p", "detailed"],
    },
    {
      id: "wavespeedai-wan21-t2v-720p",
      name: "WaveSpeedAI: Wan 2.1-T2V-720P",
      type: "video",
      icon: "film",
      iconColor: "info",
      description:
        "High-performance 720P video generation with accelerated inference, built on the 14B Wan 2.1 architecture. Ideal for complex prompts and detailed scene creation.",
      source: "huggingface.co",
      sourceUrl: "https://replicate.com/wavespeedai/wan-2.1-t2v-720p",
      tags: ["accelerated", "720p", "high-resolution", "open-model"],
    },

    {
      id: "wavespeedai-wan21-t2v-480p",
      name: "WaveSpeedAI: Wan 2.1-T2V-480P",
      type: "video",
      icon: "film",
      iconColor: "info",
      description:
        "Accelerated 480P video generation with the Wan 2.1 14B model. Optimized for fast, detailed, and expressive video synthesis from complex prompts.",
      source: "huggingface.co",
      sourceUrl: "https://replicate.com/wavespeedai/wan-2.1-t2v-480p",
      tags: ["accelerated", "480p", "high-capacity", "open-model"],
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
      sourceUrl: "https://fal.ai/models/fal-ai/pixverse/v4/text-to-video",
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
      sourceUrl: "https://fal.ai/models/fal-ai/pixverse/v4.5/text-to-video",
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
      sourceUrl: "https://replicate.com/lightricks/ltx-video",
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
      id: "pika-text-to-video-v2-2",
      name: "Pika Text to Video v2.2",
      type: "video",
      icon: "camera-reels",
      iconColor: "primary",
      description:
        "Create cinematic, high-quality videos from text prompts with Pika’s updated v2.2 model – enhanced for storytelling and visual content creation.",
      source: "FAL AI",
      sourceUrl: "https://fal.ai/models/fal-ai/pika/v2.2/text-to-video",
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
      sourceUrl: "https://replicate.com/minimax/video-01",
      tags: ["fast", "creative"],
    },
    {
      id: "hunyuan-video",
      name: "Hunyuan Video",
      type: "video",
      icon: "film",
      iconColor: "info",
      description:
        "Generate high-quality videos with realistic motion from text using Tencent’s Hunyuan Video.",
      source: "Tencent",
      sourceUrl: "https://replicate.com/tencent/hunyuan-video",
      tags: ["realistic", "high-fidelity", "tencent"],
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
      sourceUrl: "https://fal.ai/models/fal-ai/stable-audio",
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
      sourceUrl: "https://fal.ai/models/fal-ai/lyria2",
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
      sourceUrl: "https://fal.ai/models/fal-ai/kokoro/hindi",
      tags: ["hindi", "tts"],
    },
    {
      id: "cartesia-sonic-2",
      name: "Cartesia Sonic 2",
      type: "audio",
      icon: "soundwave",
      iconColor: "primary",
      description:
        "Generate audio from your prompts using Cartesia Sonic 2 – fast and creative text-to-audio generation with high sound fidelity.",
      source: "Cartesia",
      sourceUrl: "https://www.together.ai/models/cartesia-sonic",
      tags: ["fast", "creative"],
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
      sourceUrl: "https://fal.ai/models/fal-ai/elevenlabs/sound-effects",
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
      sourceUrl: "https://fal.ai/models/fal-ai/mmaudio-v2/text-to-audio",
      tags: ["synchronized", "realistic"],
    },
    {
      id: "fal-ai-ace-step-lyrics-to-audio",
      name: "ACE-Step Lyrics-to-Audio",
      type: "audio",
      icon: "music",
      iconColor: "primary",
      description:
        "Generate singing and music from lyrics using ACE-Step, combining voice and instrumental generation from text.",
      source: "Hugging Face",
      sourceUrl: "https://fal.ai/models/fal-ai/ace-step",
      tags: ["music", "lyrics", "singing", "text-to-audio"],
    },
    {
      id: "fal-ai-ace-step-prompt-to-audio",
      name: "ACE-Step Prompt-to-Audio",
      type: "audio",
      icon: "music",
      iconColor: "success",
      description:
        "Generate instrumental music from descriptive prompts using ACE-Step's text-to-audio engine.",
      source: "Hugging Face",
      sourceUrl: "https://fal.ai/models/fal-ai/ace-step/prompt-to-audio",
      tags: ["music", "instrumental", "text-to-audio", "generative"],
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

const videoGenerationHandlers = [
  {
    model: "wan-ai-wan21-t2v-13b",
    type: "fal",
    credits: 18,
  },
  {
    model: "wan-ai-wan21-t2v-13b",
    type: "replicate",
    credits: 17,
  },
  {
    model: "wan-ai-wan21-t2v-13b",
    type: "deepinfra",
    credits: 10,
  },
  {
    model: "wan-ai-wan21-t2v-14b",
    type: "deepinfra",
    credits: 10,
  },
  {
    model: "wavespeedai-wan21-t2v-720p",
    type: "replicate",
    credits: 10,
  },
  {
    model: "wavespeedai-wan21-t2v-480p",
    type: "replicate",
    credits: 12,
  },
  {
    model: "lightricks-ltx-video",
    type: "replicate",
    credits: 60,
  },
  {
    model: "google-veo-3",
    type: "replicate",
    credits: 45,
  },
  {
    model: "google-veo-3",
    type: "fal",
    credits: 50,
  },
  {
    model: "minimax-video-01",
    type: "replicate",
    credits: 50,
  },
  {
    model: "minimax-video-01",
    type: "fal",
    credits: 45,
  },
  {
    model: "hunyuan-video",
    type: "fal",
    credits: 45,
  },
  {
    model: "hunyuan-video",
    type: "replicate",
    credits: 50,
  },
  {
    model: "pixverse-v4",
    type: "fal",
    credits: 12,
  },
  {
    model: "pixverse-v4.5",
    type: "replicate",
    credits: 14,
  },
  {
    model: "pixverse-v4.5",
    type: "fal",
    credits: 15,
  },
  {
    model: "pika-text-to-video-v2-1",
    type: "fal",
    credits: 40,
  },
  {
    model: "pika-text-to-video-v2-2",
    type: "fal",
    credits: 45,
  },
  {
    model: "luma-ray2-flash",
    type: "fal",
    credits: 25,
  },
  {
    model: "kling-video-v2-master",
    type: "fal",
    credits: 20,
  },
  {
    model: "vidu-q1",
    type: "fal",
    credits: 18,
  },
  {
    model: "magi",
    type: "fal",
    credits: 22,
  },
  {
    model: "veo2",
    type: "fal",
    credits: 18,
  },
  {
    model: "cogvideox-5b",
    type: "fal",
    credits: 25,
  },
];

const imageGenerationHandlers = [
  {
    model: "black-forest-labs-flux-1-1-pro",
    type: "fal",
    credits: 5,
  },
  {
    model: "black-forest-labs-flux-schnell",
    type: "replicate",
    credits: 5,
  },
  {
    model: "black-forest-labs-flux-schnell",
    type: "fal",
    credits: 7,
  },
  {
    model: "black-forest-labs-flux-schnell",
    type: "together",
    credits: 4,
  },
  {
    model: "black-forest-labs-flux-1-dev",
    type: "together",
    credits: 4,
  },
  {
    model: "black-forest-labs-flux-1-1-pro",
    type: "base64",
    credits: 4,
  },
  {
    model: "black-forest-labs-flux-pro",
    type: "base64",
    credits: 4,
  },
  {
    model: "black-forest-labs-flux-kontext-pro",
    type: "replicate",
    credits: 4,
  },
  {
    model: "black-forest-labs-flux-kontext-max",
    type: "replicate",
    credits: 7,
  },
  {
    model: "black-forest-labs-flux-1.1-pro-ultra",
    type: "replicate",
    credits: 7,
  },
  {
    model: "bytedance-sdxl-lightning-4step",
    type: "replicate",
    credits: 7,
  },
  {
    model: "stabilityai-sd3-5",
    type: "base64",
    credits: 4,
  },
  {
    model: "stabilityai-sd3-5-medium",
    type: "base64",
    credits: 4,
  },
  {
    model: "stabilityai-sdxl-turbo",
    type: "base64",
    credits: 4,
  },
  {
    model: "recraft-v3",
    type: "fal",
    credits: 4,
  },
  {
    model: "recraft-v3",
    type: "replicate",
    credits: 2,
  },
  {
    model: "fooocus",
    type: "fal",
    credits: 3,
  },
  {
    model: "hidream-i1-dev",
    type: "fal",
    credits: 4,
  },
  {
    model: "hidream-i1-full",
    type: "fal",
    credits: 6,
  },
  {
    model: "hidream-i1-fast",
    type: "fal",
    credits: 6,
  },
  {
    model: "ideogram-v3",
    type: "fal",
    credits: 7,
  },
  {
    model: "bagel",
    type: "fal",
    credits: 10,
  },
  {
    model: "imagen4-preview",
    type: "fal",
    credits: 12,
  },
  {
    model: "f-lite-standard",
    type: "fal",
    credits: 12,
  },
  {
    model: "sana-v1.5-4.8b",
    type: "fal",
    credits: 12,
  },
  {
    model: "minimax-image-01",
    type: "fal",
    credits: 12,
  },
];
const audioGenerationHandlers = [
  {
    model: "stackadoc-stable-audio", // Matches your modelData key
    credits: 1,
    type: "replicate",
  },
  {
    model: "stackadoc-stable-audio",
    credits: 2,
    type: "fal",
  },
  {
    model: "cartesia-sonic-2",
    credits: 7,
    type: "together",
  },
  {
    model: "cassetteai-sfx-generator",
    credits: 1,
    type: "fal",
  },
  {
    model: "cassattemusic-audio",
    credits: 2,
    type: "fal",
  },
  {
    model: "multilingual-audio",
    credits: 9,
    type: "fal",
  },
  {
    model: "american-audio",
    credits: 2,
    type: "fal",
  },
  {
    model: "fal-ai-kokoro-hindi",
    credits: 5,
    type: "fal",
  },
  {
    model: "fal-ai-lyria2",
    credits: 5,
    type: "fal",
  },
  {
    model: "fal-ai-elevenlabs-sound-effects",
    credits: 5,
    type: "fal",
  },
  {
    model: "fal-ai-mmaudio-v2-text-to-audio",
    credits: 5,
    type: "fal",
  },
  {
    model: "fal-ai-ace-step-lyrics-to-audio",
    credits: 60,
    type: "fal",
  },
  {
    model: "fal-ai-ace-step-prompt-to-audio",
    credits: 3,
    type: "fal",
  },
];

function addPricesToModels() {
  // Create a map of all handlers with their maximum prices
  const priceMap = {};

  // Process all handler arrays
  [
    audioGenerationHandlers,
    imageGenerationHandlers,
    videoGenerationHandlers,
  ].forEach((handlers) => {
    handlers.forEach((handler) => {
      if (
        !priceMap[handler.model] ||
        handler.credits > priceMap[handler.model]
      ) {
        priceMap[handler.model] = handler.credits;
      }
    });
  });

  // Apply prices to all models
  Object.keys(allmodels).forEach((category) => {
    allmodels[category].forEach((model) => {
      model.price = priceMap[model.id] || 0; // Default to 0 if no price found
    });
  });
}

// Call this function to add prices before rendering
addPricesToModels();

function renderAllModels() {
  const container = document.querySelector(".main-content");
  container.innerHTML = ""; // Clear existing content

  // Create filter controls with Bootstrap styling
  const filterControls = document.createElement("div");
  filterControls.className = "filter-controls mb-5 p-3 rounded";
  filterControls.innerHTML = `
    <div class="container-fluid px-0">
      <div class="row g-3 align-items-end">
        <div class="col-md-4">
          <label for="model-search" class="form-label fw-bold">Search Models</label>
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-search"></i></span>
            <input 
              type="text" 
              id="model-search" 
              class="form-control" 
              placeholder="Search by name, description or tags..."
            >
          </div>
        </div>
        <div class="col-md-3">
          <label for="category-filter" class="form-label fw-bold">Category</label>
          <select id="category-filter" class="form-select">
            <option value="all">All Categories</option>
            <option value="image">Image Models</option>
            <option value="video">Video Models</option>
            <option value="audio">Audio Models</option>
          </select>
        </div>
        <div class="col-md-3">
          <label for="sort-by" class="form-label fw-bold">Sort By</label>
          <select id="sort-by" class="form-select">
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
          </select>
        </div>
        <div class="col-md-2 d-flex align-items-end">
          <button id="reset-filters" class="btn btn-outline-secondary w-100">
            <i class="bi bi-arrow-counterclockwise"></i> Reset
          </button>
        </div>
      </div>
    </div>
  `;
  container.appendChild(filterControls);

  // Models container
  const modelsContainer = document.createElement("div");
  modelsContainer.id = "models-container";
  container.appendChild(modelsContainer);

  // Create a pop up for mobile search and filters

  // Toggle search and filters on mobile
  const mobileSearchToggle = document.createElement("button");
  mobileSearchToggle.className = "btn btn-secondary d-md-none";
  mobileSearchToggle.innerHTML = `<i class="bi bi-search"></i> Search and Filter`;
  mobileSearchToggle.addEventListener("click", () => {
    mobileSearchFilters.classList.toggle("d-none");
  });
  container.appendChild(mobileSearchToggle);

  function filterAndRenderModels() {
    const searchTerm = document
      .getElementById("model-search")
      .value.toLowerCase();
    const categoryFilter = document.getElementById("category-filter").value;
    const sortBy = document.getElementById("sort-by").value;

    modelsContainer.innerHTML = "";

    const filteredCategories = {};

    Object.entries(allmodels).forEach(([category, modelList]) => {
      if (categoryFilter !== "all" && category !== categoryFilter) return;

      const filteredModels = modelList.filter((model) => {
        const matchesSearch =
          model.name.toLowerCase().includes(searchTerm) ||
          model.description.toLowerCase().includes(searchTerm) ||
          model.tags.some((tag) => tag.toLowerCase().includes(searchTerm));

        return matchesSearch;
      });

      if (filteredModels.length > 0) {
        filteredModels.sort((a, b) => {
          switch (sortBy) {
            case "name-asc":
              return a.name.localeCompare(b.name);
            case "name-desc":
              return b.name.localeCompare(a.name);
            case "price-asc":
              return a.price - b.price;
            case "price-desc":
              return b.price - a.price;
            default:
              return 0;
          }
        });

        filteredCategories[category] = filteredModels;
      }
    });

    // Render filtered and sorted models
    Object.entries(filteredCategories).forEach(([category, modelList]) => {
      const categoryTitle =
        category.charAt(0).toUpperCase() + category.slice(1);
      const section = document.createElement("section");
      section.className = "model-section mb-5";
      section.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h4 class="section-title m-0">
            <i class="fa-solid fa-${getCategoryIcon(
              category
            )} me-2 text-primary"></i>
            <span>${categoryTitle} Models</span>
            <span class="d-inline-flex justify-content-center align-items-center"
                  style="width: 30px; height: 30px; border-radius: 50%; font-size: 0.9rem; background-color: #0d6efd; color: white;">
              ${modelList.length}
            </span>
          </h4>
        </div>
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4" id="${category}-models"></div>
        <hr class="my-4">
      `;

      modelsContainer.appendChild(section);

      const grid = document.getElementById(`${category}-models`);
      modelList.forEach((model) => {
        const card = document.createElement("div");
        card.className = "col";
        card.innerHTML = `
          <div class="card h-100 model-card shadow-sm" data-id="${model.id}">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <h5 class="card-title mb-1">${model.name}</h5>
                <div class="model-icons">
                  <i class="bi bi-${model.icon} text-${model.iconColor}"></i>
                </div>
              </div>
              <p class="card-text text-muted small mb-3">${
                model.description
              }</p>
              <div class="d-flex justify-content-between align-items-center">
                <span class="badge bg-light text-dark">
                  <i class="bi bi-coin me-1"></i>
                  ${model.price} credits
                </span>
                <a href="${
                  model.sourceUrl
                }" target="_blank" class="text-decoration-none small" onclick="event.stopPropagation()">
                  <i class="bi bi-box-arrow-up-right"></i> ${model.source}
                </a>
              </div>
            </div>
            <div class="card-footer bg-transparent border-top-0 pt-0">
              <div class="model-tags-container">
                <div class="model-tags flex-wrap">
                  ${model.tags
                    .map(
                      (tag) =>
                        `<span class="badge bg-secondary me-1 mb-1">${tag}</span>`
                    )
                    .join("")}
                </div>
              </div>
            </div>
          </div>
        `;

        card.querySelector(".model-card").addEventListener("click", () => {
          window.location.href = `model-details.html?id=${model.id}`;
        });

        grid.appendChild(card);
      });
    });

    // Show message if no models found
    if (Object.keys(filteredCategories).length === 0) {
      modelsContainer.innerHTML = `
        <div class="text-center py-5">
          <i class="bi bi-search display-5 text-muted mb-3"></i>
          <h4 class="text-muted">No models found</h4>
          <p class="text-muted">Try adjusting your search or filters</p>
          <button id="reset-all-filters" class="btn btn-primary mt-3">
            <i class="bi bi-arrow-counterclockwise"></i> Reset all filters
          </button>
        </div>
      `;

      document
        .getElementById("reset-all-filters")
        .addEventListener("click", () => {
          document.getElementById("model-search").value = "";
          document.getElementById("category-filter").value = "all";
          document.getElementById("sort-by").value = "name-asc";
          filterAndRenderModels();
        });
    }
  }

  // Initial render
  filterAndRenderModels();

  // Event listeners for filters
  document
    .getElementById("model-search")
    .addEventListener("input", filterAndRenderModels);
  document
    .getElementById("category-filter")
    .addEventListener("change", filterAndRenderModels);
  document
    .getElementById("sort-by")
    .addEventListener("change", filterAndRenderModels);
  document.getElementById("reset-filters").addEventListener("click", () => {
    document.getElementById("model-search").value = "";
    document.getElementById("category-filter").value = "all";
    document.getElementById("sort-by").value = "name-asc";
    filterAndRenderModels();
  });
}

function getCategoryIcon(category) {
  const icons = {
    image: "images",
    video: "film",
    audio: "podcast",
  };
  return icons[category] || "box";
}

document.addEventListener("DOMContentLoaded", renderAllModels);
