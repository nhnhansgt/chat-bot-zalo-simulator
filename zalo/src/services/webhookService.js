import {
  WEBHOOK_URL,
  APP_ID,
  USER_ID,
  OA_ID,
  SECRET_KEY,
  REQUEST_TIMEOUT,
  ERROR_MESSAGES,
  EVENT_NAME,
  MAX_MESSAGE_LENGTH,
} from '../config/constants.js';
import { generateSignature } from '../utils/signature.js';

/**
 * Service for communicating with the Zalo OA webhook backend
 *
 * Handles building webhook payloads, generating signatures,
 * and sending requests to the backend API.
 */
export class WebhookService {
  /**
   * Creates a new WebhookService instance
   */
  constructor() {
    this.webhookUrl = WEBHOOK_URL;
    this.appId = APP_ID;
    this.userId = USER_ID;
    this.oaId = OA_ID;
    this.secretKey = SECRET_KEY;
    this.requestTimeout = REQUEST_TIMEOUT;
  }

  /**
   * Generates a unique message ID
   *
   * @returns {string} Unique message ID
   * @private
   */
  _generateMessageId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 11);
    return `msg_${timestamp}_${random}`;
  }

  /**
   * Builds a Zalo OA format webhook payload
   *
   * @param {string} messageText - The user's message text
   * @returns {object} The formatted webhook payload
   * @private
   */
  _buildPayload(messageText) {
    const timestamp = Date.now().toString();
    const msgId = this._generateMessageId();

    return {
      app_id: this.appId,
      sender: {
        id: this.userId,
      },
      recipient: {
        id: this.oaId,
      },
      event_name: EVENT_NAME.USER_SEND_TEXT,
      message: {
        text: messageText,
        msg_id: msgId,
      },
      timestamp,
    };
  }

  /**
   * Generates the X-ZEvent-Signature header value
   *
   * @param {object} payload - The webhook payload
   * @returns {Promise<string>} The signature header value
   * @private
   */
  async _generateSignature(payload) {
    const data = JSON.stringify(payload);
    return await generateSignature(
      payload.app_id,
      data,
      payload.timestamp,
      this.secretKey
    );
  }

  /**
   * Sends a user message to the webhook endpoint
   *
   * @param {string} messageText - The user's message text
   * @returns {Promise<object>} The bot's response
   * @throws {Error} When request fails or times out
   */
  async sendMessage(messageText) {
    // Validate input
    if (!messageText || typeof messageText !== 'string') {
      throw new Error(ERROR_MESSAGES.EMPTY_MESSAGE);
    }

    const trimmedMessage = messageText.trim();

    if (trimmedMessage.length === 0) {
      throw new Error(ERROR_MESSAGES.EMPTY_MESSAGE);
    }

    if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
      throw new Error(`Tin nhan qua dai (toi da ${MAX_MESSAGE_LENGTH} ky tu).`);
    }

    // Build webhook payload
    const payload = this._buildPayload(trimmedMessage);

    // Generate signature
    let signature;
    try {
      signature = await this._generateSignature(payload);
    } catch (error) {
      console.error('[WebhookService] Signature generation failed:', error);
      throw new Error('Loi khi tao chu ky xac thuc.');
    }

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.requestTimeout);

    try {
      // Send request to backend
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-ZEvent-Signature': signature,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Check for network errors
      if (!response.ok) {
        // Try to parse error response
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          // If not JSON, use status text
          throw new Error(`${ERROR_MESSAGES.SERVER_ERROR} (HTTP ${response.status})`);
        }

        // Handle specific error codes
        switch (response.status) {
          case 400:
            throw new Error(errorData.message || ERROR_MESSAGES.INVALID_RESPONSE);
          case 401:
            throw new Error('Thieu chu ky xac thuc.');
          case 403:
            throw new Error('Chu ky xac thuc khong hop le.');
          case 500:
            throw new Error(ERROR_MESSAGES.SERVER_ERROR);
          default:
            throw new Error(errorData.message || ERROR_MESSAGES.SERVER_ERROR);
        }
      }

      // Parse successful response
      const data = await response.json();

      // Validate response structure
      if (!data.success) {
        throw new Error(data.message || ERROR_MESSAGES.INVALID_RESPONSE);
      }

      if (!data.data || !data.data.message || !data.data.message.text) {
        console.error('[WebhookService] Invalid response structure:', data);
        throw new Error(ERROR_MESSAGES.INVALID_RESPONSE);
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      // Handle timeout
      if (error.name === 'AbortError') {
        throw new Error(ERROR_MESSAGES.TIMEOUT_ERROR);
      }

      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
      }

      // Re-throw other errors
      throw error;
    }
  }

  /**
   * Tests the webhook connection
   *
   * @returns {Promise<boolean>} True if connection is successful
   */
  async testConnection() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      // Use health check endpoint if available, otherwise send test message
      const healthUrl = this.webhookUrl.replace('/webhook', '/health');
      const response = await fetch(healthUrl, {
        method: 'GET',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      return response.ok;
    } catch (error) {
      console.warn('[WebhookService] Health check failed:', error.message);
      return false;
    }
  }
}

// Export singleton instance
export const webhookService = new WebhookService();
