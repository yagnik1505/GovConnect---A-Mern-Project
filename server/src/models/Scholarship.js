import mongoose from "mongoose";

const scholarshipSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    department: { type: String, required: true },
    eligibility: { type: String, required: true },
    applicationDeadline: { type: Date, required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ["open", "closed"], default: "open" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Scholarship", scholarshipSchema);
