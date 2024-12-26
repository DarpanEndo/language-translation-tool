import React, { useState, useRef } from 'react';
import TranslatorWindow from './components/TranslatorWindow';
import Navbar from './components/Navbar';
import UrlInput from './components/UrlInput';

function App() {
  const [url, setUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(true);
  const [selectedText, setSelectedText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLang, setTargetLang] = useState('en');
  const [loading, setLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [history, setHistory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const iframeRef = useRef(null);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' }
  ];

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    if (url.startsWith('http')) {
      setShowUrlInput(false);
      setHistory(prev => [...prev, url]);
      setCurrentIndex(prev => prev + 1);
    } else {
      alert('Please enter a valid URL starting with http:// or https://');
    }
  };

  const handleTranslate = async () => {
    if (!selectedText.trim()) return;

    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/translate-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: selectedText,
          sourceLang,
          targetLang,
        }),
      });
      
      const data = await response.json();
      if (response.ok) {
        setTranslatedText(data.translatedText);
        return { detectedLang: data.detectedLang };
      } else {
        throw new Error(data.error || data.details || 'Translation failed');
      }
    } catch (error) {
      console.error('Translation error:', error);
      alert(`Translation failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleNewWebsite = () => {
    setUrl('');
    setShowUrlInput(true);
    setSelectedText('');
    setTranslatedText('');
    setHistory([]);
    setCurrentIndex(-1);
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setUrl(history[currentIndex - 1]);
    }
  };

  const handleForward = () => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setUrl(history[currentIndex + 1]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="relative">
        <Navbar 
          showUrlInput={showUrlInput}
          currentIndex={currentIndex}
          historyLength={history.length}
          onBack={handleBack}
          onForward={handleForward}
          onNewWebsite={handleNewWebsite}
        />

        <main className="pt-16 min-h-screen">
          {showUrlInput ? (
            <UrlInput 
              url={url}
              onUrlChange={setUrl}
              onSubmit={handleUrlSubmit}
            />
          ) : (
            <div className="h-screen relative bg-white">
              <iframe
                ref={iframeRef}
                src={url}
                className="w-full h-full border-none"
                title="Website Content"
              />
              
              <TranslatorWindow
                isMinimized={isMinimized}
                onToggleMinimize={() => setIsMinimized(!isMinimized)}
                selectedText={selectedText}
                onTextChange={setSelectedText}
                sourceLang={sourceLang}
                targetLang={targetLang}
                onSourceLangChange={setSourceLang}
                onTargetLangChange={setTargetLang}
                onTranslate={handleTranslate}
                loading={loading}
                translatedText={translatedText}
                languages={languages}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
