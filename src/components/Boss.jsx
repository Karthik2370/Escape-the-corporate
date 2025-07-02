import React from 'react';

const Boss = ({ boss }) => {
  const { config } = boss;
  const isDestroyed = boss.destroyed;
  const isShooting = boss.isShooting;
  
  if (isDestroyed) return null;

  return (
    <div className="absolute z-15">
      {/* Boss Character */}
      <div
        className="absolute flex flex-col items-center justify-center rounded-lg shadow-2xl"
        style={{
          left: `${boss.x}px`,
          top: `${boss.y}px`,
          width: `${boss.width}px`,
          height: `${boss.height}px`,
          background: `linear-gradient(135deg, ${config.color} 0%, ${config.shadow} 100%)`,
          border: '3px solid rgba(255,0,0,0.5)',
          boxShadow: `
            0 8px 25px rgba(0,0,0,0.4), 
            0 0 30px ${config.glow},
            inset 0 0 20px rgba(255,255,255,0.1)
          `,
          animation: isShooting ? 'pulse 0.5s ease-in-out infinite' : 'none'
        }}
      >
        {/* Devil Boss Body */}
        <div className="relative w-full h-full flex flex-col items-center justify-center">
          
          {/* Horns */}
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 flex gap-4">
            <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-red-800 transform rotate-12"></div>
            <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-red-800 transform -rotate-12"></div>
          </div>

          {/* Head */}
          <div className="relative bg-gradient-to-br from-red-600 to-red-800 rounded-full w-16 h-16 border-2 border-red-900 mb-2">
            {/* Eyes */}
            <div className="absolute top-3 left-3 w-3 h-3 bg-yellow-400 rounded-full animate-pulse">
              <div className="absolute top-0.5 left-0.5 w-2 h-2 bg-red-600 rounded-full"></div>
            </div>
            <div className="absolute top-3 right-3 w-3 h-3 bg-yellow-400 rounded-full animate-pulse">
              <div className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-600 rounded-full"></div>
            </div>
            
            {/* Mouth */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-2 bg-black rounded-full">
              {/* Fangs */}
              <div className="absolute -top-1 left-1 w-0 h-0 border-l-1 border-r-1 border-b-2 border-l-transparent border-r-transparent border-b-white"></div>
              <div className="absolute -top-1 right-1 w-0 h-0 border-l-1 border-r-1 border-b-2 border-l-transparent border-r-transparent border-b-white"></div>
            </div>
          </div>

          {/* Body */}
          <div className="bg-gradient-to-br from-red-700 to-red-900 rounded-lg w-12 h-8 border-2 border-red-900 mb-1">
            {/* Chest detail */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-yellow-500 rounded-full"></div>
          </div>

          {/* Arms */}
          <div className="absolute top-1/2 -left-2 w-8 h-3 bg-gradient-to-r from-red-600 to-red-700 rounded-full border border-red-800 transform -rotate-12">
            {/* Gun */}
            {isShooting && (
              <div className="absolute -right-6 top-1/2 transform -translate-y-1/2 w-8 h-2 bg-gray-800 rounded-sm border border-gray-900">
                <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-1 bg-gray-600 rounded-sm"></div>
                {/* Muzzle flash */}
                <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 text-yellow-400 text-xs animate-ping">💥</div>
              </div>
            )}
          </div>
          <div className="absolute top-1/2 -right-2 w-8 h-3 bg-gradient-to-l from-red-600 to-red-700 rounded-full border border-red-800 transform rotate-12"></div>

          {/* Legs */}
          <div className="absolute -bottom-2 left-1/4 w-4 h-6 bg-gradient-to-b from-red-700 to-red-900 rounded-lg border border-red-900"></div>
          <div className="absolute -bottom-2 right-1/4 w-4 h-6 bg-gradient-to-b from-red-700 to-red-900 rounded-lg border border-red-900"></div>

          {/* Tail */}
          <div className="absolute -right-4 bottom-4 w-8 h-2 bg-gradient-to-r from-red-700 to-red-800 rounded-full border border-red-900 transform rotate-45">
            <div className="absolute -right-1 -top-1 w-0 h-0 border-l-2 border-r-2 border-b-3 border-l-transparent border-r-transparent border-b-red-800"></div>
          </div>
        </div>

        {/* Boss Title */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-red-800 text-white px-3 py-1 rounded-full text-xs font-bold border-2 border-red-600 animate-pulse">
          DEVIL BOSS
        </div>

        {/* Shooting indicator */}
        {isShooting && (
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold animate-bounce">
            DUCK NOW!
          </div>
        )}
      </div>

      {/* Bullets */}
      {boss.bullets && boss.bullets.map(bullet => (
        <div
          key={bullet.id}
          className="absolute bg-yellow-400 rounded-full border border-yellow-600 z-20"
          style={{
            left: `${bullet.x}px`,
            top: `${bullet.y}px`,
            width: `${bullet.width}px`,
            height: `${bullet.height}px`,
            boxShadow: '0 0 8px rgba(255, 255, 0, 0.6)'
          }}
        >
          {/* Bullet trail */}
          <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 w-4 h-0.5 bg-yellow-300 opacity-60 rounded-full"></div>
        </div>
      ))}

      {/* Boss aura effect */}
      <div 
        className="absolute rounded-lg border-2 border-red-500 opacity-30 animate-pulse"
        style={{
          left: `${boss.x - 10}px`,
          top: `${boss.y - 10}px`,
          width: `${boss.width + 20}px`,
          height: `${boss.height + 20}px`,
        }}
      />
    </div>
  );
};

export default Boss;