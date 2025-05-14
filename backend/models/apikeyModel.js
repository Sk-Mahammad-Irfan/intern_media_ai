import mongoose from "mongoose";

const keySchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  label: { type: String, default: "Unnamed Key" },
  createdAt: { type: Date, default: Date.now },
});

const apiKeySchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  keys: [keySchema],
});

const ApiKeyModel = mongoose.model("ApiKey", apiKeySchema);

export default ApiKeyModel;
