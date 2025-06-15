const modelData = {
  "recraft-v3": {
    name: "Recraft V3",
    type: "Text-to-Image",
    description:
      "Recraft V3 is a next-gen text-to-image model that excels in generating visually stunning and conceptually accurate images from text prompts. It is designed with features to create vector art, ensuring smooth scalability for various applications. With an emphasis on brand consistency, Recraft V3 allows creators to generate images that align closely with brand guidelines and visual identity.",
    source: "https://replicate.com/recraft-ai/recraft-v3",
    price: 5,
    icons: ["bi-image", "bi-lightning-charge"],
    performance: {
      latency: "200ms",
      resolution: "1024x1024",
      generationQuality: "High",
    },
  },
  fooocus: {
    name: "Fooocus",
    type: "Text-to-Image",
    description:
      "Fooocus is an innovative text-to-image model that offers a streamlined approach to generating high-quality artwork from textual input. It features automatic optimizations, minimizing the need for complex parameters while offering creative flexibility for diverse designs. Fooocus is particularly known for its ability to adapt quickly to new prompts, making it ideal for rapid prototyping in creative workflows.",
    source: "https://fal.ai/models/fal-ai/fooocus",
    price: 3,
    icons: ["bi-image"],
    performance: {
      latency: "180ms",
      resolution: "512x512",
      generationQuality: "Medium",
    },
  },
  "black-forest-labs-flux-1-1-pro": {
    name: "FLUX-1.1 Pro",
    type: "Text-to-Image",
    description:
      "FLUX-1.1 Pro is a high-performance text-to-image model renowned for its impressive resolution and diverse style generation. The model stands out by providing exceptional prompt-following ability and producing images with significant diversity in output, making it suitable for creative projects demanding high versatility. With ultra-fast generation times and high output diversity, FLUX-1.1 Pro delivers reliable results across various use cases.",
    source: "https://blackforestlabs.ai",
    price: 8,
    icons: ["bi-lightning-fill"],
    performance: {
      latency: "150ms",
      resolution: "1024x1024",
      generationQuality: "High",
    },
  },
  "hidream-i1-dev": {
    name: "HiDream I1 Dev",
    type: "Text-to-Image",
    description:
      "HiDream I1 Dev is an advanced text-to-image model designed for fast concept art and design prototyping. It is optimized to produce realistic, high-quality concept sketches and designs in seconds. With a robust architecture that enables it to generate images based on complex prompts, HiDream I1 Dev is widely used by designers for rapid iterations and visual storytelling.",
    source: "https://fal.ai/models/fal-ai/hidream-i1-dev",
    price: 6,
    icons: ["bi-lightning"],
    performance: {
      latency: "220ms",
      resolution: "800x800",
      generationQuality: "Medium",
    },
  },
  "ideogram-v3": {
    name: "Ideogram V3",
    type: "Text-to-Image",
    description:
      "Ideogram V3 is an extraordinary text-to-image model focused on surreal and conceptual illustration creation. It excels at producing highly stylized artwork, allowing users to generate illustrations with an imaginative and otherworldly feel. The model is highly suited for industries involved in marketing, design, and media production, where unique visuals are needed for impactful storytelling.",
    source: "https://fal.ai/models/fal-ai/ideogram/v3",
    price: 7,
    icons: ["bi-palette"],
    performance: {
      latency: "160ms",
      resolution: "1024x1024",
      generationQuality: "High",
    },
  },
  bagel: {
    name: "Bagel",
    type: "Text-to-Image",
    description:
      "Bagel is a 7B parameter multimodal model developed by Bytedance-Seed that excels in both text and image generation. It provides high-quality visual outputs and text completions, making it ideal for creative applications that benefit from seamless text-to-image capabilities. The model combines fast generation, flexible prompt handling, and strong output coherence across modalities.",
    source: "https://fal.ai/models/fal-ai/bagel",
    price: 5,
    icons: ["bi-images"],
    performance: {
      latency: "200ms",
      resolution: "1024x1024",
      generationQuality: "Multimodal",
    },
  },
  "imagen4-preview": {
    name: "Imagen 4 (Preview)",
    type: "Text-to-Image",
    description:
      "Imagen 4 is Google's latest image generation model, known for extreme photorealism and prompt precision. It creates visually stunning and highly detailed outputs with exceptional prompt interpretation. Ideal for professional and artistic projects, it delivers reliable realism and high consistency across generations.",
    source: "https://fal.ai/models/fal-ai/imagen4/preview",
    price: 7,
    icons: ["bi-camera-fill"],
    performance: {
      latency: "180ms",
      resolution: "2048x2048",
      generationQuality: "Very High",
    },
  },
  "f-lite-standard": {
    name: "F Lite (Standard)",
    type: "Text-to-Image",
    description:
      "F Lite is a 10B parameter diffusion model by Fal and Freepik, trained on safe and copyright-cleared datasets. It excels in producing clean, diverse, and appealing images suitable for commercial use, education, or SFW applications. With balanced quality and ethical content generation, it ensures trustworthy outputs.",
    source: "https://fal.ai/models/fal-ai/f-lite/standard",
    price: 4,
    icons: ["bi-shield-check"],
    performance: {
      latency: "220ms",
      resolution: "1024x1024",
      generationQuality: "Safe & Reliable",
    },
  },
  "sana-v1.5-4.8b": {
    name: "Sana V1.5 (4.8B)",
    type: "Text-to-Image",
    description:
      "Sana V1.5 is a 4.8B parameter text-to-image model focused on ultra-high detail rendering. It creates vivid, cinematic 4K visuals with precise features and depth. Perfect for design, fantasy art, and premium content generation, Sana offers excellent clarity and style in every result with fast generation time.",
    source: "https://fal.ai/models/fal-ai/sana/v1.5/4.8b",
    price: 6,
    icons: ["bi-stars"],
    performance: {
      latency: "250ms",
      resolution: "3840x2160",
      generationQuality: "4K High Detail",
    },
  },
  "minimax-image-01": {
    name: "MiniMax Image-01",
    type: "Text-to-Image",
    description:
      "MiniMax Image-01 generates high quality visuals from descriptive text prompts. It benefits significantly from detailed input, improving the richness and accuracy of output. With consistent style and enhanced prompt-following, it is well-suited for storytelling, UI concept design, and artistic exploration tasks.",
    source: "https://fal.ai/models/fal-ai/minimax/image-01",
    price: 3,
    icons: ["bi-card-text"],
    performance: {
      latency: "190ms",
      resolution: "1024x1024",
      generationQuality: "Prompt-Sensitive",
    },
  },
  "wan-ai-wan21-t2v-13b": {
    name: "Wan-AI T2V",
    type: "Text-to-Video",
    description:
      "Wan-AI T2V is a powerful text-to-video generator that produces high-quality videos at 480p resolution. Although compact in size, this model delivers impressive results, generating motion-rich, diverse video content from simple text prompts. It is ideal for producing quick video drafts for marketing, educational, or social media content with ease.",
    source: "https://deepinfra.com/Wan-AI/Wan2.1-T2V-1.3B",
    price: 9,
    icons: ["bi-film"],
    performance: {
      latency: "600ms",
      resolution: "480p",
      generationQuality: "Medium",
    },
  },
  "pixverse-v4-text-to-video": {
    name: "PixVerse V4",
    type: "Text-to-Video",
    description:
      "PixVerse V4 is an advanced text-to-video model that enhances the creative process by enabling high-quality video generation directly from text prompts. It supports creating videos with various effects, transitions, and animated content, offering a seamless workflow for content creators. This model is suitable for generating both short clips and full video compositions, making it ideal for digital marketers and content creators.",
    source: "https://fal.ai/models/fal-ai/pixverse/v4/text-to-video",
    price: 10,
    icons: ["bi-film"],
    performance: {
      latency: "800ms",
      resolution: "1080p",
      generationQuality: "High",
    },
  },
  "lightricks-ltx-video": {
    name: "Lightricks LTX",
    type: "Text-to-Video",
    description:
      "Lightricks LTX is a sophisticated text-to-video model capable of generating 24 frames per second (FPS) video clips at 768x512 resolution. Using advanced DiT (Dual-Transformer) architecture, it excels at producing realistic videos with diverse scene transitions. It's particularly suited for creating dynamic, motion-based content that requires high-quality visuals with minimal computational overhead.",
    source: "https://replicate.com/lightricks/ltx-video",
    price: 11,
    icons: ["bi-camera-video"],
    performance: {
      latency: "700ms",
      resolution: "768x512",
      generationQuality: "Medium",
    },
  },
  "pika-text-to-video-v2-1": {
    name: "Pika V2.1",
    type: "Text-to-Video",
    description:
      "Pika V2.1 is a text-to-video model that offers cinematic-quality video generation based on written prompts. Its strength lies in generating high-definition videos that meet the creative demands of professional filmmakers, marketers, and designers. With its robust generation capabilities, it ensures detailed and visually appealing outputs, making it ideal for promotional and educational video production.",
    source: "https://fal.ai/models/fal-ai/pika/v2.1/text-to-video",
    price: 12,
    icons: ["bi-film"],
    performance: {
      latency: "900ms",
      resolution: "1080p",
      generationQuality: "High",
    },
  },
  "luma-ray2-flash": {
    name: "Luma Dream Machine: Ray 2 Flash",
    type: "Text-to-Video",
    description:
      "Luma Dream Machine: Ray 2 Flash is a dreamlike text-to-video generator that creates high-quality videos from text and image-based prompts. Its ability to transform textual input into beautiful cinematic scenes makes it perfect for filmmakers and artists. The model excels at generating ethereal, surreal scenes with soft color palettes, enhancing the creativity of the video production process.",
    source: "https://lumadream.ai/ray2flash",
    price: 11,
    icons: ["bi-camera-video"],
    performance: {
      latency: "650ms",
      resolution: "720p",
      generationQuality: "Medium",
    },
  },
  "cogvideox-5b": {
    name: "CogVideoX-5B",
    type: "Text-to-Video",
    description:
      "CogVideoX-5B is a high-performance video synthesis model capable of generating vivid, coherent videos directly from text prompts. Known for its detailed visuals and fluid motion, it is well-suited for animation, storytelling, and conceptual video generation across a wide range of themes and scenes.",
    source: "https://fal.ai/models/fal-ai/cogvideox-5b",
    price: 6,
    icons: ["bi-camera-reels"],
    performance: {
      latency: "700ms",
      resolution: "720p",
      generationQuality: "Smooth Motion",
    },
  },
  "kling-video-v2-master": {
    name: "Kling 2.0 Master",
    type: "Text-to-Video",
    description:
      "Kling 2.0 Master is a next-gen video model that delivers cinematic-quality video clips with remarkable speed and fluidity. Its fast processing and scene coherence make it ideal for creative short-form content, advertisements, and AI-driven storytelling with stunning visual impact.",
    source: "https://fal.ai/models/fal-ai/kling-video/v2/master/text-to-video",
    price: 7,
    icons: ["bi-camera-reels"],
    performance: {
      latency: "600ms",
      resolution: "1080p",
      generationQuality: "Cinematic",
    },
  },
  magi: {
    name: "MAGI-1",
    type: "Text-to-Video",
    description:
      "MAGI-1 is a powerful model for generating videos with complex physical interactions and cinematic camera angles. It excels in understanding prompt intent, creating realistic scenes with high temporal coherence, making it suitable for technical demos, storytelling, and science-based animations.",
    source: "https://fal.ai/models/fal-ai/magi",
    price: 5,
    icons: ["bi-camera-reels"],
    performance: {
      latency: "800ms",
      resolution: "720p",
      generationQuality: "Physics-Aware",
    },
  },
  "vidu-q1": {
    name: "Vidu Q1",
    type: "Text-to-Video",
    description:
      "Vidu Q1 is optimized for producing visually rich 1080p videos with high motion fidelity and prompt accuracy. Its refined rendering pipeline enables dynamic scenes and varied expressions, making it ideal for social media, virtual prototyping, and animated creative work.",
    source: "https://fal.ai/models/fal-ai/vidu/q1/text-to-video",
    price: 4,
    icons: ["bi-camera-reels"],
    performance: {
      latency: "550ms",
      resolution: "1080p",
      generationQuality: "High Detail",
    },
  },
  veo2: {
    name: "Veo 2",
    type: "Text-to-Video",
    description:
      "Veo 2 is designed to deliver realistic video output with excellent camera control and visual finesse. It supports a wide variety of styles and motion types, making it ideal for cinematic experimentation, storyboarding, and creative film concepts driven by custom user prompts.",
    source: "https://fal.ai/models/fal-ai/veo2",
    price: 3,
    icons: ["bi-camera-reels"],
    performance: {
      latency: "750ms",
      resolution: "1080p",
      generationQuality: "Realistic Motion",
    },
  },
  "stackadoc-stable-audio": {
    name: "Stable Audio",
    type: "Text-to-Audio",
    description:
      "Stable Audio is an innovative text-to-audio model that generates sound effects and audio from textual descriptions. It can produce various audio types, including background music, soundscapes, and environmental sounds, with high-quality results. The model is ideal for developers, sound designers, and content creators who need customized audio for their projects, whether for video games, films, or apps.",
    source: "https://fal.ai/models/fal-ai/stable-audio",
    price: 4,
    icons: ["bi-soundwave"],
    performance: {
      latency: "100ms",
      resolution: "N/A",
      generationQuality: "High",
    },
  },
  "cassattemusic-audio": {
    name: "CassetteAI Music",
    type: "Text-to-Audio",
    description:
      "CassetteAI Music is a fast and versatile text-to-audio model that generates professional-quality music in seconds. It can produce high-fidelity music for a wide range of applications, from advertisements to film scores, all within moments of receiving a text prompt. The model is capable of generating full tracks in various genres and moods, offering creative flexibility for musicians and producers.",
    source: "https://fal.ai/models/cassetteai/music-generator",
    price: 5,
    icons: ["bi-music-note"],
    performance: {
      latency: "150ms",
      resolution: "N/A",
      generationQuality: "High",
    },
  },
  "multilingual-audio": {
    name: "ElevenLabs Multilingual TTS",
    type: "Text-to-Audio",
    description:
      "ElevenLabs Multilingual TTS is a cutting-edge text-to-speech model that can synthesize voices in multiple languages. It offers high-quality voice synthesis for a variety of applications, including voiceovers, audiobooks, and accessibility services. With its realistic and dynamic voice generation, the model provides a seamless experience for content creators and businesses operating in global markets.",
    source: "https://fal.ai/models/fal-ai/elevenlabs/tts/multilingual-v2",
    price: 4,
    icons: ["bi-translate"],
    performance: {
      latency: "120ms",
      resolution: "N/A",
      generationQuality: "Medium",
    },
  },
  "american-audio": {
    name: "American English TTS",
    type: "Text-to-Audio",
    description:
      "American English TTS is a high-quality text-to-speech model that specializes in American English voice synthesis. It produces natural-sounding voices with excellent clarity, making it ideal for creating voiceovers for videos, podcasts, and e-learning content. This model ensures high-quality output with minimal latency, providing a smooth voice synthesis experience for content creators and professionals.",
    source: "https://fal.ai/models/fal-ai/kokoro/american-english",
    price: 4,
    icons: ["bi-mic"],
    performance: {
      latency: "110ms",
      resolution: "N/A",
      generationQuality: "High",
    },
  },
  "cassetteai-sfx-generator": {
    name: "Cassette Sound Effects Generator",
    type: "Text-to-Audio",
    description:
      "Cassette AI's Sound Effects Generator is an open-source model built to create ambient sounds and dynamic SFX from prompt input. From nature atmospheres to sci-fi transitions, this tool is ideal for indie games, films, and podcasts that need quick, creative sound design without manual recording.",
    source: "https://fal.ai/models/cassetteai/sound-effects-generator",
    price: 5,
    icons: ["bi-soundwave"],
    performance: {
      latency: "350ms",
      audioQuality: "Creative FX",
      outputType: "Sound Effects",
    },
  },
  "fal-ai-lyria2": {
    name: "Lyria 2 by Google DeepMind",
    type: "Text-to-Audio",
    description:
      "Lyria 2 by Google DeepMind is a state-of-the-art music generation model designed to produce expressive, high-fidelity compositions from text prompts. It excels in generating a wide variety of musical genres with rich instrumentation and dynamic arrangements, making it ideal for scoring, demos, or creative audio production.",
    source: "https://fal.ai/models/fal-ai/lyria2",
    price: 6,
    icons: ["bi-soundwave"],
    performance: {
      latency: "300ms",
      audioQuality: "High",
      outputType: "Music Tracks",
    },
  },
  "fal-ai-kokoro-hindi": {
    name: "Kokoro Hindi TTS",
    type: "Text-to-Audio",
    description:
      "Kokoro Hindi TTS is a fast, expressive text-to-speech model optimized for the Hindi language. It delivers clear pronunciation, natural intonation, and emotional tone shifts, making it ideal for voice assistants, educational content, and localized audio experiences in Hindi.",
    source: "https://fal.ai/models/fal-ai/kokoro/hindi",
    price: 4,
    icons: ["bi-voice-over"],
    performance: {
      latency: "150ms",
      audioQuality: "Clear",
      outputType: "Voice",
    },
  },
  "fal-ai-mmaudio-v2-text-to-audio": {
    name: "MMAudio V2 Text-to-Audio",
    type: "Text-to-Audio",
    description:
      "MMAudio V2 is designed to generate realistic, context-aware audio scenes from detailed text prompts. It captures nuances like environment, timing, and emotion, making it suitable for media, simulation, and generative storytelling with dynamic, synchronized audio experiences.",
    source: "https://fal.ai/models/fal-ai/mmaudio-v2/text-to-audio",
    price: 3,
    icons: ["bi-file-music"],
    performance: {
      latency: "280ms",
      audioQuality: "Realistic",
      outputType: "Ambient / FX",
    },
  },
  // New models from modelAllData
  "black-forest-labs-flux-schnell": {
    name: "FLUX.1 [schnell]",
    type: "Text-to-Image",
    description:
      "FLUX.1 [schnell] is a 12B-parameter flow transformer for rapid, high-quality text-to-image generation in just 1-4 steps — optimized for both personal and commercial use.",
    source: "https://fal.ai/models/fal-ai/flux/schnell",
    price: 4,
    icons: ["bi-lightning-fill"],
    performance: {
      latency: "100ms",
      resolution: "1024x1024",
      generationQuality: "Fast Generation",
    },
  },
  "black-forest-labs-flux-1-dev": {
    name: "FLUX.1 [dev]",
    type: "Text-to-Image",
    description:
      "12 billion parameter rectified flow transformer capable of generating images from text descriptions.",
    source: "https://fal.ai/models/fal-ai/flux/dev",
    price: 5,
    icons: ["bi-lightning-fill"],
    performance: {
      latency: "150ms",
      resolution: "1024x1024",
      generationQuality: "High",
    },
  },
  "black-forest-labs-flux-pro": {
    name: "FLUX.pro",
    type: "Text-to-Image",
    description:
      "Black Forest Labs' first flagship model based on Flux latent rectified flow transformers.",
    source: "https://bfl.ai/models/flux-pro",
    price: 6,
    icons: ["bi-lightning-fill"],
    performance: {
      latency: "180ms",
      resolution: "1024x1024",
      generationQuality: "High",
    },
  },
  "black-forest-labs-flux-kontext-pro": {
    name: "FLUX.kontext.pro",
    type: "Text-to-Image",
    description:
      "Black Forest Labs' state-of-the-art image editing model with natural language control and precise transformations.",
    source: "https://bfl.ai/models/flux-kontext",
    price: 6,
    icons: ["bi-pencil"],
    performance: {
      latency: "200ms",
      resolution: "1024x1024",
      generationQuality: "Editing",
    },
  },
  "black-forest-labs-flux-kontext-max": {
    name: "FLUX.kontext.max",
    type: "Text-to-Image",
    description:
      "Black Forest Labs' premium image editing model with enhanced natural language control and improved typography generation.",
    source: "https://replicate.com/black-forest-labs/flux-kontext-max",
    price: 8,
    icons: ["bi-pencil"],
    performance: {
      latency: "220ms",
      resolution: "1024x1024",
      generationQuality: "Advanced Editing",
    },
  },
  "black-forest-labs-flux-1.1-pro-ultra": {
    name: "FLUX 1.1 Pro Ultra",
    type: "Text-to-Image",
    description:
      "FLUX 1.1 Pro in Ultra and Raw modes for high-resolution (up to 4MP) image generation with enhanced realism.",
    source: "https://replicate.com/black-forest-labs/flux-1.1-pro-ultra",
    price: 10,
    icons: ["bi-lightning-fill"],
    performance: {
      latency: "250ms",
      resolution: "2048x2048",
      generationQuality: "Ultra High",
    },
  },
  "bytedance-sdxl-lightning-4step": {
    name: "SDXL-Lightning (4-Step)",
    type: "Text-to-Image",
    description:
      "SDXL-Lightning by ByteDance: a fast text-to-image model generating high-quality images in just 4 steps.",
    source: "https://replicate.com/bytedance/sdxl-lightning-4step",
    price: 3,
    icons: ["bi-lightning"],
    performance: {
      latency: "80ms",
      resolution: "1024x1024",
      generationQuality: "Fast Generation",
    },
  },
  "stabilityai-sd3-5": {
    name: "SD 3.5",
    type: "Text-to-Image",
    description:
      "At 8 billion parameters, with superior quality and prompt adherence, this base model is the most powerful in the Stable Diffusion family.",
    source: "https://deepinfra.com/stabilityai/sd3.5",
    price: 5,
    icons: ["bi-image"],
    performance: {
      latency: "200ms",
      resolution: "1024x1024",
      generationQuality: "High",
    },
  },
  "stabilityai-sd3-5-medium": {
    name: "SD 3.5 Medium",
    type: "Text-to-Image",
    description:
      "2.5 billion parameter MMDiT-X model for efficient, high-quality image generation on consumer hardware.",
    source: "https://deepinfra.com/stabilityai/sd3.5-medium",
    price: 4,
    icons: ["bi-image"],
    performance: {
      latency: "150ms",
      resolution: "1024x1024",
      generationQuality: "Medium",
    },
  },
  "stabilityai-sdxl-turbo": {
    name: "SDXL Turbo",
    type: "Text-to-Image",
    description:
      "Optimized and accelerated version of SDXL 1.0 using Adversarial Diffusion Distillation (ADD).",
    source: "https://stability.ai/news/stability-ai-sdxl-turbo",
    price: 3,
    icons: ["bi-lightning"],
    performance: {
      latency: "100ms",
      resolution: "1024x1024",
      generationQuality: "Fast Generation",
    },
  },
  "wan-ai-wan21-t2v-14b": {
    name: "Wan-AI T2V 14B",
    type: "Text-to-Video",
    description:
      "A high-capacity, state-of-the-art text-to-video model that generates visually rich 480P and 720P videos with 14B parameters.",
    source: "https://deepinfra.com/Wan-AI/Wan2.1-T2V-14B",
    price: 12,
    icons: ["bi-film"],
    performance: {
      latency: "700ms",
      resolution: "720p",
      generationQuality: "High",
    },
  },
  "wavespeedai-wan21-t2v-720p": {
    name: "WaveSpeedAI Wan 2.1-T2V-720P",
    type: "Text-to-Video",
    description:
      "Accelerated text-to-video model for generating high-resolution 720P videos using the Wan 2.1 14B architecture.",
    source: "https://replicate.com/wavespeedai/wan-2.1-t2v-720p",
    price: 12,
    icons: ["bi-film"],
    performance: {
      latency: "700ms",
      resolution: "720p",
      generationQuality: "High",
    },
  },
  "wavespeedai-wan21-t2v-480p": {
    name: "WaveSpeedAI Wan 2.1-T2V-480P",
    type: "Text-to-Video",
    description:
      "Accelerated text-to-video model for generating high-quality 480P videos using the Wan 2.1 14B architecture.",
    source: "https://replicate.com/wavespeedai/wan-2.1-t2v-480p",
    price: 10,
    icons: ["bi-film"],
    performance: {
      latency: "600ms",
      resolution: "480p",
      generationQuality: "Medium",
    },
  },
  "google-veo-3": {
    name: "Google Veo 3",
    type: "Text-to-Video",
    description:
      "Veo 3 generates high-fidelity videos with sound and cinematic realism. Advanced control over motion, camera, and audio make it perfect for storytelling.",
    source: "https://deepmind.google/technologies/veo/",
    price: 15,
    icons: ["bi-camera-reels"],
    performance: {
      latency: "800ms",
      resolution: "1080p",
      generationQuality: "Cinematic",
    },
  },
  "minimax-video-01": {
    name: "MiniMax Video 01",
    type: "Text-to-Video",
    description:
      "Generate video clips from your prompts using MiniMax model – fast and creative text-to-video generation with solid visual fidelity.",
    source: "https://replicate.com/minimax/video-01",
    price: 8,
    icons: ["bi-film"],
    performance: {
      latency: "650ms",
      resolution: "720p",
      generationQuality: "Medium",
    },
  },
  "hunyuan-video": {
    name: "Hunyuan Video",
    type: "Text-to-Video",
    description:
      "Generate high-quality videos with realistic motion from text descriptions using Tencent's state-of-the-art Hunyuan Video model.",
    source: "https://replicate.com/tencent/hunyuan-video",
    price: 10,
    icons: ["bi-film"],
    performance: {
      latency: "750ms",
      resolution: "1080p",
      generationQuality: "High",
    },
  },
  "pika-text-to-video-v2-2": {
    name: "Pika V2.2",
    type: "Text-to-Video",
    description:
      "Create cinematic, high-quality videos from text prompts with Pika's updated v2.2 model – enhanced for storytelling and visual content creation.",
    source: "https://fal.ai/models/fal-ai/pika/v2.2/text-to-video",
    price: 12,
    icons: ["bi-film"],
    performance: {
      latency: "850ms",
      resolution: "1080p",
      generationQuality: "High",
    },
  },
  "pixverse-v4.5": {
    name: "PixVerse V4.5",
    type: "Text-to-Video",
    description:
      "Quickly make 5s or 8s videos at 540p, 720p or 1080p using PixVerse v4.5 with enhanced motion and prompt coherence.",
    source: "https://fal.ai/models/fal-ai/pixverse/v4.5/text-to-video",
    price: 11,
    icons: ["bi-film"],
    performance: {
      latency: "750ms",
      resolution: "1080p",
      generationQuality: "High",
    },
  },
  "cartesia-sonic-2": {
    name: "Cartesia Sonic 2",
    type: "Text-to-Audio",
    description:
      "Generate audio from your prompts using Cartesia Sonic 2 – fast and creative text-to-audio generation with high sound fidelity.",
    source: "https://www.together.ai/models/cartesia-sonic",
    price: 5,
    icons: ["bi-soundwave"],
    performance: {
      latency: "200ms",
      audioQuality: "High",
      outputType: "General Audio",
    },
  },
  "fal-ai-elevenlabs-sound-effects": {
    name: "ElevenLabs Sound Effects",
    type: "Text-to-Audio",
    description:
      "Generate sound effects using ElevenLabs' advanced sound effects model.",
    source: "https://fal.ai/models/fal-ai/elevenlabs/sound-effects",
    price: 4,
    icons: ["bi-soundwave"],
    performance: {
      latency: "250ms",
      audioQuality: "High",
      outputType: "Sound Effects",
    },
  },
  "fal-ai-ace-step-lyrics-to-audio": {
    name: "ACE-Step Lyrics-to-Audio",
    type: "Text-to-Audio",
    description:
      "Generate full musical tracks from lyrics using ACE-Step, blending singing and music based on text input.",
    source: "https://fal.ai/models/fal-ai/ace-step",
    price: 7,
    icons: ["bi-music-note"],
    performance: {
      latency: "400ms",
      audioQuality: "High",
      outputType: "Music with Lyrics",
    },
  },
  "fal-ai-ace-step-prompt-to-audio": {
    name: "ACE-Step Prompt-to-Audio",
    type: "Text-to-Audio",
    description:
      "Generate instrumental music from descriptive text using ACE-Step's prompt-based audio synthesis.",
    source: "https://fal.ai/models/fal-ai/ace-step/prompt-to-audio",
    price: 6,
    icons: ["bi-music-note"],
    performance: {
      latency: "350ms",
      audioQuality: "High",
      outputType: "Instrumental Music",
    },
  },
  "hidream-i1-full": {
    name: "HiDream I1 Full",
    type: "Text-to-Image",
    description:
      "HiDream I1 Full is a high-performance open-source image generation model with 17B parameters, delivering state-of-the-art visuals in seconds.",
    source: "https://fal.ai/models/fal-ai/hidream-i1-full",
    price: 7,
    icons: ["bi-image"],
    performance: {
      latency: "220ms",
      resolution: "1024x1024",
      generationQuality: "High",
    },
  },
  "hidream-i1-fast": {
    name: "HiDream I1 Fast",
    type: "Text-to-Image",
    description:
      "HiDream I1 Fast is an open-source, high-speed image generation model with 17B parameters – optimized for rapid inference in just 16 steps.",
    source: "https://fal.ai/models/fal-ai/hidream-i1-fast",
    price: 5,
    icons: ["bi-lightning"],
    performance: {
      latency: "150ms",
      resolution: "1024x1024",
      generationQuality: "Fast Generation",
    },
  },
};

