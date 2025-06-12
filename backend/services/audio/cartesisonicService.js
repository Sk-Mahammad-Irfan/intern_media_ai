import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY;

export const generateSpeechTogether = async (prompt) => {
  try {
    const response = await axios.post(
      "https://api.together.xyz/v1/audio/generations",
      {
        model: "cartesia/sonic-2",
        input: prompt,
        voice: "sweet lady",
        response_encoding: "pcm_f32le",
        response_format: "wav",
        sample_rate: 44100,
        stream: false,
      },
      {
        headers: {
          Authorization: `Bearer ${TOGETHER_API_KEY}`,
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer", // For binary data like audio
      }
    );

    console.log(response.data);

    // Save to a file
    const outputPath = path.resolve("speech.wav");
    fs.writeFileSync(outputPath, response.data);

    return outputPath;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const details = error.response?.data || error.message;
      console.error("API Error (Together):", details);
      throw new Error(`Together API Error: ${JSON.stringify(details)}`);
    } else {
      console.error("Unexpected error:", error);
      throw new Error("Unexpected error during Together API call");
    }
  }
};
