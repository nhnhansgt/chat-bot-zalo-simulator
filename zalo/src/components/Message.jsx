import React from 'react';

// Zalo logo icon component
const ZaloIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="white">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>
);

// Message bubble component
const MessageBubble = ({ type, textLines, timestamp, userInitial = 'B' }) => {
  const isBot = type === 'bot';

  return (
    <div className={`message ${type}`}>
      <div className={`avatar ${isBot ? 'zalo' : 'user'}`}>
        {isBot ? <ZaloIcon /> : <span>{userInitial}</span>}
      </div>
      <div className="bubble">
        <div className="bubble-text">
          {textLines.map((line, index) => (
            <div key={index} className="bubble-text-line">
              {line}
            </div>
          ))}
        </div>
        <span className="timestamp">{timestamp}</span>
      </div>
    </div>
  );
};

// Typing indicator component
export const TypingIndicator = () => (
  <div className="message bot">
    <div className="avatar zalo">
      <ZaloIcon />
    </div>
    <div className="bubble">
      <div className="typing-indicator">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  </div>
);

export default MessageBubble;
