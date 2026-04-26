import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sessionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Session",
        required: true,
        index: true
    },
    sequence: {
        type: Number,
        required: true,
        min: 1
    },
    role: {
        type: String,
        enum: ["user", "assistant", "system"],
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true,
        maxlength: 5000 // A bit more room for AI responses
    },
    // COGNITIVE ANALYSIS PAYLOAD
    analysis: {
        intent: String,
        reasoningScore: { type: Number, min: 0, max: 100 },
        reasoningLevel: String,
        independenceScore: { type: Number, min: 0, max: 100 },
        gamingRisk: String,
        status: String,
        conceptsDetected: [String],
        reasoningSteps: [String],
        patternDetected: String,
        internalMetadata: mongoose.Schema.Types.Mixed // For internal reasoning/thoughts
    }
}, {
    timestamps: true,
    versionKey: false
});

// Compound index for message ordering within a session
messageSchema.index({ sessionId: 1, sequence: 1 }, { unique: true });

export default mongoose.model("Message", messageSchema);