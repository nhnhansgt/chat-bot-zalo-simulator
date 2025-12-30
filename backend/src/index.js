import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import config, { validateConfig } from './config/index.js';
import webhookRouter from './routes/webhook.js';
import { errorHandler } from './middlewares/errorHandler.js';

/**
 * Express server for Zalo OA Chatbot Webhook Simulator
 *
 * Provides a webhook endpoint that receives Zalo OA format messages
 * and returns AI-generated responses using Google Gemini API.
 */

// Validate configuration on startup
try {
  validateConfig();
} catch (error) {
  console.error('Configuration validation failed:', error.message);
  console.error('Please check your .env file and ensure all required variables are set.');
  process.exit(1);
}

// Create Express app
const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for development
}));

// CORS configuration
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
}));

// Body parsing middleware
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Request logging middleware (development only)
if (config.isDevelopment) {
  app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.path}`, {
      body: req.method === 'POST' ? { ...req.body } : undefined,
    });
    next();
  });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'chatbot-zalo-simulator',
    status: 'healthy',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// Mount webhook routes
app.use('/webhook', webhookRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'NOT_FOUND',
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// Global error handler (must be last)
app.use(errorHandler);

// Start server
const server = app.listen(config.port, () => {
  console.log('='.repeat(50));
  console.log('Zalo OA Chatbot Webhook Simulator - Backend Server');
  console.log('='.repeat(50));
  console.log(`Environment: ${config.nodeEnv}`);
  console.log(`Server running on: http://localhost:${config.port}`);
  console.log(`Webhook endpoint: http://localhost:${config.port}/webhook`);
  console.log(`Health check: http://localhost:${config.port}/health`);
  console.log(`CORS origin: ${config.corsOrigin}`);
  console.log(`Gemini model: ${config.geminiModel}`);
  console.log('='.repeat(50));
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);

  server.close(() => {
    console.log('Server closed successfully');
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

export default app;
