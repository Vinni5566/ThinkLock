import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        index: true
    },
    payload: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "processed", "failed"],
        default: "pending",
        index: true
    },
    attempts: {
        type: Number,
        default: 0
    },
    nextRetry: {
        type: Date,
        default: Date.now,
        index: true
    },
    error: String
}, {
    timestamps: true
});

// Index for the worker to find pending events efficiently
eventSchema.index({ status: 1, nextRetry: 1 });

export default mongoose.model("OutboxEvent", eventSchema);
