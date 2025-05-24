import mongoose from "mongoose";

const creditHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    method: {
      type: String,
      enum: ["card", "crypto", "paypal", "usage", "api"],
      default: "card",
    },
    createdAt: {
      type: Date,
      default: Date.now, // Set to current time
      index: true,
      expires: 3600, // 1 hour in seconds
    },
  },
  { timestamps: true }
);

export default mongoose.model("CreditHistory", creditHistorySchema);
