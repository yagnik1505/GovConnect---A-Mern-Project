import express from "express";
import mongoose from "mongoose";
import Scheme from "../models/Scheme.js";
import Application from "../models/Application.js";
import { authMiddleware, govOrAdminMiddleware, adminMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create scheme (Gov/Admin only)
router.post("/", authMiddleware, govOrAdminMiddleware, async (req, res) => {
  try {
    const { title, code, department, launchDate, description, status } = req.body;

    if (!title || !department || !launchDate || !description) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const parsedDate = new Date(launchDate);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ success: false, message: "Invalid launchDate" });
    }

    const schemeData = {
      title,
      department,
      launchDate: parsedDate,
      description,
      status,
      createdBy: req.user.id,
    };

    // Only include code if it's provided and not empty
    if (code && code.trim() !== '') {
      schemeData.code = code.trim();
    }

    const scheme = new Scheme(schemeData);
    await scheme.save();
    res.status(201).json({ success: true, scheme });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error while creating scheme" });
  }
});

// Get all schemes with applicant count (public)
router.get("/", async (req, res) => {
  try {
    const schemes = await Scheme.find().sort({ createdAt: -1 });

    const schemesWithCount = await Promise.all(
      schemes.map(async (scheme) => {
        const count = await Application.countDocuments({
          itemId: new mongoose.Types.ObjectId(scheme._id),
          itemType: "scheme",
        });
        return { ...scheme.toObject(), applicantCount: count };
      })
    );

    res.json({ success: true, schemes: schemesWithCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error fetching schemes" });
  }
});

// Get scheme by ID (public)
router.get("/:id", async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id);
    if (!scheme) return res.status(404).json({ success: false, message: "Scheme not found" });
    res.json({ success: true, scheme });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error fetching scheme" });
  }
});

// Update scheme (Gov/Admin only)
router.put("/:id", authMiddleware, govOrAdminMiddleware, async (req, res) => {
  try {
    const body = { ...req.body };
    if (body.launchDate) {
      const d = new Date(body.launchDate);
      if (isNaN(d.getTime())) {
        return res.status(400).json({ success: false, message: "Invalid launchDate" });
      }
      body.launchDate = d;
    }

    // Handle code field properly - only include if provided and not empty
    if (body.code !== undefined) {
      if (body.code && body.code.trim() !== '') {
        body.code = body.code.trim();
      } else {
        // Remove the code field if it's empty or null
        delete body.code;
      }
    }

    const updated = await Scheme.findByIdAndUpdate(req.params.id, body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Scheme not found" });
    res.json({ success: true, scheme: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error updating scheme" });
  }
});

// Delete scheme (Admin only)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const deleted = await Scheme.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Scheme not found" });
    res.json({ success: true, message: "Scheme deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error deleting scheme" });
  }
});

export default router;
