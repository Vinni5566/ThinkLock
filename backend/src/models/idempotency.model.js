import mongoose from "mongoose";

const idempotencySchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    response: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        index: { expires: 0 }
    }
}, {
    timestamps: true
});

export default mongoose.model("Idempotency", idempotencySchema);
