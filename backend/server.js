import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import transactionRoutes from "./routes/TransactionRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Cek env variables
if (!process.env.MONGO_URI) throw new Error("MONGO_URI tidak ditemukan!");
if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET tidak ditemukan!");

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err.message));

// Routes
app.use("/api", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/ai", aiRoutes);

// Default route
app.get("/", (req, res) => res.send("Server is running!"));

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));