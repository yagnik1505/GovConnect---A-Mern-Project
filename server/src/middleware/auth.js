import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Signup route (NO admin creation allowed)
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, userType, department, designation } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Prevent admin creation from signup
    if (designation && designation.toLowerCase() === "admin") {
      return res.status(400).json({ message: "You cannot create an admin through signup" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      userType,
      department,
      designation: designation || "user" // default user if nothing provided
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Include designation in token payload
    const token = jwt.sign(
      { id: user._id, designation: user.designation },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      designation: user.designation,
      userType: user.userType,
      name: user.name
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
