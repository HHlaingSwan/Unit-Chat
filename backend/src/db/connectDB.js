import mongoose from "mongoose";

export const connectingDB = async (url) => {
  try {
    await mongoose.connect(url);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
    process.exit(1); // 1 is the exit code for an error, 0 is for success
  }
};
