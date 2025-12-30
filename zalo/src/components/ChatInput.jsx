import { useState, useRef, useEffect } from 'react';
import { MAX_MESSAGE_LENGTH } from '../config/constants.js';

/**
 * ChatInput component - Message input field with send button
 *
 * @param {object} props - Component props
 * @param {Function} props.onSendMessage - Callback when message is sent
 * @param {boolean} props.disabled - Whether input is disabled
 * @param {string} [props.placeholder] - Input placeholder text
 */
export function ChatInput({ onSendMessage, disabled = false, placeholder = 'Nhap tin nhan...' }) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);

  /**
   * Handles form submission
   *
   * @param {React.FormEvent} e - Form event
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedValue = inputValue.trim();

    // Check if input is empty
    if (!trimmedValue) {
      return;
    }

    // Check length limit
    if (trimmedValue.length > MAX_MESSAGE_LENGTH) {
      alert(`Tin nhan qua dai (toi da ${MAX_MESSAGE_LENGTH} ky tu).`);
      return;
    }

    // Send message
    onSendMessage(trimmedValue);

    // Clear input
    setInputValue('');
  };

  /**
   * Handles keyboard shortcuts
   *
   * @param {React.KeyboardEvent} e - Keyboard event
   */
  const handleKeyDown = (e) => {
    // Send message on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="chat-input-container">
      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={MAX_MESSAGE_LENGTH}
          className="chat-input-field"
          autoComplete="off"
        />

        <button
          type="submit"
          disabled={disabled || !inputValue.trim()}
          className="chat-send-button"
          aria-label="Gui tin nhan"
        >
          {disabled ? (
            <span className="sending-indicator">...</span>
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.5 2.5L9.5 17.5M18.5 2.5L12.5 17.5M18.5 2.5L2.5 9.5L9.5 11.5L12.5 17.5L18.5 2.5Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      </form>

      {/* Character counter */}
      <div className="chat-input-counter">
        {inputValue.length} / {MAX_MESSAGE_LENGTH}
      </div>
    </div>
  );
}
