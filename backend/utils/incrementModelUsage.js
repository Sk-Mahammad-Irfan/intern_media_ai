import modelUsageModel from "../models/modelUsageModel.js";

// Increment usage count for a specific model
export const incrementModelUsage = async (modelName) => {
  try {
    await modelUsageModel.findOneAndUpdate(
      { model: modelName },
      { $inc: { count: 1 } },
      { upsert: true, new: true }
    );
  } catch (error) {
    console.error(
      `Failed to update usage count for model ${modelName}:`,
      error
    );
  }
};

// Get all model usage stats (for plotting)
export const getModelUsageStats = async (req, res) => {
  try {
    const stats = await modelUsageModel.find(
      {},
      { _id: 0, model: 1, count: 1 }
    );
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    console.error("Failed to fetch model usage stats:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
