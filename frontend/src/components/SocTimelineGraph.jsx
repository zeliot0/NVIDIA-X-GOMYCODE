import React, { useState } from 'react';
import { Activity, TrendingUp, AlertTriangle, ShieldCheck, Clock, Zap } from 'lucide-react';

export default function SocTimelineGraph() {
  const [activeRange, setActiveRange] = useState('24h');
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // 24-hour telemetry curve data
  const data24h = [
    { time: '00:00', total: 12, critical: 1, high: 3, label: 'Botnet probe' },
    { time: '02:00', total: 8, critical: 0, high: 2, label: 'Port scan' },
    { time: '04:00', total: 5, critical: 0, high: 1, label: 'Low background' },
    { time: '06:00', total: 14, critical: 2, high: 4, label: 'Morning credential spray' },
    { time: '08:00', total: 38, critical: 8, high: 12, label: 'Phishing email campaign burst' },
    { time: '10:00', total: 45, critical: 11, high: 15, label: 'Bank fraud SMS wave' },
    { time: '12:00', total: 32, critical: 6, high: 10, label: 'Fake invoice attachments' },
    { time: '14:00', total: 54, critical: 14, high: 18, label: 'Peak: Web3 drainer & quishing' },
    { time: '16:00', total: 41, critical: 9, high: 14, label: 'Spearphishing attempts' },
    { time: '18:00', total: 29, critical: 5, high: 9, label: 'AI voice vishing call' },
    { time: '20:00', total: 22, critical: 3, high: 7, label: 'Social media impersonation' },
    { time: '22:00', total: 16, critical: 2, high: 5, label: 'Password stuffing retry' }
  ];

  // 7-day telemetry curve data
  const data7d = [
    { time: 'Mon', total: 184, critical: 32, high: 54, label: 'Payroll phishing campaign' },
    { time: 'Tue', total: 242, critical: 48, high: 72, label: 'Ransomware document wave' },
    { time: 'Wed', total: 198, critical: 38, high: 61, label: 'Bank SMS impersonation' },
    { time: 'Thu', total: 310, critical: 64, high: 95, label: 'Peak: Zero-day exploit probe' },
    { time: 'Fri', total: 275, critical: 52, high: 88, label: 'Weekend crypto drainer surge' },
    { time: 'Sat', total: 145, critical: 21, high: 44, label: 'Quishing QR meter stickers' },
    { time: 'Sun', total: 128, critical: 18, high: 39, label: 'Off-hours background noise' }
  ];

  const currentData = activeRange === '24h' ? data24h : data7d;
  const maxVal = Math.max(...currentData.map((d) => d.total));

  // Generate SVG path for smooth line and area fill
  const width = 800;
  const height = 220;
  const paddingX = 40;
  const paddingY = 30;

  const points = currentData.map((d, i) => {
    const x = paddingX + (i / (currentData.length - 1)) * (width - 2 * paddingX);
    const y = height - paddingY - (d.total / maxVal) * (height - 2 * paddingY);
    return { x, y, ...d };
  });

  const linePath = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  return (
    <div className="cyber-card rounded-3xl p-6 sm:p-8 space-y-6 border">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              SIEM Event Ingestion Stream
            </span>
          </div>
          <h3 className="text-xl font-black tracking-tight mt-1 flex items-center space-x-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <span>Interactive Threat Volume & Velocity Graph</span>
          </h3>
          <p className="text-xs opacity-70">
            Real-time telemetry showing intercepted attacks, velocity bursts, and temporal anomaly spikes.
          </p>
        </div>

        {/* Range Selector */}
        <div className="flex items-center space-x-2 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => { setActiveRange('24h'); setHoveredPoint(null); }}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              activeRange === '24h'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            24 Hours
          </button>
          <button
            onClick={() => { setActiveRange('7d'); setHoveredPoint(null); }}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              activeRange === '7d'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            7 Days
          </button>
        </div>
      </div>

      {/* SVG Interactive Line Chart */}
      <div className="relative w-full rounded-2xl bg-slate-950/80 border border-slate-800 p-4 overflow-hidden">
        {/* Hover inspection badge */}
        {hoveredPoint && (
          <div
            className="absolute z-20 pointer-events-none p-3 rounded-xl bg-slate-900/95 border border-cyan-500 text-xs shadow-2xl space-y-1 transition-all"
            style={{
              left: `${Math.min(Math.max((hoveredPoint.x / width) * 100, 15), 85)}%`,
              top: '15px',
              transform: 'translateX(-50%)'
            }}
          >
            <div className="flex items-center justify-between space-x-3">
              <span className="font-mono font-bold text-cyan-400">{hoveredPoint.time}</span>
              <span className="font-black text-rose-400">{hoveredPoint.total} threats</span>
            </div>
            <div className="text-[11px] opacity-75">{hoveredPoint.label}</div>
            <div className="flex items-center space-x-2 text-[10px] font-mono pt-0.5">
              <span className="text-rose-400">Critical: {hoveredPoint.critical}</span>
              <span className="text-amber-400">High: {hoveredPoint.high}</span>
            </div>
          </div>
        )}

        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48 sm:h-56">
          <defs>
            <linearGradient id="cyberAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#0284c7" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="cyberLineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>

          {/* Grid horizontal guidelines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
            const y = height - paddingY - pct * (height - 2 * paddingY);
            return (
              <g key={idx}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#334155"
                  strokeWidth="0.8"
                  strokeDasharray="4 4"
                  opacity="0.4"
                />
                <text
                  x={paddingX - 10}
                  y={y + 4}
                  fill="#64748b"
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="end"
                >
                  {Math.round(pct * maxVal)}
                </text>
              </g>
            );
          })}

          {/* Shaded Area */}
          <path d={areaPath} fill="url(#cyberAreaGrad)" />

          {/* Main Line */}
          <path
            d={linePath}
            fill="none"
            stroke="url(#cyberLineGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Interactive Data Points */}
          {points.map((p, idx) => (
            <g key={idx} className="cursor-pointer">
              <circle
                cx={p.x}
                cy={p.y}
                r="4.5"
                fill="#0f172a"
                stroke="#38bdf8"
                strokeWidth="2.5"
                className="transition-transform hover:scale-150"
                onMouseEnter={() => setHoveredPoint(p)}
              />
              {/* X Axis Time Labels */}
              <text
                x={p.x}
                y={height - 8}
                fill="#94a3b8"
                fontSize="10"
                fontFamily="monospace"
                textAnchor="middle"
              >
                {p.time}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Metric Cards Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-xs uppercase font-mono opacity-60">Peak Ingestion Rate</span>
          <div className="text-2xl font-black text-cyan-400">1,842 eps</div>
          <p className="text-[11px] opacity-60">Events processed per second</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-xs uppercase font-mono opacity-60">Threat Neutralization</span>
          <div className="text-2xl font-black text-emerald-400">100.0%</div>
          <p className="text-[11px] opacity-60">Zero uncontained intrusions</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-xs uppercase font-mono opacity-60">Mean Time to Detect (MTTD)</span>
          <div className="text-2xl font-black text-blue-400">380 ms</div>
          <p className="text-[11px] opacity-60">Instant heuristic & Groq AI inference</p>
        </div>
      </div>
    </div>
  );
}
