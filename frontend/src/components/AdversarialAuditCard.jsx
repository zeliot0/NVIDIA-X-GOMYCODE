import React, { useState } from 'react';
import { Swords, Shield, Skull, Terminal, Copy, Check, ChevronDown, ChevronUp, Sparkles, Layers } from 'lucide-react';
import { runAdversarialAudit } from '../services/api';

export default function AdversarialAuditCard({ threatText, threatType = 'Phishing' }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);

  const handleFetch = async () => {
    if (!threatText || loading) return;
    setLoading(true);
    try {
      const res = await runAdversarialAudit(threatText, threatType);
      setData(res);
      setExpanded(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="rounded-2xl border border-slate-700/80 bg-slate-950/70 p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500/20 to-blue-500/20 text-cyan-400 flex items-center justify-center font-bold border border-cyan-800/40">
            <Swords className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-bold text-slate-100">
                Adversarial Simulation: Red Team vs. Blue Team
              </h4>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-slate-900 text-cyan-300 border border-slate-700">
                MITRE ATT&CK
              </span>
            </div>
            <p className="text-xs opacity-70">
              Deconstruct offensive weaponization playbooks and defensive engineering detection rules.
            </p>
          </div>
        </div>

        {!data ? (
          <button
            onClick={handleFetch}
            disabled={loading || !threatText}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 via-purple-600 to-blue-600 hover:opacity-90 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-1.5 self-start sm:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{loading ? 'Simulating Adversaries...' : 'Simulate Red vs Blue'}</span>
          </button>
        ) : (
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center space-x-1 self-start sm:self-auto"
          >
            <span>{expanded ? 'Collapse' : 'Expand Simulation'}</span>
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        )}
      </div>

      {data && expanded && (
        <div className="pt-4 border-t border-slate-800 space-y-4 animate-in fade-in duration-200">
          {/* MITRE ATT&CK Header Card */}
          {data.mitre_attack && (
            <div className="p-3.5 rounded-xl bg-slate-900 border border-cyan-900/60 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-2 font-mono">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-cyan-300">
                  {data.mitre_attack.technique_id} - {data.mitre_attack.technique_name}
                </span>
                <span className="text-[10px] opacity-60">({data.mitre_attack.tactic})</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                Mitigation: {data.mitre_attack.mitigation_id}
              </span>
            </div>
          )}

          {/* Dual Columns: Red Team vs Blue Team */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Red Team Column */}
            <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-900/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-rose-400 flex items-center space-x-1.5">
                  <Skull className="w-4 h-4" />
                  <span>Red Team Offensive Assessment</span>
                </span>
                {data.red_team_offensive_view?.estimated_attacker_roi && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                    ROI: {data.red_team_offensive_view.estimated_attacker_roi}
                  </span>
                )}
              </div>

              <div className="space-y-2 text-xs text-rose-100">
                <div>
                  <strong className="block text-rose-300 font-semibold mb-0.5">Weaponization Playbook:</strong>
                  <p className="leading-relaxed opacity-90">{data.red_team_offensive_view?.attacker_playbook}</p>
                </div>
                <div>
                  <strong className="block text-rose-300 font-semibold mb-0.5">Lateral Pivot Target:</strong>
                  <p className="leading-relaxed opacity-90">{data.red_team_offensive_view?.lateral_movement_goal}</p>
                </div>
                <div>
                  <strong className="block text-rose-300 font-semibold mb-0.5">Evasion Tactic:</strong>
                  <p className="leading-relaxed opacity-90">{data.red_team_offensive_view?.evasion_technique}</p>
                </div>
              </div>
            </div>

            {/* Blue Team Column */}
            <div className="p-4 rounded-2xl bg-blue-950/20 border border-blue-900/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-blue-400 flex items-center space-x-1.5">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span>Blue Team Defensive Engineering</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                  SIEM Rule Ready
                </span>
              </div>

              <div className="space-y-2 text-xs text-blue-100">
                {/* Detection Rule Snippet */}
                {data.blue_team_defensive_view?.detection_rule && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-blue-300">
                      <span>Detection Rule (YARA/Sigma/Regex):</span>
                      <button
                        onClick={() => copyToClipboard(data.blue_team_defensive_view.detection_rule, 'rule')}
                        className="text-[10px] text-blue-400 hover:text-white flex items-center space-x-1"
                      >
                        {copiedKey === 'rule' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>Copy</span>
                      </button>
                    </div>
                    <pre className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-[10px] font-mono text-cyan-300 overflow-x-auto">
                      {data.blue_team_defensive_view.detection_rule}
                    </pre>
                  </div>
                )}

                {/* Containment CLI Command */}
                {data.blue_team_defensive_view?.containment_command && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-blue-300">
                      <span>Host Containment CLI Command:</span>
                      <button
                        onClick={() => copyToClipboard(data.blue_team_defensive_view.containment_command, 'cmd')}
                        className="text-[10px] text-blue-400 hover:text-white flex items-center space-x-1"
                      >
                        {copiedKey === 'cmd' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>Copy</span>
                      </button>
                    </div>
                    <pre className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-[10px] font-mono text-emerald-300 overflow-x-auto">
                      {data.blue_team_defensive_view.containment_command}
                    </pre>
                  </div>
                )}

                {/* Architectural Hardening */}
                {data.blue_team_defensive_view?.architectural_hardening && (
                  <div>
                    <strong className="block text-blue-300 font-semibold mb-0.5">Strategic Hardening:</strong>
                    <p className="leading-relaxed opacity-90">{data.blue_team_defensive_view.architectural_hardening}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
