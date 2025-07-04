import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      serverSelectionTimeoutMS: 30000,
    });
    console.log("Mongo db connected");
  } catch (err) {
    console.log("DB disconnected", err);
  }
};

export default connectDB;
