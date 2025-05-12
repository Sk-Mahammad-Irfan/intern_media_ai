import ApiKeyModel from "../models/apikeyModel.js";
import { v4 as uuidv4 } from "uuid";

// Create API Key (if not already exists)
export const generateAPIKey = async (req, res) => {
  try {
    const userId = req.user?._id || req.body.userId || "anonymous";

    // Check if key already exists for this user
    const existingKey = await ApiKeyModel.findOne({ userId });

    if (existingKey) {
      return res.json({
        success: true,
        key: existingKey.key,
        message: "API key already exists",
      });
    }

    // If not, generate and save new key
    const key = uuidv4();
    const newKey = new ApiKeyModel({ userId, key });
    await newKey.save();

    res.json({ success: true, key, message: "New API key created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error creating API key" });
  }
};

export const getAPIKeys = async (req, res) => {
  try {
    const userId = req.user?._id || req.body.userId || "anonymous";

    const keys = await ApiKeyModel.find({ userId });
    res.json({ success: true, keys });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Error fetching API keys" });
  }
};

// Delete an API key by key string
export const deleteAPIKey = async (req, res) => {
  try {
    const { key } = req.params;

    const deleted = await ApiKeyModel.findOneAndDelete({ key });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "API key not found or not owned by user",
      });
    }

    res.json({ success: true, message: "API key deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error deleting API key" });
  }
};
