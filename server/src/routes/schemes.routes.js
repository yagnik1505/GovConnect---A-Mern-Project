import express from "express";
import Scheme from "../models/Scheme.js";
import { authMiddleware, govOrAdminMiddleware, adminMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create scheme (Gov/Admin only)
router.post("/", authMiddleware, govOrAdminMiddleware, async (req, res) => {
  try {
    const { title, code, department, launchDate, description, status } = req.body;
    const scheme = new Scheme({
      title,
      code,
      department,
      launchDate,
      description,
      status,
      createdBy: req.user.id,
    });
    await scheme.save();
    res.status(201).json({ success: true, scheme });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error while creating scheme" });
  }
});

// Get all schemes (public)
router.get("/", async (req, res) => {
  try {
    const schemes = await Scheme.find().sort({ createdAt: -1 });
    res.json({ success: true, schemes });
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
    const updated = await Scheme.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
