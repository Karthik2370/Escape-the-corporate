import React from 'react';

const GameBackground = ({ backgroundOffset }) => {
  const screenHeight = window.innerHeight;
  const groundLevel = screenHeight * 0.75; // 75% of screen height
  const groundHeight = screenHeight - groundLevel;
  
  // Calculate number of tiles based on screen width
  const screenWidth = window.innerWidth;
  const tileWidth = 80;
  const numTiles = Math.ceil((screenWidth + tileWidth * 2) / tileWidth); // Ensure full coverage
  
  // Ground tiles that move with background
  const groundTiles = Array.from({ length: numTiles }, (_, i) => {
    // Calculate seamless tile position
    const left = ((i * tileWidth - (backgroundOffset % tileWidth)));
    return (
      <div
        key={i}
        className="absolute bg-gray-400 border-r border-gray-500"
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
  const numClouds = Math.max(4, Math.floor(screenWidth / 300));
  const clouds = Array.from({ length: numClouds }, (_, i) => (
    <div
      key={i}
      className="absolute text-white opacity-50"
      style={{
        left: `${(i * (screenWidth / numClouds) - backgroundOffset * 0.3) % (screenWidth + 200)}px`,
        top: `${Math.max(60, screenHeight * 0.1) + (i % 3) * Math.max(30, screenHeight * 0.05)}px`,
        fontSize: `${Math.max(24, screenWidth / 50)}px`
      }}
    >
      ☁️
    </div>
  ));

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Sky - responsive gradient */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-blue-400 to-blue-200"
        style={{ height: `${groundLevel}px` }}
      />
      
      {/* Sun - responsive positioning */}
      <div 
        className="absolute bg-yellow-300 rounded-full"
        style={{ 
          top: `${Math.max(40, screenHeight * 0.1)}px`, 
          right: `${Math.max(80, screenWidth * 0.08)}px`,
          width: `${Math.max(40, screenWidth / 30)}px`,
          height: `${Math.max(40, screenWidth / 30)}px`
        }}
      />
      
      {/* Clouds - responsive */}
      {clouds}
      
      {/* Ground base - responsive height */}
      <div 
        className="absolute left-0 right-0 bg-gray-500"
        style={{
          bottom: '0px',
          height: `${Math.max(groundHeight, 60)}px`
        }}
      />
      
      {/* Ground tiles - responsive */}
      {groundTiles}
      
      {/* Ground line - responsive thickness */}
      <div 
        className="absolute left-0 right-0 bg-gray-600"
        style={{
          bottom: '0px',
          height: `${Math.max(4, screenHeight / 200)}px`
        }}
      />
    </div>
  );
};

export default GameBackground;