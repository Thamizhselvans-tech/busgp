import React from 'react';

interface EmblemProps {
  className?: string;
  size?: number;
  imageSrc?: string;
}

export const TamilNaduEmblem: React.FC<EmblemProps> = ({ className = 'w-12 h-12', size = 48, imageSrc }) => {
  if (imageSrc) {
    return (
      <img
        src={imageSrc}
        alt="Tamil Nadu Government Bus Logo"
        style={{ width: size, height: size }}
        className={`object-contain rounded-full border-2 border-amber-400 shadow-xs ${className}`}
      />
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Circular Seal Badge */}
      <circle cx="100" cy="100" r="96" fill="#047857" stroke="#d97706" strokeWidth="5" />
      <circle cx="100" cy="100" r="88" fill="#065f46" stroke="#fbbf24" strokeWidth="2.5" />
      <circle cx="100" cy="100" r="85" stroke="#ffffff" strokeWidth="1" strokeDasharray="3 3" opacity="0.7" />

      {/* Sunburst Rays */}
      <g stroke="#fbbf24" strokeWidth="1.5" opacity="0.4">
        <line x1="100" y1="18" x2="100" y2="30" />
        <line x1="30" y1="100" x2="18" y2="100" />
        <line x1="170" y1="100" x2="182" y2="100" />
        <line x1="42" y1="42" x2="52" y2="52" />
        <line x1="158" y1="42" x2="148" y2="52" />
      </g>

      {/* Top Tamil Nadu Temple Gopuram Silhouette */}
      <g transform="translate(0, -10)">
        {/* Gopuram Tiers */}
        <path d="M78 85 L84 45 L116 45 L122 85 Z" fill="#fbbf24" stroke="#ffffff" strokeWidth="1" />
        <path d="M82 65 L86 35 L114 35 L118 65 Z" fill="#f59e0b" />
        <path d="M88 45 L91 25 L109 25 L112 45 Z" fill="#fbbf24" />
        <rect x="94" y="52" width="12" height="15" fill="#065f46" rx="4" />
        <rect x="96" y="32" width="8" height="10" fill="#065f46" rx="3" />
        {/* Gopuram Finials (Kalasam) */}
        <circle cx="94" cy="20" r="2.5" fill="#fbbf24" />
        <circle cx="100" cy="17" r="3.5" fill="#fbbf24" />
        <circle cx="106" cy="20" r="2.5" fill="#fbbf24" />
      </g>

      {/* Government Bus Silhouette / Front View */}
      <g transform="translate(0, 10)">
        {/* Bus Body Outer Frame */}
        <rect x="48" y="82" width="104" height="72" rx="10" fill="#1e3a8a" stroke="#fbbf24" strokeWidth="3" />
        {/* Bus Top Header / Destination Box */}
        <rect x="58" y="87" width="84" height="14" rx="3" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
        <text x="100" y="97" textAnchor="middle" fill="#38bdf8" fontSize="8" fontWeight="bold" fontFamily="sans-serif">
          TNSTC • EXPRESS
        </text>

        {/* Bus Windshield Glass */}
        <rect x="54" y="104" width="92" height="26" rx="4" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
        {/* Windshield Reflection */}
        <path d="M58 106 L80 106 L62 128 L58 128 Z" fill="#ffffff" opacity="0.35" />

        {/* Wipers */}
        <line x1="75" y1="126" x2="88" y2="114" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="115" y1="126" x2="128" y2="114" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />

        {/* Bus Lower Bumper & Grill */}
        <rect x="52" y="133" width="96" height="18" rx="4" fill="#1e293b" stroke="#64748b" strokeWidth="1" />

        {/* Dual Headlights (Left & Right) */}
        <circle cx="64" cy="142" r="5.5" fill="#fef08a" stroke="#ffffff" strokeWidth="1.5" />
        <circle cx="64" cy="142" r="3" fill="#ffffff" />
        <circle cx="136" cy="142" r="5.5" fill="#fef08a" stroke="#ffffff" strokeWidth="1.5" />
        <circle cx="136" cy="142" r="3" fill="#ffffff" />

        {/* Center License Plate */}
        <rect x="82" y="138" width="36" height="8" rx="2" fill="#fbbf24" stroke="#000000" strokeWidth="1" />
        <text x="100" y="144.5" textAnchor="middle" fill="#000000" fontSize="5.5" fontWeight="900" fontFamily="monospace">
          TN 63 N 2093
        </text>
      </g>

      {/* Tamil Nadu / Tricolor Ribbon Badge Accent */}
      <path d="M50 174 Q100 186 150 174" fill="none" stroke="#fbbf24" strokeWidth="3" />
      <rect x="70" y="176" width="60" height="3" fill="#f97316" />
      <rect x="70" y="179" width="60" height="3" fill="#ffffff" />
      <rect x="70" y="182" width="60" height="3" fill="#16a34a" />
    </svg>
  );
};
