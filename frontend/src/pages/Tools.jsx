import React, { useState } from 'react';
import { KeyRound, Mail, QrCode, Shield, Check, Copy, AlertTriangle, Flame, ShieldAlert, Sparkles, RefreshCw, Lock, Zap } from 'lucide-react';
import { auditPassword, inspectEmailHeader, scanQrCode } from '../services/api';
import UploadBox from '../components/UploadBox';
import RiskBadge from '../components/RiskBadge';
import RiskScore from '../components/RiskScore';

export default function Tools({ darkMode }) {
  const [activeTool, setActiveTool] = useState('password');

  // Password Sentinel State
  const [passwordInput, setPasswordInput] = useState('P@ssword123!');
  const [pwResult, setPwResult] = useState(null);
  const [pwLoading, setPwLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);

  // Email Header Sentry State
  const [headerInput, setHeaderInput] = useState('');
  const [headerResult, setHeaderResult] = useState(null);
  const [headerLoading, setHeaderLoading] = useState(false);

  // QR Code Quishing State
  const [qrFile, setQrFile] = useState(null);
  const [qrResult, setQrResult] = useState(null);
  const [qrLoading, setQrLoading] = useState(false);
  const [qrError, setQrError] = useState(null);

  // Password Audit
  const handleAuditPassword = async (pw) => {
    const target = pw !== undefined ? pw : passwordInput;
    setPwLoading(true);
    try {
      const data = await auditPassword(target);
      setPwResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setPwLoading(false);
    }
  };

  // Email Header Inspection
  const handleInspectHeader = async () => {
    if (!headerInput.trim()) return;
    setHeaderLoading(true);
    try {
      const data = await inspectEmailHeader(headerInput);
      setHeaderResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setHeaderLoading(false);
    }
  };

  // QR Scan
  const handleScanQr = async () => {
    if (!qrFile) return;
    setQrLoading(true);
    setQrError(null);
    try {
      const data = await scanQrCode(qrFile);
      setQrResult(data);
    } catch (err) {
      setQrError(err.response?.data?.detail || 'Failed to scan QR code');
    } finally {
      setQrLoading(false);
    }
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Load sample email header
  const loadSampleHeader = (type) => {
    if (type === 'spoofed') {
      setHeaderInput(`From: "PayPal Account Security" <support@fake-payment-update.xyz>
To: target-user@company.com
Subject: Action Required: Your Account Has Been Locked
Date: Sun, 27 Sep 2026 12:00:00 +0000
Return-Path: <bounce@unrelated-server-domain.net>
Reply-To: <phisher-inbox@anonymous-mail.org>
Authentication-Results: spf=fail (sender IP is 198.51.100.24) dkim=fail dmarc=fail`);
    } else {
      setHeaderInput(`From: "Google Cloud" <noreply@google.com>
To: developer@domain.com
Subject: Security update for Google Cloud project
Date: Sun, 27 Sep 2026 10:15:30 +0000
Return-Path: <3xK2ZQwQTCocmn-uhsohjrrs-qhuylfhjrrs-frp@gaia.bounces.google.com>
Authentication-Results: mx.google.com; dkim=pass header.i=@google.com; spf=pass (google.com: domain of 3xK2ZQwQTCocmn-uhsohjrrs-qhuylfhjrrs-frp@gaia.bounces.google.com designates 209.85.220.69 as permitted sender) smtp.mailfrom=3xK2ZQwQTCocmn-uhsohjrrs-qhuylfhjrrs-frp@gaia.bounces.google.com; dmarc=pass (p=REJECT sp=REJECT dis=NONE) header.from=google.com`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold">
          <Zap className="w-3.5 h-3.5" />
          <span>Advanced Cyber Defense Arsenal</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">Cybersecurity Power Tools</h1>
        <p className="text-sm opacity-70 max-w-xl mx-auto">
          Audit passwords against brute-force rigs, dissect spoofed email headers for SPF/DKIM/DMARC, and inspect QR codes for quishing traps.
        </p>
      </div>

      {/* Tool Selector Tabs */}
      <div className="flex items-center justify-center space-x-2 border-b border-slate-700/40 pb-4">
        <button
          onClick={() => setActiveTool('password')}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTool === 'password'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
              : 'opacity-70 hover:opacity-100 hover:bg-slate-800/40'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Password Sentinel</span>
        </button>

        <button
          onClick={() => setActiveTool('header')}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTool === 'header'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
              : 'opacity-70 hover:opacity-100 hover:bg-slate-800/40'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Header Sentry (Anti-Spoofing)</span>
        </button>

        <button
          onClick={() => setActiveTool('qr')}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTool === 'qr'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
              : 'opacity-70 hover:opacity-100 hover:bg-slate-800/40'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>Quishing Scanner (QR Code)</span>
        </button>
      </div>

      {/* Tool 1: Password Sentinel */}
      {activeTool === 'password' && (
        <div className="space-y-6">
          <div className="cyber-card rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Password Entropy & Crack-Time Auditor</h3>
                <p className="text-xs opacity-70">
                  Tests entropy, GPU cluster brute-force resistance, dictionary patterns, and suggests quantum-grade passphrases.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider opacity-70">
                Enter Password or Passphrase to Audit:
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="e.g. MySecretPassphrase2026!"
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-700/60 bg-slate-900/40 text-sm focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={() => handleAuditPassword()}
                  className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Audit Strength</span>
                </button>
              </div>
            </div>

            {/* Quick Demo Preloads */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="opacity-60">Test Samples:</span>
              <button
                onClick={() => { setPasswordInput('123456'); handleAuditPassword('123456'); }}
                className="px-2.5 py-1 rounded-lg bg-slate-800 text-rose-300 border border-slate-700 hover:bg-slate-700"
              >
                Weak ("123456")
              </button>
              <button
                onClick={() => { setPasswordInput('P@ssw0rd2024'); handleAuditPassword('P@ssw0rd2024'); }}
                className="px-2.5 py-1 rounded-lg bg-slate-800 text-amber-300 border border-slate-700 hover:bg-slate-700"
              >
                Moderate ("P@ssw0rd2024")
              </button>
              <button
                onClick={() => { setPasswordInput('cosmic-velvet-falcon92#'); handleAuditPassword('cosmic-velvet-falcon92#'); }}
                className="px-2.5 py-1 rounded-lg bg-slate-800 text-emerald-300 border border-slate-700 hover:bg-slate-700"
              >
                Quantum Grade Passphrase
              </button>
            </div>

            {/* Result Area */}
            {pwResult && (
              <div className="pt-4 border-t border-slate-700/40 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                    <span className="text-xs uppercase font-semibold opacity-60">Strength Rating</span>
                    <div className="text-xl font-extrabold text-cyan-400">{pwResult.strength}</div>
                    <div className="text-xs opacity-70">Entropy: {pwResult.entropy_bits} bits</div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                    <span className="text-xs uppercase font-semibold opacity-60">Offline GPU Cluster Crack Time</span>
                    <div className="text-xl font-extrabold text-amber-400">{pwResult.crack_time_offline}</div>
                    <div className="text-xs opacity-70">At 10 billion guesses/second</div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
                    <span className="text-xs uppercase font-semibold opacity-60">Online Web Crack Time</span>
                    <div className="text-xl font-extrabold text-emerald-400">{pwResult.crack_time_online}</div>
                    <div className="text-xs opacity-70">At 100 attempts/second</div>
                  </div>
                </div>

                {/* Vulnerabilities detected */}
                {pwResult.vulnerabilities.length > 0 && (
                  <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-900/60 space-y-2">
                    <span className="text-xs font-bold uppercase text-rose-400 flex items-center space-x-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Identified Weaknesses</span>
                    </span>
                    <ul className="space-y-1 text-xs text-rose-200">
                      {pwResult.vulnerabilities.map((v, i) => (
                        <li key={i}>• {v}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Quantum Passphrase Generator */}
                <div className="space-y-3 p-5 rounded-2xl bg-cyan-950/20 border border-cyan-900/40">
                  <div className="flex items-center space-x-2 text-cyan-400">
                    <Sparkles className="w-4 h-4" />
                    <h4 className="text-sm font-bold">Suggested Quantum-Resistant Passphrases</h4>
                  </div>
                  <p className="text-xs opacity-70">
                    High-entropy word combinations that are virtually impossible to crack with brute-force yet easy to remember:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                    {pwResult.suggested_alternatives.map((alt, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800"
                      >
                        <span className="font-mono text-xs font-semibold text-cyan-300">{alt}</span>
                        <button
                          onClick={() => copyToClipboard(alt, `alt-${idx}`)}
                          className="p-1 rounded text-slate-400 hover:text-white"
                        >
                          {copiedKey === `alt-${idx}` ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tool 2: Header Sentry */}
      {activeTool === 'header' && (
        <div className="space-y-6">
          <div className="cyber-card rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Email Header Anti-Spoofing Sentry</h3>
                <p className="text-xs opacity-70">
                  Paste raw email headers to verify SPF, DKIM, DMARC authenticity and detect friendly display-name impersonation.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider opacity-70">
                  Paste Raw Email Headers:
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => loadSampleHeader('spoofed')}
                    className="text-xs px-2.5 py-1 rounded bg-slate-800 text-rose-300 hover:bg-slate-700 border border-slate-700"
                  >
                    Load Spoofed Bank Header
                  </button>
                  <button
                    onClick={() => loadSampleHeader('valid')}
                    className="text-xs px-2.5 py-1 rounded bg-slate-800 text-emerald-300 hover:bg-slate-700 border border-slate-700"
                  >
                    Load Valid Google Header
                  </button>
                </div>
              </div>
              <textarea
                rows={6}
                value={headerInput}
                onChange={(e) => setHeaderInput(e.target.value)}
                placeholder="From: ...&#10;To: ...&#10;Subject: ...&#10;Authentication-Results: spf=pass dkim=pass..."
                className="w-full p-4 rounded-xl border border-slate-700/60 bg-slate-900/40 text-xs font-mono focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={handleInspectHeader}
                disabled={headerLoading || !headerInput.trim()}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-md transition-all"
              >
                {headerLoading ? 'Analyzing Headers...' : 'Inspect Email Headers'}
              </button>
            </div>

            {/* Header Results */}
            {headerResult && (
              <div className="pt-4 border-t border-slate-700/40 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div>
                    <span className="text-xs font-semibold uppercase opacity-60">Verification Verdict</span>
                    <h4 className="text-xl font-bold">{headerResult.verdict}</h4>
                    <p className="text-xs opacity-70 mt-1">{headerResult.recommendation}</p>
                  </div>
                  <RiskBadge risk={headerResult.risk} size="lg" />
                </div>

                {/* Authentication Pillars: SPF, DKIM, DMARC */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-1">
                    <span className="text-xs font-bold uppercase opacity-60">SPF Check</span>
                    <div className={`text-sm font-extrabold ${headerResult.authentication.spf === 'PASS' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {headerResult.authentication.spf}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-1">
                    <span className="text-xs font-bold uppercase opacity-60">DKIM Signature</span>
                    <div className={`text-sm font-extrabold ${headerResult.authentication.dkim === 'PASS' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {headerResult.authentication.dkim}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center space-y-1">
                    <span className="text-xs font-bold uppercase opacity-60">DMARC Policy</span>
                    <div className={`text-sm font-extrabold ${headerResult.authentication.dmarc === 'PASS' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {headerResult.authentication.dmarc}
                    </div>
                  </div>
                </div>

                {/* Indicators */}
                {headerResult.indicators.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-xs font-bold uppercase opacity-70">Header Anomalies Detected</h5>
                    <div className="space-y-1.5">
                      {headerResult.indicators.map((ind, i) => (
                        <div key={i} className="flex items-center space-x-2 text-xs p-2.5 rounded-lg bg-rose-950/30 border border-rose-900/50 text-rose-300">
                          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                          <span>{ind}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tool 3: QR Code Quishing Scanner */}
      {activeTool === 'qr' && (
        <div className="space-y-6">
          <div className="cyber-card rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold">QR Code "Quishing" Security Scanner</h3>
                <p className="text-xs opacity-70">
                  Inspect QR codes found on parking meters, restaurant receipts, or mailers safely before your camera opens them.
                </p>
              </div>
            </div>

            <UploadBox
              type="image"
              onFileSelected={(file) => setQrFile(file)}
              selectedFile={qrFile}
              onClear={() => { setQrFile(null); setQrResult(null); }}
            />

            <div className="flex justify-end">
              <button
                onClick={handleScanQr}
                disabled={qrLoading || !qrFile}
                className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-sm shadow-md transition-all flex items-center space-x-2"
              >
                <QrCode className="w-4 h-4" />
                <span>{qrLoading ? 'Decoding QR Code...' : 'Decode & Inspect QR'}</span>
              </button>
            </div>

            {qrError && (
              <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs">
                {qrError}
              </div>
            )}

            {qrResult && (
              <div className="pt-4 border-t border-slate-700/40 space-y-6">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="text-xs uppercase font-bold opacity-60">Decoded QR Code Target</span>
                  <div className="font-mono text-sm font-bold text-cyan-300 break-all p-3 rounded-lg bg-slate-950 border border-slate-800">
                    {qrResult.payload}
                  </div>
                </div>

                {qrResult.url_analysis && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                      <div>
                        <span className="text-xs uppercase font-bold opacity-60">Destination Threat Rating</span>
                        <h4 className="text-xl font-bold">{qrResult.url_analysis.threat_type}</h4>
                      </div>
                      <RiskBadge risk={qrResult.url_analysis.risk} size="lg" />
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                      <RiskScore score={qrResult.url_analysis.score} risk={qrResult.url_analysis.risk} />
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs leading-relaxed">
                      <strong>Safety Verdict: </strong>
                      {qrResult.url_analysis.explanation}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
