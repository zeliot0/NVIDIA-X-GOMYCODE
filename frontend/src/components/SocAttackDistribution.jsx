import React, { useState } from 'react';
import { ShieldCheck, Crosshair, Cpu, Database, Eye, Terminal, Zap, Activity } from 'lucide-react';

export default function SocAttackDistribution() {
  const [activeTab, setActiveTab] = useState('vectors');

  // Attack Vector distribution breakdown
  const attackVectors = [
    { name: 'Spearphishing & BEC', pct: 38, count: 712, trend: '+14%', color: 'from-rose-500 to-rose-600', fill: '#f43f5e' },
    { name: 'Quishing (Malicious QR)', pct: 24, count: 448, trend: '+28%', color: 'from-amber-500 to-amber-600', fill: '#f59e0b' },
    { name: 'Web3 & Wallet Drainers', pct: 18, count: 336, trend: '-4%', color: 'from-purple-500 to-purple-600', fill: '#a855f7' },
    { name: 'AI Voice Cloning (Vishing)', pct: 12, count: 224, trend: '+42%', color: 'from-cyan-500 to-cyan-600', fill: '#06b6d4' },
    { name: 'Zero-Day / CVE Probes', pct: 8, count: 149, trend: '+9%', color: 'from-emerald-500 to-emerald-600', fill: '#10b981' },
  ];

  // Defensive Kill-Chain stage metrics
  const killChainStages = [
    { stage: 'Reconnaissance', blocked: '1,420 probes', efficiency: '99.4%', status: 'PREVENTED' },
    { stage: 'Weaponization', blocked: '892 artifacts', efficiency: '98.8%', status: 'NEUTRALIZED' },
    { stage: 'Delivery (Email/SMS)', blocked: '1,180 lures', efficiency: '99.9%', status: 'SINKHOLED' },
    { stage: 'Exploitation / C2', blocked: '42 callbacks', efficiency: '100.0%', status: 'ISOLATED' },
  ];

  // SVG Donut calculation
  const size = 180;
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedOffset = 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Visual Donut Chart Card */}
      <div className="lg:col-span-7 cyber-card rounded-3xl p-6 sm:p-8 space-y-6 border relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center space-x-1.5">
              <Crosshair className="w-3.5 h-3.5" />
              <span>Adversary Vector Distribution</span>
            </span>
            <h3 className="text-xl font-black tracking-tight mt-1 text-slate-100">
              Attack Surface Volume Breakdown
            </h3>
          </div>

          <div className="flex items-center space-x-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs font-mono">
            <span className="px-2.5 py-1 text-cyan-400 font-bold">1,869 Incursions</span>
          </div>
        </div>

        {/* Donut Chart + Vector Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
          {/* Interactive SVG Donut */}
          <div className="sm:col-span-5 flex flex-col items-center justify-center relative">
            <svg width={size} height={size} className="transform -rotate-90">
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="rgba(30, 41, 59, 0.6)"
                strokeWidth={strokeWidth}
              />
              {attackVectors.map((v, idx) => {
                const strokeDasharray = `${(v.pct / 100) * circumference} ${circumference}`;
                const strokeDashoffset = -accumulatedOffset;
                accumulatedOffset += (v.pct / 100) * circumference;

                return (
                  <circle
                    key={idx}
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={v.fill}
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-700 hover:opacity-80"
                    strokeLinecap="round"
                  />
                );
              })}
            </svg>

            {/* Inner Ring Data Badge */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black font-mono text-cyan-400">99.8%</span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 font-mono">
                Intercepted
              </span>
            </div>
          </div>

          {/* Vector Progress Bars */}
          <div className="sm:col-span-7 space-y-3">
            {attackVectors.map((v, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-semibold text-slate-200 flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: v.fill }}></span>
                    <span>{v.name}</span>
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400">{v.count} evts</span>
                    <span className="font-black text-slate-100">{v.pct}%</span>
                    <span className={`text-[10px] font-bold ${v.trend.startsWith('+') ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {v.trend}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-900/80 rounded-full h-1.5 overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${v.color}`}
                    style={{ width: `${v.pct}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Defensive Cyber Kill Chain Card */}
      <div className="lg:col-span-5 cyber-card rounded-3xl p-6 sm:p-8 space-y-6 border relative overflow-hidden flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Lockheed Martin Kill Chain</span>
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
              ACTIVE SHIELD
            </span>
          </div>
          <h3 className="text-xl font-black tracking-tight mt-1 text-slate-100">
            Automated Neutralization Stages
          </h3>
          <p className="text-xs opacity-70 mt-1">
            Real-time containment at each critical adversarial progression milestone.
          </p>
        </div>

        <div className="space-y-3 my-2">
          {killChainStages.map((kc, idx) => (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <div className="w-7 h-7 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-mono font-bold text-cyan-400">
                  0{idx + 1}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-200 block">{kc.stage}</span>
                  <span className="text-[10px] font-mono text-slate-400">{kc.blocked}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-black text-emerald-400 block">{kc.efficiency}</span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                  {kc.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Real-time Hardware Telemetry Indicator */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 to-cyan-950/40 border border-cyan-800/40 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Cpu className="w-4 h-4 text-cyan-400 animate-pulse" />
            <div>
              <span className="text-xs font-bold block text-slate-200">Autonomous SIEM Correlator</span>
              <span className="text-[10px] font-mono text-cyan-300">NVIDIA Brev L40S & Groq LPUs Active</span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            0.42ms MTTD
          </span>
        </div>
      </div>
    </div>
  );
}
