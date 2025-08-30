import mongoose, { Schema, model, models } from "mongoose";

const issueSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ["open", "in_progress", "resolved", "closed"], default: "open" },
   images: [{ type: String }], // URL or file reference
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number], // [lng, lat]
            required: true
        },
        address: {
            type: String,
            required: true
        }
    }



}, {timestamps: true});

issueSchema.index({ location: "2dsphere" });

export default models.Issue || model("Issue", issueSchema);