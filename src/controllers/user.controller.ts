import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import { IUserInput, UserRole } from "../types";
import { ResponseUtil } from "../utils/responseUtil";
import { ValidationUtil } from "../utils/validationUtil";

/**
 * Get all users (admin only)
 */
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== UserRole.ADMIN) {
      ResponseUtil.error(res, "Access denied. Admins only.", 403);
      return;
    }

    const users = await User.find().select("-password");
    
    ResponseUtil.success(res, "Users fetched successfully", users);
  } catch (error) {
    console.error("Get all users error:", error);
    ResponseUtil.error(res, "Failed to fetch users", 500);
  }
};

/**
 * Add new user (admin only)
 */
export const addUser = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== UserRole.ADMIN) {
      ResponseUtil.error(res, "Access denied. Admins only.", 403);
      return;
    }

    const userInput: IUserInput = req.body;

    // Validate input
    const validationErrors = ValidationUtil.validateUserInput(userInput);
    if (validationErrors.length > 0) {
      ResponseUtil.validationError(res, validationErrors);
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: userInput.email });
    if (existingUser) {
      ResponseUtil.error(res, "User with this email already exists", 409);
      return;
    }

    // Validate role
    if (userInput.role && !Object.values(UserRole).includes(userInput.role)) {
      ResponseUtil.error(res, "Invalid role. Must be 'admin' or 'verifier'", 400);
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userInput.password, 12);

    // Create user
    const newUser = await User.create({
      name: ValidationUtil.sanitizeString(userInput.name),
      email: userInput.email.toLowerCase(),
      password: hashedPassword,
      role: userInput.role || UserRole.VERIFIER,
    });

    // Return user without password
    const userResponse = {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt,
    };

    ResponseUtil.success(res, "User created successfully", userResponse, 201);
  } catch (error) {
    console.error("Add user error:", error);
    ResponseUtil.error(res, "Failed to create user", 500);
  }
};

/**
 * Delete user (admin only)
 */
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.user?.role !== UserRole.ADMIN) {
      ResponseUtil.error(res, "Access denied. Admins only.", 403);
      return;
    }

    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (req.user.id === id) {
      ResponseUtil.error(res, "You cannot delete yourself.", 400);
      return;
    }

    // Find and delete user
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      ResponseUtil.error(res, "User not found.", 404);
      return;
    }

    ResponseUtil.success(res, "User deleted successfully", {
      id: deletedUser._id,
      name: deletedUser.name,
      email: deletedUser.email,
    });
  } catch (error) {
    console.error("Delete user error:", error);
    ResponseUtil.error(res, "Failed to delete user", 500);
  }
};

/**
 * Get current user profile
 */
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      ResponseUtil.error(res, "Authentication required", 401);
      return;
    }

    const user = await User.findById(req.user.id).select("-password");
    
    if (!user) {
      ResponseUtil.error(res, "User not found", 404);
      return;
    }

    ResponseUtil.success(res, "Profile fetched successfully", {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    ResponseUtil.error(res, "Failed to fetch profile", 500);
  }
};
