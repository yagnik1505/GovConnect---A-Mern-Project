import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import fs from "fs";
import Crisis from "../models/Crisis.js";
import { authMiddleware, govOrAdminMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Switch to memory storage to avoid filesystem persistence
const upload = multer({ storage: multer.memoryStorage() });

function bufferToDataUrl(buffer, mimetype) {
  if (!buffer || !mimetype) return undefined;
  const base64 = buffer.toString("base64");
  return `data:${mimetype};base64,${base64}`;
}

// NOTE: role checks are handled by middleware `govOrAdminMiddleware`

// Public (authenticated users) can submit a crisis (optional proof image)
router.post("/", authMiddleware, upload.single("proof"), async (req, res) => {
  try {
    const { title, description, location, category, priority, ward, contact } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: "Title and description are required" });
    }

    const dataUrl = req.file ? bufferToDataUrl(req.file.buffer, req.file.mimetype) : undefined;

    const crisis = new Crisis({
      title,
      description,
      location,
      category,
      priority,
      ward,
      contact,
      createdBy: req.user.id,
      proofImageDataUrl: dataUrl,
    });

    await crisis.save();
    return res.status(201).json({ success: true, crisis });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Failed to submit crisis" });
  }
});

// Creator can list their own crises
router.get("/mine", authMiddleware, async (req, res) => {
  try {
    const crises = await Crisis.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    return res.json({ success: true, crises });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Failed to fetch your crises" });
  }
});

// Officers and Admin can list all crises
// Government and Admin can list all crises
router.get("/", authMiddleware, govOrAdminMiddleware, async (req, res) => {
  try {
    const crises = await Crisis.find()
      .sort({ createdAt: -1 })
      .populate("createdBy", "name email userType designation");
    return res.json({ success: true, crises });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Failed to fetch crises" });
  }
});

// Get crisis statistics for charts (public endpoint) - MUST be before /:id route
router.get("/stats", async (req, res) => {
  try {
    // Get crisis type distribution
    const crisisTypeStats = await Crisis.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Get solved vs unsolved crisis stats
    const solvedStats = await Crisis.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // Get total crisis count
    const totalCrises = await Crisis.countDocuments();

    res.json({
      success: true,
      stats: {
        crisisTypes: crisisTypeStats,
        solvedStatus: solvedStats,
        totalCrises
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch crisis statistics" });
  }
});

// Get single crisis by id (officer/admin or owner)
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const crisis = await Crisis.findById(req.params.id).populate("createdBy", "name email userType designation");
    if (!crisis) return res.status(404).json({ success: false, message: "Crisis not found" });

    // allow if owner or government/admin
    const isOwner = crisis.createdBy && crisis.createdBy._id.toString() === req.user.id;
    const userType = (req.user.userType || "").toLowerCase();
    const designation = (req.user.designation || "").toLowerCase();
    const isGovOrAdmin = userType === "government" || designation === "admin";
    if (!isOwner && !isGovOrAdmin) return res.status(403).json({ success: false, message: "Access denied" });

    return res.json({ success: true, crisis });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Failed to fetch crisis" });
  }
});

// Government employees (non-admin) can resolve with proof image
// Government/Admin can resolve with proof image
router.post("/:id/resolve", authMiddleware, govOrAdminMiddleware, upload.single("proof"), async (req, res) => {
  try {
    const dataUrl = req.file ? bufferToDataUrl(req.file.buffer, req.file.mimetype) : undefined;
    const update = { status: "RESOLVED", resolvedAt: new Date() };
    if (dataUrl) update.resolutionProofDataUrl = dataUrl;

    const updated = await Crisis.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: "Crisis not found" });
    return res.json({ success: true, crisis: updated });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Failed to resolve crisis" });
  }
});

// Officers/Admin can update status
// Status and assignment workflows removed to restore stable baseline

export default router; 