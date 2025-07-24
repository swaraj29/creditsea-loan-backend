import mongoose from "mongoose";

// Define role type
export type Role = "admin" | "verifier";

// User schema for admin/verifier login
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "verifier"], // Allowed roles
      default: "verifier",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
