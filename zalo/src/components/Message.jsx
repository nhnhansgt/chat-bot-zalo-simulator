import { MESSAGE_TYPE } from '../config/constants.js';

/**
 * Message component - Displays a single chat message bubble
 *
 * @param {object} props - Component props
 * @param {object} props.message - Message object
 * @param {string} props.message.id - Unique message ID
 * @param {string} props.message.text - Message text content
 * @param {'user'|'bot'|'system'} props.message.sender - Message sender type
 * @param {number} props.message.timestamp - Unix timestamp
 * @param {boolean} [props.message.isError] - Whether this is an error message
 */
export function Message({ message }) {
  const { text, sender, timestamp, isError } = message;

  // Format timestamp
  const formatTime = (ts) => {
    const date = new Date(ts);
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Determine message style based on sender
  const getMessageClass = () => {
    if (isError) {
      return 'message-error';
    }
    if (sender === MESSAGE_TYPE.USER) {
      return 'message-user';
    }
    if (sender === MESSAGE_TYPE.BOT) {
      return 'message-bot';
    }
    return 'message-system';
  };

  return (
    <div className={`message ${getMessageClass()}`}>
      <div className="message-content">
        {/* Sender indicator for bot messages */}
        {sender === MESSAGE_TYPE.BOT && !isError && (
          <div className="message-sender">Zalo OA</div>
        )}

        {/* Message text */}
        <div className="message-text">{text}</div>

        {/* Timestamp */}
        <div className="message-time">{formatTime(timestamp)}</div>
      </div>
    </div>
  );
}
