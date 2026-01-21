import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [prompt, setPrompt] = useState('');
  const [code, setCode] = useState('');
  const [explanation, setExplanation] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('');

  const generate = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/api/generate', {
        prompt,
        language
      });
      setCode(res.data.code);
      setExplanation(res.data.explanation);
      setOutput(res.data.output);
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
    <div style={{ padding: '40px', fontFamily: 'Arial' }}>
      <h1>Code Assistant</h1>
      
      <textarea
        value={prompt}
        onChange={handlePromptChange}
        placeholder="Please type your request here..."
        rows={1}
        style={{ width: '500px', padding: '10px', marginRight: '10px', resize: 'none', overflow: 'hidden'}}
      />
      
      <div>
        <button onClick={generate} disabled={loading} style={{ padding: '10px 20px', marginTop: '10px' }}>
        {loading ? 'Generating...' : 'Generate'}
        </button>

        <select value={language} onChange={(e) => setLanguage(e.target.value)}style={{ marginLeft: '20px', padding: '10px' }}>
          <option value=""disabled>Backend</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="C++">C++</option>
          <option value="javascript">JavaScript</option>
        </select>

        { <select value={language} onChange={(e) => setLanguage(e.target.value)}style={{ marginLeft: '20px', padding: '10px' }}>
          <option value=""disabled>Frontend</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
          <option value="typescript">TypeScript</option>
          <option value="javscript">JavaScript</option>
        </select> }
      </div>

      
      <pre style={{ marginTop: '20px', padding: '20px', background: '#f4f4f4', whiteSpace: 'pre-wrap' }}>
        {code || 'Your code will appear here...'}
      </pre>

      <pre style={{ marginTop: '20px', padding: '20px', background: '#f4f4f4', whiteSpace: 'pre-wrap' }}>
        {output || 'Your output will appear here...'}
      </pre>

      <pre style={{ marginTop: '20px', padding: '20px', background: '#f4f4f4', whiteSpace: 'pre-wrap' }}>
        {explanation || 'Your explanation will appear here...'}
      </pre>

    </div>
  );
}

export default App;