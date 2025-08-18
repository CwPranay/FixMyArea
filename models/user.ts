import mongoose, { Schema, model, models } from "mongoose";

const userSchema = new Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // only for credentials login
  image: { type: String },
  role: { type: String, enum: ["user", "authority","admin"], default: "user" },
  authorityDocs: { type: [String] }, // URLs or file references
  authorityVerified: { type: Boolean, default: false }, // Verification status
}, { timestamps: true });

export default models.User || model("User", userSchema);
