/**
 * ChatHeader component - Displays chat header with title and status
 *
 * @param {object} props - Component props
 * @param {boolean} props.isTyping - Whether bot is currently typing
 * @param {string} [props.title] - Chat title
 * @param {string} [props.subtitle] - Chat subtitle/status text
 */
export function ChatHeader({ isTyping = false, title = 'Zalo OA Chatbot', subtitle = 'Simulator' }) {
  return (
    <div className="chat-header">
      {/* Avatar */}
      <div className="chat-header-avatar">
        <div className="avatar-placeholder">OA</div>
        {/* Online status indicator */}
        <div className="avatar-status online" />
      </div>

      {/* Title and status */}
      <div className="chat-header-info">
        <h1 className="chat-header-title">{title}</h1>
        <p className="chat-header-status">
          {isTyping ? (
            <>
              <span className="typing-indicator">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </span>
              {' Dang nhap tin...'}
            </>
          ) : (
            <>{subtitle}</>
          )}
        </p>
      </div>

      {/* Menu button (placeholder for future features) */}
      <button className="chat-header-menu" aria-label="Menu">
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="10" cy="10" r="1.5" fill="currentColor" />
          <circle cx="10" cy="5" r="1.5" fill="currentColor" />
          <circle cx="10" cy="15" r="1.5" fill="currentColor" />
        </svg>
      </button>
    </div>
  );
}
