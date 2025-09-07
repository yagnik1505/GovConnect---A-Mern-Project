import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import schemesRoutes from "./routes/schemes.routes.js";
import scholarshipsRoutes from "./routes/scholarships.routes.js";
import { authMiddleware, adminMiddleware } from "./middleware/authMiddleware.js";

dotenv.config();
const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Public routes
app.use("/api/auth", authRoutes);

// Protected sample routes
app.get("/api/admin/dashboard", authMiddleware, adminMiddleware, (req, res) => {
  res.json({ message: `Welcome Admin ${req.user.id}` });
});
app.get("/api/profile", authMiddleware, (req, res) => {
  res.json({ message: `Welcome ${req.user.userType} ${req.user.designation}` });
});

// Resources routes
app.use("/api/schemes", schemesRoutes);
app.use("/api/scholarships", scholarshipsRoutes);

// MongoDB connection and server start
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => app.listen(5000, () => console.log("Server running on port 5000")))
  .catch((err) => console.error("MongoDB connection error:", err));

// Global error handling middleware (must be last middleware)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});
