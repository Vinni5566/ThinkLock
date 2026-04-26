import express from "express";
import { rateLimit } from "express-rate-limit";
import { handleChatMessage } from "../controllers/chat.controller.js";
import { getCognitiveProfile, getAntiGamingStats } from "../controllers/analytics.controller.js";
import { updateSessionBehavior } from "../controllers/behavior.controller.js";
import validate from "../middlewares/validate.middleware.js";
import { chatRequestSchema, analyticsSchema } from "../utils/schemas.js";
import config from "../config/config.js";

const router = express.Router();

const chatLimiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    message: { error: "Too many requests, please try again later." }
});

// Primary Chat Endpoint
router.post("/send", chatLimiter, validate(chatRequestSchema), handleChatMessage);

// Analytics Endpoints
router.get("/profile/:sessionId", validate(analyticsSchema), getCognitiveProfile);
router.get("/anti-gaming/:sessionId", validate(analyticsSchema), getAntiGamingStats);

// Intelligence Loop: n8n Behavioral Feedback
router.post("/behavior/:sessionId", validate(analyticsSchema), updateSessionBehavior);

export default router;