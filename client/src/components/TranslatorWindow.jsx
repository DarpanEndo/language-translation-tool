import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaLanguage, 
  FaArrowRight, 
  FaChevronDown, 
  FaChevronUp,
  FaExchangeAlt,
  FaRegCopy
} from 'react-icons/fa';

function TranslatorWindow({
  isMinimized,
  onToggleMinimize,
  selectedText,
  onTextChange,
  sourceLang,
  targetLang,
  onSourceLangChange,
  onTargetLangChange,
  onTranslate,
  loading,
  translatedText,
  languages
}) {
  const [detectedLang, setDetectedLang] = useState(null);

  const sourceLanguages = [
    { code: 'auto', name: 'Detect Language' },
    ...languages
  ];

  const handleTranslate = async () => {
    const result = await onTranslate();
    if (result?.detectedLang) {
      setDetectedLang(result.detectedLang);
    }
  };

  const handleCopyText = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="fixed bottom-4 right-4">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`backdrop-blur-lg bg-gradient-to-br from-gray-900/70 to-purple-900/50 border border-purple-500/20 rounded-lg shadow-xl overflow-hidden ${
          isMinimized ? 'h-12 w-48' : 'w-96'
        }`}
      >
        <div 
          className="bg-gradient-to-r from-purple-800/50 to-gray-800/50 backdrop-blur-sm text-white p-3 flex justify-between items-center cursor-pointer border-b border-purple-500/20"
          onClick={onToggleMinimize}
        >
          <div className="flex items-center space-x-2">
            <FaLanguage className="text-xl text-purple-300" />
            <h3 className="font-semibold">Translator</h3>
          </div>
          <button className="hover:bg-purple-500/30 p-1 rounded transition-colors">
            {isMinimized ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>
        
        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="p-4 space-y-4 bg-gradient-to-br from-gray-900/50 to-purple-900/30"
            >
              <div className="grid grid-cols-2 gap-2 relative">
                <div>
                  <label className="block text-sm font-medium text-purple-100 mb-1">From</label>
                  <select
                    value={sourceLang}
                    onChange={(e) => {
                      onSourceLangChange(e.target.value);
                      setDetectedLang(null);
                    }}
                    className="w-full px-2 py-1.5 border border-purple-500/30 rounded-md bg-gray-800/50 text-purple-100 shadow-sm 
                               focus:ring-purple-500 focus:border-purple-500 backdrop-blur-sm appearance-none
                               [&>option]:bg-gray-800 [&>option]:text-white"
                    style={{ colorScheme: 'dark' }}
                  >
                    {sourceLanguages.map(lang => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                  {sourceLang === 'auto' && detectedLang && (
                    <p className="text-xs text-purple-200/70 mt-1 flex items-center">
                      <FaLanguage className="mr-1" />
                      Detected: {languages.find(l => l.code === detectedLang)?.name || detectedLang}
                    </p>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-purple-100 mb-1">To</label>
                  <select
                    value={targetLang}
                    onChange={(e) => onTargetLangChange(e.target.value)}
                    className="w-full px-2 py-1.5 border border-purple-500/30 rounded-md bg-gray-800/50 text-purple-100 shadow-sm 
                               focus:ring-purple-500 focus:border-purple-500 backdrop-blur-sm appearance-none
                               [&>option]:bg-gray-800 [&>option]:text-white"
                    style={{ colorScheme: 'dark' }}
                  >
                    {languages.map(lang => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className="bg-purple-600/50 p-2 rounded-full text-white cursor-pointer hover:bg-purple-500/50 transition-colors backdrop-blur-sm">
                    <FaArrowRight />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="relative">
                  <textarea
                    value={selectedText}
                    onChange={(e) => {
                      onTextChange(e.target.value);
                      setDetectedLang(null);
                    }}
                    placeholder="Enter text to translate..."
                    className="w-full h-24 p-3 border border-purple-500/30 rounded-md resize-none bg-gray-800/50 text-purple-100 
                               placeholder-purple-300/50 focus:ring-purple-500 focus:border-purple-500 pr-10 backdrop-blur-sm"
                  />
                  <button 
                    onClick={() => handleCopyText(selectedText)}
                    className="absolute top-2 right-2 text-purple-300/70 hover:text-purple-200"
                  >
                    <FaRegCopy />
                  </button>
                </div>
                
                <button
                  onClick={handleTranslate}
                  disabled={loading || !selectedText.trim()}
                  className="w-full bg-purple-600/50 backdrop-blur-sm text-white px-4 py-2 rounded-md hover:bg-purple-500/50 
                             transition-colors disabled:bg-gray-600/50 disabled:cursor-not-allowed flex items-center justify-center
                             border border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/20"
                >
                  {loading ? 'Translating...' : 'Translate'}
                </button>
              </div>
              
              {translatedText && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="mt-4 p-3 bg-gray-800/50 backdrop-blur-sm rounded-md border border-purple-500/30 max-h-40 overflow-y-auto relative"
                >
                  <h4 className="font-medium text-purple-100 mb-2">Translation:</h4>
                  <p className="text-purple-200/90 pr-8">{translatedText}</p>
                  <button 
                    onClick={() => handleCopyText(translatedText)}
                    className="absolute top-2 right-2 text-purple-300/70 hover:text-purple-200"
                  >
                    <FaRegCopy />
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default TranslatorWindow; 