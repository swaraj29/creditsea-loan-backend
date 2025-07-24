import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

/**
 * Middleware to verify JWT and set req.user
 */
export const protect = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization as string;
  const token = authHeader?.split(" ")[1]; // Format: "Bearer <token>"

  if (!token) {
    res.status(401).json({ msg: "No token" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as any;
    req.user = decoded;
    next(); // Proceed to controller
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};

/**
 * Middleware to ensure user is admin
 */
export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ msg: "User not authenticated" });
    return;
  }

  if (req.user.role !== "admin") {
    res.status(403).json({ msg: "Admin access required" });
    return;
  }

  next();
};

// Middleware to check if user is verifier or admin
export const requireVerifier = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ msg: "User not authenticated" });
    return;
  }

  if (req.user.role !== "verifier" && req.user.role !== "admin") {
    res.status(403).json({ msg: "Verifier or Admin access required" });
    return;
  }

  next();
};