function renderModel(id, containerId) {
  const model = modelData[id];
  const container = document.getElementById(containerId);
  if (!model) {
    container.innerHTML = `<div class="alert alert-warning">Model ID "${id}" not found.</div>`;
    return;
  }

  container.innerHTML = `
        <div class="model-column border rounded-4 p-4 shadow-sm bg-white h-100">
            <!-- Model Header -->
            <div class="model-header d-flex justify-content-between align-items-start mb-3">
              <h4 class="fw-semibold mb-0 text-primary">${model.name}</h4>
              <div class="text-muted fs-5">${model.icons.map(icon => `<i class="bi ${icon} me-2"></i>`).join("")}</div>
            </div>

            <!-- Type and Description -->
            <p class="text-muted mb-2"><strong>Type:</strong> ${model.type}</p>
            <p class="mb-3">${model.description}</p>

            <!-- Price -->
            <p class="mb-2 model-price fw-medium">
              <i class="bi bi-coin text-warning me-1"></i> ${model.price} credits per request
            </p>

            <!-- Source -->
            <p class="text-muted mb-3">
              <strong>Source:</strong>
              <a href="${model.source}" target="_blank" class="text-decoration-none">${model.source}</a>
            </p>

            <!-- Performance Metrics -->
            <div class="performance-metrics border-top pt-3 mb-4">
              <div class="metric mb-2 d-flex justify-content-between">
                <span><strong>Latency:</strong></span> <span>150ms</span>
              </div>
              <div class="metric mb-2 d-flex justify-content-between">
                <span><strong>Resolution:</strong></span> <span>1024x1024</span>
              </div>
              <div class="metric d-flex justify-content-between">
                <span><strong>Output Quality:</strong></span> <span>High</span>
              </div>
            </div>

            <!-- View Details Button -->
            <a href="model-details.html?id=${id}" class="btn btn-outline-primary w-100">View Details</a>
          </div>
     
    `;
}

// Load model1 from URL
// Get model ID from URL
const urlParams = new URLSearchParams(window.location.search);
const model1Id = urlParams.get("id");

// DOM references
const dropdown = document.getElementById("secondModelSelect");
const categoryHeading = document.getElementById("categoryHeading");

// Render first model if ID exists
if (model1Id) {
  renderModel(model1Id, "model1");

  const model1Type = modelData[model1Id]?.type;
  if (model1Type) populateDropdown(model1Type);
}

// Populate dropdown with models of the same category
function populateDropdown(modelType) {
  dropdown.innerHTML = "<option value=''>Select Another Model</option>";

  for (const key in modelData) {
    const model = modelData[key];
    if (model.type === modelType && key !== model1Id) {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = model.name;
      dropdown.appendChild(option);
    }
  }

  // Update category heading
  categoryHeading.innerHTML = `<strong>Category:</strong> <span class="text-dark">${modelType}</span>`;
}

// On dropdown selection, render second model
dropdown.addEventListener("change", function () {
  const selectedId = this.value;
  if (selectedId) {
    renderModel(selectedId, "model2");
  } else {
    document.getElementById("model2").innerHTML = ""; // Clear if nothing selected
  }
});
