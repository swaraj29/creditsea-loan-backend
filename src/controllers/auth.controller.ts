import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { IUserInput, ILoginInput, IJWTPayload, UserRole } from "../types";
import { ResponseUtil } from "../utils/responseUtil";
import { ValidationUtil } from "../utils/validationUtil";

/**
 * Register new user with comprehensive validation
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
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

    ResponseUtil.success(res, "User registered successfully", userResponse, 201);
  } catch (error) {
    console.error("Registration error:", error);
    ResponseUtil.error(res, "Internal server error", 500, "Registration failed");
  }
};

/**
 * Login user with JWT token generation
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const loginInput: ILoginInput = req.body;

    // Validate input
    const validationErrors = ValidationUtil.validateLoginInput(loginInput);
    if (validationErrors.length > 0) {
      ResponseUtil.validationError(res, validationErrors);
      return;
    }

    // Find user
    const user = await User.findOne({ email: loginInput.email.toLowerCase() });
    if (!user) {
      ResponseUtil.error(res, "Invalid credentials", 401);
      return;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(loginInput.password, user.password);
    if (!isPasswordValid) {
      ResponseUtil.error(res, "Invalid credentials", 401);
      return;
    }

    // Generate JWT token
    const jwtPayload: IJWTPayload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role as UserRole,
    };

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      ResponseUtil.error(res, "JWT configuration error", 500);
      return;
    }

    const token = jwt.sign(
      jwtPayload as object,
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" } as jwt.SignOptions
    );

    // Return user data and token
    const responseData = {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };

    ResponseUtil.success(res, "Login successful", responseData);
  } catch (error) {
    console.error("Login error:", error);
    ResponseUtil.error(res, "Internal server error", 500, "Login failed");
  }
};
