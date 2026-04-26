import logger from "./logger.js";

const States = {
    CLOSED: "CLOSED",
    OPEN: "OPEN",
    HALF_OPEN: "HALF_OPEN"
};

class CircuitBreaker {
    constructor(request, options = {}) {
        this.request = request;
        this.state = States.CLOSED;
        this.failureCount = 0;
        this.failureThreshold = options.failureThreshold || 3;
        this.recoveryTimeout = options.recoveryTimeout || 30000; // 30 seconds
        this.lastFailureTime = null;
    }

    async fire(...args) {
        if (this.state === States.OPEN) {
            if (Date.now() - this.lastFailureTime > this.recoveryTimeout) {
                this.state = States.HALF_OPEN;
                logger.info(`[CIRCUIT_BREAKER]: State moving to HALF_OPEN`);
            } else {
                logger.warn(`[CIRCUIT_BREAKER]: State is OPEN. Failing fast.`);
                throw new Error("Circuit Breaker is OPEN. AI service unavailable.");
            }
        }

        try {
            const response = await this.request(...args);
            this.onSuccess();
            return response;
        } catch (error) {
            this.onFailure();
            throw error;
        }
    }

    onSuccess() {
        this.failureCount = 0;
        this.state = States.CLOSED;
    }

    onFailure() {
        this.failureCount++;
        this.lastFailureTime = Date.now();
        
        if (this.failureCount >= this.failureThreshold) {
            this.state = States.OPEN;
            logger.error(`[CIRCUIT_BREAKER]: State moved to OPEN due to ${this.failureCount} failures.`);
        }
    }
}

export default CircuitBreaker;
