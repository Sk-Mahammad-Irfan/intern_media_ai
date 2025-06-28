import ModelConfig from "../models/genmodelModel.js";

// Create a new model config
export const createModelConfig = async (req, res) => {
  try {
    const newModel = new ModelConfig(req.body);
    const savedModel = await newModel.save();
    res.status(201).json(savedModel);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all model configs
export const getAllModelConfigs = async (req, res) => {
  try {
    const models = await ModelConfig.find();
    res.status(200).json(models);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single model config by ID
export const getModelConfigById = async (req, res) => {
  try {
    const model = await ModelConfig.findOne({ modelId: req.params.id });
    if (!model) return res.status(404).json({ error: "Model not found" });
    res.status(200).json(model);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a model config by ID
export const updateModelConfig = async (req, res) => {
  try {
    const updatedModel = await ModelConfig.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedModel)
      return res.status(404).json({ error: "Model not found" });
    res.status(200).json(updatedModel);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a model config by ID
export const deleteModelConfig = async (req, res) => {
  try {
    const deletedModel = await ModelConfig.findByIdAndDelete(req.params.id);
    if (!deletedModel)
      return res.status(404).json({ error: "Model not found" });
    res.status(200).json({ message: "Model deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteModelsByAssetType = async (req, res) => {
  try {
    const deletedModels = await ModelConfig.deleteMany({
      assetType: req.params.assetType,
    });
    if (deletedModels.deletedCount === 0)
      return res.status(404).json({ error: "No models found" });
    res.status(200).json({
      message: `${deletedModels.deletedCount} models deleted successfully`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all image models
export const getAllImageModels = async (req, res) => {
  try {
    const imageModels = await ModelConfig.find({ assetType: "image" });
    res.status(200).json(imageModels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all video models
export const getAllVideoModels = async (req, res) => {
  try {
    const videoModels = await ModelConfig.find({ assetType: "video" });
    res.status(200).json(videoModels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all audio models
export const getAllAudioModels = async (req, res) => {
  try {
    const audioModels = await ModelConfig.find({ assetType: "audio" });
    res.status(200).json(audioModels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create multiple model configs
export const createMultipleModelConfigs = async (req, res) => {
  try {
    const models = req.body; // Expecting an array of model config objects
    if (!Array.isArray(models) || models.length === 0) {
      return res
        .status(400)
        .json({ error: "Request body must be a non-empty array" });
    }

    const savedModels = await ModelConfig.insertMany(models, { ordered: true });
    res.status(201).json(savedModels);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
