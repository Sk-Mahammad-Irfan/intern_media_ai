import ApiKeyModel from "../models/apikeyModel.js";
import { v4 as uuidv4 } from "uuid";

export const generateAPIKey = async (req, res) => {
  try {
    const userId = req.user?._id || req.body.userId || "anonymous";
    const label = req.body.label || "Unnamed Key";
    const key = uuidv4();

    let userKeys = await ApiKeyModel.findOne({ userId });

    if (!userKeys) {
      userKeys = new ApiKeyModel({ userId, keys: [] });
    }

    // Add new key
    userKeys.keys.push({ key, label });
    await userKeys.save();

    res.json({ success: true, key, label, message: "API key created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error creating API key" });
  }
};

export const getAPIKeys = async (req, res) => {
  try {
    const userId = req.user?._id || req.body.userId || "anonymous";
    const userKeys = await ApiKeyModel.findOne({ userId });

    res.json({ success: true, keys: userKeys?.keys || [] });
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

    const updated = await ApiKeyModel.findOneAndUpdate(
      { "keys.key": key },
      { $pull: { keys: { key } } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "API key not found",
      });
    }

    res.json({ success: true, message: "API key deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error deleting API key" });
  }
};
