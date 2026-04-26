import express from "express";
import { sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

/**
 * @route   POST /api/message
 * @desc    Primary Thinking Engine Entry Point
 * 1. Validates Session
 * 2. Calls Gemini for Intent & Reasoning
 * 3. Returns structured JSON for Live Feedback UI
 */
router.post("/", sendMessage);

/**
 * @route   GET /api/message/health
 * @desc    Internal check to ensure the Message Service is reachable
 */
router.get("/health", (req, res) => res.status(200).json({ status: "Message Service Active" }));

export default router;