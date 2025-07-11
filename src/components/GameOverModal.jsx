import React from 'react';
import { RotateCcw, Trophy, Zap } from 'lucide-react';

const GameOverModal = ({ score, highScore, gameTimeSeconds, speed, difficulty, onRestart, onBackToMenu }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 transition-all duration-300 p-4 z-50">
    <div className="modal-content relative rounded-2xl shadow-2xl text-center w-full max-w-sm border border-red-200/40 backdrop-blur-xl bg-white/95 dark:bg-gray-900/95 overflow-hidden animate-fadeIn">
      {/* Top Accent Bar */}
      <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-500/80 to-orange-500/80 h-12 w-full shadow-md">
        <span className="text-2xl">💥</span>
      </div>
      <div className="py-3 sm:py-4 px-4 sm:px-6">
        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-800 dark:text-gray-100 mb-1 tracking-tight drop-shadow-sm">Game Over!</h1>
        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-200 mb-2">Corporate stress got you!</p>
        <div className="bg-gray-100/80 dark:bg-gray-800/80 rounded-lg p-3 mb-4 border border-gray-200/60 shadow-sm">
          <div className="grid grid-cols-2 gap-2 text-center">
            <div>
              <div className="text-lg sm:text-xl font-bold text-blue-600">{score}</div>
              <div className="text-xs text-gray-700 dark:text-gray-300">Final Score</div>
            </div>
            <div>
              <div className="text-lg sm:text-xl font-bold text-green-600">{gameTimeSeconds}s</div>
              <div className="text-xs text-gray-700 dark:text-gray-300">Survival Time</div>
            </div>
            <div>
              <div className="text-lg sm:text-xl font-bold text-purple-600">{speed.toFixed(1)}x</div>
              <div className="text-xs text-gray-700 dark:text-gray-300">Max Speed</div>
            </div>
            <div>
              <div className="text-lg sm:text-xl font-bold text-orange-600 capitalize">{difficulty}</div>
              <div className="text-xs text-gray-700 dark:text-gray-300">Difficulty</div>
            </div>
          </div>
          {score === highScore && score > 0 && (
            <div className="text-xs text-yellow-600 font-bold mt-2 animate-pulse">🎉 New High Score!</div>
          )}
        </div>
        <button
          onClick={onRestart}
          className="interactive w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-400 mb-2"
        >
          <RotateCcw size={16} />
          Try Again
        </button>
        <button
          onClick={onBackToMenu}
          className="interactive w-full bg-gradient-to-r from-gray-700 to-gray-500 hover:from-gray-800 hover:to-gray-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          Back to Menu
        </button>
      </div>
    </div>
  </div>
);

export default GameOverModal;