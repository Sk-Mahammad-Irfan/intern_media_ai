import modelUsageModel from "../models/ModelUsage.js";

export const getModelUsageStats = async (req, res) => {
  try {
    const usageData = await modelUsageModel.find();

    const leaderboard = usageData.map((entry) => ({
      model: entry.model,
      usage: entry.count,
      description: getModelDescription(entry.model)
    }));

    leaderboard.sort((a, b) => b.usage - a.usage); // Highest count first

    res.status(200).json(leaderboard);
  } catch (error) {
    console.error("Error fetching usage stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getModelDescription = (modelName) => {
  const descriptions = {
    "stackadoc-stable-audio": "Stable audio generation model",
    "multilingual-audio": "Multilingual speech synthesis",
    "black-forest-labs-flux-1-1-pro": "Video generation with high realism",
    "lightricks-ltx-video": "Light and fast text-to-video model",
    "pixverse-v4-text-to-video": "PixVerse v4: top-tier text-to-video"
  };
  return descriptions[modelName] || "AI model";
};
