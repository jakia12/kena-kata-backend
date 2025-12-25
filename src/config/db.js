// src/config/db.js
import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is missing in .env");
  }

  try {
    const conn = await mongoose.connect(uri, {
      // These options are fine to omit in modern mongoose,
      // but keeping it explicit is okay for learning.
      // serverSelectionTimeoutMS: 5000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    // Fail fast so you immediately know DB is down
    process.exit(1);
  }
};

export default connectDB;
