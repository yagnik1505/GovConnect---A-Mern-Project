import express from "express";
import Application from "../models/Application.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { itemId, itemType, title, name, email } = req.body;
  if (!itemId || !itemType || !title || !name || !email) {
    return res.status(400).json({ success: false, message: "Missing required fields." });
  }

  try {
    const application = new Application({ itemId, itemType, title, name, email });
    await application.save();
    return res.status(201).json({ success: true, message: "Application received.", application });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Failed to save application." });
  }
});

export default router;
