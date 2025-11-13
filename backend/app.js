import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import worspaceRoutes from "./src/routes/workspaceRoutes.js";
import { errorMiddleware } from "./src/middleware/errorMiddleware.js"; 
dotenv.config();
const app = express();

// Connect to MongoDB
connectDB.connect(process.env.MONGO_URI);

// Middleware
app.use(cors({
  origin: "http://localhost:5173",  // your React app’s origin
  credentials: true,                // allow cookies/auth headers
}));
app.use(express.json());
// Routes
app.use("/api/auth", authRoutes);
app.use("/api", worspaceRoutes);

app.use(errorMiddleware);
export default app;
