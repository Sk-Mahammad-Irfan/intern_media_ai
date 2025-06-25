import express from "express";

import {
  createModelConfig,
  createMultipleModelConfigs,
  deleteModelConfig,
  getAllAudioModels,
  getAllImageModels,
  getAllModelConfigs,
  getAllVideoModels,
  getModelConfigById,
  updateModelConfig,
} from "../controller/modelsController.js";

const router = express.Router();

router.post("/", createModelConfig);
router.post("/bulk", createMultipleModelConfigs);

router.get("/", getAllModelConfigs);
router.get("/image", getAllImageModels);
router.get("/video", getAllVideoModels);
router.get("/audio", getAllAudioModels);
router.get("/:id", getModelConfigById);
router.put("/:id", updateModelConfig);
router.delete("/:id", deleteModelConfig);

export default router;
