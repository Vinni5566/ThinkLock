import mongoose from "mongoose";
import Session from "../models/session.model.js";
import Message from "../models/message.model.js";

/**
 * SYNC SESSION STATS
 * Updates the session's aggregate data (like average reasoning score) 
 * based on all assistant messages in the chat.
 */
export const syncSessionStats = async (sessionId) => {
    if (!mongoose.Types.ObjectId.isValid(sessionId)) {
        throw new Error("Invalid session ID for stats sync");
    }

    // Aggregation Pipeline: Calculate average score across all assistant responses
    const stats = await Message.aggregate([
        {
            $match: {
                sessionId: new mongoose.Types.ObjectId(sessionId),
                role: "assistant",
                "analysis.reasoningScore": { $exists: true, $ne: null }
            }
        },
        {
            $group: {
                _id: "$sessionId",
                avgScore: { $avg: "$analysis.reasoningScore" },
                totalAIResponses: { $sum: 1 }
            }
        }
    ]);

    if (stats.length > 0) {
        await Session.findByIdAndUpdate(sessionId, {
            avgReasoningScore: Math.round(stats[0].avgScore)
        });
    }
};

/**
 * ARCHIVE/DELETE SESSION
 * Handles the cascading deletion of messages when a session is removed.
 */
export const deleteSessionWithMessages = async (sessionId) => {
    const dbSession = await mongoose.startSession();
    try {
        await dbSession.withTransaction(async () => {
            // 1. Remove all associated messages
            await Message.deleteMany({ sessionId }, { session: dbSession });

            // 2. Remove the session itself
            await Session.findByIdAndDelete(sessionId, { session: dbSession });
        });
        return true;
    } catch (error) {
        throw error;
    } finally {
        dbSession.endSession();
    }
};

/**
 * GET SESSION SUMMARY
 * Logic to generate a quick summary for the UI 'Stats' card.
 */
export const getSessionProgress = async (sessionId) => {
    const session = await Session.findById(sessionId).lean();
    if (!session) throw new Error("Session not found");

    return {
        id: session._id,
        title: session.title,
        progress: session.avgReasoningScore || 0,
        activityCount: session.messageCount,
        status: session.status
    };
};