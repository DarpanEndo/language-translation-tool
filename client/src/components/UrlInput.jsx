import React from 'react';
import { FaGlobe } from 'react-icons/fa';

function UrlInput({ url, onUrlChange, onSubmit }) {
  return (
    <div className="max-w-xl mx-auto mt-20 p-6">
      <div className="backdrop-blur-lg bg-purple-500/10 border border-white/20 rounded-lg shadow-2xl p-8">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Website Translator
        </h1>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="url"
              value={url}
              onChange={(e) => onUrlChange(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-4 py-4 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg text-white placeholder-white/50 backdrop-blur-sm"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
              <FaGlobe className="h-6 w-6 text-white/50" />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600/80 backdrop-blur-sm text-white px-6 py-4 rounded-lg hover:bg-purple-500/80 transition-all duration-300 font-medium text-lg shadow-lg hover:shadow-purple-500/25 transform hover:-translate-y-0.5"
          >
            Load Website
          </button>
        </form>
      </div>
    </div>
  );
}

export default UrlInput; 