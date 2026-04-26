import mongoose from "mongoose";
import Session from "../models/session.model.js";
import Message from "../models/message.model.js";

/**
 * CREATE SESSION
 * Explicitly used if a user wants to start a session before sending a message.
 */
export const createSession = async (req, res, next) => {
    try {
        const title = req.body.question || "New Reasoning Session";
        const session = await Session.create({
            title: title,
            question: title,
            lastMessageAt: new Date(),
            messageCount: 0,
        });

        res.status(201).json(session);
    } catch (err) {
        next(err); // Forward to global error handler
    }
};

/**
 * GET ALL SESSIONS
 * Optimized for sidebar listing with necessary chat previews.
 */
export const getSessions = async (req, res, next) => {
    try {
        const sessions = await Session.find()
            .sort({ lastMessageAt: -1 })
            .select("title firstMessage messageCount status lastMessageAt analytics behavioralClassification")
            .lean();

        res.status(200).json(sessions);
    } catch (err) {
        next(err);
    }
};

/**
 * GET SESSION MESSAGES
 * Delivers the full chat history including the Gemini analysis metadata.
 */
export const getSessionMessages = async (req, res, next) => {
    try {
        const { id } = req.params;

        // 1. Strict Validation: Ensure ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid session identification format" });
        }

        // 2. Optimized Retrieval
        // We sort by 'sequence' to guarantee the logical flow of the conversation
        const messages = await Message.find({ sessionId: id })
            .sort({ sequence: 1 })
            .lean();

        // 3. Optional: Check if session exists even if messages are empty
        if (messages.length === 0) {
            const sessionExists = await Session.exists({ _id: id });
            if (!sessionExists) {
                return res.status(404).json({ error: "Session not found" });
            }
        }

        res.status(200).json({
            sessionId: id,
            messages
        });
    } catch (err) {
        next(err);
    }
};

/**
 * DELETE SESSION
 * Removes a session and all its associated messages.
 */
export const deleteSession = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid session identification format" });
        }

        await Session.findByIdAndDelete(id);
        await Message.deleteMany({ sessionId: id });

        res.status(200).json({ success: true, message: "Session and associated messages deleted" });
    } catch (err) {
        next(err);
    }
};

/**
 * DELETE ALL SESSIONS
 * Wipes the entire history for a clean slate.
 */
export const deleteAllSessions = async (req, res, next) => {
    try {
        await Session.deleteMany({});
        await Message.deleteMany({});

        res.status(200).json({ success: true, message: "All sessions and messages cleared" });
    } catch (err) {
        next(err);
    }
};