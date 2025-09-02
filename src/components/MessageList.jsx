import React, { useEffect, useRef } from "react";

export default function MessageList({ history, loading }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, loading]);

  return (
    <div className="chat-messages" id="chat-messages">
      <div className="message ai-message">
        Hello! I'm your AI assistant. How can I help you today?
      </div>
      {history.map((msg, i) =>
        msg.role === "assistant" ? (
          <pre key={i} className="message ai-message">
            {msg.content}
          </pre>
        ) : (
          <div key={i} className="message user-message">
            {msg.content}
          </div>
        )
      )}
      {loading && (
        <pre className="message ai-message thinking-placeholder">
          thinking...
        </pre>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}