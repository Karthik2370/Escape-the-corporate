import React from 'react';

const PauseModal = ({ onResume }) => (
  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 pointer-events-auto transition-all duration-300 z-50">
    <div className="rounded-2xl shadow-2xl text-center max-w-xs w-full border border-blue-400/40 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 overflow-hidden animate-fadeIn p-8">
      <div className="text-5xl mb-2 animate-bounce">⏸️</div>
      <h1 className="text-2xl font-extrabold text-blue-700 dark:text-blue-200 mb-2 tracking-tight drop-shadow-sm">Paused</h1>
      <p className="text-base text-gray-700 dark:text-gray-200 mb-4">Game is paused.</p>
      <div className="bg-blue-50/80 rounded-xl p-2 border border-blue-100/60 mb-4">
        <div className="text-blue-600 font-bold text-xs mb-1">Press <kbd>Spacebar</kbd> to resume</div>
      </div>
      <button
        onClick={onResume}
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        Resume
      </button>
    </div>
  </div>
);

export default PauseModal; 