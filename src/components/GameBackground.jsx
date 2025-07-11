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
      sunMoon: { type: 'sun' },
      clouds: '☁️',
      cloudOpacity: 'opacity-50',
      groundBase: 'bg-gray-500',
      groundTiles: 'bg-gray-400 border-gray-500',
      groundLine: 'bg-gray-600'
    },
    night: {
      skyGradient: 'from-indigo-900 via-purple-900 to-gray-900',
      sunMoon: { type: 'moon' },
      clouds: '☁️',
      cloudOpacity: 'opacity-20',
      groundBase: 'bg-gray-800',
      groundTiles: 'bg-gray-700 border-gray-800',
      groundLine: 'bg-gray-900'
    },
    aurora: {
      skyGradient: 'from-blue-900 via-teal-700 to-indigo-900',
      sunMoon: { type: 'none' },
      clouds: '',
      cloudOpacity: '',
      groundBase: 'bg-slate-900',
      groundTiles: 'bg-slate-800 border-teal-900',
      groundLine: 'bg-teal-400'
    },
    city: {
      skyGradient: 'from-blue-900 via-purple-900 to-gray-900',
      sunMoon: { type: 'none' },
      clouds: '',
      cloudOpacity: '',
      groundBase: 'bg-gray-900',
      groundTiles: 'bg-gray-800 border-purple-900',
      groundLine: 'bg-purple-400'
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
    <div className="absolute inset-0 overflow-hidden z-0">
      {/* Sky - responsive gradient */}
      <div 
        className={`absolute inset-0 bg-gradient-to-b ${currentTheme.skyGradient}`}
        style={{ height: `${groundLevel}px` }}
      />
      
      {/* Sun/Moon or special background elements */}
      {(() => {
        const sunMoonType = currentTheme.sunMoon.type;
        if (sunMoonType === 'sun') {
          // Day sun
          return (
            <svg className="absolute" style={{ zIndex: 0, top: `${Math.max(40, screenHeight * 0.12)}px`, right: `${Math.max(80, screenWidth * 0.08)}px`, width: `${Math.max(48, screenWidth / 24)}px`, height: `${Math.max(48, screenWidth / 24)}px` }} viewBox="0 0 64 64" fill="none">
              <defs>
                <radialGradient id="sunGradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#fffbe6" />
                  <stop offset="60%" stopColor="#ffe066" />
                  <stop offset="100%" stopColor="#ffb300" />
                </radialGradient>
              </defs>
              <circle cx="32" cy="32" r="16" fill="url(#sunGradient)" />
              {[...Array(12)].map((_, i) => (
                <rect key={i} x="31" y="4" width="2" height="12" rx="1" fill="#ffe066" opacity="0.7" transform={`rotate(${i * 30} 32 32)`} />
              ))}
            </svg>
          );
        } else if (sunMoonType === 'moon') {
          // Night moon
          return (
            <svg className="absolute" style={{ zIndex: 0, top: `${Math.max(40, screenHeight * 0.12)}px`, right: `${Math.max(80, screenWidth * 0.08)}px`, width: `${Math.max(48, screenWidth / 24)}px`, height: `${Math.max(48, screenWidth / 24)}px` }} viewBox="0 0 64 64" fill="none">
              <defs>
                <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#e0e7ff" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.1" />
                </radialGradient>
                <radialGradient id="moonBody" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f8fafc" />
                  <stop offset="100%" stopColor="#cbd5e1" />
                </radialGradient>
              </defs>
              <circle cx="32" cy="32" r="24" fill="url(#moonGlow)" />
              <path d="M44 32c0 8-6.5 14-14 14 5-3 8-8 8-14s-3-11-8-14c7.5 0 14 6 14 14z" fill="url(#moonBody)" />
              <circle cx="38" cy="38" r="2.2" fill="#e2e8f0" opacity="0.7" />
              <circle cx="42" cy="28" r="1.2" fill="#e2e8f0" opacity="0.5" />
              <circle cx="34" cy="44" r="1.5" fill="#e2e8f0" opacity="0.4" />
            </svg>
          );
        } else if (theme === 'aurora') {
          // Aurora ribbons and stars
          return (
            <>
              {/* Aurora ribbons */}
              <svg className="absolute pointer-events-none" style={{ zIndex: 0, top: 0, left: 0, width: '100vw', height: `${groundLevel * 0.8}px` }} viewBox={`0 0 1440 400`} fill="none">
                <defs>
                  <linearGradient id="aurora1" x1="0" y1="0" x2="1440" y2="400" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#7fffd4" stopOpacity="0.7" />
                    <stop offset="1" stopColor="#00bcd4" stopOpacity="0.2" />
                  </linearGradient>
                  <linearGradient id="aurora2" x1="0" y1="0" x2="1440" y2="400" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#b388ff" stopOpacity="0.6" />
                    <stop offset="1" stopColor="#00e5ff" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
                <path d="M0 200 Q 360 100 720 200 T 1440 200 V400 H0Z" fill="url(#aurora1)" opacity="0.7" />
                <path d="M0 120 Q 480 220 960 120 T 1440 120 V400 H0Z" fill="url(#aurora2)" opacity="0.5" />
              </svg>
              {/* Aurora stars */}
              {Array.from({ length: 30 }).map((_, i) => (
                <div
                  key={`aurora-star-${i}`}
                  className="absolute animate-pulse"
                  style={{
                    zIndex: 0,
                    left: `${(i * 47) % window.innerWidth}px`,
                    top: `${40 + (i * 73) % (groundLevel * 0.7)}px`,
                    fontSize: `${8 + (i % 3) * 4}px`,
                    color: '#e0f7fa',
                    opacity: 0.5 + (i % 3) * 0.2,
                    animationDelay: `${(i * 0.2) % 2}s`,
                    animationDuration: `${2 + (i % 2)}s`
                  }}
                >
                  ✦
                </div>
              ))}
            </>
          );
        } else if (theme === 'city') {
          // City skyline SVG
          return (
            <svg className="absolute pointer-events-none" style={{ zIndex: 0, left: 0, width: '100vw', height: `${groundLevel * 0.7}px`, bottom: `${groundHeight + 20}px` }} viewBox="0 0 1440 300" fill="none">
              <rect x="0" y="220" width="1440" height="80" fill="#22223b" />
              {/* Buildings */}
              <rect x="80" y="120" width="60" height="100" fill="#39375b" />
              <rect x="160" y="170" width="40" height="50" fill="#4a4e69" />
              <rect x="220" y="140" width="50" height="80" fill="#39375b" />
              <rect x="300" y="180" width="30" height="40" fill="#4a4e69" />
              <rect x="350" y="160" width="40" height="60" fill="#39375b" />
              <rect x="420" y="130" width="60" height="90" fill="#4a4e69" />
              <rect x="500" y="180" width="30" height="40" fill="#39375b" />
              <rect x="540" y="150" width="50" height="70" fill="#4a4e69" />
              <rect x="610" y="170" width="40" height="50" fill="#39375b" />
              <rect x="670" y="120" width="60" height="100" fill="#4a4e69" />
              <rect x="750" y="180" width="30" height="40" fill="#39375b" />
              <rect x="790" y="140" width="50" height="80" fill="#4a4e69" />
              <rect x="860" y="170" width="40" height="50" fill="#39375b" />
              <rect x="920" y="120" width="60" height="100" fill="#4a4e69" />
              <rect x="1000" y="180" width="30" height="40" fill="#39375b" />
              <rect x="1040" y="150" width="50" height="70" fill="#4a4e69" />
              <rect x="1110" y="170" width="40" height="50" fill="#39375b" />
              <rect x="1170" y="160" width="40" height="60" fill="#4a4e69" />
              <rect x="1220" y="180" width="30" height="40" fill="#39375b" />
              {/* Windows */}
              {Array.from({ length: 40 }).map((_, i) => (
                <rect key={i} x={90 + (i * 32) % 1300} y={130 + (i * 17) % 120} width="6" height="12" rx="2" fill="#ffe066" opacity={0.7 + 0.3 * Math.sin(i)} />
              ))}
            </svg>
          );
        }
        return null;
      })()}
      
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