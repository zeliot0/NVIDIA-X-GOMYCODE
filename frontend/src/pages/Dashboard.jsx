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
  CheckCircle2
} from 'lucide-react';
import { getHistory } from '../services/api';
import RiskBadge from '../components/RiskBadge';

export default function Dashboard({ setActivePage, setReportId, setAnalyzeTab }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleOpenReport = (id) => {
    if (setReportId) setReportId(id);
    setActivePage('report');
  };

  const handleQuickAnalyze = (tab) => {
    if (setAnalyzeTab) setAnalyzeTab(tab);
    setActivePage('analyze');
  };

  return (
    <div className="space-y-8 py-6 max-w-7xl mx-auto px-4">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold mb-2">
            <Zap className="w-3.5 h-3.5" />
            <span>Autonomous Cyber Defense Center</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Security Command Dashboard</h1>
          <p className="text-xs sm:text-sm opacity-70 mt-1">
            Real-time telemetry of your personal threat exposure, security hygiene, and defensive tools.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActivePage('arena')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-750 border border-slate-700 transition-all flex items-center space-x-1.5"
          >
            <Swords className="w-3.5 h-3.5 text-cyan-400" />
            <span>Cyber Arena</span>
          </button>
          <button
            onClick={() => setActivePage('analyze')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-md shadow-cyan-500/20 flex items-center space-x-1.5"
          >
            <Search className="w-3.5 h-3.5" />
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
            <h2 className="text-lg font-bold">Personal Cyber Health Posture</h2>
            <p className="text-xs opacity-70 max-w-md">
              {healthScore >= 85
                ? 'Your cybersecurity hygiene is in excellent standing. Threat detection and proactive defense are fully active.'
                : 'Attention needed: You have recently encountered high-risk attack vectors. Follow the recommended protection steps.'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Safe Browsing Active</span>
          </span>
          <span className="flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Zap className="w-3.5 h-3.5" />
            <span>AI Reasoning Online</span>
          </span>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl cyber-card border space-y-2">
          <div className="flex items-center justify-between opacity-70">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Scans Run</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold">{loading ? '...' : total}</div>
          <p className="text-xs opacity-60">Messages, URLs, images & audio</p>
        </div>

        <div className="p-5 rounded-2xl cyber-card border space-y-2">
          <div className="flex items-center justify-between opacity-70">
            <span className="text-xs font-semibold uppercase tracking-wider">Critical Threats</span>
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-extrabold text-rose-400">{loading ? '...' : critical}</div>
          <p className="text-xs opacity-60">Intercepted credential theft attempts</p>
        </div>

        <div className="p-5 rounded-2xl cyber-card border space-y-2">
          <div className="flex items-center justify-between opacity-70">
            <span className="text-xs font-semibold uppercase tracking-wider">High Risk Alerts</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-400">{loading ? '...' : high}</div>
          <p className="text-xs opacity-60">Phishing links and scam lures</p>
        </div>

        <div className="p-5 rounded-2xl cyber-card border space-y-2">
          <div className="flex items-center justify-between opacity-70">
            <span className="text-xs font-semibold uppercase tracking-wider">Safe Checks</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400">{loading ? '...' : safe}</div>
          <p className="text-xs opacity-60">Verified without threat signals</p>
        </div>
      </div>

      {/* Main Grid: Recent Activity & Arsenal Launcher */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Checks List */}
        <div className="lg:col-span-2 cyber-card rounded-2xl p-6 border space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-700/40">
            <h3 className="text-base font-bold flex items-center space-x-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Recent Security Checks</span>
            </h3>
            <button
              onClick={() => setActivePage('history')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center space-x-1"
            >
              <span>View All History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {loading ? (
            <div className="py-8 text-center text-sm font-mono opacity-50">Loading analyses...</div>
          ) : history.length === 0 ? (
            <div className="py-8 text-center text-sm opacity-60">
              No analyses recorded yet. Scan your first message or URL!
            </div>
          ) : (
            <div className="divide-y divide-slate-700/40">
              {history.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleOpenReport(item.id)}
                  className="py-3 flex items-center justify-between hover:bg-slate-800/30 px-2 rounded-xl transition-colors cursor-pointer group"
                >
                  <div className="space-y-1 min-w-0 pr-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 opacity-80">
                        {item.input_type}
                      </span>
                      <h4 className="text-sm font-semibold group-hover:text-cyan-400 transition-colors truncate">
                        {item.threat_type}
                      </h4>
                    </div>
                    <p className="text-xs opacity-60 truncate max-w-md">
                      {item.source_preview || item.explanation}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 flex-shrink-0">
                    <RiskBadge risk={item.risk} size="sm" />
                    <span className="text-xs font-mono opacity-60 hidden sm:inline">
                      {item.score}/100
                    </span>
                    <ArrowRight className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:text-cyan-400 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cyber Defense Arsenal Launcher */}
        <div className="space-y-4">
          <div className="cyber-card rounded-2xl p-6 border space-y-4">
            <h3 className="text-base font-bold flex items-center space-x-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Cyber Defense Tools</span>
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => setActivePage('tools')}
                className="w-full p-3 rounded-xl bg-slate-900/60 hover:bg-cyan-950/40 text-left border border-slate-800 hover:border-cyan-800 transition-all flex items-center space-x-3"
              >
                <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold block">Password Sentinel</span>
                  <span className="text-[11px] opacity-60">Entropy & crack-time audit</span>
                </div>
              </button>

              <button
                onClick={() => setActivePage('tools')}
                className="w-full p-3 rounded-xl bg-slate-900/60 hover:bg-cyan-950/40 text-left border border-slate-800 hover:border-cyan-800 transition-all flex items-center space-x-3"
              >
                <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold block">Header Sentry</span>
                  <span className="text-[11px] opacity-60">SPF/DKIM email spoof check</span>
                </div>
              </button>

              <button
                onClick={() => setActivePage('tools')}
                className="w-full p-3 rounded-xl bg-slate-900/60 hover:bg-cyan-950/40 text-left border border-slate-800 hover:border-cyan-800 transition-all flex items-center space-x-3"
              >
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <QrCode className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold block">Quishing Scanner</span>
                  <span className="text-[11px] opacity-60">QR code phishing inspector</span>
                </div>
              </button>

              <button
                onClick={() => setActivePage('radar')}
                className="w-full p-3 rounded-xl bg-slate-900/60 hover:bg-cyan-950/40 text-left border border-slate-800 hover:border-cyan-800 transition-all flex items-center space-x-3"
              >
                <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400">
                  <Radio className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold block">Threat Radar</span>
                  <span className="text-[11px] opacity-60">Trending scams & AI voice clones</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
