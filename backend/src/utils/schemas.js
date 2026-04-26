import { z } from "zod";
import mongoose from "mongoose";

// Helper for MongoDB ObjectId validation
const objectId = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid MongoDB ObjectId",
});

/**
 * REQUEST SCHEMAS
 */
export const chatRequestSchema = z.object({
    body: z.object({
        sessionId: objectId.optional(), // Optional for new sessions
        content: z.string().min(1, "Message content cannot be empty").max(2000, "Message too long"),
    }),
    headers: z.object({
        "idempotency-key": z.string().optional(),
    }).passthrough(),
});

/**
 * AI RESPONSE SCHEMA (AI SYSTEM CONTRACT)
 */
export const aiResponseSchema = z.object({
    intent: z.enum(["casual", "problem-solving"]),
    reasoningScore: z.number().min(0).max(100),
    independenceScore: z.number().min(0).max(100),
    reasoningLevel: z.enum(["low", "medium", "high", "none"]),
    gamingRisk: z.enum(["low", "medium", "high"]),
    status: z.enum(["IDLE", "HINT", "UNLOCK", "BLOCKED"]),
    publicResponse: z.string().min(1),
    conceptsDetected: z.array(z.string()),
    reasoningSteps: z.array(z.string()).optional(),
    internalThought: z.object({
        pattern: z.string(),
        justification: z.string()
    }).optional()
});

export const analyticsSchema = z.object({
    params: z.object({
        sessionId: objectId
    })
});
