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
      "Imagen 4 is Google’s latest image generation model, known for extreme photorealism and prompt precision. It creates visually stunning and highly detailed outputs with exceptional prompt interpretation. Ideal for professional and artistic projects, it delivers reliable realism and high consistency across generations.",
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

  // audio models
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
      "Cassette AI’s Sound Effects Generator is an open-source model built to create ambient sounds and dynamic SFX from prompt input. From nature atmospheres to sci-fi transitions, this tool is ideal for indie games, films, and podcasts that need quick, creative sound design without manual recording.",
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
  "multilingual-audio": {
    name: "Multilingual TTS",
    type: "Text-to-Audio",
    description:
      "Multilingual TTS by ElevenLabs (via FAL AI) offers high-quality voice synthesis in multiple languages. It supports natural, expressive speech generation with a variety of voice profiles suitable for narration, accessibility, and content localization. Ideal for developers and creators working with global audiences.",
    source: "https://fal.ai/models/fal-ai/elevenlabs/tts/multilingual-v2",
    price: 4,
    icons: ["bi-translate"],
    performance: {
      latency: "120ms",
      audioQuality: "Natural",
      outputType: "Multilingual Voice",
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
        <div class="model-column">
        <div class="model-header">
            <h4>${model.name}</h4>
            <div>${model.icons
              .map((icon) => `<i class="bi ${icon} me-1"></i>`)
              .join("")}</div>
        </div>
        <p class="text-muted mb-1"><strong>Type:</strong> ${model.type}</p>
        <p>${model.description}</p>
        <p class="mb-1 model-price"><i class="bi bi-coin"></i> ${
          model.price
        } credits per request</p>
        <p class="text-muted"><strong>Source:</strong> <a href="${
          model.source
        }" target="_blank">${model.source}</a></p>

        <div class="performance-metrics mb-4">
        <div class="metric">
            <span><strong>Latency:</strong></span> <span>150ms</span>
        </div>
        <div class="metric">
            <span><strong>Resolution:</strong></span> <span>1024x1024</span>
        </div>
        <div class="metric">
            <span><strong>Output Quality:</strong></span> <span>High</span>
        </div>
        </div>

        <a href="model-details.html?id=${id}" class="btn btn-outline-primary">View Details</a>

      
    `;
}

// Load model1 from URL
const urlParams = new URLSearchParams(window.location.search);
const model1Id = urlParams.get("id");
if (model1Id) renderModel(model1Id, "model1");

// Filter models by category based on first model's type
const dropdown = document.getElementById("secondModelSelect");

function populateDropdown(modelType) {
  dropdown.innerHTML = "<option value=''>Select Another Model</option>";
  for (const key in modelData) {
    if (modelData[key].type === modelType && key !== model1Id) {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = modelData[key].name;
      dropdown.appendChild(option);
    }
  }
  const categoryHeading = document.getElementById("categoryHeading");
  categoryHeading.textContent = `Category: ${modelType}`;
}

// On model1 load, populate dropdown with same category models
if (model1Id) {
  const model1Type = modelData[model1Id].type;
  populateDropdown(model1Type);
}

// Show second model on change
dropdown.addEventListener("change", function () {
  const selectedId = this.value;
  if (selectedId) renderModel(selectedId, "model2");
});
