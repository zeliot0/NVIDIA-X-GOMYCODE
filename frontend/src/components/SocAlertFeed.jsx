import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, Search, Download, ExternalLink, Siren, ArrowRight } from 'lucide-react';
import RiskBadge from './RiskBadge';

export default function SocAlertFeed({ history = [], setActivePage, setReportId, setToolTab }) {
  const [filter, setFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample SIEM live alerts if history has few items
  const baseAlerts = [
    {
      id: 'siem-1094',
      threat_type: 'Permit2 Approval Drainer Signature',
      risk: 'CRITICAL',
      score: 98,
      input_type: 'WEB3',
      source_preview: '0x000000000022d473030f116ddee9f6b43ac78ba3 unlimited spender authorization',
      status: 'BLOCKED',
      timestamp: 'Just now'
    },
    {
      id: 'siem-1093',
      threat_type: 'Chase Bank SMS Account Suspension Lure',
      risk: 'CRITICAL',
      score: 95,
      input_type: 'SMS',
      source_preview: 'URGENT: Your Chase card is frozen. Verify credentials at chse-security-verify.xyz',
      status: 'MITIGATED',
      timestamp: '4m ago'
    },
    {
      id: 'siem-1092',
      threat_type: 'Deepfake Executive Audio Voicemail',
      risk: 'HIGH',
      score: 84,
      input_type: 'VOICE',
      source_preview: 'Wire $15,000 for emergency acquisition before board meeting concludes',
      status: 'ISOLATED',
      timestamp: '18m ago'
    },
    {
      id: 'siem-1091',
      threat_type: 'Quishing QR Code on Parking Receipt',
      risk: 'HIGH',
      score: 79,
      input_type: 'QR',
      source_preview: 'https://park-pay-express.top/session?id=9401',
      status: 'QUARANTINED',
      timestamp: '42m ago'
    },
    {
      id: 'siem-1090',
      threat_type: 'Spoofed Google Workspace SPF Fail',
      risk: 'MEDIUM',
      score: 62,
      input_type: 'EMAIL',
      source_preview: 'From: google-security@notice-server-mail.net (SPF: FAIL, DKIM: FAIL)',
      status: 'FILTERED',
      timestamp: '1h ago'
    }
  ];

  // Merge real scan history items
  const mappedHistory = history.map((h) => ({
    id: `scan-${h.id}`,
    threat_type: h.threat_type || 'Unclassified Threat',
    risk: h.risk || 'MEDIUM',
    score: h.score || 50,
    input_type: (h.input_type || 'MSG').toUpperCase(),
    source_preview: h.source_preview || h.explanation || 'Analyzed user submission',
    status: h.risk === 'CRITICAL' ? 'BLOCKED' : 'MITIGATED',
    timestamp: 'Recent',
    realId: h.id
  }));

  const allAlerts = [...mappedHistory, ...baseAlerts];

  const filteredAlerts = allAlerts.filter((a) => {
    if (filter === 'CRITICAL' && a.risk !== 'CRITICAL') return false;
    if (filter === 'HIGH' && a.risk !== 'HIGH') return false;
    if (filter === 'SAFE' && a.risk !== 'LOW') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        a.threat_type.toLowerCase().includes(q) ||
        a.source_preview.toLowerCase().includes(q) ||
        a.input_type.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const exportCefSyslog = () => {
    const lines = filteredAlerts.map(
      (a) =>
        `CEF:0|SAFEAI|SecurityCenter|2.0|${a.id}|${a.threat_type}|${a.score}|src=${a.input_type} msg=${a.source_preview.replace(/\|/g, '_')} act=${a.status}`
    );
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `safeai_soc_siem_events_${Date.now()}.cef`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleTriageIncident = (alert) => {
    if (setToolTab) setToolTab('incident');
    if (setActivePage) setActivePage('tools');
  };

  return (
    <div className="cyber-card rounded-3xl p-6 sm:p-8 space-y-6 border">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              SOC Security Operations Triage
            </span>
          </div>
          <h3 className="text-xl font-black tracking-tight mt-1 flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-cyan-400" />
            <span>Live SIEM Incident & Alert Triage Queue</span>
          </h3>
          <p className="text-xs opacity-70">
            Real-time feed of ingested alerts with instant forensic triage and SIEM CEF export capabilities.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={exportCefSyslog}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export SIEM Log (CEF)</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Severity Filter Tabs */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto">
          {['ALL', 'CRITICAL', 'HIGH', 'SAFE'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === f
                  ? 'bg-cyan-500 text-slate-950 font-black'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {f} ({allAlerts.filter((a) => f === 'ALL' || (f === 'SAFE' ? a.risk === 'LOW' : a.risk === f)).length})
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search IOC, payload, or alert..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs focus:outline-none focus:border-cyan-500 text-slate-200"
          />
        </div>
      </div>

      {/* Alert Feed Table */}
      <div className="divide-y divide-slate-800/80 rounded-2xl border border-slate-800 bg-slate-950/60 overflow-hidden">
        {filteredAlerts.length === 0 ? (
          <div className="py-8 text-center text-xs opacity-60 font-mono">
            No incidents matching active SIEM filter.
          </div>
        ) : (
          filteredAlerts.map((alert, i) => (
            <div
              key={i}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-900/50 transition-colors"
            >
              <div className="space-y-1 min-w-0 pr-4">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                    {alert.input_type}
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400 font-bold">
                    {alert.id}
                  </span>
                  <h4 className="text-sm font-bold text-slate-100 truncate">
                    {alert.threat_type}
                  </h4>
                </div>
                <p className="text-xs opacity-70 truncate max-w-xl font-mono text-slate-300">
                  {alert.source_preview}
                </p>
              </div>

              <div className="flex items-center space-x-3 flex-shrink-0 self-end sm:self-auto">
                <RiskBadge risk={alert.risk} size="sm" />
                <span className="text-xs font-mono font-bold text-slate-400 hidden md:inline">
                  {alert.score}/100
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 font-bold">
                  {alert.status}
                </span>

                <button
                  onClick={() => handleTriageIncident(alert)}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center space-x-1"
                >
                  <Siren className="w-3 h-3" />
                  <span>Triage</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
