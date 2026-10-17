import fs from "fs";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.routes.js";
import schemesRoutes from "./routes/schemes.routes.js";
import scholarshipsRoutes from "./routes/scholarships.routes.js";
import applyRoutes from "./routes/apply.routes.js";
import crisesRoutes from "./routes/crises.routes.js";

import { authMiddleware, adminMiddleware } from "./middleware/authMiddleware.js";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Startup validation
if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error("FATAL ERROR: MONGO_URI and JWT_SECRET are required.");
  process.exit(1);
}

// CORS
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map(url => url.trim().replace(/\/$/, ""))
  : ["http://localhost:5173"];

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);

      if (
        allowedOrigins.includes(origin) ||
        origin.startsWith("http://localhost")
      ) {
        return cb(null, true);
      }

      return cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());

// Uploads Folder
const uploadsDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use("/uploads", express.static(uploadsDir));

// Routes
app.use("/api/auth", authRoutes);

app.get(
  "/api/admin/dashboard",
  authMiddleware,
  adminMiddleware,
  (req, res) => {
    res.json({
      message: `Welcome Admin ${req.user.id}`,
    });
  }
);

app.get("/api/profile", authMiddleware, (req, res) => {
  res.json({
    message: `Welcome ${req.user.userType} ${req.user.designation}`,
  });
});

app.use("/api/schemes", schemesRoutes);
app.use("/api/scholarships", scholarshipsRoutes);
app.use("/api/apply", applyRoutes);
app.use("/api/crises", crisesRoutes);

// Health Route
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running",
  });
});

const PORT = process.env.PORT || 5000;

// Mongo Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Atlas Connected");
    console.log("Database:", mongoose.connection.name);
    console.log("Host:", mongoose.connection.host);

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error("MongoDB Error:", err);
  });

// Error Handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message,
  });
});