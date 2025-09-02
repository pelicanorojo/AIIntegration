const express = require('express');
const path = require('path');
const axios = require('axios');
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
// Serve the main page, with vite local, in production will we see...
//app.use(express.static('public'));

// Chat API endpoint
app.post('/api/chat', async (req, res) => {
  try {
    // TODO: Implement Optimistic history sync.
    let { message, history, provider, model, systemPrompt } = req.body;

    let response;
    if (provider === 'ollama') {
      response = await callOllamaAPI(message, history, model, systemPrompt);
    } else if (provider === 'huggingface') {
      response = await callHuggingFaceAPI(message, history, model, systemPrompt);
    } else {
      return res.status(400).json({ error: 'Invalid provider specified' });
    }
    
    res.json({ response });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Ollama API integration
async function callOllamaAPI(message, history, model, systemPrompt) {
  try {
    // Dynamically fetch available models from Ollama
    const tagsResponse = await axios.get('http://localhost:11434/api/tags');
    const availableModels = tagsResponse.data.models.map(m => m.name);

    // Validate model
    if (!availableModels.includes(model)) {
      model = availableModels[0]; // Default to first available model
    }

    // TODO: try history summarization if too long: when at half of max tokens, summarize first half, injecting on a new system prompt.
    // Format messages for Ollama API
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history,
      { role: 'user', content: message }
    ];
    
    const response = await axios.post('http://localhost:11434/api/chat', {
      model: model,
      messages: messages,
      stream: false
    });
    
    return response.data.message.content;
  } catch (error) {
    console.error('Error calling Ollama API:', error);
    throw new Error('Failed to get response from Ollama');
  }
}

// HuggingFace API integration
async function callHuggingFaceAPI(message, history, model, systemPrompt) {
  try {
    // Dynamically fetch available models from your own endpoint or HuggingFace API
    // Here, using the static list as in your /api/huggingface/models endpoint
    const availableModels = ["gpt2", "bert-base-uncased", "distilbert-base-uncased"];
    if (!availableModels.includes(model)) {
      model = availableModels[0]; // Default to first available model
    }

    const apiKey = process.env.HUGGINGFACE_API_KEY;
    if (!apiKey) {
      throw new Error('HuggingFace API key not found');
    }
    
    // Format the prompt with history and system prompt
    let prompt = systemPrompt + '\n\n';
    for (const msg of history) {
      prompt += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
    }
    prompt += `User: ${message}\nAssistant:`;
    
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${model}`,
      { inputs: prompt },
      {
        headers: { Authorization: `Bearer ${apiKey}` }
      }
    );
    
    // Extract the generated text from the response
    return response.data[0].generated_text;
  } catch (error) {
    console.error('Error calling HuggingFace API:', error);
    throw new Error('Failed to get response from HuggingFace');
  }
}

// List Ollama models endpoint
app.get('/api/ollama/models', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:11434/api/tags');
    // The response contains a 'models' array
    res.json({ models: response.data.models });
  } catch (error) {
    console.error('Error fetching Ollama models:', error);
    res.status(500).json({ error: 'Failed to fetch Ollama models' });
  }
});

// List HuggingFace models endpoint (example: static list, adjust as needed)
app.get('/api/huggingface/models', (req, res) => {
  // Replace with dynamic fetching if needed
  res.json({ models: ["gpt2", "bert-base-uncased", "distilbert-base-uncased"] });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
