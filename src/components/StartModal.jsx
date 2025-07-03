import React, { useState } from 'react';
import { Play, Trophy, Zap, Shield, Flame } from 'lucide-react';

const StartModal = ({ highScore, onStart }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState('normal');

  const difficulties = {
    easy: {
      name: 'Easy',
      icon: Shield,
      color: 'from-green-500 to-green-600',
      description: 'Slower pace, more forgiving',
      features: ['Slower speed progression', 'Fewer obstacles', 'More spacing']
    },
    normal: {
      name: 'Normal',
      icon: Zap,
      color: 'from-blue-500 to-blue-600',
      description: 'Balanced challenge',
      features: ['Standard speed', 'Regular obstacles', 'Balanced gameplay']
    },
    expert: {
      name: 'Expert',
      icon: Flame,
      color: 'from-red-500 to-red-600',
      description: 'Fast-paced, intense',
      features: ['Rapid speed increase', 'More obstacles', 'Higher scores']
    }
  };

  const handleStart = () => {
    onStart(selectedDifficulty);
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 pointer-events-auto transition-all duration-300 p-4">
      <div
        className="relative rounded-3xl shadow-2xl text-center w-full max-w-md border border-blue-200/40 backdrop-blur-xl bg-white/60 dark:bg-gray-900/60 overflow-hidden animate-fadeIn"
        style={{ maxHeight: '95vh', overflowY: 'auto' }}
      >
        {/* Top Accent Bar */}
        <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500/80 to-purple-500/80 h-12 sm:h-14 w-full shadow-md">
          <span className="text-2xl sm:text-3xl">🏃‍♂️</span>
          <span className="text-xl sm:text-2xl animate-bounce">💼</span>
        </div>
        
        {/* Title */}
        <div className="py-3 sm:py-4 px-4 sm:px-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent mb-1 tracking-tight drop-shadow-sm">
            Corporate Stress
          </h1>
          <h2 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200 mb-1">Runner</h2>
          <p className="text-gray-500 dark:text-gray-300 text-sm mb-3">Escape the office chaos!</p>
          
          {/* Difficulty Selection */}
          <div className="mb-4">
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">Choose Difficulty:</h3>
            <div className="grid grid-cols-1 gap-2">
              {Object.entries(difficulties).map(([key, diff]) => {
                const IconComponent = diff.icon;
                const isSelected = selectedDifficulty === key;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedDifficulty(key)}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 text-left ${
                      isSelected 
                        ? 'border-blue-400 bg-blue-50/80 dark:bg-blue-900/40 shadow-md' 
                        : 'border-gray-200 bg-white/60 dark:bg-gray-800/60 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${diff.color} text-white`}>
                        <IconComponent size={16} />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-sm text-gray-800 dark:text-gray-100">{diff.name}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-300">{diff.description}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Instructions */}
          <div className="bg-gradient-to-r from-blue-50/80 to-purple-50/80 rounded-2xl p-3 mb-3 border border-blue-100/60 shadow-sm">
            <div className="grid grid-cols-2 gap-2 text-center mb-2">
              <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-2 shadow-sm">
                <div className="text-lg mb-1">⬆️</div>
                <div className="text-xs font-semibold text-gray-700 dark:text-gray-200">Jump</div>
                <div className="text-xs text-gray-500">Over obstacles</div>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 rounded-xl p-2 shadow-sm">
                <div className="text-lg mb-1">⬇️</div>
                <div className="text-xs font-semibold text-gray-700 dark:text-gray-200">Duck</div>
                <div className="text-xs text-gray-500">Under threats</div>
              </div>
            </div>
            <div className="bg-red-50/80 dark:bg-red-900/40 rounded-xl p-2 border border-red-100/60 mb-2">
              <div className="text-red-600 font-bold text-xs mb-1">👹 Boss Battles!</div>
              <div className="text-red-500 text-xs">Duck bullets, then touch to destroy!</div>
            </div>
            <div className="bg-blue-50/80 rounded-xl p-2 border border-blue-100/60">
              <div className="text-blue-600 font-bold text-xs mb-1">⏸️ Pause</div>
              <div className="text-blue-500 text-xs">Press <kbd>Spacebar</kbd> to pause/resume</div>
            </div>
          </div>
          
          {/* High Score Display */}
          {highScore > 0 && (
            <div className="bg-yellow-50/80 dark:bg-yellow-900/40 rounded-xl p-2 mb-3 border border-yellow-200/60 shadow-sm">
              <div className="flex items-center justify-center gap-2">
                <Trophy className="text-yellow-500" size={14} />
                <span className="text-yellow-700 dark:text-yellow-200 font-bold text-sm">Best Score: {highScore}</span>
              </div>
            </div>
          )}
          
          {/* Start Button */}
          <button
            onClick={handleStart}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <Play size={18} />
            <span>Start Running!</span>
          </button>
          
          {/* Credits */}
          <div className="mt-3 pt-3 border-t border-gray-200/60">
            <div className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              <div className="font-semibold mb-1">Created by Karthik Nambiar</div>
              <div>A fun game inspired by Chrome's Dino game</div>
              <div>Personal project • Just for fun! 🎮</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartModal;