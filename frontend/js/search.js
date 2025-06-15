// ===================== MODEL DATA =====================
const models = {
  "cogvideox-5b": {
    id: "cogvideox-5b",
    title: "Cogvideox-5b",
    description:
      "Generate videos from prompts using CogVideoX-5B – a powerful model designed for text-to-video synthesis with detailed visuals and smooth motion.",
    link: "https://fal.ai/models/fal-ai/cogvideox-5b",
    fullDetails:
      "CogVideoX-5B leverages advanced generative architecture to produce dynamic video content from natural language prompts. Designed for creative applications such as concept development, visualization, and storytelling, it delivers rich detail and temporal consistency.",
    chatPage: "videomodel.html",
    creditPrice: "40 credits/second",
    providers: ["fal"],
  },
  "kling-video-v2-master": {
    id: "kling-video-v2-master",
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
  "minimax-video-01": {
    id: "minimax-video-01",
    title: "MiniMax Video 01",
    description:
      "Generate video clips from your prompts using MiniMax model – fast and creative text-to-video generation with solid visual fidelity.",
    link: "https://replicate.com/minimax/video-01",
    fullDetails:
      "MiniMax Video 01 transforms text prompts into vivid and coherent video sequences. Designed for efficiency and flexibility, it supports a variety of use cases including storytelling, content ideation, and visual experimentation.",
    chatPage: "videomodel.html",
    creditPrice: "30 credits/second",
    providers: ["fal", "replicate"],
  },
  "hunyuan-video": {
    id: "hunyuan-video",
    title: "Hunyuan Video",
    description:
      "Generate high-quality videos with realistic motion from text descriptions using Tencent’s state-of-the-art Hunyuan Video model.",
    link: "https://replicate.com/tencent/hunyuan-video",
    fullDetails:
      "Hunyuan Video is a cutting-edge text-to-video model developed by Tencent. It creates highly realistic, coherent, and detailed videos directly from natural language prompts. Ideal for content creation, advertising, simulation, and storytelling.",
    chatPage: "videomodel.html",
    creditPrice: "30 credits/second",
    providers: ["fal", "replicate"],
  },

  magi: {
    id: "magi",
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
    id: "vidu-q1",
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
  "black-forest-labs-flux-1-1-pro": {
    id: "black-forest-labs-flux-1-1-pro",
    title: "Black Forest Labs: FLUX-1.1 Pro",
    description:
      "Black Forest Labs' latest state-of-the-art proprietary model offering exceptional prompt following, visual quality, detail, and output diversity.",
    link: "https://deepinfra.com/black-forest-labs/FLUX-1.1-pro",
    fullDetails:
      "FLUX-1.1 Pro by Black Forest Labs delivers top-tier text-to-image generation with industry-leading prompt alignment, visual fidelity, intricate detailing, and outstanding output variety — ideal for creative, professional, and commercial applications.",
    chatPage: "imagemodel.html",
    provider: "deepinfra",
  },
  "black-forest-labs-flux-schnell": {
    id: "black-forest-labs-flux-schnell",
    title: "Black Forest Labs: FLUX.1 [schnell]",
    description:
      "FLUX.1 [schnell] is a 12B-parameter flow transformer for rapid, high-quality text-to-image generation in just 1–4 steps — optimized for both personal and commercial use.",
    link: "https://fal.ai/models/fal-ai/flux/schnell",
    fullDetails:
      "Black Forest Labs’ FLUX.1 [schnell] model delivers fast and efficient image generation via a 12-billion parameter flow transformer, balancing speed and output quality across 1–4 inference steps. Perfect for creators seeking top-tier results with minimal latency.",
    chatPage: "imagemodel.html",
    provider: "fal",
  },
  "black-forest-labs-flux-1-dev": {
    id: "black-forest-labs-flux-1-dev",
    title: "Black Forest Labs: FLUX.1 [dev]",
    description:
      "12 billion parameter rectified flow transformer capable of generating images from text descriptions.",
    link: "https://fal.ai/models/fal-ai/flux/dev",
    fullDetails:
      "FLUX.1 [dev] is a 12 billion parameter rectified flow transformer model designed for high-quality, prompt-faithful text-to-image synthesis. It excels in generating diverse, detailed images across a range of styles, purely from textual descriptions without requiring input images.",
    chatPage: "imagemodel.html",
    creditPrice: "4-5 credits/image",
    providers: "together",
  },
  "black-forest-labs-flux-pro": {
    id: "black-forest-labs-flux-pro",
    title: "Black Forest Labs: FLUX.pro",
    description:
      "Black Forest Labs' first flagship model based on Flux latent rectified flow transformers.",
    link: "https://bfl.ai/models/flux-pro",
    fullDetails:
      "FLUX.pro is Black Forest Labs' flagship model featuring a powerful rectified flow transformer architecture optimized for photorealism, creative coherence, and precision in text-to-image synthesis. It builds on the FLUX family to deliver higher fidelity and semantic alignment in image generation.",
    chatPage: "imagemodel.html",
    creditPrice: "5-6 credits/image",
    providers: "deepinfra",
  },
  "black-forest-labs-flux-kontext-pro": {
    id: "black-forest-labs-flux-kontext-pro",
    title: "Black Forest Labs: FLUX.kontext.pro",
    description:
      "Black Forest Labs' state-of-the-art image editing model with natural language control and precise transformations.",
    link: "https://bfl.ai/models/flux-kontext",
    fullDetails:
      "FLUX.kontext.pro is a next-generation image editing model by Black Forest Labs, built on the FLUX latent rectified flow transformer architecture. It enables natural language-based transformations of existing images with exceptional prompt adherence, consistency, and high visual fidelity. Ideal for tasks such as style alteration, object modification, or semantic refinement using intuitive text prompts.",
    chatPage: "imagemodel.html",
    creditPrice: "5-6 credits/image",
    providers: "replicate",
  },
  "black-forest-labs-flux-kontext-max": {
    id: "black-forest-labs-flux-kontext-max",
    title: "Black Forest Labs: FLUX.kontext.max",
    description:
      "Black Forest Labs' premium image editing model with enhanced natural language control and improved typography generation.",
    link: "https://replicate.com/black-forest-labs/flux-kontext-max",
    fullDetails:
      "FLUX.kontext.max is a premium, high-performance image editing model by Black Forest Labs, designed to offer enhanced natural language-based transformations with improved typography generation. Built on an evolved FLUX transformer framework, it delivers top-tier prompt fidelity, semantic precision, and aesthetic refinement. Ideal for tasks involving advanced object editing, style modification, or layout-sensitive transformations via intuitive text prompts.",
    chatPage: "imagemodel.html",
    creditPrice: "7-8 credits/image",
    providers: ["replicate"],
  },
  "black-forest-labs-flux-1.1-pro-ultra": {
    id: "black-forest-labs-flux-1.1-pro-ultra",
    title: "Black Forest Labs: FLUX 1.1 Pro Ultra",
    description:
      "FLUX 1.1 Pro in Ultra and Raw modes for high-resolution (up to 4MP) image generation with enhanced realism.",
    link: "https://replicate.com/black-forest-labs/flux-1.1-pro-ultra",
    fullDetails:
      "FLUX 1.1 Pro Ultra is a high-resolution image generation model from Black Forest Labs. Supporting both 'Ultra' and 'Raw' modes, it allows generation of images up to 4 megapixels with impressive clarity and detail. Raw mode prioritizes photorealism, while Ultra mode boosts visual fidelity for creative tasks. Ideal for detailed compositions, realism-based edits, and fine-grain prompt adherence.",
    chatPage: "imagemodel.html",
    creditPrice: "8-10 credits/image",
    providers: ["replicate"],
  },
  "bytedance-sdxl-lightning-4step": {
    id: "bytedance-sdxl-lightning-4step",
    title: "ByteDance: SDXL-Lightning (4-Step)",
    description:
      "SDXL-Lightning by ByteDance: a fast text-to-image model generating high-quality images in just 4 steps.",
    link: "https://replicate.com/bytedance/sdxl-lightning-4step",
    fullDetails:
      "SDXL-Lightning (4-Step) is a lightning-fast diffusion model developed by ByteDance, built on the Stable Diffusion XL architecture. It generates high-quality images in only four inference steps, making it ideal for real-time generation, prototyping, and creative workflows that require speed without compromising visual fidelity.",
    chatPage: "imagemodel.html",
    creditPrice: "2-4 credits/image",
    providers: ["replicate"],
  },

  "stabilityai-sd3-5": {
    id: "stabilityai-sd3-5",
    title: "Stability AI: SD 3.5",
    description:
      "At 8 billion parameters, with superior quality and prompt adherence, this base model is the most powerful in the Stable Diffusion family.",
    link: "https://deepinfra.com/stabilityai/sd3.5",
    fullDetails:
      "SD 3.5 is Stability AI’s 8 billion parameter base model offering unmatched quality, coherence, and faithfulness to prompts. It excels at detailed text-to-image synthesis, ideal for professional and production-grade generation tasks at 1 megapixel resolution.",
    chatPage: "imagemodel.html",
    creditPrice: "4-5 credits/image",
    providers: "deepinfra",
  },
  "stabilityai-sd3-5-medium": {
    id: "stabilityai-sd3-5-medium",
    title: "Stability AI: SD 3.5 Medium",
    description:
      "At 2.5 billion parameters, with improved MMDiT-X architecture and training methods, this model is designed to run “out of the box” on consumer hardware, striking a balance between quality and ease of customization.",
    link: "https://deepinfra.com/stabilityai/sd3.5-medium",
    fullDetails:
      "SD 3.5 Medium is a 2.5B parameter model based on the improved MMDiT-X architecture. Designed for efficient performance and customization, it runs well on consumer hardware while generating high-quality images up to 2 megapixels. Ideal for lightweight yet capable applications.",
    chatPage: "imagemodel.html",
    creditPrice: "2-4 credits/image",
    providers: "deepinfra",
  },
  "stabilityai-sdxl-turbo": {
    id: "stabilityai-sdxl-turbo",
    title: "Stability AI: SDXL Turbo",
    description:
      "The SDXL Turbo model, developed by Stability AI, is an optimized, fast text-to-image generative model. It is a distilled version of SDXL 1.0, leveraging Adversarial Diffusion Distillation (ADD) to generate high-quality images in less steps.",
    link: "https://stability.ai/news/stability-ai-sdxl-turbo",
    fullDetails:
      "SDXL Turbo is a distilled, high-speed version of SDXL 1.0 developed by Stability AI. It leverages Adversarial Diffusion Distillation (ADD) to generate high-quality images in significantly fewer steps, ideal for fast image generation workflows while maintaining visual fidelity.",
    chatPage: "imagemodel.html",
    creditPrice: "2-4 credits/image",
    providers: "deepinfra",
  },
  "recraft-v3": {
    id: "recraft-v3",
    title: "Recraft V3: Text-to-Image",
    description:
      "Recraft V3 is a state-of-the-art text-to-image model capable of generating long texts, vector art, images in brand styles, and much more.",
    link: "https://replicate.com/recraft-ai/recraft-v3",
    fullDetails:
      "Recraft V3 offers unparalleled quality in text-to-image generation, excelling in creating detailed visuals across various styles and artistic outputs.",
    chatPage: "imagemodel.html",
    provider: "huggingface",
  },

  fooocus: {
    id: "fooocus",
    title: "Fooocus: Base Model",
    description:
      "Fooocus is a powerful text-to-image model offering base parameters with automated optimizations and quality improvements for rapid and high-quality image generation.",
    link: "https://fal.ai/models/fal-ai/fooocus",
    fullDetails:
      "Fooocus provides an optimized framework for rapid image generation, ensuring high visual quality with automated enhancements.",
    chatPage: "imagemodel.html",
    provider: "fal",
  },

  // Text-to-Video
  "wan-ai-wan21-t2v-13b": {
    id: "wan-ai-wan21-t2v-13b",
    title: "Wan-AI: Wan2.1-T2V-1.3B",
    description:
      "A lightweight and efficient text-to-video model that delivers high-quality 480P video generation despite its compact 1.3B parameter size.",
    link: "https://deepinfra.com/Wan-AI/Wan2.1-T2V-1.3B",
    fullDetails:
      "Wan2.1-T2V-1.3B is designed for fast, resource-efficient text-to-video synthesis.",
    chatPage: "videomodel.html",
    provider: "huggingface",
  },
  "wan-ai-wan21-t2v-14b": {
    id: "wan-ai-wan21-t2v-14b",
    title: "Wan-AI: Wan2.1-T2V-14B",
    description:
      "A high-capacity and advanced text-to-video model generating high-quality 480P and 720P videos from complex prompts.",
    link: "https://deepinfra.com/Wan-AI/Wan2.1-T2V-14B",
    fullDetails:
      "Wan2.1-T2V-14B is designed for visually rich, detailed, and expressive text-to-video synthesis from high-complexity prompts.",
    chatPage: "videomodel.html",
    provider: "huggingface",
  },
  "wavespeedai-wan21-t2v-720p": {
    id: "wavespeedai-wan21-t2v-720p",
    title: "WaveSpeedAI: Wan 2.1-T2V-720P",
    description:
      "A high-resolution, accelerated text-to-video model built on Wan 2.1 with 14B parameters for expressive and complex video synthesis.",
    link: "https://replicate.com/wavespeedai/wan-2.1-t2v-720p",
    fullDetails:
      "WaveSpeedAI’s Wan 2.1-T2V-720P delivers fast and detailed video generation in 720P resolution. As part of an open, next-generation suite of video foundation models, it excels in translating intricate prompts into rich, coherent video outputs.",
    chatPage: "videomodel.html",
    provider: "huggingface",
  },
  "wavespeedai-wan21-t2v-480p": {
    id: "wavespeedai-wan21-t2v-480p",
    title: "WaveSpeedAI: Wan 2.1-T2V-480P",
    description:
      "A 480P text-to-video model built for fast and detailed video generation using the Wan 2.1 14B architecture.",
    link: "https://replicate.com/wavespeedai/wan-2.1-t2v-480p",
    fullDetails:
      "Part of WaveSpeedAI's open suite of video foundation models, Wan 2.1-T2V-480P offers accelerated inference and high-quality video output from complex text prompts, making it ideal for creative and research workflows.",
    chatPage: "videomodel.html",
    provider: "huggingface",
  },
  "google-veo-3": {
    id: "google-veo-3",
    title: "Google Veo 3",
    description:
      "Veo 3 generates cinematic videos with synchronized audio and photorealistic motion. Perfect for storytellers and creators.",
    link: "https://deepmind.google/technologies/veo/",
    fullDetails:
      "Google Veo 3 is Google’s flagship AI video model that supports naturalistic video generation with audio. Enhanced cinematic controls, camera movements, and realistic audio syncing make it ideal for producing studio-quality video content.",
    chatPage: "videomodel.html",
    provider: "fal",
  },
  "lightricks-ltx-video": {
    id: "lightricks-ltx-video",
    title: "Lightricks: LTX-Video",
    description:
      "LTX-Video is the first DiT-based video generation model capable of producing high-quality 24 FPS videos at 768x512 resolution in real time.",
    link: "https://replicate.com/lightricks/ltx-video",
    fullDetails:
      "Developed by Lightricks, LTX-Video leverages DiT to deliver ultra-fast, high-resolution video generation.",
    chatPage: "videomodel.html",
    provider: "huggingface",
  },

  "pixverse-v4": {
    id: "pixverse-v4",
    title: "PixVerse: Text-to-Video v4",
    description:
      "Generate high-quality video clips from text and image prompts using PixVerse v4.",
    link: "https://fal.ai/models/fal-ai/pixverse/v4/text-to-video",
    fullDetails:
      "PixVerse v4 enables state-of-the-art text-to-video and image-to-video generation.",
    chatPage: "videomodel.html",
    provider: "huggingface",
  },
  "pixverse-v4.5": {
    id: "pixverse-v4.5",
    title: "PixVerse: Text-to-Video v4.5",
    description:
      "Create 5s or 8s video clips with better motion and prompt accuracy using PixVerse v4.5.",
    link: "https://fal.ai/models/fal-ai/pixverse/v4.5/text-to-video",
    fullDetails:
      "PixVerse v4.5 supports fast 5-8 second video generation at various resolutions with enhanced motion fidelity and complex action handling.",
    chatPage: "videomodel.html",
    provider: "huggingface",
  },

  // Text-to-Audio
  "stackadoc-stable-audio": {
    id: "stackadoc-stable-audio",
    title: "Stable Audio Open 1.0",
    description:
      "An open-source model for generating short audio samples, sound effects, and production elements using text prompts.",
    link: "https://fal.ai/models/fal-ai/stable-audio",
    fullDetails:
      "Stable Audio Open 1.0 is designed for generating short-form audio like sound effects and musical elements.",
    chatPage: "audiomodel.html",
    provider: "fal",
  },
  "cassattemusic-audio": {
    id: "cassattemusic-audio",
    title: "CassetteAI Music Generator",
    description:
      "Fast, high-quality AI music generation producing studio-ready tracks in seconds.",
    link: "https://fal.ai/models/cassetteai/music-generator",
    fullDetails:
      "CassetteAI’s music generator creates a 30-second music sample in under 2 seconds and a full 3-minute track in under 10 seconds. Operating at 44.1 kHz stereo, it ensures professional-grade consistency with no breaks, squeaks, or glitches. Ideal for producers, game developers, and content creators.",
    chatPage: "audiomodel.html",
    provider: "fal",
  },

  "multilingual-audio": {
    id: "multilingual-audio",
    title: "Multilingual TTS",
    description:
      "Text-to-speech generation in multiple languages with high clarity and diverse voices.",
    link: "https://fal.ai/models/fal-ai/elevenlabs/tts/multilingual-v2",
    fullDetails:
      "Multilingual TTS by ElevenLabs supports a wide range of languages and accents, enabling natural voice generation across global content. It's a great fit for multilingual applications and localization.",
    chatPage: "audiomodel.html",
    provider: "fal",
  },
  "cartesia-sonic-2": {
    id: "cartesia-sonic-2",
    title: "Cartesia Sonic 2",
    description:
      "Generate audio from your prompts using Cartesia Sonic 2 – fast and creative text-to-audio generation with high sound fidelity.",
    link: "https://www.together.ai/models/cartesia-sonic",
    fullDetails:
      "Cartesia Sonic 2 transforms text prompts into vivid and coherent audio clips. Designed for efficiency and expressiveness, it supports a variety of use cases including storytelling, ambient sound design, music ideation, and audio branding.",
    chatPage: "audiomodel.html",
    providers: "fal",
  },

  bagel: {
    id: "bagel",
    title: "Bagel",
    description:
      "Bagel is a 7B parameter multimodal model by Bytedance-Seed that generates both text and high-quality images from prompts.",
    link: "https://fal.ai/models/fal-ai/bagel",
    fullDetails:
      "Bagel is a powerful 7B parameter model developed by Bytedance-Seed that can generate both natural language and visual content from text prompts. It is designed for multimodal applications, offering balanced performance in both image synthesis and text generation.",
    chatPage: "imagemodel.html",
    creditPrice: "4 credits/image",
    provider: "fal",
  },
  "imagen4-preview": {
    id: "imagen4-preview",
    title: "Imagen 4 (Preview)",
    description:
      "Imagen 4 is Google’s highest quality image generation model, known for photorealism and prompt accuracy.",
    link: "https://fal.ai/models/fal-ai/imagen4/preview",
    fullDetails:
      "Imagen 4 (Preview) represents Google's cutting-edge in text-to-image generation. It delivers state-of-the-art visual quality, high prompt fidelity, and realism, making it ideal for photorealistic renders, marketing visuals, and creative content generation.",
    chatPage: "imagemodel.html",
    creditPrice: "4 credits/image",
    provider: "fal",
  },
  "f-lite-standard": {
    id: "f-lite-standard",
    title: "F Lite (Standard)",
    description:
      "F Lite is a 10B parameter diffusion model by Fal and Freepik, trained on copyright-safe and SFW content.",
    link: "https://fal.ai/models/fal-ai/f-lite/standard",
    fullDetails:
      "F Lite (Standard) is a powerful 10B parameter diffusion model co-developed by Fal and Freepik. It is optimized for generating safe-for-work, copyright-compliant imagery across a wide range of commercial and creative applications.",
    chatPage: "imagemodel.html",
    creditPrice: "4 credits/image",
    provider: "fal",
  },
  "sana-v1.5-4.8b": {
    id: "sana-v1.5-4.8b",
    title: "Sana V1.5 (4.8B)",
    description:
      "Sana v1.5 4.8B is a powerful text-to-image model that generates ultra-high quality 4K images with remarkable detail.",
    link: "https://fal.ai/models/fal-ai/sana/v1.5/4.8b",
    fullDetails:
      "Sana V1.5 (4.8B) is a state-of-the-art text-to-image model designed for high-resolution generation. With support for 4K image outputs and fine visual fidelity, it's ideal for digital art, detailed product mockups, and visually rich storytelling.",
    chatPage: "imagemodel.html",
    creditPrice: "4 credits/image",
    provider: "fal",
  },
  "minimax-image-01": {
    id: "minimax-image-01",
    title: "MiniMax Image-01",
    description:
      "Generate high quality images from text prompts using MiniMax Image-01. Longer text prompts improve image quality.",
    link: "https://fal.ai/models/fal-ai/minimax/image-01",
    fullDetails:
      "MiniMax Image-01 is a text-to-image generation model capable of creating high-quality visuals from natural language descriptions. It performs best with longer, more detailed prompts, and is suitable for general-purpose visual content creation.",
    chatPage: "imagemodel.html",
    creditPrice: "4 credits/image",
    provider: "fal",
  },
  "fal-ai-lyria2": {
    id: "fal-ai-lyria2",
    title: "Lyria 2 by Google DeepMind",
    description:
      "Advanced AI model for generating a wide range of music genres using natural language prompts.",
    link: "https://fal.ai/models/fal-ai/lyria2",
    fullDetails:
      "Lyria 2 is Google DeepMind’s latest music generation model, offering high-fidelity, versatile musical compositions with natural instrument simulation and multi-track support. Ideal for artists, developers, and creatives seeking AI-generated music.",
    chatPage: "audiomodel.html",
    creditPrice: "1 credits/generation",
    providers: "fal",
  },
  "fal-ai-kokoro-hindi": {
    id: "fal-ai-kokoro-hindi",
    title: "Kokoro Hindi TTS",
    description:
      "A fast and expressive Hindi text-to-speech model with clear pronunciation and accurate intonation.",
    link: "https://fal.ai/models/fal-ai/kokoro/hindi",
    fullDetails:
      "Kokoro Hindi is an advanced TTS model from fal.ai designed to deliver expressive and natural-sounding Hindi speech. Optimized for clarity, prosody, and speed, it's ideal for voice apps, narration, and accessibility tools.",
    chatPage: "audiomodel.html",
    creditPrice: "1 credits/generation",
    providers: "fal",
  },
  "fal-ai-elevenlabs-sound-effects": {
    id: "fal-ai-elevenlabs-sound-effects",
    title: "ElevenLabs Sound Effects",
    description:
      "Generate sound effects using ElevenLabs' advanced sound effects model.",
    link: "https://fal.ai/models/fal-ai/elevenlabs/sound-effects",
    fullDetails:
      "This sound effects generator from ElevenLabs enables high-quality, AI-generated audio snippets across a variety of themes and use cases. Perfect for games, films, and multimedia projects needing immersive sound design.",
    chatPage: "audiomodel.html",
    creditPrice: "1 credits/generation",
    providers: "fal",
  },
  "fal-ai-mmaudio-v2-text-to-audio": {
    id: "fal-ai-mmaudio-v2-text-to-audio",
    title: "MMAudio V2 Text-to-Audio",
    description:
      "MMAudio generates synchronized audio from text inputs, creating sounds directly from descriptive prompts.",
    link: "https://fal.ai/models/fal-ai/mmaudio-v2/text-to-audio",
    fullDetails:
      "MMAudio V2 is a powerful text-to-audio generation model capable of producing synchronized, realistic audio clips from natural language prompts. Ideal for sound design, multimedia content, and accessibility solutions.",
    chatPage: "audiomodel.html",
    creditPrice: "1 credits/generation",
    providers: "fal",
  },
  "fal-ai-ace-step-lyrics-to-audio": {
    id: "fal-ai-ace-step-lyrics-to-audio",
    title: "ACE-Step Lyrics-to-Audio",
    description:
      "Generate full music with vocals from lyrics using ACE-Step's text-to-audio capabilities.",
    link: "https://fal.ai/models/fal-ai/ace-step",
    fullDetails:
      "ACE-Step is a cutting-edge model that generates complete musical pieces including vocals and instrumentation directly from written lyrics and genre/style prompts.",
    chatPage: "audiomodel.html",
    creditPrice: "1 credits/generation",
    providers: "fal",
  },
  "fal-ai-ace-step-prompt-to-audio": {
    id: "fal-ai-ace-step-prompt-to-audio",
    title: "ACE-Step Prompt-to-Audio",
    description:
      "Generate instrumental audio tracks from descriptive text prompts using ACE-Step.",
    link: "https://fal.ai/models/fal-ai/ace-step/prompt-to-audio",
    fullDetails:
      "ACE-Step Prompt-to-Audio generates rich, genre-aware instrumental music from plain text prompts. It simplifies music creation for sound designers, content creators, and app developers.",
    chatPage: "audiomodel.html",
    creditPrice: "1 credits/generation",
    providers: "fal",
  },
  "american-audio": {
    id: "american-audio",
    title: "American English TTS",
    description:
      "Generate natural American English voices for narration, characters, and content creation.",
    link: "https://fal.ai/models/fal-ai/kokoro/american-english",
    fullDetails:
      "This American English TTS model offers high-quality, fluent, and natural-sounding speech, making it suitable for virtual assistants, video dubbing, and storytelling use cases.",
    chatPage: "audiomodel.html",
    provider: "fal",
  },
  "cassetteai-sfx-generator": {
    id: "cassetteai-sfx-generator",
    title: "CassetteAI SFX Generator",
    description:
      "Create stunningly realistic sound effects in seconds with CassetteAI’s SFX model – high-quality, prompt-based audio up to 30 seconds long.",
    link: "https://fal.ai/models/cassetteai/sound-effects-generator",
    fullDetails:
      "CassetteAI’s Sound Effects Generator allows for fast and natural creation of high-quality sound effects using only a text prompt. It supports up to 30 seconds of audio with near-instant generation time, perfect for games, films, and immersive experiences.",
    chatPage: "audiomodel.html",
    provider: "fal",
  },
  "pika-text-to-video-v2-1": {
    id: "pika-text-to-video-v2-1",
    title: "Pika Text to Video v2.1",
    description:
      "Generate high-quality, cinematic videos from text prompts with Pika’s advanced v2.1 model – ideal for storytelling and visual ideation.",
    link: "https://fal.ai/models/fal-ai/pika/v2.1/text-to-video",
    fullDetails:
      "Pika v2.1 transforms written prompts into cinematic video clips with impressive realism and motion dynamics. Optimized for storytelling, concept art, and idea prototyping, this model delivers fast, visually engaging outputs directly from text.",
    chatPage: "videomodel.html",
    provider: "fal",
  },
  "pika-text-to-video-v2-2": {
    id: "pika-text-to-video-v2-2",
    title: "Pika Text to Video v2.2",
    description:
      "Create cinematic, high-quality videos from text prompts with Pika’s updated v2.2 model – enhanced for storytelling and visual content creation.",
    link: "https://fal.ai/models/fal-ai/pika/v2.2/text-to-video",
    fullDetails:
      "Pika v2.2 transforms text prompts into vivid, high-quality video clips with smoother motion and improved detail. Ideal for storytelling, concept development, and rapid visual ideation, this version builds on the cinematic power of v2.1 with upgraded output fidelity and creative flexibility.",
    chatPage: "videomodel.html",
    provider: "fal",
  },
  "luma-ray2-flash": {
    id: "luma-ray2-flash",
    title: "Luma Dream Machine: Ray 2 Flash",
    description:
      "Ray 2 Flash generates realistic, coherent video scenes from text prompts with high speed and cinematic motion quality.",
    link: "https://fal.ai/models/fal-ai/luma-dream-machine/ray-2-flash",
    fullDetails:
      "Luma’s Dream Machine: Ray 2 Flash is a high-performance text-to-video model designed for speed and realism. It excels at generating vivid visuals with smooth, natural motion, making it ideal for creative storytelling, concept videos, and prototyping cinematic scenes.",
    chatPage: "videomodel.html",
    provider: "fal",
  },
  "hidream-i1-dev": {
    id: "hidream-i1-dev",
    title: "HiDream I1 (Dev)",
    description:
      "HiDream I1 generates high-quality, imaginative images from text prompts with speed and clarity – ideal for concept art and design prototyping.",
    link: "https://fal.ai/models/fal-ai/hidream-i1-dev",
    fullDetails:
      "HiDream I1 (Dev) is a text-to-image model optimized for fast generation and visual fidelity. It excels at interpreting imaginative prompts and rendering detailed visuals, making it suitable for artists, creatives, and rapid prototyping scenarios.",
    chatPage: "imagemodel.html",
    provider: "fal",
  },
  "hidream-i1-full": {
    id: "hidream-i1-full",
    title: "HiDream I1 Full",
    description:
      "HiDream I1 Full is a high-performance open-source image generation model with 17B parameters, delivering state-of-the-art visuals in seconds.",
    link: "https://fal.ai/models/fal-ai/hidream-i1-full",
    fullDetails:
      "HiDream I1 Full is a powerful 17B parameter text-to-image foundation model, open-sourced for creatives and developers. It provides best-in-class image quality and speed, making it ideal for high-fidelity concept art, product mockups, and creative exploration.",
    chatPage: "imagemodel.html",
    provider: "fal",
  },
  "hidream-i1-fast": {
    id: "hidream-i1-fast",
    title: "HiDream I1 Fast",
    description:
      "HiDream I1 Fast is an open-source, high-speed image generation model with 17B parameters – optimized for rapid inference in just 16 steps.",
    link: "https://fal.ai/models/fal-ai/hidream-i1-fast",
    fullDetails:
      "HiDream I1 Fast is a cutting-edge, 17B parameter text-to-image foundation model from FAL AI, purpose-built for ultra-fast generation while maintaining high visual fidelity. With only 16 inference steps, it's ideal for interactive creative workflows, rapid design iteration, and real-time concept visualization.",
    chatPage: "imagemodel.html",
    provider: "fal",
  },
  "ideogram-v3": {
    id: "ideogram-v3",
    title: "Ideogram V3",
    description:
      "Turn complex, creative prompts into visually rich illustrations with Ideogram V3 – ideal for surreal, conceptual, and narrative-driven artwork.",
    link: "https://fal.ai/models/fal-ai/ideogram/v3",
    fullDetails:
      "Ideogram V3 is a next-gen text-to-image model crafted for storytelling and imaginative concepts. It excels at rendering scenes with symbolic, surreal, or fantastical elements, making it perfect for writers, concept artists, and world-builders.",
    chatPage: "imagemodel.html",
    provider: "fal",
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
