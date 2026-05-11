import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
    required: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  bio: {
    type: String,
    default: "",
    trim: true,
  },
  avatar: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
}, { timestamps: true });

const User = mongoose.model("User", userSchema, "users");

export default User;