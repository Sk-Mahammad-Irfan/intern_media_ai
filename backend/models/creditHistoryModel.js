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
      enum: ["card", "crypto", "paypal"],
      default: "card",
    },
  },
  { timestamps: true }
);

export default mongoose.model("CreditHistory", creditHistorySchema);
