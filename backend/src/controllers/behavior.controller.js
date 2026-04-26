import Session from "../models/session.model.js";
import ApiError from "../utils/ApiError.js";
import logger from "../utils/logger.js";

/**
 * N8N FEEDBACK ENDPOINT
 * Allows the async intelligence layer to update session behavior classifications.
 */
export const updateSessionBehavior = async (req, res, next) => {
    try {
        const { sessionId } = req.params;
        const { classification, insight } = req.body;

        const session = await Session.findByIdAndUpdate(
            sessionId,
            {
                $set: {
                    behavioralClassification: classification,
                    "analytics.latestInsight": insight
                }
            },
            { new: true }
        );

        if (!session) throw new ApiError(404, "Session not found");

        logger.info(`[N8N_FEEDBACK]: sid=${sessionId} classification=${classification}`);
        
        res.status(200).json({
            success: true,
            data: session
        });
    } catch (error) {
        next(error);
    }
};
