import app from './src/app.js';
import { connectDB } from './src/config/db.js';
import config from './src/config/config.js';
import logger from './src/utils/logger.js';
import { startOutboxWorker } from './src/utils/n8n.util.js';

// Initialize Database
connectDB();

// Start Background Processes
startOutboxWorker();

// Start Server
app.listen(config.port, () => {
    logger.info(`🚀 Cognitive Shield Backend [${config.nodeEnv}] running at http://localhost:${config.port}`);
});