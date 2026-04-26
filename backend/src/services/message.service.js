import mongoose from "mongoose";
import Session from "../models/session.model.js";
import Message from "../models/message.model.js";
import Idempotency from "../models/idempotency.model.js";
import { generateTitle } from "../utils/generateTitle.js";
import { analyzeMessage } from "../utils/gemini.util.js";
import { dispatchEvent } from "../utils/n8n.util.js";
import ApiError from "../utils/ApiError.js";
import logger from "../utils/logger.js";

const ANALYTICS_VERSION = "v1.2"; // For historical consistency

export const handleMessageFlow = async ({ sessionId, content, idempotencyKey }) => {
    const startTime = Date.now();
    let activeSid = sessionId;
    let isNew = !sessionId;

    // 1. IDEMPOTENCY CHECK
    if (idempotencyKey) {
        const existing = await Idempotency.findOne({ key: idempotencyKey });
        if (existing) {
            logger.info(`[IDEMPOTENCY_HIT]: key=${idempotencyKey}`);
            return existing.response;
        }
    }

    // 2. CONTEXT RETRIEVAL
    let sessionDoc;
    if (isNew) {
        sessionDoc = new Session({
            title: generateTitle(content),
            firstMessage: content.substring(0, 200),
            analyticsVersion: ANALYTICS_VERSION
        });
        activeSid = sessionDoc._id;
    } else {
        sessionDoc = await Session.findById(activeSid);
        if (!sessionDoc) throw new ApiError(404, "Session not found");
    }

    const history = await Message.find({ sessionId: activeSid })
        .sort({ sequence: 1 })
        .limit(10)
        .lean();

    // 3. CALL AI ENGINE (Outside Transaction)
    const aiAnalysis = await analyzeMessage(content, history);

    // 4. ATOMIC DB UPDATE (Start Transaction)
    const dbSession = await mongoose.startSession();
    let flowResult = null;

    try {
        await dbSession.withTransaction(async () => {
            const nextSeq = (sessionDoc.messageCount || 0) + 1;

            if (isNew) await sessionDoc.save({ session: dbSession });

            const [userMsg] = await Message.create([{
                sessionId: activeSid,
                sequence: nextSeq,
                role: "user",
                content: content.trim(),
                analysis: { intent: aiAnalysis.intent }
            }], { session: dbSession });

            const [aiMsg] = await Message.create([{
                sessionId: activeSid,
                sequence: nextSeq + 1,
                role: "assistant",
                content: aiAnalysis.publicResponse,
                analysis: {
                    ...aiAnalysis,
                    internalMetadata: aiAnalysis.internalThought
                }
            }], { session: dbSession });

            // Update Session Aggregates
            await Session.findByIdAndUpdate(activeSid, {
                $inc: {
                    messageCount: 2,
                    "analytics.totalDetections": aiAnalysis.gamingRisk === "high" ? 1 : 0,
                    "analytics.blockedCount": aiAnalysis.status === "BLOCKED" ? 1 : 0,
                    "analytics.warningCount": aiAnalysis.status === "HINT" ? 1 : 0
                },
                $set: {
                    lastMessageAt: new Date(),
                    "analytics.avgReasoningScore": aiAnalysis.reasoningScore,
                    "analytics.avgIndependenceScore": aiAnalysis.independenceScore,
                    "analytics.aiRelianceRatio": (100 - aiAnalysis.independenceScore)
                }
            }, { session: dbSession });

            flowResult = {
                sessionId: activeSid,
                messages: [userMsg, aiMsg],
                sessionStats: aiAnalysis
            };

            // DURABLE EVENT QUEUEING (Inside Transaction)
            await dispatchEvent("MESSAGE_PROCESSED", {
                sessionId: activeSid,
                content,
                analysis: aiAnalysis,
                version: ANALYTICS_VERSION
            }, { session: dbSession });

            // IDEMPOTENCY CACHING
            if (idempotencyKey) {
                await Idempotency.create([{
                    key: idempotencyKey,
                    response: flowResult
                }], { session: dbSession });
            }
        });

        return flowResult;
    } catch (error) {
        logger.error(`[MESSAGE_FLOW_CRITICAL_FAIL]: ${error.message}`);
        throw error;
    } finally {
        await dbSession.endSession();
    }
};