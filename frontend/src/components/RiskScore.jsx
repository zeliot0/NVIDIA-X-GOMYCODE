import React from 'react';

export default function RiskScore({ score = 0, risk = 'LOW', size = 'normal' }) {
  const normalized = (risk || 'LOW').toUpperCase();
  const safeScore = Math.min(Math.max(score, 0), 100);

  const colorConfig = {
    CRITICAL: {
      bar: 'bg-gradient-to-r from-rose-600 to-red-500',
      text: 'text-rose-400',
      circle: '#f43f5e',
      border: 'border-rose-500/30',
    },
    HIGH: {
      bar: 'bg-gradient-to-r from-amber-600 to-orange-500',
      text: 'text-amber-400',
      circle: '#f97316',
      border: 'border-amber-500/30',
    },
    MEDIUM: {
      bar: 'bg-gradient-to-r from-yellow-500 to-amber-400',
      text: 'text-yellow-400',
      circle: '#eab308',
      border: 'border-yellow-500/30',
    },
    LOW: {
      bar: 'bg-gradient-to-r from-emerald-500 to-teal-400',
      text: 'text-emerald-400',
      circle: '#10b981',
      border: 'border-emerald-500/30',
    },
  };

  const current = colorConfig[normalized] || colorConfig.LOW;

  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Security Threat Score</span>
        <div className="flex items-baseline space-x-1">
          <span className={`text-3xl font-extrabold tracking-tight ${current.text}`}>{safeScore}</span>
          <span className="text-sm text-slate-500 font-medium">/ 100</span>
        </div>
      </div>

      {/* Progress Bar with glow */}
      <div className="relative w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${current.bar}`}
          style={{ width: `${safeScore}%` }}
        />
      </div>

      {/* Score Tier Markings */}
      <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
        <span>0 (Safe)</span>
        <span>25 (Medium)</span>
        <span>55 (High)</span>
        <span>80+ (Critical)</span>
      </div>
    </div>
  );
}
