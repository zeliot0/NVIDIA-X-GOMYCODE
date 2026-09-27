import React from 'react';

export default function FalconLogo({ className = 'w-10 h-10', glow = true }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {glow && (
        <div className="absolute inset-0 rounded-xl bg-emerald-500/20 blur-md pointer-events-none animate-pulse"></div>
      )}
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10 drop-shadow-[0_2px_8px_rgba(16,185,129,0.4)]"
      >
        <defs>
          <linearGradient id="falconGradient" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="eyeGradient" x1="20" y1="18" x2="28" y2="26" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#a7f3d0" />
          </linearGradient>
        </defs>

        {/* Outer Angular Geometric Hawk Shield / Wings */}
        <path
          d="M24 4L38 10L42 22L36 34L24 44L12 34L6 22L10 10L24 4Z"
          fill="#0c131a"
          stroke="url(#falconGradient)"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Dynamic Swept Wing Cuts */}
        <path
          d="M10 12L24 8L38 12L40 21L34 18L24 23L14 18L8 21L10 12Z"
          fill="url(#falconGradient)"
          opacity="0.9"
        />

        {/* Falcon Beak & Center Armor Plating */}
        <path
          d="M24 22L31 28L24 40L17 28L24 22Z"
          fill="#070a0e"
          stroke="url(#falconGradient)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Hawk Beak Sharp Talon Tip */}
        <path
          d="M24 28L27 34L24 38L21 34L24 28Z"
          fill="url(#falconGradient)"
        />

        {/* Cyber Hawk Eye (Targeting Lens) */}
        <polygon
          points="24,14 28,19 24,24 20,19"
          fill="url(#eyeGradient)"
          className="animate-pulse"
        />
        <circle cx="24" cy="19" r="1.5" fill="#047857" />

        {/* Angular Wing Accents Left & Right */}
        <path
          d="M14 24L8 26L13 32L18 29"
          stroke="#10b981"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M34 24L40 26L35 32L30 29"
          stroke="#10b981"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
