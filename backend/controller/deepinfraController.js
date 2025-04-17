import axios from "axios";

export const generateVideoDeepinfra = async (req, res) => {
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
          Authorization: `Bearer ${process.env.DEEPINFRA_API}`,
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

export const generateVideoReplicate = async (req, res) => {
  const prompt = req.body.prompt;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const response = await axios.post(
      "https://api.replicate.com/v1/models/wan-video/wan-2.1-1.3b/predictions",
      {
        input: {
          prompt: prompt,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json",
          Prefer: "wait",
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error(
      "Replicate API error:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to generate video" });
  }
};

export const generateVideoFal = async (req, res) => {
  const prompt = req.body.prompt;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    // Step 1: Submit prompt to Fal API
    const startResponse = await axios.post(
      "https://queue.fal.run/fal-ai/wan/v2.1/1.3b/text-to-video",
      { prompt },
      {
        headers: {
          Authorization: `Key ${process.env.FAL_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const requestId = startResponse.data.request_id;

    if (!requestId) {
      return res
        .status(500)
        .json({ error: "No request_id returned from Fal API" });
    }

    // Step 2: Polling function
    const pollForResult = async (requestId, retries = 30, delay = 4000) => {
      const statusUrl = `https://queue.fal.run/fal-ai/wan/v2.1/1.3b/text-to-video/requests/${requestId}/status`;

      for (let i = 0; i < retries; i++) {
        const statusResponse = await axios.get(statusUrl, {
          headers: {
            Authorization: `Key ${process.env.FAL_KEY}`,
          },
        });

        const { status, output } = statusResponse.data;

        if (status === "COMPLETED" && output?.video_url) {
          return output.video_url;
        } else if (status === "FAILED") {
          throw new Error("Video generation failed.");
        }

        // Wait before next attempt
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      throw new Error("Video generation timed out.");
    };

    // Step 3: Get video URL or timeout
    const videoUrl = await pollForResult();

    res.status(200).json({ video_url: videoUrl });
  } catch (error) {
    console.error("Fal API error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate video" });
  }
};
