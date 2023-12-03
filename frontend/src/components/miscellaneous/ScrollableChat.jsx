import React from 'react';

const ScrollableChat = ({ messages }) => {
  return (
    <div className="overflow-y-auto max-h-60">
      {messages.map((message, index) => (
        <div key={index} className="mb-2">
          {/* Render your individual chat message here */}
          {message.text}
        </div>
      ))}
    </div>
  );
};

export default ScrollableChat;
