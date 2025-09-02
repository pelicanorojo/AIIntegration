import React, { useState } from "react";
import MessageList from "./MessageList.jsx";
import MessageInput from "./MessageInput.jsx";

export default function Chat({
  provider,
  model,
  systemPrompt,
  history,
  setHistory,
}) {
  const [loading, setLoading] = useState(false);

  const sendMessage = async (message) => {
    setHistory([...history, { role: "user", content: message }]);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          history,
          provider,
          model,
          systemPrompt,
        }),
      });
      const data = await res.json();
      setHistory(h =>
        [...h, { role: "assistant", content: data.response || "Sorry, I couldn't process your request." }]
      );
    } catch {
      setHistory(h =>
        [...h, { role: "assistant", content: "Sorry, there was an error processing your message." }]
      );
    }
    setLoading(false);
  };

  return (
    <>
      <MessageList history={history} loading={loading} />
      <MessageInput onSend={sendMessage} disabled={loading} history={history} />
    </>
  );
}