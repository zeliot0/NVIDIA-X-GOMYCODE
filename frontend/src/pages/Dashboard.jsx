import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Flame,
  Clock,
  ArrowRight,
  Activity,
  TrendingUp,
  Search,
  KeyRound,
  Mail,
  QrCode,
  Swords,
  Radio,
  Zap,
  CheckCircle2,
  Siren,
  Coins,
  Brain,
  Globe,
  Terminal,
  Cpu,
  Layers
} from 'lucide-react';
import { getHistory } from '../services/api';
import RiskBadge from '../components/RiskBadge';
import SocThreatMap from '../components/SocThreatMap';
import MitreMatrixGrid from '../components/MitreMatrixGrid';
import SocTimelineGraph from '../components/SocTimelineGraph';
import SocAlertFeed from '../components/SocAlertFeed';

export default function Dashboard({ setActivePage, setReportId, setAnalyzeTab, setToolTab }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date().toUTCString());

  // Real-time ticking clock for SOC operations
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toUTCString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const records = await getHistory();
        setHistory(records);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const total = history.length;
  const critical = history.filter((h) => h.risk === 'CRITICAL').length;
  const high = history.filter((h) => h.risk === 'HIGH').length;
  const safe = history.filter((h) => h.risk === 'LOW').length;

  // Calculate dynamic Cyber Posture Score
  const healthScore = total === 0 ? 100 : Math.max(100 - (critical * 15 + high * 8), 45);

  const defconLevel = critical > 0 ? 'DEFCON 2: ELEVATED THREAT ENVIRONMENT' : high > 0 ? 'DEFCON 3: ACTIVE MONITORING' : 'DEFCON 4: NORMAL OPERATIONS';
  const defconColor = critical > 0 ? 'text-rose-400 bg-rose-950/60 border-rose-800' : high > 0 ? 'text-amber-400 bg-amber-950/60 border-amber-800' : 'text-emerald-400 bg-emerald-950/60 border-emerald-800';

  return (
    <div className="space-y-8 py-6 max-w-7xl mx-auto px-4">
      {/* SOC Command Header & Live Telemetry Ticker */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`px-2.5 py-0.5 rounded-full border text-xs font-mono font-black uppercase flex items-center space-x-1.5 ${defconColor}`}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
              </span>
              <span>{defconLevel}</span>
            </span>

            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
              UTC: {currentTime}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Security Operations Center (SOC)
          </h1>
          <p className="text-xs sm:text-sm opacity-70 mt-1">
            Real-time SIEM event correlation, adversarial threat mapping, MITRE ATT&CK alignment, and automated AI countermeasures.
          </p>
        </div>

        {/* SOC Action Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActivePage('arena')}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-all flex items-center space-x-1.5"
          >
            <Swords className="w-4 h-4 text-cyan-400" />
            <span>Cyber Arena</span>
          </button>
          <button
            onClick={() => setActivePage('radar')}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-all flex items-center space-x-1.5"
          >
            <Radio className="w-4 h-4 text-rose-400" />
            <span>Threat Radar</span>
          </button>
          <button
            onClick={() => setActivePage('analyze')}
            className="px-4 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 flex items-center space-x-1.5"
          >
            <Search className="w-4 h-4" />
            <span>New Threat Scan</span>
          </button>
        </div>
      </div>

      {/* Cyber Posture Banner */}
      <div className="cyber-card rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border">
        <div className="flex items-center space-x-5">
          <div className="relative flex items-center justify-center">
            <div className="w-20 h-20 rounded-full border-4 border-cyan-500/30 flex items-center justify-center bg-cyan-950/40">
              <span className="text-2xl font-black text-cyan-400">{healthScore}%</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold">Personal Cyber Health Posture</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                SIEM INDEX
              </span>
            </div>
            <p className="text-xs opacity-70 max-w-xl">
              {healthScore >= 85
                ? 'Your cybersecurity hygiene is in optimal standing. Autonomous threat detection, safe URL sandboxing, and MITRE mitigations are fully active.'
                : 'Attention needed: You have recently encountered high-severity attack vectors. Review uncontained incidents in the SIEM alert queue.'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Ingestion Pipeline: Healthy</span>
          </span>
          <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Cpu className="w-3.5 h-3.5" />
            <span>AI Reasoning: Online</span>
          </span>
        </div>
      </div>

      {/* Metric Telemetry Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl cyber-card border space-y-2">
          <div className="flex items-center justify-between opacity-70">
            <span className="text-xs font-semibold uppercase tracking-wider font-mono">Total Ingested Events</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold">{loading ? '...' : total}</div>
          <p className="text-xs opacity-60">Messages, URLs, docs, audio, & Web3</p>
        </div>

        <div className="p-5 rounded-2xl cyber-card border space-y-2">
          <div className="flex items-center justify-between opacity-70">
            <span className="text-xs font-semibold uppercase tracking-wider font-mono">Critical Exploits</span>
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-extrabold text-rose-400">{loading ? '...' : critical}</div>
          <p className="text-xs opacity-60">Intercepted credential theft & drainers</p>
        </div>

        <div className="p-5 rounded-2xl cyber-card border space-y-2">
          <div className="flex items-center justify-between opacity-70">
            <span className="text-xs font-semibold uppercase tracking-wider font-mono">High Risk Incursions</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-400">{loading ? '...' : high}</div>
          <p className="text-xs opacity-60">Phishing lures, fake invoices, & quishing</p>
        </div>

        <div className="p-5 rounded-2xl cyber-card border space-y-2">
          <div className="flex items-center justify-between opacity-70">
            <span className="text-xs font-semibold uppercase tracking-wider font-mono">Verified Clean</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400">{loading ? '...' : safe}</div>
          <p className="text-xs opacity-60">Verified without threat signatures</p>
        </div>
      </div>

      {/* Interactive SIEM Telemetry Curve Graph */}
      <SocTimelineGraph />

      {/* Interactive Global Threat Map & Adversary Dossier */}
      <SocThreatMap />

      {/* MITRE ATT&CK Matrix Grid */}
      <MitreMatrixGrid />

      {/* Live SIEM Alert Triage Queue */}
      <SocAlertFeed
        history={history}
        setActivePage={setActivePage}
        setReportId={setReportId}
        setToolTab={setToolTab}
      />

      {/* SOC Defense Arsenal Launcher */}
      <div className="cyber-card rounded-3xl p-6 sm:p-8 space-y-4 border">
        <div className="flex items-center space-x-2">
          <Zap className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold">Active SOC Defense Countermeasure Tools</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => { if (setToolTab) setToolTab('incident'); setActivePage('tools'); }}
            className="p-3.5 rounded-xl bg-slate-900/80 hover:bg-rose-950/40 text-left border border-slate-800 hover:border-rose-800/60 transition-all flex items-center space-x-3 group"
          >
            <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400 group-hover:scale-105 transition-transform">
              <Siren className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold block text-slate-100">Incident Commander</span>
              <span className="text-[11px] opacity-60">Bank dispute & police legal draft</span>
            </div>
          </button>

          <button
            onClick={() => { if (setToolTab) setToolTab('breach'); setActivePage('tools'); }}
            className="p-3.5 rounded-xl bg-slate-900/80 hover:bg-cyan-950/40 text-left border border-slate-800 hover:border-cyan-800/60 transition-all flex items-center space-x-3 group"
          >
            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 group-hover:scale-105 transition-transform">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold block text-slate-100">Dark Web Breach Radar</span>
              <span className="text-[11px] opacity-60">Compromised identity & stuffing</span>
            </div>
          </button>

          <button
            onClick={() => { if (setToolTab) setToolTab('crypto'); setActivePage('tools'); }}
            className="p-3.5 rounded-xl bg-slate-900/80 hover:bg-amber-950/40 text-left border border-slate-800 hover:border-amber-800/60 transition-all flex items-center space-x-3 group"
          >
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 group-hover:scale-105 transition-transform">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold block text-slate-100">Web3 & Crypto Audit</span>
              <span className="text-[11px] opacity-60">Permit2 drainer & smart contract</span>
            </div>
          </button>

          <button
            onClick={() => { if (setToolTab) setToolTab('psych'); setActivePage('tools'); }}
            className="p-3.5 rounded-xl bg-slate-900/80 hover:bg-purple-950/40 text-left border border-slate-800 hover:border-purple-800/60 transition-all flex items-center space-x-3 group"
          >
            <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400 group-hover:scale-105 transition-transform">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold block text-slate-100">Psychology Radar</span>
              <span className="text-[11px] opacity-60">Cialdini persuasion spectrum</span>
            </div>
          </button>

          <button
            onClick={() => { if (setToolTab) setToolTab('password'); setActivePage('tools'); }}
            className="p-3.5 rounded-xl bg-slate-900/80 hover:bg-cyan-950/40 text-left border border-slate-800 hover:border-cyan-800 transition-all flex items-center space-x-3 group"
          >
            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 group-hover:scale-105 transition-transform">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold block text-slate-100">Password Sentinel</span>
              <span className="text-[11px] opacity-60">Entropy & crack-time audit</span>
            </div>
          </button>

          <button
            onClick={() => { if (setToolTab) setToolTab('header'); setActivePage('tools'); }}
            className="p-3.5 rounded-xl bg-slate-900/80 hover:bg-blue-950/40 text-left border border-slate-800 hover:border-blue-800 transition-all flex items-center space-x-3 group"
          >
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 group-hover:scale-105 transition-transform">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold block text-slate-100">Header Sentry</span>
              <span className="text-[11px] opacity-60">SPF/DKIM email spoof check</span>
            </div>
          </button>

          <button
            onClick={() => { if (setToolTab) setToolTab('qr'); setActivePage('tools'); }}
            className="p-3.5 rounded-xl bg-slate-900/80 hover:bg-emerald-950/40 text-left border border-slate-800 hover:border-emerald-800 transition-all flex items-center space-x-3 group"
          >
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:scale-105 transition-transform">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold block text-slate-100">Quishing Scanner</span>
              <span className="text-[11px] opacity-60">QR code phishing inspector</span>
            </div>
          </button>

          <button
            onClick={() => setActivePage('radar')}
            className="p-3.5 rounded-xl bg-slate-900/80 hover:bg-rose-950/40 text-left border border-slate-800 hover:border-rose-800 transition-all flex items-center space-x-3 group"
          >
            <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400 group-hover:scale-105 transition-transform">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold block text-slate-100">Live Threat Radar</span>
              <span className="text-[11px] opacity-60">Active fraud campaigns & AI clones</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
