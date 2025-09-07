import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  profile: {
    age: Number,
    gender: { type: String, enum: ["male","female"], default: "male" },
    interests: [String],
    location: String
  }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
