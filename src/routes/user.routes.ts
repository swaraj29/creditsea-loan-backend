import express from "express";
import { deleteUser, addUser, getAllUsers, getProfile } from "../controllers/user.controller";
import { protect, requireAdmin } from "../middlewares/auth.middleware";

const router = express.Router();

// Protected routes
router.get("/profile", protect, getProfile);

// Admin only routes
router.get("/", protect, requireAdmin, getAllUsers);
router.post("/", protect, requireAdmin, addUser);
router.delete("/:id", protect, requireAdmin, deleteUser);

export default router;
