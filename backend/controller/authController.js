import { comparePassword, hashPassword } from "../helper/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";
import validator from "validator";

export const registerController = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).send({
        success: false,
        message: "Please fill all fields",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).send({
        success: false,
        message: "Invalid email",
      });
    }

    if (!validator.isStrongPassword(password)) {
      return res.status(400).send({
        success: false,
        message:
          "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(401).send({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await new userModel({
      username,
      email,
      password: hashedPassword,
      credits: 0,
    }).save();

    // 🔐 Generate JWT Token for auto-login
    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).send({
      success: true,
      message: "User Registered",
      user: {
        userId: user._id,
        email: user.email,
        username: user.username,
        credits: user.credits,
      },
      token, // ✅ Send token back
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Error in register",
      err,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (validator.isEmpty(email) || validator.isEmpty(password)) {
      return res.status(400).send({
        success: false,
        message: "Please fill all field",
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(401).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).send({
      success: true,
      message: "Login successfully",
      user: {
        username: user.username,
        email: user.email,
        credits: user.credits,
        userId: user._id,
      },
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Error in login",
      err,
    });
  }
};

export const successGoogleLogin = async (req, res) => {
  try {
    // Check if user exists
    if (!req.user) {
      return res.status(401).send({
        success: false,
        message: "User not authenticated",
      });
    }

    // Generate JWT token for the user
    const token = JWT.sign({ _id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Create user object with token
    const userWithToken = {
      ...(typeof req.user.toObject === "function"
        ? req.user.toObject()
        : req.user),
      token: token,
    };

    res.status(200).send({
      success: true,
      message: "success login using google",
      user: userWithToken,
    });
  } catch (error) {
    console.error("Error in successGoogleLogin:", error);
    res.status(500).send({
      success: false,
      message: "Error in successGoogleLogin",
      error: error.message || error,
    });
  }
};

export const failureGoogleLogin = async (req, res) => {
  try {
    res.status(401).send({
      success: false,
      message: "failure login using google",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in failureGoogleLogin",
      error,
    });
  }
};

// test protected route
export const testProtectedRoute = async (req, res) => {
  try {
    res.status(200).send({
      success: true,
      message: "test authenticated route",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in testAuthenticated",
      error,
    });
  }
};
