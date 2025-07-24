import express from "express";
import { register, login } from "../controllers/auth.controller";

const router = express.Router();

// Auth routes
router.post("/register", register);   // Signup
router.post("/login", login);         // Login

export default router;
