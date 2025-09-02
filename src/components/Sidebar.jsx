import React, { useEffect, useState } from "react";

export default function Sidebar({
  provider,
  setProvider,
  model,
  setModel,
  systemPrompt,
  setSystemPrompt,
  resetChat,
}) {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchModels() {
      setLoading(true);
      try {
        let url = "";
        if (provider === "ollama") {
          url = "/api/ollama/models";
        } else if (provider === "huggingface") {
          url = "/api/huggingface/models";
        }
        if (url) {
          const res = await fetch(url);
          const data = await res.json();
          // For Ollama, data.models is an array of objects with a 'name' property
          // For HuggingFace, you may need to adjust based on your backend response
          setModels(
            provider === "ollama"
              ? data.models.map(m => m.name)
              : data.models
          );
        }
      } catch {
        setModels([]);
      }
      setLoading(false);
    }
    fetchModels();
  }, [provider]);

  return (
    <div className="sidebar">
      <div className="config-section">
        <h3>LLM Provider</h3>
        <select value={provider} onChange={e => setProvider(e.target.value)}>
          <option value="ollama">Ollama - Local</option>
          <option value="huggingface">WIP Open Router - Remote</option>
        </select>
      </div>
      <div className="config-section">
        <h3>Model Selection</h3>
        {loading ? (
          <div>Loading models...</div>
        ) : (
          <select value={model} onChange={e => setModel(e.target.value)}>
            {models.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        )}
      </div>
      <div className="config-section">
        <h3>System Prompt</h3>
        <textarea
          rows={6}
          value={systemPrompt}
          onChange={e => setSystemPrompt(e.target.value)}
        />
      </div>
      <button onClick={resetChat}>Reset Chat</button>
    </div>
  );
}