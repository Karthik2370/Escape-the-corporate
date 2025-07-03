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
      skyGradient: 'from-indigo-900 via-purple-900 to-gray-900',
      sunMoon: {
        color: 'bg-gray-200',
        icon: '🌙',
        glow: 'shadow-blue-300'
      },
      clouds: '☁️',
      cloudOpacity: 'opacity-20',
      groundBase: 'bg-gray-800',
      groundTiles: 'bg-gray-700 border-gray-800',
      groundLine: 'bg-gray-900'
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

  // Responsive clouds based on screen size
  const numClouds = Math.max(3, Math.floor(screenWidth / 400));
  const clouds = Array.from({ length: numClouds }, (_, i) => (
    <div
      key={i}
      className={`absolute text-white ${currentTheme.cloudOpacity}`}
      style={{
        left: `${(i * (screenWidth / numClouds) - backgroundOffset * 0.2) % (screenWidth + 200)}px`,
        top: `${Math.max(60, screenHeight * 0.15) + (i % 2) * Math.max(40, screenHeight * 0.1)}px`,
        fontSize: `${Math.max(32, screenWidth / 40)}px`
      }}
    >
      {currentTheme.clouds}
    </div>
  ));

  // Stars for night mode - scattered naturally across the sky
  const stars = theme === 'night' ? Array.from({ length: 25 }, (_, i) => {
    // Create more natural star distribution
    const x = (i * 127 + backgroundOffset * 0.05) % (screenWidth + 100);
    const y = Math.max(20, screenHeight * 0.05) + (i * 37) % (screenHeight * 0.6);
    const size = Math.max(6, screenWidth / 120);
    const brightness = 0.4 + (i % 3) * 0.3; // Varying brightness
    
    return (
      <div
        key={`star-${i}`}
        className="absolute text-yellow-100 animate-pulse"
        style={{
          left: `${x}px`,
          top: `${y}px`,
          fontSize: `${size}px`,
          opacity: brightness,
          animationDelay: `${(i * 0.3) % 3}s`,
          animationDuration: `${2 + (i % 2)}s`
        }}
      >
        ✦
      </div>
    );
  }) : [];

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
          top: `${Math.max(40, screenHeight * 0.12)}px`, 
          right: `${Math.max(80, screenWidth * 0.08)}px`,
          width: `${Math.max(40, screenWidth / 30)}px`,
          height: `${Math.max(40, screenWidth / 30)}px`
        }}
      >
        {/* Add subtle glow for moon */}
        {theme === 'night' && (
          <div 
            className="absolute inset-0 rounded-full bg-blue-200 opacity-20 animate-pulse"
            style={{ transform: 'scale(1.5)' }}
          />
        )}
      </div>
      
      {/* Clouds - responsive */}
      {clouds}
      
      {/* Stars for night mode - naturally scattered */}
      {stars}
      
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