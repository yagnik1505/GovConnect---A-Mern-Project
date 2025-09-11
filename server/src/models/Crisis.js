import mongoose from "mongoose";

const crisisSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String },
    category: { type: String, enum: ["infrastructure", "health", "safety", "environment", "other"], default: "other" },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    ward: { type: String },
    contact: { type: String },
    status: { type: String, enum: ["pending", "completed"], default: "pending" },
    proofImageUrl: { type: String },
    resolutionProofUrl: { type: String },
    proofImageDataUrl: { type: String },
    resolutionProofDataUrl: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Crisis", crisisSchema); 