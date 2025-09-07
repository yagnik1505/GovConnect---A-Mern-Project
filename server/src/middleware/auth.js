import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Signup route (NO admin creation allowed)
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, userType, department, designation } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

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
      designation: designation || "user"
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Login route
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User does not exist" });
    }

    console.log("Stored hash:", user.password);
    const valid = await bcrypt.compare(password, user.password);
    console.log("Password valid:", valid);

    if (!valid) {
      return res.status(401).json({ success: false, message: "Incorrect password" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        designation: user.designation.toLowerCase(),
        userType: user.userType.toLowerCase(),
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
        userType: user.userType.toLowerCase(),
        designation: user.designation.toLowerCase(),
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
