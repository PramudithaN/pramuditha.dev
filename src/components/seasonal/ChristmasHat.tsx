import React from 'react';

interface ChristmasHatProps {
  className?: string;
  style?: React.CSSProperties;
}

export const ChristmasHat: React.FC<ChristmasHatProps> = ({ className = '', style }) => {
  return (
    <svg
      className={`seasonal-brand-hat ${className}`}
      style={style}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="brandHatRed" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff3333" />
          <stop offset="100%" stopColor="#b30000" />
        </linearGradient>
      </defs>
      {/* Red Cone with fold */}
      <path
        d="M14 42 C18 20 40 10 52 16 C55 20 54 28 50 34 Z"
        fill="url(#brandHatRed)"
      />
      {/* Folded tip */}
      <path
        d="M52 16 C58 22 56 32 48 34 Z"
        fill="#990000"
      />
      {/* White Fur Brim */}
      <rect
        x="10"
        y="38"
        width="40"
        height="10"
        rx="5"
        fill="#ffffff"
        filter="drop-shadow(0 2px 3px rgba(0,0,0,0.2))"
      />
      {/* Pom-Pom */}
      <circle
        cx="53"
        cy="34"
        r="6.5"
        fill="#ffffff"
        filter="drop-shadow(0 2px 3px rgba(0,0,0,0.18))"
      />
    </svg>
  );
};
