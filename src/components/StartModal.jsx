import React, { useState } from 'react';
import { Play, Trophy, Zap, Shield, Flame, Sun, Moon } from 'lucide-react';

const StartModal = ({ highScore, onStart }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState('normal');
  const [selectedTheme, setSelectedTheme] = useState('day');

  const difficulties = {
    easy: {
      name: 'Easy',
      icon: Shield,
      color: 'from-green-500 to-green-600',
      description: 'Slower pace, higher jumps',
      features: ['15% stronger jumps', 'Slower progression', 'More forgiving']
    },
    normal: {
      name: 'Normal',
      icon: Zap,
      color: 'from-blue-500 to-blue-600',
      description: 'Balanced challenge',
      features: ['Standard physics', 'Regular obstacles', 'Balanced gameplay']
    },
    expert: {
      name: 'Expert',
      icon: Flame,
      color: 'from-red-500 to-red-600',
      description: 'Lower jumps, fast pace',
      features: ['Weaker jumps', 'Rapid progression', '1.5x score bonus']
    }
  };

  const themes = {
    day: {
      name: 'Day',
      icon: Sun,
      color: 'from-yellow-400 to-orange-500',
      description: 'Bright sunny sky'
    },
    night: {
      name: 'Night',
      icon: Moon,
      color: 'from-indigo-600 to-purple-700',
      description: 'Starry night sky'
    }
  };

  const handleStart = () => {
    onStart(selectedDifficulty, selectedTheme);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 pointer-events-auto transition-all duration-300 p-2 z-50">
      <div
        className="relative rounded-2xl shadow-2xl text-center w-full max-w-sm border border-blue-200/40 backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 overflow-hidden animate-fadeIn"
        style={{ maxHeight: '98vh', overflowY: 'auto' }}
      >
        {/* Top Accent Bar */}
        <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500/80 to-purple-500/80 h-10 w-full shadow-md">
          <span className="text-xl">🏃‍♂️</span>
          <span className="text-lg animate-bounce">💼</span>
        </div>
        
        {/* Content */}
        <div className="py-3 px-4">
          <h1 className="text-xl font-extrabold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent mb-1 tracking-tight">
            Corporate Stress Runner
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-xs mb-3">Escape the office chaos!</p>
          
          {/* Theme Selection */}
          <div className="mb-3">
            <h3 className="text-xs font-bold text-gray-700 dark:text-gray-200 mb-2">Choose Theme:</h3>
            <div className="grid grid-cols-2 gap-1.5">
              {Object.entries(themes).map(([key, theme]) => {
                const IconComponent = theme.icon;
                const isSelected = selectedTheme === key;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedTheme(key)}
                    className={`p-2 rounded-lg border transition-all duration-200 text-left ${
                      isSelected 
                        ? 'border-blue-400 bg-blue-50/80 dark:bg-blue-900/40 shadow-sm' 
                        : 'border-gray-200 bg-white/60 dark:bg-gray-800/60 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-md bg-gradient-to-r ${theme.color} text-white`}>
                        <IconComponent size={12} />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-xs text-gray-800 dark:text-gray-100">{theme.name}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-300">{theme.description}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty Selection */}
          <div className="mb-3">
            <h3 className="text-xs font-bold text-gray-700 dark:text-gray-200 mb-2">Choose Difficulty:</h3>
            <div className="grid grid-cols-1 gap-1.5">
              {Object.entries(difficulties).map(([key, diff]) => {
                const IconComponent = diff.icon;
                const isSelected = selectedDifficulty === key;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedDifficulty(key)}
                    className={`p-2 rounded-lg border transition-all duration-200 text-left ${
                      isSelected 
                        ? 'border-blue-400 bg-blue-50/80 dark:bg-blue-900/40 shadow-sm' 
                        : 'border-gray-200 bg-white/60 dark:bg-gray-800/60 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-md bg-gradient-to-r ${diff.color} text-white`}>
                        <IconComponent size={12} />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-xs text-gray-800 dark:text-gray-100">{diff.name}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-300">{diff.description}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Controls */}
          <div className="bg-gradient-to-r from-blue-50/80 to-purple-50/80 rounded-xl p-2 mb-3 border border-blue-100/60">
            <div className="grid grid-cols-2 gap-1.5 text-center mb-2">
              <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-1.5">
                <div className="text-sm mb-0.5">⬆️</div>
                <div className="text-xs font-semibold text-gray-700 dark:text-gray-200">Jump</div>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-1.5">
                <div className="text-sm mb-0.5">⬇️</div>
                <div className="text-xs font-semibold text-gray-700 dark:text-gray-200">Duck</div>
              </div>
            </div>
            <div className="bg-red-50/80 dark:bg-red-900/40 rounded-lg p-1.5 border border-red-100/60 mb-1.5">
              <div className="text-red-600 font-bold text-xs">👹 Boss Battles: Duck bullets!</div>
            </div>
            <div className="bg-blue-50/80 rounded-lg p-1.5 border border-blue-100/60">
              <div className="text-blue-600 font-bold text-xs">⏸️ Press Spacebar to pause</div>
            </div>
          </div>
          
          {/* High Score */}
          {highScore > 0 && (
            <div className="bg-yellow-50/80 dark:bg-yellow-900/40 rounded-lg p-2 mb-3 border border-yellow-200/60">
              <div className="flex items-center justify-center gap-1">
                <Trophy className="text-yellow-500" size={12} />
                <span className="text-yellow-700 dark:text-yellow-200 font-bold text-xs">Best: {highScore}</span>
              </div>
            </div>
          )}
          
          {/* Start Button */}
          <button
            onClick={handleStart}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 transform hover:scale-105 shadow-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 touch-manipulation"
          >
            <Play size={16} />
            <span>Start Running!</span>
          </button>
          
          {/* Credits */}
          <div className="mt-2 pt-2 border-t border-gray-200/60">
            <div className="text-xs text-gray-600 dark:text-gray-400 leading-tight">
              <div className="font-semibold">Created by Karthik Nambiar</div>
              <div>Inspired by Chrome's Dino game</div>
              <div>Personal project • Just for fun! 🎮</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartModal;