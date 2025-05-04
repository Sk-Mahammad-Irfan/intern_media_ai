import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const soundEffectsRapidapi = async (prompt) => {
  console.log("Hello from RapidAPI");

  const options = {
    method: "POST",
    url: "https://elevenlabs-sound-effects.p.rapidapi.com/generate-sound",
    headers: {
      "content-type": "application/json",
      "X-RapidAPI-Key": process.env.RAPID_API_AUDIO_KEY,
      "X-RapidAPI-Host": "elevenlabs-sound-effects.p.rapidapi.com",
    },
    data: {
      text: prompt,
      prompt_influence: 0.3,
      duration_seconds: null,
    },
  };

  try {
    const response = await axios(options);
    const audioUrl = response?.data?.audioUrl || null;

    if (!audioUrl) {
      throw new Error("Failed to generate audio: No audio URL returned.");
    }

    console.log(audioUrl);
    return audioUrl;
  } catch (error) {
    console.error("Error with RapidAPI audio generation:", error.message || error);
    return null;
  }
};
