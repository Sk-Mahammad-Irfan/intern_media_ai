import axios from "axios";

export const generateVideo = async (req, res) => {
  const prompt = req.body.prompt;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const response = await axios.post(
      "https://api.deepinfra.com/v1/inference/Wan-AI/Wan2.1-T2V-1.3B",
      { prompt },
      {
        headers: {
          Authorization: "Bearer LOt00HYBeSYqH5Xzoh24xzPJMWqv48YO",
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error(
      "DeepInfra API error:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to generate video" });
  }
};
