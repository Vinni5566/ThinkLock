import logger from "./logger.js";

/**
 * Generic retry utility with exponential backoff
 * @param {Function} fn - The async function to retry
 * @param {Object} options - Retry options
 * @returns {Promise<any>}
 */
export const withRetry = async (fn, options = { maxRetries: 3, initialDelay: 500, maxDelay: 3000 }) => {
    const { maxRetries, initialDelay, maxDelay } = options;
    let delay = initialDelay;

    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            const isLastRetry = i === maxRetries - 1;
            
            // Log the attempt
            logger.warn(`[RETRY]: Attempt ${i + 1} failed. ${error.message}`);

            if (isLastRetry) {
                logger.error(`[RETRY]: All ${maxRetries} attempts failed.`);
                throw error;
            }

            // Check if error is transient (e.g., 503, 429)
            // If not transient, we might want to throw immediately, 
            // but for now, we'll follow the user's lead and retry.
            
            await new Promise((resolve) => setTimeout(resolve, delay));
            delay = Math.min(delay * 2, maxDelay);
        }
    }
};
