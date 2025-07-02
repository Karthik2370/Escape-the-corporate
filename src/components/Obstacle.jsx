import React from 'react';

const Obstacle = ({ obstacle }) => {
  const { config } = obstacle;
  const isPulsing = config.priority === 'critical';
  const isDuckObstacle = obstacle.obstacleType === 'duck';

  return (
    <div
      className="absolute flex flex-col items-center justify-center text-white font-bold text-xs rounded-lg shadow-lg z-10"
      style={{
        left: `${obstacle.x}px`,
        top: `${obstacle.y}px`,
        width: `${obstacle.width}px`,
        height: `${obstacle.height}px`,
        background: `linear-gradient(135deg, ${config.color} 0%, ${config.shadow} 100%)`,
        border: '2px solid rgba(255,255,255,0.2)',
        boxShadow: `
          0 4px 15px rgba(0,0,0,0.3), 
          0 0 15px ${config.glow}
          ${isDuckObstacle ? ', 0 0 25px rgba(255,255,255,0.3)' : ''}
        `,
        animation: isPulsing ? 'pulse 1s ease-in-out infinite' : 'none',
        transform: isDuckObstacle ? 'scale(1.05)' : 'scale(1)'
      }}
    >
      <div 
        className="text-xl mb-1"
        style={{
          animation: isDuckObstacle ? 'bounce 2s ease-in-out infinite' : 'none'
        }}
      >
        {config.icon}
      </div>
      <div className="text-center text-xs font-bold leading-tight">{config.title}</div>
      
      {/* Duck obstacle indicator */}
      {isDuckObstacle && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
          <div className="text-xs bg-yellow-400 text-black px-2 py-1 rounded-full font-bold animate-pulse">
            DUCK!
          </div>
        </div>
      )}
      
      {/* Critical priority indicator */}
      {isPulsing && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
      )}
      
      {/* Floating effect for duck obstacles */}
      {isDuckObstacle && (
        <div 
          className="absolute inset-0 rounded-lg border-2 border-white opacity-30"
          style={{
            animation: 'pulse 1.5s ease-in-out infinite'
          }}
        />
      )}
    </div>
  );
};

export default Obstacle;