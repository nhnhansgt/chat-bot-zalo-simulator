import React, { useRef, useEffect } from 'react';

// Sticker icon
const StickerIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#6B7280" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <circle cx="8.5" cy="9.5" r="1.5" fill="currentColor" stroke="none"/>
    <circle cx="15.5" cy="9.5" r="1.5" fill="currentColor" stroke="none"/>
    <path d="M8 14s1.5 2 4 2 4-2 4-2" strokeLinecap="round"/>
  </svg>
);

// Image icon
const ImageIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#6B7280" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" stroke="none"/>
    <path d="M21 15l-5-5L5 21" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Attachment icon
const AttachmentIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#6B7280" strokeWidth="2">
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
  </svg>
);

// Send icon
const SendIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
  </svg>
);

const ChatInput = ({ onSend, disabled }) => {
  const textareaRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const text = textareaRef.current.value.trim();
      if (text && !disabled) {
        onSend(text);
        textareaRef.current.value = '';
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleInputChange = () => {
    const textarea = textareaRef.current;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 100) + 'px';
  };

  const handleSendClick = () => {
    const text = textareaRef.current.value.trim();
    if (text && !disabled) {
      onSend(text);
      textareaRef.current.value = '';
      textareaRef.current.style.height = 'auto';
    }
  };

  return (
    <footer className="chat-footer">
      <div className="action-buttons">
        <button className="action-btn" title="Gửi Sticker">
          <StickerIcon />
        </button>
        <button className="action-btn" title="Gửi ảnh">
          <ImageIcon />
        </button>
        <button className="action-btn" title="Đính kèm file">
          <AttachmentIcon />
        </button>
      </div>
      <div className="input-container">
        <textarea
          ref={textareaRef}
          className="message-input"
          placeholder="Nhập tin nhắn..."
          rows="1"
          onKeyDown={handleKeyDown}
          onChange={handleInputChange}
          disabled={disabled}
        />
      </div>
      <button
        className="send-button"
        onClick={handleSendClick}
        disabled={disabled}
        title="Gửi tin nhắn"
      >
        <SendIcon />
      </button>
    </footer>
  );
};

export default ChatInput;
