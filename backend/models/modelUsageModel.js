import mongoose from "mongoose";
const modelUsageSchema = new mongoose.Schema({
  model: { type: String, required: true, unique: true },
  count: { type: Number, default: 1 },
});

const modelUsageModel = mongoose.model("ModelUsage", modelUsageSchema);
export default modelUsageModel;
