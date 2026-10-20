import express from "express";
import mongoose from "mongoose";
import Application from "../models/Application.js";
import Scheme from "../models/Scheme.js";
import Scholarship from "../models/Scholarship.js";
import User from "../models/User.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  const { itemId, itemType, title, name: bodyName, email: bodyEmail } = req.body;

  if (!itemId || !itemType || !title || !bodyName || !bodyEmail) {
    return res.status(400).json({ success: false, message: "Missing required fields." });
  }

  if (!["scheme", "scholarship"].includes(itemType)) {
    return res.status(400).json({ success: false, message: "Invalid itemType." });
  }

  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ success: false, message: "Token is not valid" });
    }

    const name = user.name;
    const email = user.email;

    const objectId = new mongoose.Types.ObjectId(itemId);

    // Enforce item status rules: only allow apply if active/open
    if (itemType === "scheme") {
      const scheme = await Scheme.findById(objectId);
      if (!scheme) {
        return res.status(404).json({ success: false, message: "Scheme not found." });
      }
      if (scheme.status !== "active") {
        return res.status(403).json({ success: false, message: "This scheme is inactive. Applications are closed." });
      }
    } else if (itemType === "scholarship") {
      const scholarship = await Scholarship.findById(objectId);
      if (!scholarship) {
        return res.status(404).json({ success: false, message: "Scholarship not found." });
      }
      if (scholarship.status !== "open") {
        return res.status(403).json({ success: false, message: "This scholarship is closed. Applications are not allowed." });
      }
    }

    const existing = await Application.findOne({ itemId: objectId, itemType, email });
    if (existing) {
      return res.status(409).json({ success: false, message: "You have already applied for this item." });
    }

    const application = new Application({ itemId: objectId, itemType, title, name, email });
    await application.save();
    return res.status(201).json({ success: true, message: "Application received.", application });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Failed to save application." });
  }
});

export default router;
