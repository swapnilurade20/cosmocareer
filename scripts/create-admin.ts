import "dotenv/config";
import bcrypt from "bcryptjs";
import {connectDB} from "../lib/db";
import User from "../models/User";
import mongoose from "mongoose";

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME?.trim() || "CosmoCareer Admin";
  if (!email || !password || password.length < 14) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD (minimum 14 characters) in the server environment before running this script.");
  }
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is not configured.");
  await connectDB();
  const passwordHash = await bcrypt.hash(password, 12);
  const existing = await User.findOne({ email }).select("_id role");
  if (existing) {
    await User.updateOne({ _id: existing._id }, {
      $set: { name, email, passwordHash, role: "admin", isActive: true, preferredLanguage: "en" }
    });
    console.log("Existing account updated: administrator role enabled, account activated and password reset.");
  } else {
    await User.create({ name, email, passwordHash, role: "admin", preferredLanguage: "en", isActive: true });
    console.log("Administrator account created successfully.");
  }
  console.log("Sign in with the exact ADMIN_EMAIL and ADMIN_PASSWORD configured for this run.");
}
main().catch(error => {
  console.error("Admin bootstrap failed:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
}).finally(async () => {
  await mongoose.disconnect();
});
