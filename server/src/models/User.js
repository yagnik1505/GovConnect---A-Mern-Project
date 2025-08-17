import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, enum: ["Public", "Government"], default: "Public" },
  department: { type: String, default: "" }, 
  designation: { type: String, default: "" } // 👈 signup always user, admin only manual
});

export default mongoose.model("User", UserSchema);
