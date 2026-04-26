import express from "express";
import cors from "cors";
import config from "./config/config.js";
import logger from "./utils/logger.js";
import chatRoutes from "./routes/chat.routes.js";
import sessionRoutes from "./routes/session.routes.js";
import messageRoutes from "./routes/message.routes.js";
import ApiError from "./utils/ApiError.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logging
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

// Routes
app.use("/api/chat", chatRoutes);
app.use("/api/session", sessionRoutes);
app.use("/api/message", messageRoutes);

// 404 Handler
app.use((req, res, next) => {
    next(new ApiError(404, "Endpoint not found"));
});

// Global Error Handler
app.use((err, req, res, next) => {
    let { statusCode, message } = err;
    
    if (!statusCode) statusCode = 500;
    
    res.locals.errorMessage = err.message;

    const response = {
        success: false,
        code: statusCode,
        message,
        ...(config.nodeEnv === "development" && { stack: err.stack }),
    };

    if (config.nodeEnv === "development") {
        logger.error(err);
    }

    res.status(statusCode).send(response);
});

export default app;