import React from 'react';
import { RotateCcw, Trophy, Zap } from 'lucide-react';

const GameOverModal = ({ score, highScore, gameTimeSeconds, speed, onRestart }) => (
  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 pointer-events-auto transition-all duration-300">
    <div
      className="relative rounded-2xl shadow-2xl text-center max-w-sm w-full border border-red-200/40 backdrop-blur-xl bg-white/60 dark:bg-gray-900/60 overflow-hidden animate-fadeIn"
      style={{ maxHeight: '90vh', overflowY: 'auto' }}
    >
      {/* Top Accent Bar */}
      <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-500/80 to-orange-500/80 h-12 w-full shadow-md">
        <span className="text-2xl">💥</span>
      </div>
      <div className="py-4 px-6">
        <h1 className="text-2xl font-extrabold text-gray-800 dark:text-gray-100 mb-1 tracking-tight drop-shadow-sm">Game Over!</h1>
        <p className="text-base text-gray-600 dark:text-gray-300 mb-2">Corporate stress got you!</p>
        <div className="bg-gray-100/80 dark:bg-gray-800/80 rounded-lg p-3 mb-4 border border-gray-200/60 shadow-sm">
          <div className="grid grid-cols-2 gap-2 text-center">
            <div>
              <div className="text-xl font-bold text-blue-600">{score}</div>
              <div className="text-xs text-gray-600">Final Score</div>
            </div>
            <div>
              <div className="text-xl font-bold text-green-600">{gameTimeSeconds}s</div>
              <div className="text-xs text-gray-600">Survival Time</div>
            </div>
            <div>
              <div className="text-xl font-bold text-purple-600">{speed.toFixed(1)}x</div>
              <div className="text-xs text-gray-600">Max Speed</div>
            </div>
            <div>
              <div className="text-xl font-bold text-orange-600">{Math.floor(score / 200)}</div>
              <div className="text-xs text-gray-600">Speed Levels</div>
            </div>
          </div>
          {score === highScore && score > 0 && (
            <div className="text-xs text-yellow-600 font-bold mt-2 animate-pulse">🎉 New High Score!</div>
          )}
        </div>
        <button
          onClick={onRestart}
          className="mt-2 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 mx-auto transition-colors text-base focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <RotateCcw size={16} />
          Try Again
        </button>
      </div>
    </div>
  </div>
);

export default GameOverModal; 