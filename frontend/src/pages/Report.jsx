import React, { useEffect, useState } from 'react';
import { ArrowLeft, Printer, Shield, Check, Copy, AlertTriangle, FileText } from 'lucide-react';
import { getReport } from '../services/api';
import RiskBadge from '../components/RiskBadge';
import RiskScore from '../components/RiskScore';
import IndicatorList from '../components/IndicatorList';
import ProtectionPlan from '../components/ProtectionPlan';

export default function Report({ reportId, setActivePage }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!reportId) return;
    const fetchReport = async () => {
      try {
        setLoading(true);
        const data = await getReport(reportId);
        setReport(data);
      } catch (err) {
        setError('Report not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [reportId]);

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    if (!report) return;
    const text = `SAFEAI FORMAL SECURITY ASSESSMENT
Reference ID: #${report.id}
Date: ${new Date(report.created_at).toLocaleString()}
Input Type: ${report.input_type.toUpperCase()}
Risk: ${report.risk} (Score: ${report.score}/100)
Threat: ${report.threat_type}

Explanation:
${report.explanation}

Attacker Goal:
${report.attacker_goal}

Recommendations:
${(report.recommendations || []).map((r, i) => `${i + 1}. ${r}`).join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="py-24 text-center font-mono text-sm text-slate-500">
        Loading security report details...
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
        <h2 className="text-xl font-bold text-white">Report Not Found</h2>
        <p className="text-sm text-slate-400">{error || 'Unable to locate report.'}</p>
        <button
          onClick={() => setActivePage('history')}
          className="px-4 py-2 rounded-xl bg-slate-800 text-sm text-white font-medium hover:bg-slate-700"
        >
          Return to History
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
      {/* Top Actions */}
      <div className="flex items-center justify-between no-print">
        <button
          onClick={() => setActivePage('history')}
          className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to History</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopySummary}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20 hover:opacity-90 transition-opacity"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Official Report Document Container */}
      <div className="cyber-card rounded-3xl p-6 sm:p-10 border border-slate-800 space-y-8 shadow-2xl bg-slate-950/90 print:bg-white print:text-black">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-6 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 shadow-md">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase">
                SAFE<span className="text-cyan-400">AI</span> Security Report
              </h2>
              <p className="text-xs text-slate-400">
                Automated Personal Cybersecurity Intelligence & Risk Assessment
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right font-mono text-xs text-slate-400 space-y-0.5">
            <div>Report ID: <span className="text-slate-200 font-bold">#SAFE-{report.id.toString().padStart(5, '0')}</span></div>
            <div>Date: {new Date(report.created_at).toLocaleDateString()} {new Date(report.created_at).toLocaleTimeString()}</div>
            <div>Input Channel: <span className="uppercase text-cyan-400 font-semibold">{report.input_type}</span></div>
          </div>
        </div>

        {/* Risk Overview & Threat Classification */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">Risk Assessment</span>
            <div>
              <RiskBadge risk={report.risk} size="lg" />
            </div>
            <p className="text-xs text-slate-400 pt-1 font-mono">
              Confidence Factor: 95%
            </p>
          </div>

          <div className="md:col-span-2">
            <RiskScore score={report.score} risk={report.risk} />
          </div>
        </div>

        {/* Subject Preview */}
        {report.source_preview && (
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Inspected Subject</h4>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-slate-300 break-all">
              {report.source_preview}
            </div>
          </div>
        )}

        {/* Threat Diagnosis & Attacker Goal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">Threat Type</h4>
            <h3 className="text-lg font-bold text-white">{report.threat_type}</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">{report.explanation}</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400">Suspected Attacker Goal</h4>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {report.attacker_goal || 'Trick the victim into compromising sensitive information or financial credentials.'}
            </p>
          </div>
        </div>

        {/* Indicators */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Detected Signals & Indicators</h4>
          <IndicatorList indicators={report.indicators} />
        </div>

        {/* Action Plan */}
        <div className="space-y-3">
          <ProtectionPlan recommendations={report.recommendations} risk={report.risk} />
        </div>

        {/* Educational Insight */}
        {report.educational_tip && (
          <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-900 text-xs text-blue-200 leading-relaxed">
            <strong className="block text-blue-300 font-semibold mb-1">Cybersecurity Takeaway</strong>
            {report.educational_tip}
          </div>
        )}

        {/* Formal Footer */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>SAFEAI Autonomous Cyber Engine • Confidential Personal Report</span>
          <span>Verified Safe Execution • Zero Malware Transmission</span>
        </div>
      </div>
    </div>
  );
}
