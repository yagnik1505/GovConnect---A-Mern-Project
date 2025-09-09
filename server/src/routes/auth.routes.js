import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// 📌 SIGNUP
router.post("/signup", async (req, res) => {
  try {
    let { name, email, password, userType, department, designation } = req.body;

    // Validate existing user
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Prevent signup as admin
    if (designation?.toLowerCase() === "admin") {
      return res.status(400).json({ message: "You cannot create an admin through signup" });
    }

    // Normalize userType and designation to lowercase with default fallback
    userType = (userType || "public").toLowerCase();
    designation = (designation || "user").toLowerCase();

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      userType,
      department,
      designation,
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 📌 LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ success: false, message: "User does not exist" });
    }

    // Compare password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ success: false, message: "Incorrect password" });
    }

    // Generate JWT including normalized userType and designation
    const token = jwt.sign(
      {
        id: user._id,
        userType: (user.userType || "public").toLowerCase(),
        designation: (user.designation || "user").toLowerCase(),
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        userType: (user.userType || "public").toLowerCase(),
        designation: (user.designation || "user").toLowerCase(),
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
