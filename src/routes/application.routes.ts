import express from "express";
import {
  submitApplication,
  getApplications,
  updateStatus,
  verifyApplication,
  rejectApplication,
  approveApplication,
  adminRejectApplication,
  getDashboardStats
} from "../controllers/application.controller";
import { protect, requireAdmin, requireVerifier } from "../middlewares/auth.middleware";

const router = express.Router();

// Public route - submit new application
router.post("/submit", submitApplication);

// Protected routes
router.get("/", protect, getApplications);
router.get("/stats", protect, getDashboardStats);

// Verifier only routes
router.patch("/:id/verify", protect, requireVerifier, verifyApplication);
router.patch("/:id/reject", protect, requireVerifier, rejectApplication);

// Admin only routes  
router.patch("/:id/approve", protect, requireAdmin, approveApplication);
router.patch("/:id/admin-reject", protect, requireAdmin, adminRejectApplication);

// Generic status update (for backward compatibility)
router.patch("/:id", protect, updateStatus);

export default router;
