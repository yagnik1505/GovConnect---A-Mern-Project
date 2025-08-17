import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js"; // ✅ will now work
import { authMiddleware, adminMiddleware } from "./middleware/authMiddleware.js";

dotenv.config();
const app = express();

app.use(express.json());

// Public Auth Routes
app.use("/api/auth", authRoutes);

// Example: Admin-only route
app.get("/api/admin/dashboard", authMiddleware, adminMiddleware, (req, res) => {
  res.json({ message: `Welcome Admin ${req.user.id}` });
});

// Example: Any logged-in user route
app.get("/api/profile", authMiddleware, (req, res) => {
  res.json({ message: `Welcome ${req.user.designation}` });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch((err) => console.error(err));
