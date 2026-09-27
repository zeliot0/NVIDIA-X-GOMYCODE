import React from 'react';
import { ShieldCheck, AlertCircle, AlertTriangle, Flame } from 'lucide-react';

export default function RiskBadge({ risk, size = 'md' }) {
  const normalized = (risk || 'LOW').toUpperCase();

  const configs = {
    CRITICAL: {
      label: 'CRITICAL RISK',
      icon: Flame,
      bg: 'bg-rose-950/60',
      border: 'border-rose-600',
      text: 'text-rose-400',
      glow: 'shadow-rose-900/30 shadow-md',
    },
    HIGH: {
      label: 'HIGH RISK',
      icon: AlertTriangle,
      bg: 'bg-amber-950/60',
      border: 'border-amber-600',
      text: 'text-amber-400',
      glow: 'shadow-amber-900/30 shadow-md',
    },
    MEDIUM: {
      label: 'MEDIUM RISK',
      icon: AlertCircle,
      bg: 'bg-yellow-950/60',
      border: 'border-yellow-600',
      text: 'text-yellow-400',
      glow: 'shadow-yellow-900/30 shadow-md',
    },
    LOW: {
      label: 'LOW RISK',
      icon: ShieldCheck,
      bg: 'bg-emerald-950/60',
      border: 'border-emerald-600',
      text: 'text-emerald-400',
      glow: 'shadow-emerald-900/30 shadow-md',
    },
  };

  const current = configs[normalized] || configs.LOW;
  const Icon = current.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs space-x-1',
    md: 'px-3 py-1 text-xs sm:text-sm space-x-1.5',
    lg: 'px-4 py-1.5 text-sm sm:text-base space-x-2 font-bold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold border ${current.bg} ${current.border} ${current.text} ${current.glow} ${sizeClasses[size] || sizeClasses.md}`}
    >
      <Icon className={size === 'lg' ? 'w-5 h-5' : size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
      <span className="tracking-wide">{current.label}</span>
    </span>
  );
}
