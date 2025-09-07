import mongoose from "mongoose";

const schemeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },  // renamed from name
    code: { type: String, unique: true, sparse: true },
    department: { type: String, required: true },
    launchDate: { type: Date, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Scheme", schemeSchema);
