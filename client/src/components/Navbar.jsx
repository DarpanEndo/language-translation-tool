import React from 'react';
import { FaHome, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

function Navbar({ showUrlInput, currentIndex, historyLength, onBack, onForward, onNewWebsite }) {
  return (
    <nav className="bg-purple-500/5 backdrop-blur-lg border-b border-white/10 shadow-lg fixed top-0 w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-4">
            <span className="text-xl font-bold text-white">Website Translator</span>
            {!showUrlInput && (
              <div className="flex space-x-4">
                <button
                  onClick={onBack}
                  disabled={currentIndex <= 0}
                  className="bg-purple-600/30 hover:bg-purple-500/40 text-white p-2 rounded-full disabled:opacity-50 transition-all duration-300 backdrop-blur-sm border border-white/10 disabled:hover:bg-purple-600/30"
                >
                  <FaArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={onForward}
                  disabled={currentIndex >= historyLength - 1}
                  className="bg-purple-600/30 hover:bg-purple-500/40 text-white p-2 rounded-full disabled:opacity-50 transition-all duration-300 backdrop-blur-sm border border-white/10 disabled:hover:bg-purple-600/30"
                >
                  <FaArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center">
            {!showUrlInput && (
              <button
                onClick={onNewWebsite}
                className="bg-purple-600/80 hover:bg-purple-500/80 text-white px-4 py-2 rounded-full transition-all duration-300 backdrop-blur-sm flex items-center space-x-2 border border-white/20
                          shadow-[0_0_15px_rgba(168,85,247,0.5)] hover:shadow-[0_0_30px_rgba(168,85,247,0.8)] 
                          transform hover:-translate-y-0.5"
              >
                <FaHome className="w-4 h-4" />
                <span>New Website</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 