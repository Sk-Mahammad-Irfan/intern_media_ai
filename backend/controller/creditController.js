// creditController.js

import User from "../models/userModel.js";
import CreditHistory from "../models/creditHistoryModel.js";

// ✅ Get current user credits
export const getCreditsController = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId).select("credits");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      credits: user.credits,
    });
  } catch (error) {
    console.error("Error fetching credits:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch credits",
    });
  }
};

// ✅ Update user credits and log to history
export const updateCreditsController = async (req, res) => {
  try {
    const { userId, amount, method = "card" } = req.body;

    if (!userId || amount === undefined) {
      return res.status(400).json({
        success: false,
        message: "User ID and amount are required",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Add credits
    user.credits += amount;
    await user.save();

    // Log credit transaction
    await CreditHistory.create({
      userId,
      amount,
      method,
    });

    res.status(200).json({
      success: true,
      message: "Credits updated successfully",
      user: {
        username: user.username,
        email: user.email,
        credits: user.credits,
      },
    });
  } catch (error) {
    console.error("Error updating credits:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update credits",
    });
  }
};

// ✅ Decrease credits (backend logic only)
// ✅ Decrease credits and log history
export const decreaseCredits = async (userId, amount, method = "usage") => {
  if (!userId || amount === undefined) {
    throw new Error("User ID and amount are required");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  if (user.credits < amount) {
    throw new Error("Insufficient credits");
  }

  user.credits -= amount;
  await user.save();

  // Log credit deduction in history
  await CreditHistory.create({
    userId,
    amount: -Math.abs(amount), // Ensure it's stored as negative
    method, // e.g., "usage", "download", etc.
  });

  return {
    username: user.username,
    email: user.email,
    credits: user.credits,
  };
};

// ✅ Check if user has enough credits
export const checkCredits = async (userId, credits) => {
  if (!userId || credits === undefined) {
    throw new Error("User ID and credits are required");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  console.log(Number((user.credits - credits).toFixed(2)));
  return Number((user.credits - credits).toFixed(2)) >= 0;
};

// ✅ Get credit history for a user
export const getCreditHistoryController = async (req, res) => {
  try {
    const userId = req.params.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const history = await CreditHistory.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await CreditHistory.countDocuments({ userId });

    res.status(200).json({
      success: true,
      history,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching credit history:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch credit history",
    });
  }
};
