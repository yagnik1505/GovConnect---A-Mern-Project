import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
    itemType: { type: String, enum: ["scheme", "scholarship"], required: true },
    title: { type: String, required: true }, // store title for clarity
    name: { type: String, required: true },
    email: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Application", applicationSchema);
