import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import worspaceRoutes from "./src/routes/workspaceRoutes.js";
import chatRoutes from "./src/routes/chatRoutes.js";
import { errorMiddleware } from "./src/middleware/errorMiddleware.js"; 
dotenv.config();
const app = express();

// Connect to MongoDB
connectDB.connect(process.env.MONGO_URI);

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173", 
  credentials: true,               
}));
app.use(express.json());
// Routes
app.use("/api/auth", authRoutes);
app.use("/api", worspaceRoutes);
app.use("/api/chat", chatRoutes);

app.use(errorMiddleware);
export default app;
