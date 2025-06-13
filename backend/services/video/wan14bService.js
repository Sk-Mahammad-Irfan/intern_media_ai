import axios from "axios";

export const wan14B = async (prompt, resolution, aspect_ratio, seed) => {
  const DEEPINFRA_TOKEN = process.env.DEEPINFRA_API;

  const url = "https://api.deepinfra.com/v1/inference/Wan-AI/Wan2.1-T2V-14B";

  try {
    const response = await axios.post(
      url,
      { prompt },
      {
        headers: {
          Authorization: `Bearer ${DEEPINFRA_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error generating video:",
      error.response?.data || error.message
    );
    throw error;
  }
};
