import express from 'express';
import { verifySignatureMiddleware } from '../middlewares/verifySignature.js';
import { asyncHandler, ValidationError } from '../middlewares/errorHandler.js';
import { geminiService } from '../services/gemini.js';

const router = express.Router();

/**
 * POST /webhook
 *
 * Receives Zalo OA format webhook and returns AI-generated response.
 *
 * Request body format:
 * {
 *   "app_id": "string",
 *   "sender": { "id": "string" },
 *   "recipient": { "id": "string" },
 *   "event_name": "user_send_text",
 *   "message": { "text": "string", "msg_id": "string" },
 *   "timestamp": "string"
 * }
 *
 * Response format:
 * {
 *   "success": true,
 *   "data": {
 *     "msg_id": "string",
 *     "recipient_id": "string",
 *     "message": { "text": "string" }
 *   }
 * }
 */
router.post(
  '/',
  verifySignatureMiddleware,
  asyncHandler(async (req, res) => {
    // Validate required fields
    const { app_id, sender, recipient, event_name, message, timestamp } = req.body;

    const validationErrors = {};

    // Validate app_id
    if (!app_id || typeof app_id !== 'string') {
      validationErrors.app_id = 'Field is required and must be a string';
    }

    // Validate sender
    if (!sender || typeof sender !== 'object') {
      validationErrors.sender = 'Field is required and must be an object';
    } else if (!sender.id || typeof sender.id !== 'string') {
      validationErrors['sender.id'] = 'Field is required and must be a string';
    }

    // Validate recipient
    if (!recipient || typeof recipient !== 'object') {
      validationErrors.recipient = 'Field is required and must be an object';
    } else if (!recipient.id || typeof recipient.id !== 'string') {
      validationErrors['recipient.id'] = 'Field is required and must be a string';
    }

    // Validate event_name
    if (!event_name || typeof event_name !== 'string') {
      validationErrors.event_name = 'Field is required and must be a string';
    } else if (event_name !== 'user_send_text') {
      validationErrors.event_name = `Must be "user_send_text", got "${event_name}"`;
    }

    // Validate message
    if (!message || typeof message !== 'object') {
      validationErrors.message = 'Field is required and must be an object';
    } else {
      if (!message.text || typeof message.text !== 'string') {
        validationErrors['message.text'] = 'Field is required and must be a string';
      }
      if (!message.msg_id || typeof message.msg_id !== 'string') {
        validationErrors['message.msg_id'] = 'Field is required and must be a string';
      }
    }

    // Validate timestamp
    if (!timestamp || typeof timestamp !== 'string') {
      validationErrors.timestamp = 'Field is required and must be a string';
    }

    // Return validation errors if any
    if (Object.keys(validationErrors).length > 0) {
      throw new ValidationError('Invalid webhook payload', validationErrors);
    }

    // Extract message text
    const userMessage = message.text.trim();

    if (userMessage.length === 0) {
      throw new ValidationError('Message text cannot be empty');
    }

    // Generate AI response
    let botResponse;
    try {
      botResponse = await geminiService.generateResponse(userMessage);
    } catch (error) {
      console.error('[webhook] AI generation failed:', error.message);
      throw new Error(`Failed to generate response: ${error.message}`);
    }

    // Generate bot message ID
    const botMsgId = `bot_msg_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;

    // Return success response
    res.status(200).json({
      success: true,
      data: {
        msg_id: botMsgId,
        recipient_id: sender.id,
        message: {
          text: botResponse,
        },
      },
    });
  })
);

/**
 * GET /webhook/health
 *
 * Health check endpoint for webhook service
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    service: 'zalo-webhook',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

export default router;
