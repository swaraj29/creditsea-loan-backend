import app from "./app";
import dotenv from "dotenv";
import { connectDB } from "./config/db";

// Load environment variables from .env file
dotenv.config();

const PORT = process.env.PORT || 5001;

// Start server function
const startServer = async (): Promise<void> => {
  try {
    // Connect to MongoDB using db.ts
    await connectDB();
    
    // Start server only after DB is connected
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Start the server
startServer();
