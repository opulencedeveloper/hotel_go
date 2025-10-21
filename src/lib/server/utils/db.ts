import mongoose from "mongoose";
const databaseUrlAndCode = process.env.MONGODB_URI || "";

const MONGODB_URI = databaseUrlAndCode;

export async function connectDB() {
  if (!MONGODB_URI) {
    console.error("Please define MONGODB_URI in .env.local");
    throw new Error("Please define MONGODB_URI in .env.local");
  }

  if (mongoose.connection.readyState >= 1) return;

  return mongoose.connect(MONGODB_URI);
}
