import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      trim: true,
      maxLength: 30,
    },
    email: {
      type: String,
      require: true,
      unique: true,
      maxLength: 50,
    },
    password: {
      type: String,
      require: function () {
        // Password is required only if googleId is not provided
        return !this.googleId;
      },
      minLength: 8,
      maxLength: 100,
    },
    credits: {
      type: Number,
      default: 0,
    },
    googleId: {
      type: String,
      default: null,
    },
    role: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model("Users", userSchema);

export default userModel;
