import React from 'react';
import { AlertCircle, CheckCircle2, Flame, ShieldAlert } from 'lucide-react';

export default function IndicatorList({ indicators = [], indicatorDetails = [] }) {
  if (!indicators || indicators.length === 0) {
    return (
      <div className="flex items-center space-x-2 text-sm text-emerald-400 bg-emerald-950/30 p-3 rounded-xl border border-emerald-900/50">
        <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
        <span>No malicious indicators or scam signals detected.</span>
      </div>
    );
  }

  // If detailed breakdown is available, render enriched cards
  if (indicatorDetails && indicatorDetails.length > 0) {
    return (
      <div className="space-y-2.5">
        {indicatorDetails.map((item, idx) => {
          const isHigh = item.severity === 'high' || item.severity === 'critical';
          return (
            <div
              key={idx}
              className="flex items-start space-x-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <div className={`mt-0.5 p-1 rounded-lg ${isHigh ? 'bg-rose-950 text-rose-400' : 'bg-amber-950 text-amber-400'}`}>
                {isHigh ? <Flame className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-slate-200 capitalize">
                    {item.type.replace(/_/g, ' ')}
                  </h4>
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      item.severity === 'critical'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : item.severity === 'high'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-yellow-950 text-yellow-300 border border-yellow-800'
                    }`}
                  >
                    {item.severity}
                  </span>
                </div>
                {item.evidence && (
                  <p className="text-xs text-slate-400 mt-1 font-mono bg-slate-950/60 px-2 py-1 rounded border border-slate-800/80">
                    Detected: <span className="text-cyan-300">"{item.evidence}"</span>
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Fallback to simple string list
  return (
    <ul className="space-y-2">
      {indicators.map((ind, idx) => (
        <li
          key={idx}
          className="flex items-center space-x-2 text-sm text-slate-300 p-2.5 rounded-lg bg-slate-900 border border-slate-800"
        >
          <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span className="font-medium">{ind}</span>
        </li>
      ))}
    </ul>
  );
}
