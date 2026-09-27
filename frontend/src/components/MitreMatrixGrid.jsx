import React, { useState } from 'react';
import { Layers, ShieldCheck, ChevronRight, AlertTriangle, ExternalLink, Zap, Lock } from 'lucide-react';

export default function MitreMatrixGrid() {
  const [selectedTactic, setSelectedTactic] = useState(null);

  const mitreTactics = [
    {
      id: 'TA0001',
      name: 'Initial Access',
      coverage: '98%',
      techniques: [
        { id: 'T1566.001', name: 'Spearphishing Attachment', status: 'PROTECTED', counter: 'Document Sandbox & Macro Stripping' },
        { id: 'T1566.002', name: 'Spearphishing Link', status: 'PROTECTED', counter: 'Anti-Typosquatting & Safe Browsing Filter' },
        { id: 'T1566.003', name: 'Quishing (QR Code Redirection)', status: 'PROTECTED', counter: 'QR Camera Decoder & Payload Parser' }
      ]
    },
    {
      id: 'TA0002',
      name: 'Execution',
      coverage: '94%',
      techniques: [
        { id: 'T1204.001', name: 'Malicious Link Click', status: 'PROTECTED', counter: 'Cognitive Urgency Warning' },
        { id: 'T1204.002', name: 'Malicious File Run', status: 'PROTECTED', counter: 'Static Heuristic Signature Scanner' },
        { id: 'T1059.001', name: 'PowerShell / Script Injection', status: 'MONITORED', counter: 'Constrained Language Mode Advisor' }
      ]
    },
    {
      id: 'TA0005',
      name: 'Defense Evasion',
      coverage: '91%',
      techniques: [
        { id: 'T1027', name: 'Obfuscated Files / Base64 Encoded Payloads', status: 'PROTECTED', counter: 'Entropy & De-obfuscation Parser' },
        { id: 'T1036', name: 'Masquerading / Fake Display Names', status: 'PROTECTED', counter: 'SPF/DKIM Header Sentry Check' }
      ]
    },
    {
      id: 'TA0006',
      name: 'Credential Access',
      coverage: '99%',
      techniques: [
        { id: 'T1110', name: 'Brute Force / Password Spraying', status: 'PROTECTED', counter: 'Password Sentinel Entropy & Crack-Time Auditor' },
        { id: 'T1539', name: 'Steal Web Session Cookie', status: 'PROTECTED', counter: 'Remote Session Kill Advice' },
        { id: 'T1528', name: 'Steal Application Access Token', status: 'PROTECTED', counter: 'OAuth Revocation Checklist' }
      ]
    },
    {
      id: 'TA0009',
      name: 'Collection & Fraud',
      coverage: '95%',
      techniques: [
        { id: 'T1598', name: 'Phishing for Financial Information', status: 'PROTECTED', counter: 'Bank Dispute Letter Auto-Generator' },
        { id: 'T1557', name: 'Adversary-in-the-Middle (AiTM)', status: 'PROTECTED', counter: 'FIDO2 / Passkey Hardware Key Guidance' }
      ]
    },
    {
      id: 'TA0040',
      name: 'Impact & Web3',
      coverage: '96%',
      techniques: [
        { id: 'T1486', name: 'Data Encrypted for Ransom (Ransomware)', status: 'PROTECTED', counter: 'Emergency Air-gap Containment Protocol' },
        { id: 'T1565', name: 'Permit2 Crypto Drainer Manipulation', status: 'PROTECTED', counter: 'Smart Contract Allowance Auditor' }
      ]
    }
  ];

  return (
    <div className="cyber-card rounded-3xl p-6 sm:p-8 space-y-6 border">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              SOC Enterprise Framework Mapping
            </span>
          </div>
          <h3 className="text-xl font-black tracking-tight mt-1 flex items-center space-x-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <span>MITRE ATT&CK® Defense Coverage Matrix</span>
          </h3>
          <p className="text-xs opacity-70">
            Automated alignment of personal cyber defense capabilities against standardized enterprise threat tactics.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-800 text-cyan-300 font-bold">
            Average Shield Coverage: 95.5%
          </span>
        </div>
      </div>

      {/* Grid of Tactics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mitreTactics.map((tactic) => (
          <div
            key={tactic.id}
            onClick={() => setSelectedTactic(selectedTactic?.id === tactic.id ? null : tactic)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
              selectedTactic?.id === tactic.id
                ? 'bg-cyan-950/40 border-cyan-500 shadow-md shadow-cyan-500/10'
                : 'bg-slate-900/60 hover:bg-slate-800/60 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold">{tactic.id}</span>
                <h4 className="text-sm font-bold text-slate-100">{tactic.name}</h4>
              </div>
              <span className="text-xs font-mono font-black px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-emerald-400">
                {tactic.coverage}
              </span>
            </div>

            <div className="space-y-1.5">
              {tactic.techniques.slice(0, 2).map((tech) => (
                <div key={tech.id} className="flex items-center justify-between text-[11px] p-2 rounded-lg bg-slate-950/70 border border-slate-800/80">
                  <span className="font-mono text-slate-300 truncate max-w-[180px]">{tech.name}</span>
                  <span className="text-[9px] font-mono font-bold text-emerald-400 px-1 rounded bg-emerald-950/60 border border-emerald-800/60">
                    {tech.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-[11px] text-cyan-400 pt-1 font-semibold">
              <span>{tactic.techniques.length} Techniques Mapped</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        ))}
      </div>

      {/* Selected Tactic Expanded Inspector */}
      {selectedTactic && (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-cyan-800 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-xs font-mono uppercase text-cyan-400 font-bold">
                Tactic Details: {selectedTactic.id}
              </span>
              <h4 className="text-lg font-bold text-white">{selectedTactic.name}</h4>
            </div>
            <button
              onClick={() => setSelectedTactic(null)}
              className="text-xs text-slate-400 hover:text-white px-3 py-1 rounded-lg bg-slate-800"
            >
              Close
            </button>
          </div>

          <div className="space-y-2">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Active Defensive Countermeasures for {selectedTactic.name}:
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selectedTactic.techniques.map((tech) => (
                <div key={tech.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-cyan-300">{tech.id}</span>
                    <span className="text-[10px] font-mono font-bold text-emerald-400 px-1.5 py-0.2 rounded bg-emerald-950 border border-emerald-800">
                      {tech.status}
                    </span>
                  </div>
                  <h6 className="text-xs font-bold text-slate-100">{tech.name}</h6>
                  <p className="text-[11px] opacity-75 text-slate-300">
                    <strong>SAFEAI Countermeasure: </strong>
                    {tech.counter}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
