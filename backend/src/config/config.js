import dotenv from "dotenv";
dotenv.config();

const config = {
    port: process.env.PORT || 5000,
    mongoUri: process.env.MONGO_URI,
    geminiApiKey: process.env.GEMINI_API_KEY,
    nodeEnv: process.env.NODE_ENV || "development",

    // AI Configuration
    ai: {
        modelChain: [
            "gemini-3-flash-preview",
            "gemini-3-pro-preview"
        ],
        historyLimit: 10,
        retry: {
            maxRetries: 3,
            initialDelay: 500, // ms
            maxDelay: 3000     // ms
        }
    },

    // Rate Limiting
    rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100                  // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    },

    // Business Logic
    chat: {
        maxMessageLength: 2000,
        maxHistoryContext: 6
    },

    // n8n Webhooks
    n8n: {
        eventsUrl: process.env.N8N_EVENTS_URL || "http://localhost:5678/webhook/cognitive-events",
        apiKey: process.env.N8N_API_KEY || ""
    }
};

export default config;
