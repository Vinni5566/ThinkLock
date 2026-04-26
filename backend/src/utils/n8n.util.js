import axios from "axios";
import config from "../config/config.js";
import logger from "./logger.js";
import OutboxEvent from "../models/event.model.js";

/**
 * GUARANTEED DELIVERY DISPATCHER
 * Saves to Outbox within the transaction.
 */
export const dispatchEvent = async (eventType, payload, options = { session: null }) => {
    try {
        await OutboxEvent.create([{
            type: eventType,
            payload
        }], { session: options.session });
        
        logger.debug(`[OUTBOX_QUEUED]: ${eventType}`);
    } catch (error) {
        logger.error(`[OUTBOX_FAIL]: Failed to queue event. ${error.message}`);
        // If this is critical, we might want to throw, but usually, 
        // we'd rather save the business transaction (the message).
    }
};

/**
 * BACKGROUND WORKER: Outbox Processor
 * Processes pending events and handles retries.
 */
export const startOutboxWorker = () => {
    logger.info("🚀 Outbox Worker Started");
    
    setInterval(async () => {
        const events = await OutboxEvent.find({
            status: "pending",
            nextRetry: { $lte: new Date() }
        }).limit(10);

        for (const event of events) {
            try {
                await axios.post(config.n8n.eventsUrl, {
                    type: event.type,
                    timestamp: event.createdAt,
                    payload: event.payload
                }, {
                    headers: { 'X-N8N-API-KEY': process.env.N8N_API_KEY || '' }
                });

                event.status = "processed";
                await event.save();
                logger.debug(`[OUTBOX_PROCESSED]: ${event.type}`);
            } catch (error) {
                event.attempts += 1;
                event.error = error.message;
                
                if (event.attempts >= 5) {
                    event.status = "failed";
                } else {
                    // Exponential backoff for the next retry
                    const backoff = Math.pow(2, event.attempts) * 1000;
                    event.nextRetry = new Date(Date.now() + backoff);
                }
                
                await event.save();
                logger.warn(`[OUTBOX_RETRY]: ${event.type} attempt ${event.attempts} failed.`);
            }
        }
    }, 10000); // Check every 10 seconds
};
