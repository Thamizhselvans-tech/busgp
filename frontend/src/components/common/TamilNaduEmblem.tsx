import React from 'react';

interface EmblemProps {
  className?: string;
  size?: number;
}

export const TamilNaduEmblem: React.FC<EmblemProps> = ({ className = 'w-12 h-12', size = 48 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Circular Seal */}
      <circle cx="100" cy="100" r="94" fill="#047857" stroke="#fbbf24" strokeWidth="6" />
      <circle cx="100" cy="100" r="84" fill="#065f46" stroke="#ffffff" strokeWidth="2" />

      {/* Sunburst / Rays */}
      <g stroke="#fbbf24" strokeWidth="2" opacity="0.6">
        <line x1="100" y1="30" x2="100" y2="45" />
        <line x1="100" y1="155" x2="100" y2="170" />
        <line x1="30" y1="100" x2="45" y2="100" />
        <line x1="155" y1="100" x2="170" y2="100" />
        <line x1="50" y1="50" x2="60" y2="60" />
        <line x1="150" y1="150" x2="140" y2="140" />
        <line x1="150" y1="50" x2="140" y2="60" />
        <line x1="50" y1="150" x2="60" y2="140" />
      </g>

      {/* Srivilliputhur Gopuram / Temple Tower Silhouette */}
      {/* Base Foundation */}
      <rect x="60" y="145" width="80" height="12" fill="#fbbf24" rx="2" />
      {/* Tier 1 */}
      <path d="M66 145 L70 120 L130 120 L134 145 Z" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
      <rect x="92" y="128" width="16" height="17" fill="#1e293b" rx="8" />
      {/* Tier 2 */}
      <path d="M72 120 L76 100 L124 100 L128 120 Z" fill="#fbbf24" stroke="#ffffff" strokeWidth="1" />
      <rect x="94" y="106" width="12" height="14" fill="#1e293b" rx="6" />
      {/* Tier 3 */}
      <path d="M78 100 L82 82 L118 82 L122 100 Z" fill="#f59e0b" stroke="#ffffff" strokeWidth="1" />
      <rect x="95" y="87" width="10" height="13" fill="#1e293b" rx="5" />
      {/* Tier 4 */}
      <path d="M84 82 L87 68 L113 68 L116 82 Z" fill="#fbbf24" stroke="#ffffff" strokeWidth="1" />
      {/* Top Dome & Kalasam finials */}
      <path d="M88 68 C88 56 112 56 112 68 Z" fill="#f59e0b" />
      <line x1="94" y1="56" x2="94" y2="48" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
      <line x1="100" y1="54" x2="100" y2="44" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" />
      <line x1="106" y1="56" x2="106" y2="48" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />

      {/* Indian National Flag Ribbon / Emblem Accent */}
      <rect x="75" y="160" width="50" height="4" fill="#f97316" />
      <rect x="75" y="164" width="50" height="4" fill="#ffffff" />
      <rect x="75" y="168" width="50" height="4" fill="#16a34a" />
      <circle cx="100" cy="166" r="2" fill="#1e3a8a" />
    </svg>
  );
};
