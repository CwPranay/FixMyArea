// models/issue.ts
import mongoose, { Schema, model, models } from "mongoose";

const issueSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { 
        type: String, 
        enum: ["open", "in_progress", "resolved", "closed"], 
        default: "open" 
    },
    images: [{ type: String }],
    // REMOVE the old createdBy field completely
    createdById: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false
    },
    createdByType: {
        type: String,
        enum: ["user", "anonymous"],
        required: true,
        default: "anonymous"
    },
    createdByName: {
        type: String,
        required: true,
        default: "Anonymous"
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            required: true,
            default: "Point"
        },
        coordinates: {
            type: [Number],
            required: true,
            validate: {
                validator: function(coords: number[]) {
                    return coords.length === 2 && 
                           typeof coords[0] === 'number' && 
                           typeof coords[1] === 'number';
                },
                message: 'Coordinates must be an array of two numbers'
            }
        },
        address: {
            type: String,
            required: true
        }
    }
}, { timestamps: true });

issueSchema.index({ location: "2dsphere" });

// Delete the old model to ensure it's recreated with new schema
delete mongoose.models.Issue;

export default model("Issue", issueSchema);