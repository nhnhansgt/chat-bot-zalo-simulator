import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../config/index.js';

/**
 * Service for integrating with Google Gemini AI API
 *
 * Handles AI response generation for chatbot messages.
 * Implements proper error handling and timeout management.
 */
export class GeminiService {
  /**
   * Creates a new GeminiService instance
   *
   * @throws {Error} If GEMINI_API_KEY is not configured
   */
  constructor() {
    if (!config.geminiApiKey || config.geminiApiKey === 'your_gemini_api_key_here') {
      throw new Error('GEMINI_API_KEY is not configured. Please set a valid API key in .env file.');
    }

    // Initialize Gemini AI client
    this.genAI = new GoogleGenerativeAI(config.geminiApiKey);
    this.modelName = config.geminiModel;

    // Get the model
    this.model = this.genAI.getGenerativeModel({ model: this.modelName });

    // Set timeout for API calls (30 seconds)
    this.timeout = 30000;

    // System prompt for the chatbot
    this.systemPrompt = `You are a helpful and friendly AI assistant for a Zalo Official Account chatbot simulator.
Keep your responses concise, helpful, and conversational.
Respond in Vietnamese by default unless the user writes in another language.
If you don't understand something, ask for clarification politely.`;
  }

  /**
   * Generates an AI response for the given user message
   *
   * @param {string} userMessage - The user's message text
   * @returns {Promise<string>} The AI-generated response
   * @throws {Error} When API call fails or times out
   */
  async generateResponse(userMessage) {
    // Validate input
    if (!userMessage || typeof userMessage !== 'string' || userMessage.trim().length === 0) {
      throw new Error('User message must be a non-empty string');
    }

    try {
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Gemini API request timeout'));
        }, this.timeout);
      });

      // Create the API call promise
      const apiPromise = this._callGeminiAPI(userMessage);

      // Race between API call and timeout
      const result = await Promise.race([apiPromise, timeoutPromise]);

      return result;
    } catch (error) {
      console.error('[GeminiService] Failed to generate response:', {
        error: error.message,
        userMessage: userMessage.substring(0, 50),
      });

      // Re-throw with context
      throw new Error(`AI service error: ${error.message}`);
    }
  }

  /**
   * Internal method to call Gemini API
   *
   * @private
   * @param {string} userMessage - The user's message text
   * @returns {Promise<string>} The AI-generated response
   */
  async _callGeminiAPI(userMessage) {
    try {
      // Combine system prompt with user message
      const prompt = `${this.systemPrompt}\n\nUser: ${userMessage}\n\nAssistant:`;

      // Generate content
      const result = await this.model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      // Validate response
      if (!text || text.trim().length === 0) {
        throw new Error('Empty response from Gemini API');
      }

      return text.trim();
    } catch (error) {
      // Handle specific API errors
      if (error.status === 401) {
        throw new Error('Invalid Gemini API key');
      }
      if (error.status === 429) {
        throw new Error('Gemini API rate limit exceeded');
      }
      if (error.status === 500) {
        throw new Error('Gemini API service error');
      }

      // Re-throw other errors
      throw error;
    }
  }

  /**
   * Generates a response with conversation context
   *
   * @param {Array<{role: string, content: string}>} history - Conversation history
   * @param {string} userMessage - The current user message
   * @returns {Promise<string>} The AI-generated response
   */
  async generateResponseWithContext(history, userMessage) {
    // Build conversation context
    const conversationHistory = history
      .map((msg) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n');

    const fullPrompt = `${this.systemPrompt}\n\n${conversationHistory}\nUser: ${userMessage}\n\nAssistant:`;

    try {
      const result = await this.model.generateContent(fullPrompt);
      const response = result.response;
      return response.text().trim();
    } catch (error) {
      console.error('[GeminiService] Context generation failed:', error.message);
      // Fallback to simple response
      return this.generateResponse(userMessage);
    }
  }
}

// Export singleton instance
export const geminiService = new GeminiService();
