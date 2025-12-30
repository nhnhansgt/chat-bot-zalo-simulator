import React from 'react';

// Back arrow icon
const BackIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="white" strokeWidth="2.5">
    <path d="M19 12H5M12 19L5 12L12 5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Three dots menu icon
const MoreIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="white">
    <circle cx="12" cy="5" r="2"/>
    <circle cx="12" cy="12" r="2"/>
    <circle cx="12" cy="19" r="2"/>
  </svg>
);

const ChatHeader = ({ title }) => {
  return (
    <header className="chat-header">
      <div className="header-left">
        <div className="back-button">
          <BackIcon />
        </div>
        <span className="header-title">{title}</span>
      </div>
      <div className="header-right">
        <MoreIcon />
      </div>
    </header>
  );
};

export default ChatHeader;
