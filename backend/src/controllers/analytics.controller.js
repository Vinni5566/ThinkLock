import Session from "../models/session.model.js";
import ApiError from "../utils/ApiError.js";

/**
 * GET COGNITIVE PROFILE
 * Aggregates stats across all user sessions or a specific one.
 */
export const getCognitiveProfile = async (req, res, next) => {
    try {
        const { sessionId } = req.params;
        const session = await Session.findById(sessionId);
        
        if (!session) throw new ApiError(404, "Session not found");

        // In a real app, we might aggregate across ALL user sessions here
        res.status(200).json({
            success: true,
            data: {
                reasoningScore: session.analytics.avgReasoningScore,
                independenceScore: session.analytics.avgIndependenceScore,
                consistency: 65, // Placeholder for complex calc
                aiRelianceRatio: session.analytics.aiRelianceRatio,
                latestInsight: session.analytics.latestInsight,
                trends: {
                    reasoningGrowth: "12%",
                    weeklyData: [20, 45, 30, 78, 65, 80] // Mock for frontend graph
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * GET ANTI-GAMING STATS
 */
export const getAntiGamingStats = async (req, res, next) => {
    try {
        const { sessionId } = req.params;
        const session = await Session.findById(sessionId);
        
        if (!session) throw new ApiError(404, "Session not found");

        const total = session.analytics.totalDetections;
        const gamingScore = total > 0 ? Math.min(Math.round((total / session.messageCount) * 100), 100) : 0;

        res.status(200).json({
            success: true,
            data: {
                totalDetections: session.analytics.totalDetections,
                blocked: session.analytics.blockedCount,
                warnings: session.analytics.warningCount,
                gamingScore: `${gamingScore}%`,
                riskLevel: gamingScore > 20 ? "High" : "Low"
            }
        });
    } catch (error) {
        next(error);
    }
};
