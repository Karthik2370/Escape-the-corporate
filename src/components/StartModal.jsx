import React from 'react';
import { Play, Trophy } from 'lucide-react';

const StartModal = ({ highScore, onStart }) => (
  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 pointer-events-auto transition-all duration-300">
    <div
      className="relative rounded-3xl shadow-2xl text-center max-w-md w-full min-w-[320px] border border-blue-200/40 backdrop-blur-xl bg-white/60 dark:bg-gray-900/60 overflow-hidden animate-fadeIn"
      style={{ maxHeight: '90vh', overflowY: 'auto' }}
    >
      {/* Top Accent Bar */}
      <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500/80 to-purple-500/80 h-14 w-full shadow-md">
        <span className="text-3xl">🏃‍♂️</span>
        <span className="text-2xl animate-bounce">💼</span>
      </div>
      {/* Title */}
      <div className="py-4 px-6">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent mb-1 tracking-tight drop-shadow-sm">
          Corporate Stress
        </h1>
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">Runner</h2>
        <p className="text-gray-500 dark:text-gray-300 text-base mb-4">Escape the office chaos!</p>
        {/* Quick Instructions */}
        <div className="bg-gradient-to-r from-blue-50/80 to-purple-50/80 rounded-2xl p-4 mb-4 border border-blue-100/60 shadow-sm">
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-2 shadow-sm">
              <div className="text-xl mb-1">⬆️</div>
              <div className="text-xs font-semibold text-gray-700 dark:text-gray-200">Jump</div>
              <div className="text-xs text-gray-500">Over obstacles</div>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-2 shadow-sm">
              <div className="text-xl mb-1">⬇️</div>
              <div className="text-xs font-semibold text-gray-700 dark:text-gray-200">Duck</div>
              <div className="text-xs text-gray-500">Under threats</div>
            </div>
          </div>
          <div className="mt-2 bg-red-50/80 dark:bg-red-900/40 rounded-xl p-2 border border-red-100/60">
            <div className="text-red-600 font-bold text-xs mb-1">👹 Boss Battles!</div>
            <div className="text-red-500 text-xs">Duck bullets, then touch to destroy!</div>
          </div>
          <div className="mt-2 bg-blue-50/80 rounded-xl p-2 border border-blue-100/60">
            <div className="text-blue-600 font-bold text-xs mb-1">⏸️ Pause</div>
            <div className="text-blue-500 text-xs">Press <kbd>Spacebar</kbd> to pause/resume</div>
          </div>
        </div>
        {/* High Score Display */}
        {highScore > 0 && (
          <div className="bg-yellow-50/80 dark:bg-yellow-900/40 rounded-xl p-2 mb-4 border border-yellow-200/60 shadow-sm">
            <div className="flex items-center justify-center gap-2">
              <Trophy className="text-yellow-500" size={16} />
              <span className="text-yellow-700 dark:text-yellow-200 font-bold text-sm">Best Score: {highScore}</span>
            </div>
          </div>
        )}
        {/* Start Button */}
        <button
          onClick={onStart}
          className="mt-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-2xl flex items-center gap-2 mx-auto transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <Play size={20} />
          <span>Start Running!</span>
        </button>
      </div>
    </div>
  </div>
);

export default StartModal; 