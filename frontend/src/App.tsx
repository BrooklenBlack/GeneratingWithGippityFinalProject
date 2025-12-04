import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:8000';

function App() {
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('# Your generated code will appear here\n# Type a prompt above and click "Generate Code"');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateCode = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt!');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`${API_URL}/api/generate`, {
        prompt: prompt,
        language: language
      });
      
      setCode(response.data.code);
      setError('');
    } catch (err: any) {
      console.error('Error:', err);
      setError('Failed to generate code. Make sure backend is running on port 8000.');
      setCode('// Error generating code. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      generateCode();
    }
  };

  return (
    <div className="App">
      <div style={{ 
        backgroundColor: '#1e1e1e', 
        minHeight: '100vh', 
        padding: '20px',
        color: 'white'
      }}>
        <header style={{ marginBottom: '30px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '36px', marginBottom: '10px' }}>
            AI Code Assistant
          </h1>
          <p style={{ color: '#888', fontSize: '14px' }}>
            Powered by Hugging Face CodeGen | Built with React + FastAPI
          </p>
        </header>

        {/* Input Section */}
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto',
          backgroundColor: '#252526',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
              Input a prompt:
            </label>
            <input
              type="text"
              placeholder="e.g., Create a function to reverse a string"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={handleKeyPress}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                border: '1px solid #444',
                borderRadius: '4px',
                backgroundColor: '#1e1e1e',
                color: 'white',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ 
            display: 'flex', 
            gap: '10px', 
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <div>
              <label style={{ marginRight: '8px' }}>Language:</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                style={{
                  padding: '10px 15px',
                  fontSize: '14px',
                  border: '1px solid #444',
                  borderRadius: '4px',
                  backgroundColor: '#1e1e1e',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
                <option value="csharp">C#</option>
              </select>
            </div>

            <button
              onClick={generateCode}
              disabled={loading}
              style={{
                padding: '10px 30px',
                fontSize: '16px',
                fontWeight: 'bold',
                border: 'none',
                borderRadius: '4px',
                backgroundColor: loading ? '#555' : '#007acc',
                color: 'white',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              {loading ? 'Generating...' : 'Generate Code'}
            </button>
          </div>

          {error && (
            <div style={{
              marginTop: '15px',
              padding: '10px',
              backgroundColor: '#d32f2f',
              color: 'white',
              borderRadius: '4px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}
        </div>

        {/* Code Editor */}
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto',
          border: '1px solid #444',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <div style={{
            backgroundColor: '#2d2d30',
            padding: '10px 15px',
            borderBottom: '1px solid #444',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontWeight: 'bold' }}>💻 Generated Code</span>
            <span style={{ fontSize: '12px', color: '#888' }}>
              {language.toUpperCase()}
            </span>
          </div>
          
          <Editor
            height="500px"
            language={language}
            value={code}
            onChange={(value) => setCode(value || '')}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              roundedSelection: false,
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </div>

        {/* Footer */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '30px',
          color: '#888',
          fontSize: '12px'
        }}>
          <p>Team: Generating with Gippity | Northwest Missouri State University</p>
        </div>
      </div>
    </div>
  );
}

export default App;