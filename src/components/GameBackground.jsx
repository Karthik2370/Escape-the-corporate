import React from 'react';

const GameBackground = ({ backgroundOffset, theme = 'day' }) => {
  const screenHeight = window.innerHeight;
  const groundLevel = screenHeight * 0.75; // 75% of screen height
  const groundHeight = screenHeight - groundLevel;
  
  // Calculate number of tiles based on screen width
  const screenWidth = window.innerWidth;
  const tileWidth = 80;
  const numTiles = Math.ceil((screenWidth + tileWidth * 2) / tileWidth); // Ensure full coverage
  
  // Theme configurations
  const themes = {
    day: {
      skyGradient: 'from-blue-400 to-blue-200',
      sunMoon: {
        color: 'bg-yellow-300',
        icon: '☀️',
        glow: 'shadow-yellow-200'
      },
      clouds: '☁️',
      cloudOpacity: 'opacity-50',
      groundBase: 'bg-gray-500',
      groundTiles: 'bg-gray-400 border-gray-500',
      groundLine: 'bg-gray-600'
    },
    night: {
      skyGradient: 'from-indigo-900 via-purple-900 to-indigo-800',
      sunMoon: {
        color: 'bg-gray-100',
        icon: '🌙',
        glow: 'shadow-blue-200'
      },
      clouds: '☁️',
      cloudOpacity: 'opacity-30',
      groundBase: 'bg-gray-700',
      groundTiles: 'bg-gray-600 border-gray-700',
      groundLine: 'bg-gray-800'
    }
  };

  const currentTheme = themes[theme] || themes.day;
  
  // Ground tiles that move with background
  const groundTiles = Array.from({ length: numTiles }, (_, i) => {
    // Calculate seamless tile position
    const left = ((i * tileWidth - (backgroundOffset % tileWidth)));
    return (
      <div
        key={i}
        className={`absolute border-r ${currentTheme.groundTiles}`}
        style={{
          left: `${left}px`,
          bottom: '0px',
          width: `${tileWidth}px`,
          height: `${Math.max(groundHeight, 60)}px` // Minimum 60px height
        }}
      />
    );
  });

  // Responsive clouds/stars based on screen size
  const numElements = Math.max(4, Math.floor(screenWidth / 300));
  const skyElements = Array.from({ length: numElements }, (_, i) => (
    <div
      key={i}
      className={`absolute text-white ${currentTheme.cloudOpacity}`}
      style={{
        left: `${(i * (screenWidth / numElements) - backgroundOffset * 0.3) % (screenWidth + 200)}px`,
        top: `${Math.max(60, screenHeight * 0.1) + (i % 3) * Math.max(30, screenHeight * 0.05)}px`,
        fontSize: `${Math.max(24, screenWidth / 50)}px`
      }}
    >
      {currentTheme.clouds}
    </div>
  ));

  // Add stars for night mode
  const stars = theme === 'night' ? Array.from({ length: 20 }, (_, i) => (
    <div
      key={`star-${i}`}
      className="absolute text-yellow-200 opacity-80 animate-pulse"
      style={{
        left: `${(i * 73 + backgroundOffset * 0.1) % (screenWidth + 100)}px`,
        top: `${Math.max(20, screenHeight * 0.05) + (i % 5) * Math.max(20, screenHeight * 0.08)}px`,
        fontSize: `${Math.max(8, screenWidth / 100)}px`,
        animationDelay: `${i * 0.2}s`
      }}
    >
      ⭐
    </div>
  )) : [];

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Sky - responsive gradient */}
      <div 
        className={`absolute inset-0 bg-gradient-to-b ${currentTheme.skyGradient}`}
        style={{ height: `${groundLevel}px` }}
      />
      
      {/* Sun/Moon - responsive positioning */}
      <div 
        className={`absolute ${currentTheme.sunMoon.color} rounded-full ${currentTheme.sunMoon.glow} shadow-lg`}
        style={{ 
          top: `${Math.max(40, screenHeight * 0.1)}px`, 
          right: `${Math.max(80, screenWidth * 0.08)}px`,
          width: `${Math.max(40, screenWidth / 30)}px`,
          height: `${Math.max(40, screenWidth / 30)}px`
        }}
      >
        {/* Add moon face for night mode */}
        {theme === 'night' && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-600" style={{ fontSize: '60%' }}>
            🌙
          </div>
        )}
      </div>
      
      {/* Sky elements (clouds) - responsive */}
      {skyElements}
      
      {/* Stars for night mode */}
      {stars}
      
      {/* Shooting star occasionally for night mode */}
      {theme === 'night' && Math.random() < 0.001 && (
        <div 
          className="absolute text-yellow-300 opacity-80 animate-ping"
          style={{
            left: `${Math.random() * screenWidth}px`,
            top: `${Math.max(30, screenHeight * 0.1)}px`,
            fontSize: `${Math.max(12, screenWidth / 80)}px`
          }}
        >
          💫
        </div>
      )}
      
      {/* Ground base - responsive height */}
      <div 
        className={`absolute left-0 right-0 ${currentTheme.groundBase}`}
        style={{
          bottom: '0px',
          height: `${Math.max(groundHeight, 60)}px`
        }}
      />
      
      {/* Ground tiles - responsive */}
      {groundTiles}
      
      {/* Ground line - responsive thickness */}
      <div 
        className={`absolute left-0 right-0 ${currentTheme.groundLine}`}
        style={{
          bottom: '0px',
          height: `${Math.max(4, screenHeight / 200)}px`
        }}
      />
    </div>
  );
};

export default GameBackground;