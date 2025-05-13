import modelUsageModel from "../models/modelUsageModel.js";

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
