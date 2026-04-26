import * as messageService from "../services/message.service.js";
import logger from "../utils/logger.js";

/**
 * THIN CHAT CONTROLLER
 * Delegates all logic to the Service layer.
 */
export const handleChatMessage = async (req, res, next) => {
    try {
        const { sessionId, content } = req.body;
        const idempotencyKey = req.headers["idempotency-key"];

        const result = await messageService.handleMessageFlow({ 
            sessionId, 
            content, 
            idempotencyKey 
        });

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        // Pass to global error handler in app.js
        next(error);
    }
};