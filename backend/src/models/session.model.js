import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        index: true,
        default: null
    },
    title: {
        type: String,
        trim: true,
        maxlength: 120,
        default: "New Reasoning Session",
        required: true
    },
    firstMessage: {
        type: String,
        maxlength: 2000, // Sync with config
        trim: true
    },
    messageCount: {
        type: Number,
        default: 0,
        min: 0
    },
    analytics: {
        avgReasoningScore: { type: Number, default: 0, min: 0, max: 100 },
        avgIndependenceScore: { type: Number, default: 0, min: 0, max: 100 },
        aiRelianceRatio: { type: Number, default: 0, min: 0, max: 100 },
        totalDetections: { type: Number, default: 0, min: 0 },
        blockedCount: { type: Number, default: 0, min: 0 },
        warningCount: { type: Number, default: 0, min: 0 },
        latestInsight: { type: String, default: "Analyzing patterns...", maxlength: 500 }
    },
    behavioralClassification: {
        type: String,
        enum: ["unclassified", "high-reliance-pattern", "gaming-behavior", "thinking-heavy"],
        default: "unclassified"
    },
    analyticsVersion: {
        type: String,
        default: "v1.0"
    },
    lastMessageAt: {
        type: Date,
        default: Date.now,
        index: true
    },
    status: {
        type: String,
        enum: ["active", "completed", "archived"],
        default: "active",
        index: true
    }
}, {
    timestamps: true,
    versionKey: false
});

sessionSchema.index({ userId: 1, lastMessageAt: -1 });
sessionSchema.index({ "analytics.totalDetections": -1 });

export default mongoose.model("Session", sessionSchema);