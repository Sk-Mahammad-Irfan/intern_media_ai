import mongoose from "mongoose";

const CustomInputSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: {
    type: String,
    enum: ["text", "number", "checkbox", "select", "boolean", "float"],
    required: true,
  },
  label: { type: String, required: true },
  placeholder: { type: String },
  default: mongoose.Schema.Types.Mixed,
  options: [{ type: String }],
});

const ModelSchema = new mongoose.Schema({
  modelId: { type: String, required: true },
  name: { type: String, required: true },
  assetType: { type: String, required: true },
  provider: [{ type: String, required: true }],
  credits: [{ type: Number, required: true }],
  endpoint: { type: String },
  isActive: { type: Boolean, default: true },
  falid: { type: String, default: "" },
  togetherid: { type: String, default: "" },
  deepid: { type: String, default: "" },
  custom_inputs: [CustomInputSchema],
  aspect_ratios: [{ type: String }],
  resolutions: [{ type: String }],
  provider_aspect_ratios: {
    type: Map,
    of: [String],
    default: {},
  },
  description: {
    type: String,
    default: "",
  },
  link: {
    type: String,
    default: "",
  },
  fullDetails: {
    type: String,
    default: "",
  },
  chatPage: {
    type: String,
    default: "imagemodel.html",
  },
  creditPrice: {
    type: String,
    default: "7-8 credits/image",
  },
  tags: [{ type: String }],
});

const ModelConfig = mongoose.model("ModelConfig", ModelSchema);

export default ModelConfig;
