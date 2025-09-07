import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // will store bcrypt hash manually
  userType: {
    type: String,
    enum: ["public", "government", "admin"],
    required: true,
    lowercase: true,
    default: "public",
  },
  designation: {
    type: String,
    lowercase: true,
    default: "user",
  },
  department: String,
});

// Normalize fields only (do NOT hash password here)
userSchema.pre("save", function (next) {
  this.userType = (this.userType || "public").toLowerCase();
  this.designation = (this.designation || "user").toLowerCase();
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
