import { comparePassword, hashPassword } from "../helper/authHelper.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";
import validator from "validator";
import crypto from "crypto";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const config = {
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
};
// Email transporter configuration
const transporter = nodemailer.createTransport(config);

// Send verification email function
const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email.html?token=${token}`; // Changed to frontend URL

  const mailOptions = {
    from: `"${process.env.APP_NAME}" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: "Verify Your Email Address",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Email Verification</h2>
        <p>Thank you for registering with us! Please click the button below to verify your email address:</p>
        <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">Verify Email</a>
        <p>If you didn't create an account with us, please ignore this email.</p>
        <p style="color: #888; font-size: 12px;">This link will expire in 24 hours.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
export const registerController = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validation
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

    // Check if user exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(401).send({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create verification token
    const verificationToken = crypto.randomBytes(20).toString("hex");
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // Create new user
    const user = await new userModel({
      username,
      email,
      password: hashedPassword,
      credits: 0,
      verified: false,
      verificationToken,
      verificationTokenExpires,
    }).save();

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    res.status(200).send({
      success: true,
      message:
        "Registration successful! Please check your email to verify your account.",
      user: {
        userId: user._id,
        email: user.email,
        username: user.username,
        credits: user.credits,
        role: user.role || 0,
        verified: user.verified,
      },
      // Note: We don't send a JWT token here since the user isn't verified yet
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Error in registration",
      err,
    });
  }
};

export const verifyEmailController = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Verification token is required",
      });
    }

    const user = await userModel.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification token",
      });
    }

    // Mark user as verified and clear token
    user.verified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    // Generate JWT token for immediate login
    const authToken = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
      token: authToken,
      user: {
        userId: user._id,
        email: user.email,
        username: user.username,
        credits: user.credits,
        role: user.role,
        verified: true,
      },
    });
  } catch (err) {
    console.error("Email verification error:", err);
    return res.status(500).json({
      success: false,
      message: "Error verifying email",
      error: err.message,
    });
  }
};

export const resendVerificationEmailController = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Check if already verified
    if (user.verified) {
      return res.status(400).send({
        success: false,
        message: "Email is already verified",
      });
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(20).toString("hex");
    user.verificationToken = verificationToken;
    user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await user.save();

    // Send new verification email
    await sendVerificationEmail(email, verificationToken);

    res.status(200).send({
      success: true,
      message: "Verification email resent successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Error resending verification email",
      err,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (validator.isEmpty(email) || validator.isEmpty(password)) {
      return res.status(400).send({
        success: false,
        message: "Please fill all fields",
      });
    }

    // Find user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(401).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if email is verified
    if (!user.verified) {
      return res.status(403).send({
        success: false,
        message: `Please verify your email address first. Check your inbox or `,
        error: "Email not verified",
      });
    }

    // Generate JWT token
    const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).send({
      success: true,
      message: "Login successful",
      user: {
        username: user.username,
        email: user.email,
        credits: user.credits,
        userId: user._id,
        role: user.role,
        verified: user.verified,
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
