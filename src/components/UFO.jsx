import React from 'react';

const UFO = ({ ufo }) => {
  // UFO body and beam
  return (
    <div
      className="absolute z-30 pointer-events-none transition-transform duration-300"
      style={{
        left: `${ufo.x}px`,
        top: `${ufo.y}px`,
        width: '80px',
        height: '48px',
        // Use transform for smoother movement
        transform: `translateX(0)`
      }}
    >
      {/* UFO body (SVG for style) */}
      <svg width="80" height="48" viewBox="0 0 80 48" fill="none">
        <ellipse cx="40" cy="32" rx="32" ry="12" fill="#b2bec3" />
        <ellipse cx="40" cy="24" rx="24" ry="10" fill="#636e72" />
        <ellipse cx="40" cy="20" rx="14" ry="7" fill="#dfe6e9" />
        {/* Lights */}
        <circle cx="20" cy="32" r="3" fill="#00b894" />
        <circle cx="60" cy="32" r="3" fill="#fdcb6e" />
        <circle cx="40" cy="40" r="3" fill="#00b894" />
      </svg>
      {/* Beam when dropping */}
      {ufo.isDropping && (
        <div
          className="absolute left-1/2 transform -translate-x-1/2"
          style={{
            top: '44px',
            width: '24px',
            height: `${ufo.dropY - ufo.y - 44}px`,
            background: 'linear-gradient(to bottom, rgba(0,255,255,0.4), rgba(0,255,255,0.1) 80%, transparent)',
            borderRadius: '12px',
            zIndex: 1,
            pointerEvents: 'none',
            transition: 'height 0.08s linear',
          }}
        />
      )}
    </div>
  );
};

export default UFO; 