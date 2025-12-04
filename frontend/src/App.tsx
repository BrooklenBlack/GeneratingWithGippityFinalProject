import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const language = 'python';

  const generate = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/api/generate', {
        prompt,
        language
      });
      setResponse(res.data.code);
    } catch (error) {
      setResponse('Error generating code');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial' }}>
      <h1>Code Assistant</h1>
      
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="What code do you want?"
        style={{ width: '500px', padding: '10px', marginRight: '10px' }}
      />
      
      <button onClick={generate} disabled={loading} style={{ padding: '10px 20px', marginLeft: '10px' }}>
        {loading ? 'Generating...' : 'Generate'}
      </button>
      
      <pre style={{ marginTop: '20px', padding: '20px', background: '#f4f4f4', whiteSpace: 'pre-wrap' }}>
        {response || 'Your code will appear here...'}
      </pre>
    </div>
  );
}

export default App;