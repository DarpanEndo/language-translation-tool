import React, { useState } from 'react';
import './App.css';

function App() {
  const [url, setUrl] = useState('');
  const [targetLang, setTargetLang] = useState('es');
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);

  const languages = [
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' }
  ];

  const handleTranslate = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, targetLang }),
      });
      
      const data = await response.json();
      setTranslatedText(data.translatedText);
    } catch (error) {
      console.error('Translation error:', error);
      alert('Error translating the webpage');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Website Translator</h1>
      <div className="container">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter website URL"
          className="url-input"
        />
        
        <select
          value={targetLang}
          onChange={(e) => setTargetLang(e.target.value)}
          className="language-select"
        >
          {languages.map(lang => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>

        <button 
          onClick={handleTranslate}
          disabled={loading}
          className="translate-button"
        >
          {loading ? 'Translating...' : 'Translate'}
        </button>

        {translatedText && (
          <div className="result">
            <h2>Translated Content:</h2>
            <div className="translated-text">
              {translatedText}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App; 