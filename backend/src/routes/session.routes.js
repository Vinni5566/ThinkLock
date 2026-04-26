import express from "express";
import {
    createSession,
    getSessions,
    getSessionMessages,
    deleteSession,
    deleteAllSessions,
} from "../controllers/session.controller.js";

const router = express.Router();

/**
 * @route   DELETE /api/session
 * @desc    Clear all sessions
 */
router.delete("/", deleteAllSessions);

/**
 * @route   DELETE /api/session/:id
 * @desc    Delete a specific session
 */
router.delete("/:id", deleteSession);

/**
 * @route   POST /api/session
 * @desc    Manual session creation (e.g., clicking "New Chat")
 */
router.post("/", createSession);

/**
 * @route   GET /api/session
 * @desc    Sidebar History: Fetches all sessions sorted by 'lastMessageAt'
 */
router.get("/", getSessions);

/**
 * @route   GET /api/session/:id/messages
 * @desc    Conversation View: Fetches full chat history with AI Reasoning data
 */
router.get("/:id/messages", getSessionMessages);

export default router;