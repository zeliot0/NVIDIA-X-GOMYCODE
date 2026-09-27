import React, { useEffect, useState } from 'react';
import { Radio, AlertTriangle, ShieldCheck, Search, Filter, Shield, ExternalLink, Zap } from 'lucide-react';
import { getThreatRadar } from '../services/api';
import RiskBadge from '../components/RiskBadge';

export default function Radar() {
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchRadar = async () => {
      try {
        setLoading(true);
        const data = await getThreatRadar();
        setThreats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRadar();
  }, []);

  const filtered = threats.filter((t) => {
    if (filter !== 'ALL' && t.category !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const categories = ['ALL', ...new Set(threats.map((t) => t.category))];

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold mb-2">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Active Global Threat Intelligence</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Live Threat Radar</h1>
          <p className="text-sm opacity-70 mt-1">
            Tracking active social engineering campaigns, zero-day scams, and emerging cyber deception vectors worldwide.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono opacity-60">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Live Feed Updated Today</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="cyber-card rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search active scams or tactics..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-700/60 bg-slate-900/40 text-xs focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                filter === cat
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'opacity-70 hover:opacity-100 hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Threat List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-16 text-center font-mono text-sm opacity-50">Syncing live threat feeds...</div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center opacity-60 text-sm">No threat matching your filter criteria.</div>
        ) : (
          filtered.map((threat) => (
            <div
              key={threat.id}
              className="cyber-card rounded-2xl p-6 border space-y-4 hover:border-cyan-500/50 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/40 pb-3">
                <div className="flex items-center space-x-3">
                  <RiskBadge risk={threat.severity} size="md" />
                  <span className="text-xs uppercase font-mono px-2 py-0.5 rounded bg-slate-800/80 text-cyan-400 font-bold border border-slate-700">
                    {threat.category}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight flex-1 sm:text-right">
                  {threat.title}
                </h3>
              </div>

              <p className="text-sm opacity-80 leading-relaxed font-sans">
                {threat.description}
              </p>

              {/* Attack Tactics & Defense */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold uppercase text-amber-400 flex items-center space-x-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Observed Attacker Tactics</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {threat.tactics.map((tac, idx) => (
                      <span key={idx} className="text-xs px-2 py-0.5 rounded bg-slate-950 border border-slate-800 opacity-90">
                        {tac}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-900/40 space-y-1.5">
                  <span className="text-xs font-bold uppercase text-emerald-400 flex items-center space-x-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Recommended Countermeasure</span>
                  </span>
                  <p className="text-xs text-emerald-200 leading-relaxed">
                    {threat.defense}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
