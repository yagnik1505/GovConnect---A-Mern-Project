import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import authRoutes from "./routes/auth.routes.js";
import schemesRoutes from "./routes/schemes.routes.js";
import scholarshipsRoutes from "./routes/scholarships.routes.js";
import applyRoutes from "./routes/apply.routes.js";
import crisesRoutes from "./routes/crises.routes.js";

import { authMiddleware, adminMiddleware } from "./middleware/authMiddleware.js";

dotenv.config();
const app = express();

// CORS & JSON parsing middleware
// Allow the dev client to run on any localhost port used by Vite (dynamic),
// reflect the request origin when running in development.
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173", // Allow Vercel or localhost
    credentials: true,
  })
);
app.use(express.json());

// Static uploads directory
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Public routes
app.use("/api/auth", authRoutes);

// Protected sample routes with middleware
app.get("/api/admin/dashboard", authMiddleware, adminMiddleware, (req, res) => {
  res.json({ message: `Welcome Admin ${req.user.id}` });
});

app.get("/api/profile", authMiddleware, (req, res) => {
  res.json({ message: `Welcome ${req.user.userType} ${req.user.designation}` });
});

// Resource routes
app.use("/api/schemes", schemesRoutes);
app.use("/api/scholarships", scholarshipsRoutes);
app.use("/api/apply", applyRoutes);
app.use("/api/crises", crisesRoutes);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));

// Global error handling middleware (last)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});
