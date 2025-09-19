import express from "express";
import mongoose from "mongoose";
import Application from "../models/Application.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  const { itemId, itemType, title, name, email } = req.body;

  if (!itemId || !itemType || !title || !name || !email) {
    return res.status(400).json({ success: false, message: "Missing required fields." });
  }

  if (!["scheme", "scholarship"].includes(itemType)) {
    return res.status(400).json({ success: false, message: "Invalid itemType." });
  }

  try {
    const objectId = new mongoose.Types.ObjectId(itemId);

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
