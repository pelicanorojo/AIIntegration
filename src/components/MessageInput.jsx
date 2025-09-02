import React, { useState, useEffect, useRef } from "react";

export default function MessageInput({ onSend, disabled, history }) {
  const [input, setInput] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    // Focus the input when history changes (i.e., after sending/receiving a message)
    inputRef.current?.focus();
  }, [history]);

  const handleSend = () => {
    if (input.trim()) {
      onSend(input.trim());
      setInput("");
    }
  };
  return (
    <div className="input-area">
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Type your message here..."
        disabled={disabled}
        onKeyDown={e => e.key === "Enter" && handleSend()}
      />
      <button onClick={handleSend} disabled={disabled}>Send</button>
    </div>
  );
}