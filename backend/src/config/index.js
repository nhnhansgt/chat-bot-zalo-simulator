import dotenv from 'dotenv';
import { ValidationError } from '../middlewares/errorHandler.js';

// Load environment variables
dotenv.config();

/**
 * Validates and loads configuration from environment variables
 */
export function validateConfig() {
  const required = [
    'PORT',
    'OA_APP_ID',
    'OA_SECRET_KEY',
    'GEMINI_API_KEY',
    'GEMINI_MODEL',
    'CORS_ORIGIN',
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new ValidationError(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }

  return true;
}

/**
 * Application configuration
 */
export const config = {
  // Server configuration
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  // Zalo OA configuration
  oaAppId: process.env.OA_APP_ID,
  oaSecretKey: process.env.OA_SECRET_KEY,

  // Gemini AI configuration
  geminiApiKey: process.env.GEMINI_API_KEY,
  geminiModel: process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp',

  // CORS configuration
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',

  // Feature flags
  isDevelopment: process.env.NODE_ENV !== 'production',
};

export default config;
