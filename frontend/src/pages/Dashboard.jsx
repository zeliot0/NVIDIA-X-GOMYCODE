import React, { useEffect, useState } from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Flame, Clock, ArrowRight, Activity, TrendingUp, Search } from 'lucide-react';
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
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Security Dashboard</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time monitoring of your digital threat scans and personal safety profile
          </p>
        </div>

        <button
          onClick={() => setActivePage('analyze')}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-md shadow-cyan-500/20"
        >
          <Search className="w-4 h-4" />
          <span>New Threat Scan</span>
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl cyber-card border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Scans Run</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{loading ? '...' : total}</div>
          <p className="text-xs text-slate-500">Across messages, URLs, images & audio</p>
        </div>

        <div className="p-5 rounded-2xl cyber-card border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Critical Threats</span>
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-extrabold text-rose-400">{loading ? '...' : critical}</div>
          <p className="text-xs text-rose-500/80 font-medium">Immediate interception advised</p>
        </div>

        <div className="p-5 rounded-2xl cyber-card border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">High Risk Alerts</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-400">{loading ? '...' : high}</div>
          <p className="text-xs text-amber-500/80 font-medium">Phishing & deceptive links</p>
        </div>

        <div className="p-5 rounded-2xl cyber-card border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Safe Checks</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400">{loading ? '...' : safe}</div>
          <p className="text-xs text-emerald-500/80 font-medium">Verified without indicators</p>
        </div>
      </div>

      {/* Main Grid: Recent Activity & Quick Scanners */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Checks List */}
        <div className="lg:col-span-2 cyber-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
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
            <div className="py-8 text-center text-sm text-slate-500 font-mono">Loading analyses...</div>
          ) : history.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500">
              No analyses recorded yet. Scan your first message or URL!
            </div>
          ) : (
            <div className="divide-y divide-slate-800/80">
              {history.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleOpenReport(item.id)}
                  className="py-3 flex items-center justify-between hover:bg-slate-900/50 px-2 rounded-xl transition-colors cursor-pointer group"
                >
                  <div className="space-y-1 min-w-0 pr-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                        {item.input_type}
                      </span>
                      <h4 className="text-sm font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors truncate">
                        {item.threat_type}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-400 truncate max-w-md">
                      {item.source_preview || item.explanation}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 flex-shrink-0">
                    <RiskBadge risk={item.risk} size="sm" />
                    <span className="text-xs font-mono text-slate-500 hidden sm:inline">
                      {item.score}/100
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Launch Cards & Educational Spot */}
        <div className="space-y-4">
          <div className="cyber-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>Quick Scanners</span>
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleQuickAnalyze('text')}
                className="p-3 rounded-xl bg-slate-900 hover:bg-cyan-950/40 text-left border border-slate-800 hover:border-cyan-800 transition-all"
              >
                <span className="text-xs font-bold text-white block">💬 Text SMS</span>
                <span className="text-[11px] text-slate-400">Phishing lures</span>
              </button>

              <button
                onClick={() => handleQuickAnalyze('url')}
                className="p-3 rounded-xl bg-slate-900 hover:bg-cyan-950/40 text-left border border-slate-800 hover:border-cyan-800 transition-all"
              >
                <span className="text-xs font-bold text-white block">🔗 Safe URL</span>
                <span className="text-[11px] text-slate-400">Domain safety</span>
              </button>

              <button
                onClick={() => handleQuickAnalyze('image')}
                className="p-3 rounded-xl bg-slate-900 hover:bg-cyan-950/40 text-left border border-slate-800 hover:border-cyan-800 transition-all"
              >
                <span className="text-xs font-bold text-white block">📸 Screenshot</span>
                <span className="text-[11px] text-slate-400">Fake logins</span>
              </button>

              <button
                onClick={() => handleQuickAnalyze('voice')}
                className="p-3 rounded-xl bg-slate-900 hover:bg-cyan-950/40 text-left border border-slate-800 hover:border-cyan-800 transition-all"
              >
                <span className="text-xs font-bold text-white block">🎤 Voice Call</span>
                <span className="text-[11px] text-slate-400">Vishing & OTP</span>
              </button>
            </div>
          </div>

          {/* Coach Quick Prompt Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/70 to-blue-950/70 border border-cyan-800/60 space-y-3">
            <h4 className="text-sm font-bold text-cyan-300">Need Cybersecurity Advice?</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Ask our AI Coach about OTP protection, password managers, and how to verify sudden alerts.
            </p>
            <button
              onClick={() => setActivePage('coach')}
              className="w-full py-2 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-colors"
            >
              Ask Cyber Coach
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
