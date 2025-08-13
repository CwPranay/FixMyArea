import mongoose, { Schema, model, models } from "mongoose";

const userSchema = new Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // only for credentials login
  image: { type: String },
  role: { type: String, enum: ["user", "authority"], default: "user" },
}, { timestamps: true });

export default models.User || model("User", userSchema);
