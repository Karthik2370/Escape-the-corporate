import React from 'react';

const Runner = ({ runner }) => {
  const runnerWidth = runner.isDucking ? 50 : 40;
  const runnerHeight = runner.isDucking ? 30 : 60;
  
  // Animation states
  const isRunning = !runner.isJumping && !runner.isDucking;
  const runCycle = Math.floor(Date.now() / 150) % 4; // 4-frame running cycle

  return (
    <div
      className="absolute z-20"
      style={{
        left: `${runner.x}px`,
        top: `${runner.y}px`,
        width: `${runnerWidth}px`,
        height: `${runnerHeight}px`,
        transition: 'none'
      }}
    >
      {/* Main character body */}
      <div className="relative w-full h-full">
        
        {/* Head */}
        <div 
          className="absolute bg-gradient-to-br from-orange-300 to-orange-400 rounded-full border-2 border-orange-500"
          style={{
            width: runner.isDucking ? '12px' : '16px',
            height: runner.isDucking ? '12px' : '16px',
            top: runner.isDucking ? '2px' : '2px',
            left: '50%',
            transform: 'translateX(-50%)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}
        >
          {/* Eyes */}
          <div className="absolute top-1 left-1 w-1 h-1 bg-black rounded-full"></div>
          <div className="absolute top-1 right-1 w-1 h-1 bg-black rounded-full"></div>
        </div>

        {/* Body */}
        <div 
          className="absolute bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg border-2 border-blue-700"
          style={{
            width: runner.isDucking ? '20px' : '18px',
            height: runner.isDucking ? '12px' : '24px',
            top: runner.isDucking ? '12px' : '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
          }}
        >
          {/* Tie/shirt detail */}
          <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-1 h-3 bg-red-500 rounded-sm"></div>
        </div>

        {/* Arms */}
        {!runner.isDucking && (
          <>
            <div 
              className="absolute bg-gradient-to-br from-orange-300 to-orange-400 rounded-full border border-orange-500"
              style={{
                width: '8px',
                height: '3px',
                top: '20px',
                left: isRunning ? `${8 + Math.sin(runCycle) * 2}px` : '8px',
                transform: `rotate(${isRunning ? Math.sin(runCycle * 2) * 15 : 0}deg)`,
                transformOrigin: 'right center'
              }}
            />
            <div 
              className="absolute bg-gradient-to-br from-orange-300 to-orange-400 rounded-full border border-orange-500"
              style={{
                width: '8px',
                height: '3px',
                top: '20px',
                right: isRunning ? `${8 + Math.cos(runCycle) * 2}px` : '8px',
                transform: `rotate(${isRunning ? -Math.cos(runCycle * 2) * 15 : 0}deg)`,
                transformOrigin: 'left center'
              }}
            />
          </>
        )}

        {/* Legs */}
        {runner.isDucking ? (
          // Ducking legs - horizontal
          <>
            <div 
              className="absolute bg-gradient-to-br from-gray-600 to-gray-700 rounded-full border border-gray-800"
              style={{
                width: '12px',
                height: '4px',
                bottom: '2px',
                left: '8px'
              }}
            />
            <div 
              className="absolute bg-gradient-to-br from-gray-600 to-gray-700 rounded-full border border-gray-800"
              style={{
                width: '12px',
                height: '4px',
                bottom: '2px',
                right: '8px'
              }}
            />
          </>
        ) : (
          // Running/jumping legs
          <>
            <div 
              className="absolute bg-gradient-to-br from-gray-600 to-gray-700 rounded-full border border-gray-800"
              style={{
                width: '4px',
                height: runner.isJumping ? '16px' : '18px',
                bottom: '0px',
                left: isRunning ? `${12 + Math.sin(runCycle * 1.5) * 3}px` : '12px',
                transform: `rotate(${isRunning ? Math.sin(runCycle * 1.5) * 10 : 0}deg)`,
                transformOrigin: 'top center'
              }}
            />
            <div 
              className="absolute bg-gradient-to-br from-gray-600 to-gray-700 rounded-full border border-gray-800"
              style={{
                width: '4px',
                height: runner.isJumping ? '16px' : '18px',
                bottom: '0px',
                right: isRunning ? `${12 + Math.cos(runCycle * 1.5) * 3}px` : '12px',
                transform: `rotate(${isRunning ? -Math.cos(runCycle * 1.5) * 10 : 0}deg)`,
                transformOrigin: 'top center'
              }}
            />
          </>
        )}

        {/* Feet */}
        {!runner.isDucking && (
          <>
            <div 
              className="absolute bg-black rounded-sm"
              style={{
                width: '6px',
                height: '3px',
                bottom: '-2px',
                left: isRunning ? `${10 + Math.sin(runCycle * 1.5) * 4}px` : '10px'
              }}
            />
            <div 
              className="absolute bg-black rounded-sm"
              style={{
                width: '6px',
                height: '3px',
                bottom: '-2px',
                right: isRunning ? `${10 + Math.cos(runCycle * 1.5) * 4}px` : '10px'
              }}
            />
          </>
        )}

        {/* Motion lines when running */}
        {isRunning && (
          <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 opacity-30">
            <div className="w-6 h-0.5 bg-white rounded-full animate-pulse"></div>
            <div className="w-4 h-0.5 bg-white rounded-full mt-1 animate-pulse" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-0.5 bg-white rounded-full mt-1 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          </div>
        )}

        {/* Jump effect */}
        {runner.isJumping && (
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs opacity-50">
            💨
          </div>
        )}

        {/* Duck effect */}
        {runner.isDucking && (
          <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 text-xs opacity-50">
            💨
          </div>
        )}
      </div>

      {/* Dynamic shadow */}
      <div 
        className="absolute bg-black opacity-20 rounded-full"
        style={{
          bottom: `-${runner.isJumping ? Math.max(5, 15 - (runner.y - (400 - 60)) / 8) : 8}px`,
          left: '50%',
          transform: 'translateX(-50%)',
          width: `${runnerWidth * 0.8}px`,
          height: '6px',
          filter: 'blur(2px)'
        }}
      />
    </div>
  );
};

export default Runner;