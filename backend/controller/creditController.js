import userModel from "../models/userModel.js";

export const updateCreditsController = async (req, res) => {
  try {
    const { userId, amount } = req.body;

    if (!userId || amount === undefined) {
      return res.status(400).json({
        success: false,
        message: "User ID and amount are required",
      });
    }

    // Find the user
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update credits
    user.credits += amount;

    // Save the updated user
    await user.save();

    res.status(200).json({
      success: true,
      message: "Credits updated successfully",
      user: {
        username: user.username,
        email: user.email,
        credits: user.credits,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Error updating credits",
      err: err.message,
    });
  }
};

export const getCreditsController = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Find the user
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      credits: user.credits,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Error getting credits",
      err: err.message,
    });
  }
};

export const decreaseCredits = async (userId, amount) => {
  if (!userId || amount === undefined) {
    throw new Error("User ID and amount are required");
  }

  const user = await userModel.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (user.credits < amount) {
    throw new Error("Insufficient credits");
  }

  user.credits -= amount;

  await user.save();

  return {
    username: user.username,
    email: user.email,
    credits: user.credits,
  };
};
