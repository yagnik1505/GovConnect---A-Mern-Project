import express from "express";
import Scholarship from "../models/Scholarship.js";
import { authMiddleware, govOrAdminMiddleware, adminMiddleware } from "../middleware/authMiddleware.js";
import Application from "../models/Application.js";

const router = express.Router();

// Create scholarship (Gov/Admin only)
router.post("/", authMiddleware, govOrAdminMiddleware, async (req, res) => {
  try {
    const {
      title,
      department,
      eligibility,
      applicationDeadline,
      description,
      amount,
      status,
    } = req.body;

    const scholarship = new Scholarship({
      title,
      department,
      eligibility,
      applicationDeadline,
      description,
      amount,
      status,
      createdBy: req.user.id,
    });

    await scholarship.save();
    res.status(201).json({ success: true, scholarship });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error while creating scholarship" });
  }
});

// Get all scholarships (public)
router.get("/", async (req, res) => {
  try {
    const scholarships = await Scholarship.find().sort({ createdAt: -1 });
    res.json({ success: true, scholarships });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error fetching scholarships" });
  }
});

// Get scholarship by ID (public)
router.get("/:id", async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);
    if (!scholarship) return res.status(404).json({ success: false, message: "Scholarship not found" });
    res.json({ success: true, scholarship });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error fetching scholarship" });
  }
});

// Update scholarship (Gov/Admin only)
router.put("/:id", authMiddleware, govOrAdminMiddleware, async (req, res) => {
  try {
    const updated = await Scholarship.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Scholarship not found" });
    res.json({ success: true, scholarship: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error updating scholarship" });
  }
});

// Delete scholarship (Admin only)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const deleted = await Scholarship.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Scholarship not found" });
    res.json({ success: true, message: "Scholarship deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error deleting scholarship" });
  }
});

router.get("/", async (req, res) => {
  try {
    const scholarships = await Scholarship.find().sort({ createdAt: -1 });

    // Add applicant count for each scholarship
    const scholarshipsWithCount = await Promise.all(
      scholarships.map(async (scholarship) => {
        const count = await Application.countDocuments({ itemId: scholarship._id, itemType: "scholarship" });
        return { ...scholarship.toObject(), applicantCount: count };
      })
    );

    res.json({ success: true, scholarships: scholarshipsWithCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error fetching scholarships" });
  }
});

export default router;
