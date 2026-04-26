import * as messageService from "../services/message.service.js";

export const sendMessage = async (req, res, next) => {
    try {
        const { sessionId, content } = req.body;
        if (!content) return res.status(400).json({ error: "Content is required" });

        const result = await messageService.handleMessageFlow({ sessionId, content });
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};