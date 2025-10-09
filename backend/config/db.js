import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    // console.log("✅ DB connected");
    return true; // ✅ Return success
  } catch (error) {
    console.error("❌ DB connection error:", error.message);
    throw error; // ✅ Throw error so startServer can catch it
  }
};

export default connectDb;