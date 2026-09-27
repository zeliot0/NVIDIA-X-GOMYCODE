import React, { useEffect, useState } from 'react';
import { Clock, Search, Trash2, ArrowRight, Filter, ShieldAlert, ShieldCheck } from 'lucide-react';
import { getHistory, deleteReport } from '../services/api';
import RiskBadge from '../components/RiskBadge';

export default function History({ setActivePage, setReportId }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRisk, setFilterRisk] = useState('ALL');
  const [filterType, setFilterType] = useState('ALL');
  const [search, setSearch] = useState('');

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const data = await getHistory();
      setHistory(data);
    } catch (err) {
      console.error('Failed to load history', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm(`Delete analysis record #${id}?`)) return;
    try {
      await deleteReport(id);
      setHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert('Could not delete record');
    }
  };

  const handleOpenReport = (id) => {
    if (setReportId) setReportId(id);
    setActivePage('report');
  };

  const filtered = history.filter((item) => {
    if (filterRisk !== 'ALL' && item.risk !== filterRisk) return false;
    if (filterType !== 'ALL' && item.input_type !== filterType) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchThreat = (item.threat_type || '').toLowerCase().includes(q);
      const matchPrev = (item.source_preview || '').toLowerCase().includes(q);
      const matchExp = (item.explanation || '').toLowerCase().includes(q);
      return matchThreat || matchPrev || matchExp;
    }
    return true;
  });

  return (
    <div className="space-y-6 py-6 max-w-6xl mx-auto px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center space-x-3">
            <Clock className="w-7 h-7 text-cyan-400" />
            <span>Security Scan History</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review previous threat evaluations, indicators, and recommended action plans.
          </p>
        </div>

        <button
          onClick={() => setActivePage('analyze')}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
        >
          <span>Run New Scan</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="cyber-card rounded-2xl p-4 border border-slate-800 flex flex-col md:flex-row items-center gap-3 justify-between">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search keywords, threat types..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((risk) => (
              <button
                key={risk}
                onClick={() => setFilterRisk(risk)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  filterRisk === risk
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {risk}
              </button>
            ))}
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Types</option>
            <option value="text">Text Message</option>
            <option value="url">URL Link</option>
            <option value="image">Screenshot</option>
            <option value="document">Document</option>
            <option value="voice">Voice Recording</option>
          </select>
        </div>
      </div>

      {/* History Items List */}
      <div className="space-y-3">
        {loading ? (
          <div className="py-12 text-center text-sm font-mono text-slate-500">Loading history records...</div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center cyber-card rounded-2xl border border-slate-800 p-8 space-y-3">
            <ShieldCheck className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-base font-semibold text-slate-300">No matching security records found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Scan a message, link, image, or document to populate your security history.
            </p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => handleOpenReport(item.id)}
              className="cyber-card rounded-2xl p-5 border border-slate-800 hover:border-slate-700 hover:bg-slate-900/80 transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex items-center space-x-2.5">
                  <RiskBadge risk={item.risk} size="sm" />
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                    {item.input_type}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    {new Date(item.created_at).toLocaleDateString()} {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors truncate">
                  {item.threat_type}
                </h3>

                <p className="text-xs text-slate-400 font-sans line-clamp-1">
                  {item.source_preview || item.explanation}
                </p>
              </div>

              {/* Actions & Score */}
              <div className="flex items-center space-x-4 self-end sm:self-center flex-shrink-0">
                <div className="text-right">
                  <span className="text-lg font-black text-white">{item.score}</span>
                  <span className="text-xs text-slate-500"> /100</span>
                </div>

                <button
                  type="button"
                  onClick={(e) => handleDelete(e, item.id)}
                  title="Delete from history"
                  className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="p-2 rounded-lg bg-slate-800 group-hover:bg-cyan-500 group-hover:text-slate-950 text-slate-400 transition-all">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
