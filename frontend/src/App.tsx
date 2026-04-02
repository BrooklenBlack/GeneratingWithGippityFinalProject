import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [prompt, setPrompt] = useState('');
  const [code, setCode] = useState('');
  const [explanation, setExplanation] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('');

  const normalizeText = (text: string) => {
    if (!text) return '';
    // Convert escaped newlines/tabs to actual characters so code appears vertically.
    const decoded = text.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
    return decoded;
  };

  const generate = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/api/generate', {
        prompt,
        language
      });
      setCode(normalizeText(res.data.code));
      setExplanation(normalizeText(res.data.explanation));
      setOutput(normalizeText(res.data.output));
    } catch (error) {
      setCode('Error generating code. Please try again.');
      setOutput('Error generating output. Please try again.');
      setExplanation('Error generating explaination. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);

    e.target.style.height = 'auto'; 
    e.target.style.height = `${e.target.scrollHeight}px`;
  };  


  return (
    <div className="app-container">
      <h1>Code Assistant</h1>
      
      <textarea
        className="prompt-input"
        value={prompt}
        onChange={handlePromptChange}
        placeholder="Please type your request here..."
        rows={1}
      />
      
      <div className="controls">
        <button 
          className="generate-btn"
          onClick={generate} 
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate'}
        </button>

        <select 
          className="language-select"
          value={language} 
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="" disabled>Select language...</option>
          <optgroup label="Backend">
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="C++">C++</option>
            <option value="C#">C#</option>
            <option value="javascript">JavaScript</option>
          </optgroup>
          <optgroup label="Frontend">
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="typescript">TypeScript</option>
            <option value="javascript">JavaScript</option>
          </optgroup>
        </select>
      </div>

      <pre className="output-box">
        {code || 'Your code will appear here...'}
      </pre>

      <pre className="output-box">
        {output || 'Your output will appear here...'}
      </pre>

      <pre className="output-box">
        {explanation || 'Your explanation will appear here...'}
      </pre>

    </div>
  );
}

export default App;