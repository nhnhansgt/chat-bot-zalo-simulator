import { useState, useCallback, useRef } from 'react';
import { webhookService } from '../services/webhookService.js';
import { CHAT_CONFIG, MESSAGE_TYPE, ERROR_MESSAGES } from '../config/constants.js';

/**
 * Custom hook for chat state management
 *
 * Encapsulates chat logic including message management,
 * API communication, loading states, and error handling.
 *
 * @returns {object} Chat state and operations
 */
export function useChat() {
  // State
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Ref to track if component is mounted
  const isMountedRef = useRef(true);

  /**
   * Generates a unique message ID
   *
   * @returns {string} Unique message ID
   */
  const generateMessageId = () => {
    return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  };

  /**
   * Adds a user message to the chat
   *
   * @param {string} text - Message text
   * @returns {object} The created message object
   */
  const addUserMessage = useCallback((text) => {
    const message = {
      id: generateMessageId(),
      text,
      sender: MESSAGE_TYPE.USER,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, message]);

    return message;
  }, []);

  /**
   * Adds a bot message to the chat
   *
   * @param {string} text - Message text
   * @param {string} msgId - Zalo message ID from response
   * @returns {object} The created message object
   */
  const addBotMessage = useCallback((text, msgId) => {
    const message = {
      id: generateMessageId(),
      text,
      sender: MESSAGE_TYPE.BOT,
      timestamp: Date.now(),
      msgId,
    };

    setMessages((prev) => [...prev, message]);

    return message;
  }, []);

  /**
   * Clears the current error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Clears all messages from the chat
   */
  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  /**
   * Sends a message and handles the response
   *
   * @param {string} text - The message text to send
   * @returns {Promise<void>}
   */
  const sendMessage = useCallback(
    async (text) => {
      // Clear any previous errors
      clearError();

      // Validate input
      if (!text || typeof text !== 'string' || text.trim().length === 0) {
        setError(ERROR_MESSAGES.EMPTY_MESSAGE);
        return;
      }

      const trimmedText = text.trim();

      // Check if already processing a message
      if (isLoading) {
        return;
      }

      // Add user message immediately
      addUserMessage(trimmedText);

      // Set loading states
      setIsLoading(true);
      setIsTyping(true);

      try {
        // Send message to webhook service
        const response = await webhookService.sendMessage(trimmedText);

        // Check if component is still mounted
        if (!isMountedRef.current) {
          return;
        }

        // Extract bot message from response
        const botMessageText = response.data.message.text;
        const botMsgId = response.data.msg_id;

        // Add bot message to chat
        addBotMessage(botMessageText, botMsgId);

        // Clear typing indicator
        setIsTyping(false);
      } catch (error) {
        // Check if component is still mounted
        if (!isMountedRef.current) {
          return;
        }

        console.error('[useChat] Send message failed:', error);

        // Set error state
        setError(error.message || ERROR_MESSAGES.SERVER_ERROR);

        // Add system error message to chat
        const errorMessage = {
          id: generateMessageId(),
          text: `Loi: ${error.message || 'Khong the gui tin nhan.'}`,
          sender: 'system',
          timestamp: Date.now(),
          isError: true,
        };

        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        // Clear loading state
        setIsLoading(false);
        setIsTyping(false);
      }
    },
    [addUserMessage, addBotMessage, clearError, isLoading]
  );

  /**
   * Retries sending the last message
   *
   * Useful when a message fails to send due to network issues
   */
  const retryLastMessage = useCallback(() => {
    // Find the last user message
    const userMessages = messages.filter((msg) => msg.sender === MESSAGE_TYPE.USER);

    if (userMessages.length > 0) {
      const lastUserMessage = userMessages[userMessages.length - 1];

      // Remove the error message if exists
      setMessages((prev) => prev.filter((msg) => !msg.isError));

      // Resend the message
      sendMessage(lastUserMessage.text);
    }
  }, [messages, sendMessage]);

  /**
   * Deletes a message by ID
   *
   * @param {string} messageId - ID of the message to delete
   */
  const deleteMessage = useCallback((messageId) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
  }, []);

  // Cleanup on unmount
  useState(() => {
    return () => {
      isMountedRef.current = false;
    };
  });

  return {
    // State
    messages,
    isTyping,
    isLoading,
    error,

    // Operations
    sendMessage,
    clearError,
    clearMessages,
    retryLastMessage,
    deleteMessage,

    // Computed
    hasMessages: messages.length > 0,
    messageCount: messages.length,
  };
}
