import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import applicationRoutes from "./routes/application.routes";
import userRoutes from "./routes/user.routes"; // ✅ NEW IMPORT

const app = express();

// Middleware for enabling CORS and parsing JSON request bodies
app.use(cors());
app.use(express.json());

// Mount route handlers
app.use("/api/auth", authRoutes);              // Register/Login routes
app.use("/api/applications", applicationRoutes); // Loan application routes
app.use("/api/users", userRoutes);              // ✅ User management (delete user etc.)

// Basic route to check if API is alive
app.get("/", (_, res) => {
  res.send("CreditSea Backend Running!");
});

export default app;
