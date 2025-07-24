import mongoose from "mongoose";

// Loan Application Schema
const applicationSchema = new mongoose.Schema(
  {
    // Applicant details
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    
    // Loan details
    amount: { type: Number, required: true },
    purpose: { type: String, required: true },
    tenure: { type: Number, required: true }, // in months
    monthlyIncome: { type: Number, required: true },
    employmentType: { type: String, required: true },
    
    // Documents
    panCard: String,
    aadharCard: String,
    
    // Status tracking
    status: {
      type: String,
      enum: ["pending", "verified", "rejected", "approved"],
      default: "pending",
    },
    
    // Workflow tracking
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    verifiedAt: Date,
    adminActionBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    adminActionAt: Date,
    rejectionReason: String,
    
    submittedBy: { type: String, required: false }, // IP address or user ID
  },
  { timestamps: true }
);

export default mongoose.model("Application", applicationSchema);
