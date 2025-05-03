import { fal } from "@fal-ai/client";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

fal.config({
  credentials: process.env.FAL_AI_AUDIO_API,
});

export const generateAudioWithFal = async (prompt, duration = 20) => {
  try {
    const result = await fal.subscribe("cassetteai/sound-effects-generator", {
      input: { prompt, duration },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS") {
          console.log(update.logs.map((log) => log.message).join("\n"));
        }
      },
    });
    console.log("Generating audio...");
    // return result.data;
    // console.log(result.data.audio_file.url);
    return result.data.audio_file.url;
  } catch (error) {
    console.error("Error generating audio with FAL:", error);
    throw error;
  }
};

export const generateWithRapidApiAudio = async (prompt) => {
  console.log("Hello from RapidAPI");

  const options = {
    method: "POST",
    url: "https://elevenlabs-sound-effects.p.rapidapi.com/generate-sound",
    headers: {
      "content-type": "application/json",
      "X-RapidAPI-Key": process.env.RAPID_API_AUDIO_KEY, // Ensure your API key is stored securely in .env
      "X-RapidAPI-Host": "elevenlabs-sound-effects.p.rapidapi.com",
    },
    data: {
      text: prompt,
      prompt_influence: 0.3,
      duration_seconds: null,
    },
  };

  try {
    // Make the API request
    const response = await axios(options);
    console.log(response)

    // Check if the response contains a valid audio URL
    const audioUrl = response?.data?.audioUrl || null;

    if (!audioUrl) {
      throw new Error("Failed to generate audio: No audio URL returned.");
    }
    console.log(audioUrl);

    return audioUrl;
  } catch (error) {
    console.error(
      "Error with RapidAPI audio generation:",
      error.message || error
    );
    return null;
  }
};
