import mongoose from "mongoose";

const apiKeySchema = new mongoose.Schema({
  userId: String,
  key: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now },
});

const ApiKeyModel = mongoose.model("ApiKey", apiKeySchema);

export default ApiKeyModel;
