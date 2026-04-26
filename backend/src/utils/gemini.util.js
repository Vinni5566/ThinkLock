import { GoogleGenerativeAI } from "@google/generative-ai";
import config from "../config/config.js";
import { aiResponseSchema } from "./schemas.js";
import { withRetry } from "./retry.util.js";
import ApiError from "./ApiError.js";
import logger from "./logger.js";
import CircuitBreaker from "./CircuitBreaker.js";

/**
 * SEMANTIC VALIDATOR
 * Ensures logical consistency in AI output.
 */
const validateSemanticConsistency = (data) => {
    // 1. Check if high reasoning score has a valid reasoning level
    if (data.reasoningScore > 70 && data.reasoningLevel === "low") {
        throw new Error("Contradictory reasoning score and level.");
    }

    // 2. Check if gamingRisk "high" has a corresponding low independence score
    if (data.gamingRisk === "high" && data.independenceScore > 50) {
        throw new Error("Gaming risk detected but independence score is too high.");
    }

    // 3. Ensure BLOCKED status has a justification
    if (data.status === "BLOCKED" && !data.internalThought?.justification) {
        throw new Error("Blocked status requires internal justification.");
    }
    
    return data;
};

const genAI = new GoogleGenerativeAI(config.geminiApiKey);

const systemInstruction = `You are a JSON-only API. No prose. No markdown.
            
            ROLE: Senior Cognitive Auditor & Educational Architect.
            GOAL: Rigorously analyze if the user is demonstrating genuine independent thinking or 'gaming' the system for quick answers.
            
            STRICT GUIDELINES:
            1. STATUS 'UNLOCK': ONLY grant if reasoningScore > 80. The user must have solved the core logic themselves.
            2. STATUS 'HINT': Use if the user is on the right track but needs a nudge. DO NOT give the answer.
            3. STATUS 'BLOCKED': Use if the user is asking for the code/answer directly or showing zero reasoning effort.
            4. STATUS 'IDLE': Default for casual conversation.
            
            REASONING ANALYSIS:
            - Decompose the user's logic into concepts.
            - Identify 'Internal Reasoning Steps' taken by the user.
            
            OUTPUT SCHEMA:
            {
                "intent": "casual" | "problem-solving",
                "reasoningScore": 0-100,
                "independenceScore": 0-100,
                "reasoningLevel": "low"|"medium"|"high"|"none",
                "gamingRisk": "low"|"medium"|"high",
                "status": "IDLE"|"HINT"|"UNLOCK"|"BLOCKED",
                "publicResponse": "Socratic guidance or final confirmation here",
                "conceptsDetected": ["string"],
                "reasoningSteps": ["string"],
                "internalThought": { "pattern": "string", "justification": "string" }
            }`;

const callModelInternal = async (modelName, content, history) => {
    const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: systemInstruction,
        generationConfig: { responseMimeType: "application/json" }
    }, { apiVersion: "v1beta" });

    const formattedHistory = history.slice(-config.chat.maxHistoryContext).map(msg => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }]
    }));

    const chat = model.startChat({ history: formattedHistory });
    const result = await chat.sendMessage(`INPUT: "${content}"`);
    const responseText = result.response.text();

    const parsed = JSON.parse(responseText);
    const validated = aiResponseSchema.parse(parsed); // Use parse for strictness
    
    // SEMANTIC VALIDATION
    return validateSemanticConsistency(validated);
};

// Initialize Circuit Breakers for each model
const breakers = config.ai.modelChain.reduce((acc, model) => {
    acc[model] = new CircuitBreaker((...args) => callModelInternal(model, ...args), {
        failureThreshold: 3,
        recoveryTimeout: 60000 // 1 minute
    });
    return acc;
}, {});

export const analyzeMessage = async (content, history = []) => {
    for (const modelName of config.ai.modelChain) {
        try {
            const breaker = breakers[modelName];
            return await withRetry(() => breaker.fire(content, history), config.ai.retry);
        } catch (error) {
            const isLastModel = modelName === config.ai.modelChain[config.ai.modelChain.length - 1];
            if (!isLastModel) {
                logger.warn(`[FAILOVER]: ${modelName} failed/tripped. Trying next...`);
                continue;
            }
            throw new ApiError(502, error.message || "AI service temporarily unavailable");
        }
    }
};