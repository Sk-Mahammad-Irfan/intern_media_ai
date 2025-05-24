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
      expires: 604800, // 7 days in seconds
    },
  },
  { timestamps: true }
);

export default mongoose.model("CreditHistory", creditHistorySchema);
