import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// 📌 SIGNUP
router.post("/signup", async (req, res) => {
  try {
    let { name, email, password, userType, department, designation } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // Block creating admin via signup
    if (designation?.toLowerCase() === "admin") {
      return res
        .status(400)
        .json({ message: "You cannot create an admin through signup" });
    }

    // Default values & lowercase normalization
    userType = (userType || "public").toLowerCase();
    designation = (designation || "user").toLowerCase();

    // ✅ Hash password manually
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

    console.log("Login attempt with email:", email);
    console.log("Password received:", password);

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user)
      return res.status(404).json({ success: false, message: "User does not exist" });

    console.log("Stored hashed password:", user.password);

    // Compare password with bcrypt
    const valid = await bcrypt.compare(password, user.password);
    console.log("Password match result:", valid);

    if (!valid)
      return res.status(401).json({ success: false, message: "Incorrect password" });

    // Generate JWT with designation & userType
    const token = jwt.sign(
      {
        id: user._id,
        designation: (user.designation || "user").toLowerCase(),
        userType: (user.userType || "public").toLowerCase(),
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
