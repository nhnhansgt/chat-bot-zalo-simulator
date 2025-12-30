/**
 * Configuration constants for Zalo OA Chatbot Simulator
 *
 * Loads configuration from environment variables.
 * Defaults are provided for development convenience.
 */

/**
 * Webhook URL for backend API
 */
export const WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_URL || 'http://localhost:3001/webhook';

/**
 * Zalo OA Application ID
 */
export const APP_ID = import.meta.env.VITE_APP_ID || 'demo_app_id';

/**
 * Demo user ID (simulated Zalo user)
 */
export const USER_ID = import.meta.env.VITE_USER_ID || 'demo_user_123';

/**
 * Zalo OA ID (simulated Official Account)
 */
export const OA_ID = import.meta.env.VITE_OA_ID || 'demo_oa_987';

/**
 * Secret key for signature generation
 * IMPORTANT: Change this in production!
 */
export const SECRET_KEY = import.meta.env.VITE_SECRET_KEY || 'demo_secret_key_change_in_production';

/**
 * Request timeout in milliseconds
 */
export const REQUEST_TIMEOUT = 30000;

/**
 * Typing indicator delay in milliseconds (simulates processing time)
 */
export const TYPING_INDICATOR_DELAY = 500;

/**
 * Maximum message length
 */
export const MAX_MESSAGE_LENGTH = 2000;

/**
 * Chat configuration
 */
export const CHAT_CONFIG = {
  // Enable typing indicator
  showTypingIndicator: true,

  // Auto-scroll to bottom on new message
  autoScroll: true,

  // Show timestamp on messages
  showTimestamp: true,

  // Message sound (optional, not implemented in v1)
  enableSound: false,
};

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Khong the ket noi den server. Vui long kiem tra ket noi mang.',
  TIMEOUT_ERROR: 'Yeu cau qua han. Vui long thu lai.',
  SERVER_ERROR: 'Co loi xay ra tu server. Vui long thu lai sau.',
  INVALID_RESPONSE: 'Phan hoi tu server khong hop le.',
  EMPTY_MESSAGE: 'Vui long nhap tin nhan.',
};

/**
 * Message types
 */
export const MESSAGE_TYPE = {
  USER: 'user',
  BOT: 'bot',
};

/**
 * Webhook event names
 */
export const EVENT_NAME = {
  USER_SEND_TEXT: 'user_send_text',
};
