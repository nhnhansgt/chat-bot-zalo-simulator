import { useEffect, useRef } from 'react';
import { useChat } from './hooks/useChat.js';
import { ChatHeader } from './components/ChatHeader.jsx';
import { ChatInput } from './components/ChatInput.jsx';
import { Message } from './components/Message.jsx';
import './index.css';

/**
 * Main App component - Zalo OA Chatbot Simulator
 *
 * Provides a chat interface that simulates Zalo Official Account
 * webhook integration with AI-powered responses.
 */
function App() {
  const { messages, isTyping, isLoading, error, sendMessage, clearError, clearMessages } =
    useChat();

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  /**
   * Auto-scroll to bottom when new messages arrive
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /**
   * Handles sending a message
   *
   * @param {string} text - Message text
   */
  const handleSendMessage = async (text) => {
    try {
      await sendMessage(text);
    } catch (err) {
      console.error('[App] Send message error:', err);
    }
  };

  /**
   * Handles clearing error state
   */
  const handleClearError = () => {
    clearError();
  };

  return (
    <div className="app">
      <div className="chat-container">
        {/* Chat Header */}
        <ChatHeader isTyping={isTyping} title="Zalo OA Chatbot" subtitle="Simulator" />

        {/* Error Banner */}
        {error && (
          <div className="error-banner">
            <span className="error-message">{error}</span>
            <button
              type="button"
              className="error-close"
              onClick={handleClearError}
              aria-label="Dong thong bao loi"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 4L4 12M4 4L12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Messages Area */}
        <div className="messages-container" ref={messagesContainerRef}>
          {messages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M32 56C45.2548 56 56 45.2548 56 32C56 18.7452 45.2548 8 32 8C18.7452 8 8 18.7452 8 32C8 45.2548 18.7452 56 32 56Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M24 32H40M32 24V40"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h3 className="empty-state-title">Xin chao!</h3>
              <p className="empty-state-text">
                Day la bo mo phong Zalo OA Chatbot. Nhap tin nhan de bat dau tro chuyen voi AI.
              </p>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <Message key={message.id} message={message} />
              ))}
              {/* Typing indicator */}
              {isTyping && (
                <div className="message message-bot">
                  <div className="message-content">
                    <div className="message-sender">Zalo OA</div>
                    <div className="typing-indicator-inline">
                      <span className="typing-dot-inline" />
                      <span className="typing-dot-inline" />
                      <span className="typing-dot-inline" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Chat Input */}
        <div className="chat-input-wrapper">
          <ChatInput onSendMessage={handleSendMessage} disabled={isLoading} />
        </div>
      </div>

      {/* Footer info */}
      <div className="app-footer">
        <p>Zalo OA Chatbot Simulator v1.0.0</p>
      </div>
    </div>
  );
}

export default App;
