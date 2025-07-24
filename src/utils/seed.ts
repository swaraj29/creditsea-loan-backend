import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User";
import dotenv from "dotenv";

dotenv.config();

const seedUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/creditsea");
    console.log("✅ Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@creditsea.com" });
    if (existingAdmin) {
      console.log("Admin user already exists");
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 12);
    
    await User.create({
      name: "Admin User",
      email: "admin@creditsea.com",
      password: hashedPassword,
      role: "admin"
    });

    // Create verifier user
    const verifierPassword = await bcrypt.hash("verifier123", 12);
    
    await User.create({
      name: "Verifier User", 
      email: "verifier@creditsea.com",
      password: verifierPassword,
      role: "verifier"
    });

    console.log("✅ Seed users created successfully:");
    console.log("📧 Admin: admin@creditsea.com / admin123");
    console.log("📧 Verifier: verifier@creditsea.com / verifier123");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedUsers();
