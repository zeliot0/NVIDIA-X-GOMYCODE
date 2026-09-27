import React, { useState } from 'react';
import { Globe, Radio, Shield, AlertTriangle, Crosshair, Server, Eye, ExternalLink } from 'lucide-react';

export default function SocThreatMap() {
  const [selectedNode, setSelectedNode] = useState(null);

  const threatNodes = [
    {
      id: 'node-1',
      name: 'APT-29 / Cozy Bear Proxy Cluster',
      origin: 'Eastern Europe (55.75° N, 37.61° E)',
      category: 'Spearphishing & OAuth Hijacking',
      status: 'BLOCKED',
      frequency: '342 probes/hr',
      vector: 'T1566.002 - Spearphishing Link',
      cx: 62,
      cy: 28,
      color: '#f43f5e',
      details: 'Typo-squatted cloud infrastructure mimicking Microsoft 365 and Google Workspace authentication.'
    },
    {
      id: 'node-2',
      name: 'Lazarus Group Web3 Drainer Network',
      origin: 'East Asia (39.03° N, 125.76° E)',
      category: 'Permit2 & Smart Contract Drainers',
      status: 'SINKHOLED',
      frequency: '189 probes/hr',
      vector: 'T1059.007 - JavaScript / Web3 Infiltration',
      cx: 82,
      cy: 35,
      color: '#fbbf24',
      details: 'Distributed malicious RPC endpoints and counterfeit Uniswap/Blur airdrop claim contracts.'
    },
    {
      id: 'node-3',
      name: 'Gold Factory Vishing / AI Voice Call Hub',
      origin: 'Southeast Asia (13.75° N, 100.50° E)',
      category: 'Deepfake Audio & SIM Swap Telephony',
      status: 'INTERCEPTED',
      frequency: '512 calls/day',
      vector: 'T1598.003 - Phishing for Information (Voice)',
      cx: 75,
      cy: 52,
      color: '#38bdf8',
      details: 'Synthetic voice clones of bank fraud executives demanding OTP authorization codes.'
    },
    {
      id: 'node-4',
      name: 'FIN7 / Bulletproof Host Ingress',
      origin: 'Western Hemisphere (38.90° N, 77.03° W)',
      category: 'Fake Invoices & Document Macros',
      status: 'QUARANTINED',
      frequency: '94 drops/day',
      vector: 'T1204.002 - Malicious File Execution',
      cx: 25,
      cy: 34,
      color: '#a855f7',
      details: 'Exploitative DOCX and PDF attachments containing obfuscated PowerShell payloads.'
    },
    {
      id: 'node-5',
      name: 'Lethal Quishing QR Generator Syndicate',
      origin: 'Western Europe (48.85° N, 2.35° E)',
      category: 'Physical & Digital Quishing',
      status: 'DECODED & NEUTRALIZED',
      frequency: '231 scans/day',
      vector: 'T1566.003 - QR Code Redirection',
      cx: 50,
      cy: 30,
      color: '#34d399',
      details: 'Parking meter sticker replacements and fake package delivery slips with credential harvester links.'
    }
  ];

  return (
    <div className="cyber-card rounded-3xl p-6 sm:p-8 space-y-6 border relative overflow-hidden">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400">
              Live Threat Telemetry & Adversary Mapping
            </span>
          </div>
          <h3 className="text-xl font-black tracking-tight mt-1 flex items-center space-x-2">
            <Globe className="w-5 h-5 text-cyan-400" />
            <span>Global Cyber Threat Radar Map</span>
          </h3>
          <p className="text-xs opacity-70">
            Real-time tracking of active cybercrime syndicates, state-sponsored APTs, and automated botnets targeted at end users.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-cyan-300">
            Sensor Feed: <strong>ONLINE</strong> (12ms)
          </span>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-800/80 text-emerald-400">
            Defense: <strong>100% BLOCKED</strong>
          </span>
        </div>
      </div>

      {/* Interactive Map Visual Canvas */}
      <div className="relative w-full h-64 sm:h-80 rounded-2xl bg-slate-950/90 border border-slate-800/80 overflow-hidden flex items-center justify-center soc-grid">
        {/* Radar Sweep Circle overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="w-64 h-64 sm:w-96 sm:h-96 rounded-full border border-cyan-500/40 flex items-center justify-center">
            <div className="w-48 h-48 sm:w-72 sm:h-72 rounded-full border border-cyan-500/30 flex items-center justify-center">
              <div className="w-32 h-32 sm:w-48 sm:h-48 rounded-full border border-cyan-500/20"></div>
            </div>
          </div>
          <div className="absolute w-64 h-64 sm:w-96 sm:h-96 rounded-full overflow-hidden animate-radar">
            <div className="w-1/2 h-1/2 bg-gradient-to-br from-cyan-500/30 to-transparent"></div>
          </div>
        </div>

        {/* Global Grid Coordinates and Lines */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Target Central Node: Protected Endpoint (You) */}
          <circle cx="50%" cy="50%" r="6" fill="#38bdf8" />
          <circle cx="50%" cy="50%" r="14" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" className="animate-spin" style={{ animationDuration: '8s' }} />

          {/* Arcs from Threat Nodes to Center */}
          {threatNodes.map((n) => (
            <g key={n.id}>
              {/* Threat Path Line */}
              <line
                x1={`${n.cx}%`}
                y1={`${n.cy}%`}
                x2="50%"
                y2="50%"
                stroke={n.color}
                strokeWidth="1.2"
                strokeDasharray="4 4"
                opacity="0.5"
              />
              {/* Origin Circle */}
              <circle
                cx={`${n.cx}%`}
                cy={`${n.cy}%`}
                r="6"
                fill={n.color}
                className="cursor-pointer transition-transform hover:scale-150"
                onClick={() => setSelectedNode(n)}
              />
              {/* Pulse Ring */}
              <circle
                cx={`${n.cx}%`}
                cy={`${n.cy}%`}
                r="12"
                fill="none"
                stroke={n.color}
                strokeWidth="1"
                opacity="0.7"
              />
            </g>
          ))}
        </svg>

        {/* Node Hover Labels */}
        {threatNodes.map((n) => (
          <button
            key={n.id}
            onClick={() => setSelectedNode(n)}
            style={{ left: `${n.cx}%`, top: `${n.cy}%` }}
            className="absolute -translate-x-1/2 -translate-y-8 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-900/90 border border-slate-700 hover:border-cyan-400 hover:text-cyan-300 transition-all shadow-md z-10 flex items-center space-x-1"
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: n.color }}></span>
            <span>{n.name.split(' ')[0]}</span>
          </button>
        ))}

        {/* Center Tag: Protected User System */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-4 px-2.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-[10px] font-mono text-cyan-300 flex items-center space-x-1 shadow-lg pointer-events-none">
          <Shield className="w-3 h-3 text-cyan-400" />
          <span>SAFEAI PROTECTED ENDPOINT</span>
        </div>
      </div>

      {/* Node Inspection Drawer if selected */}
      {selectedNode ? (
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-800/60 space-y-3 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
            <div>
              <span className="text-xs uppercase font-mono font-bold text-cyan-400">Adversary Dossier</span>
              <h4 className="text-base font-bold text-white flex items-center space-x-2">
                <span>{selectedNode.name}</span>
                <span className="text-xs px-2 py-0.5 rounded font-mono bg-rose-950 border border-rose-800 text-rose-300 font-bold">
                  {selectedNode.status}
                </span>
              </h4>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800"
            >
              Close Dossier
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="opacity-60 uppercase text-[10px] block font-mono">Origin / Geolocation</span>
              <span className="font-semibold text-slate-200">{selectedNode.origin}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="opacity-60 uppercase text-[10px] block font-mono">Primary Attack Vector</span>
              <span className="font-semibold text-slate-200">{selectedNode.category}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="opacity-60 uppercase text-[10px] block font-mono">MITRE ATT&CK Mapping</span>
              <span className="font-mono text-cyan-300 font-bold">{selectedNode.vector}</span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
            <strong>Intelligence Profile: </strong>
            {selectedNode.details}
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-between text-xs px-4 py-2 rounded-xl bg-slate-900/60 border border-slate-800/80 opacity-75 font-mono">
          <span className="flex items-center space-x-2">
            <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
            <span>Click any pulsating radar node on the map to inspect the adversary dossier.</span>
          </span>
          <span className="hidden sm:inline text-cyan-400">5 Active Syndicates Tracked</span>
        </div>
      )}
    </div>
  );
}
