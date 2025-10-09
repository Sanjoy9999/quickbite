import React from 'react';
import './scooterLoader.css';

export default function ScooterLoaderInline({ size = 96, speed = '2.4s' }) {
  const style = {
    '--loader-size': `${size}px`,
    '--loader-speed': speed,
  };

  // Simple lightweight scooter-ish SVG. Repeated twice in the track for a looping animation.
  const ScooterSVG = ({ className = 'scooter-img' }) => (
    <svg
      className={className}
      width={size}
      height={Math.round(size * 0.6)}
      viewBox="0 0 200 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect x="0" y="60" width="200" height="20" rx="10" fill="#F3F4F6" />
      <g transform="translate(10,0)">
        <circle cx="36" cy="88" r="12" fill="#111827" />
        <circle cx="36" cy="88" r="8" fill="#9CA3AF" />
        <circle cx="120" cy="88" r="12" fill="#111827" />
        <circle cx="120" cy="88" r="8" fill="#9CA3AF" />
        <path d="M20 70 L40 50 L90 50 L110 40" stroke="#111827" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <rect x="92" y="28" width="60" height="22" rx="8" fill="#F59E0B" />
        <path d="M70 40 q30 -20 60 -10" stroke="#111827" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>
    </svg>
  );

  return (
    <div className="scooter-loader" style={style}>
      <div className="scooter-track" aria-hidden>
        <ScooterSVG />
        <ScooterSVG />
      </div>
    </div>
  );
}
