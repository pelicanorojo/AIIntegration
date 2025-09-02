import React, { useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import Chat from "./components/Chat.jsx";

export default function App() {
  const [provider, setProvider] = useState("ollama");
  const [model, setModel] = useState("llama2");
  const [systemPrompt, setSystemPrompt] = useState(
    "You are a helpful, friendly AI assistant. Answer questions clearly and concisely."
  );
  const [history, setHistory] = useState([]);

  const resetChat = () => setHistory([]);

  return (
    <div>
      <div className="header">
        <h1>AI Integration Experiment</h1>
      </div>
      <div className="container">
        <Sidebar
          provider={provider}
          setProvider={setProvider}
          model={model}
          setModel={setModel}
          systemPrompt={systemPrompt}
          setSystemPrompt={setSystemPrompt}
          resetChat={resetChat}
        />
        <div className="main-content">
          <Chat
            provider={provider}
            model={model}
            systemPrompt={systemPrompt}
            history={history}
            setHistory={setHistory}
          />
        </div>
      </div>
    </div>
  );
}