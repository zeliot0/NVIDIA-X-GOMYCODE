import React, { useState } from 'react';
import {
  KeyRound,
  Mail,
  QrCode,
  Shield,
  Check,
  Copy,
  AlertTriangle,
  Flame,
  ShieldAlert,
  Sparkles,
  RefreshCw,
  Lock,
  Zap,
  Siren,
  Search,
  Coins,
  Brain,
  FileCheck,
  Clock,
  ExternalLink,
  ShieldCheck,
  Layers,
  ArrowRight
} from 'lucide-react';
import {
  auditPassword,
  inspectEmailHeader,
  scanQrCode,
  generateIncidentResponse,
  checkBreach,
  auditCrypto,
  auditPsychProfile
} from '../services/api';
import UploadBox from '../components/UploadBox';
import RiskBadge from '../components/RiskBadge';
import RiskScore from '../components/RiskScore';

export default function Tools({ darkMode, initialTool = 'incident' }) {
  const [activeTool, setActiveTool] = useState(initialTool);

  React.useEffect(() => {
    if (initialTool) {
      setActiveTool(initialTool);
    }
  }, [initialTool]);

  // Clipboard copy state
  const [copiedKey, setCopiedKey] = useState(null);

  const cleanText = (txt) => (txt ? String(txt).replace(/\\n/g, '\n').replace(/\\"/g, '"') : '');

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(cleanText(text));
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // ----------------------------------------------------
  // Tool 1: Incident Commander State
  // ----------------------------------------------------
  const [incidentType, setIncidentType] = useState('bank_fraud');
  const [incidentDetails, setIncidentDetails] = useState('');
  const [incidentLoss, setIncidentLoss] = useState('$1,250');
  const [incidentLoading, setIncidentLoading] = useState(false);
  const [incidentResult, setIncidentResult] = useState(null);

  const handleRunIncidentResponse = async () => {
    if (!incidentDetails.trim()) return;
    setIncidentLoading(true);
    try {
      const data = await generateIncidentResponse(incidentType, incidentDetails, incidentLoss);
      setIncidentResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIncidentLoading(false);
    }
  };

  const loadIncidentSample = (type) => {
    if (type === 'bank_fraud') {
      setIncidentType('bank_fraud');
      setIncidentDetails('I received an SMS claiming to be Chase Fraud alert, clicked the link and entered my online banking username, password, and SMS 2FA code. Immediately after, an unauthorized Zelle wire transfer of $1,250 was dispatched to an unknown recipient.');
      setIncidentLoss('$1,250.00 USD');
    } else if (type === 'ransomware') {
      setIncidentType('ransomware');
      setIncidentDetails('Downloaded what looked like an invoice PDF. The computer froze, all files now have a .lock extension and a text file on desktop demands 0.5 Bitcoin within 48 hours or data will be leaked.');
      setIncidentLoss('0.5 BTC ransom demand');
    } else {
      setIncidentType('account_takeover');
      setIncidentDetails('My phone suddenly lost cell service ("No Service"). A few minutes later, I received security emails on my backup address stating my Gmail password and recovery phone number were changed.');
      setIncidentLoss('Compromised primary email and cloud drive');
    }
  };

  // ----------------------------------------------------
  // Tool 2: Dark Web Breach & Stuffing Simulator State
  // ----------------------------------------------------
  const [breachQuery, setBreachQuery] = useState('target.user@domain.com');
  const [breachLoading, setBreachLoading] = useState(false);
  const [breachResult, setBreachResult] = useState(null);

  const handleRunBreachCheck = async (q) => {
    const target = q !== undefined ? q : breachQuery;
    if (!target.trim()) return;
    setBreachLoading(true);
    try {
      const data = await checkBreach(target);
      setBreachResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setBreachLoading(false);
    }
  };

  // ----------------------------------------------------
  // Tool 3: Web3 & Crypto Scam Auditor State
  // ----------------------------------------------------
  const [cryptoPayload, setCryptoPayload] = useState('');
  const [cryptoLoading, setCryptoLoading] = useState(false);
  const [cryptoResult, setCryptoResult] = useState(null);

  const handleRunCryptoAudit = async (payload) => {
    const target = payload !== undefined ? payload : cryptoPayload;
    if (!target.trim()) return;
    setCryptoLoading(true);
    try {
      const data = await auditCrypto(target);
      setCryptoResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setCryptoLoading(false);
    }
  };

  const loadCryptoSample = (type) => {
    if (type === 'permit2') {
      const sample = `Permit2 Signature Request:
Contract: 0x000000000022d473030f116ddee9f6b43ac78ba3
Spender: 0x7a250d5630b4cf539739df2c5dacb4c659f2488d (Fake Swap Router)
Amount: 115792089237316195423570985008687907853269984665640564039457584007913129639935 (Unlimited)
Nonce: 0
Deadline: 1893456000
Signature: 0x8b321a6c98...`;
      setCryptoPayload(sample);
      handleRunCryptoAudit(sample);
    } else if (type === 'airdrop') {
      const sample = `Claim 5,000 $BLUR / $UNI Airdrop:
Connect your MetaMask wallet and execute:
function claimReward() public payable {
    require(msg.value >= 0.05 ether, "Gas fee coverage");
    payable(owner).transfer(msg.value);
}`;
      setCryptoPayload(sample);
      handleRunCryptoAudit(sample);
    } else {
      const sample = `Uniswap V3 Swap Router Contract:
0xE592427A0AEce92De3Edee1F18E0157C05861564
Official deployment on Ethereum Mainnet
Standard Multicall2 integration`;
      setCryptoPayload(sample);
      handleRunCryptoAudit(sample);
    }
  };

  // ----------------------------------------------------
  // Tool 4: Psych Manipulation Radar State
  // ----------------------------------------------------
  const [psychInput, setPsychInput] = useState('');
  const [psychLoading, setPsychLoading] = useState(false);
  const [psychResult, setPsychResult] = useState(null);

  const handleRunPsychAudit = async (text) => {
    const target = text !== undefined ? text : psychInput;
    if (!target.trim()) return;
    setPsychLoading(true);
    try {
      const data = await auditPsychProfile(target);
      setPsychResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setPsychLoading(false);
    }
  };

  const loadPsychSample = (type) => {
    if (type === 'ceo') {
      const sample = `URGENT from CEO Richard Vance: I am stuck in an executive board meeting with our investors and cannot take calls. I need you to immediately purchase 10 Apple $100 gift cards for our VIP client rewards program. Scratch the back, send photos of the PIN codes directly to my personal email within the next 20 minutes before this deal falls apart. Do not mention this to anyone in HR yet.`;
      setPsychInput(sample);
      handleRunPsychAudit(sample);
    } else if (type === 'irs') {
      const sample = `FINAL NOTICE FROM INTERNAL REVENUE SERVICE: A federal arrest warrant has been issued under your Social Security Number for tax evasion and fraudulent offshore filings. Local sheriffs are en route to your home address to detain you within 45 minutes unless you immediately call 800-555-0199 and settle the bond amount of $4,800. Do not hang up or attempt to consult legal counsel.`;
      setPsychInput(sample);
      handleRunPsychAudit(sample);
    } else {
      const sample = `Exclusive insider alpha: Elon Musk just endorsed this unreleased AI token. 9,420 investors joined in the last 15 minutes! Presale pool is 98% full. Put $500 in now and guarantee 100x return before DEX listing in 3 hours! Miss this and regret forever!`;
      setPsychInput(sample);
      handleRunPsychAudit(sample);
    }
  };

  // ----------------------------------------------------
  // Tool 5: Password Sentinel State
  // ----------------------------------------------------
  const [passwordInput, setPasswordInput] = useState('P@ssword123!');
  const [pwResult, setPwResult] = useState(null);
  const [pwLoading, setPwLoading] = useState(false);

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

  // ----------------------------------------------------
  // Tool 6: Email Header Sentry State
  // ----------------------------------------------------
  const [headerInput, setHeaderInput] = useState('');
  const [headerResult, setHeaderResult] = useState(null);
  const [headerLoading, setHeaderLoading] = useState(false);

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

  // ----------------------------------------------------
  // Tool 7: QR Code Quishing State
  // ----------------------------------------------------
  const [qrFile, setQrFile] = useState(null);
  const [qrResult, setQrResult] = useState(null);
  const [qrLoading, setQrLoading] = useState(false);
  const [qrError, setQrError] = useState(null);

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

  const getMeterColor = (score) => {
    if (score >= 70) return 'from-rose-500 to-red-600';
    if (score >= 40) return 'from-amber-500 to-yellow-500';
    return 'from-emerald-500 to-teal-500';
  };

  const toolTabs = [
    { id: 'incident', label: 'Incident Commander', icon: Siren, tag: 'Emergency' },
    { id: 'breach', label: 'Dark Web Breach', icon: Search, tag: 'Intelligence' },
    { id: 'crypto', label: 'Web3 & Crypto Audit', icon: Coins, tag: 'Smart Contracts' },
    { id: 'psych', label: 'Psychology Radar', icon: Brain, tag: 'Social Eng.' },
    { id: 'password', label: 'Password Sentinel', icon: KeyRound, tag: 'Entropy' },
    { id: 'header', label: 'Header Sentry', icon: Mail, tag: 'Anti-Spoof' },
    { id: 'qr', label: 'Quishing Scanner', icon: QrCode, tag: 'QR Defense' },
  ];

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold">
          <Zap className="w-3.5 h-3.5" />
          <span>Autonomous Cyber Defense Arsenal</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">Cybersecurity Beast Power Suite</h1>
        <p className="text-sm opacity-70 max-w-2xl mx-auto">
          Enterprise-tier AI countermeasures: triage live fraud incidents, generate legal chargeback notices, audit Web3 drainer contracts, simulate dark web credential exposure, and deconstruct attacker psychology.
        </p>
      </div>

      {/* Tool Selector Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 border-b border-slate-700/40 pb-4">
        {toolTabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTool === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTool(t.id)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 ring-1 ring-cyan-400/40'
                  : 'opacity-75 hover:opacity-100 bg-slate-900/40 hover:bg-slate-800/60 border border-slate-800/80'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
              <span className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded ${
                isActive ? 'bg-black/30 text-cyan-200' : 'bg-slate-800 text-slate-400'
              }`}>
                {t.tag}
              </span>
            </button>
          );
        })}
      </div>

      {/* ---------------------------------------------------- */}
      {/* TOOL 1: INCIDENT COMMANDER                           */}
      {/* ---------------------------------------------------- */}
      {activeTool === 'incident' && (
        <div className="space-y-6">
          <div className="cyber-card rounded-3xl p-6 sm:p-8 space-y-6 border">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
                <Siren className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Emergency Incident Commander & Legal Generator</h3>
                <p className="text-xs opacity-70">
                  Immediate 3-tier containment strategy, Regulation E formal bank dispute notice, and official police cybercrime complaint draft.
                </p>
              </div>
            </div>

            {/* Quick Demo Preloads */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="opacity-60">Preload Scenario:</span>
              <button
                onClick={() => loadIncidentSample('bank_fraud')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 text-rose-300 border border-slate-700 hover:bg-slate-750"
              >
                🚨 Wire / Zelle Bank Fraud ($1,250)
              </button>
              <button
                onClick={() => loadIncidentSample('ransomware')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 text-amber-300 border border-slate-700 hover:bg-slate-750"
              >
                🔒 PC Ransomware & File Encryption
              </button>
              <button
                onClick={() => loadIncidentSample('account_takeover')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 text-cyan-300 border border-slate-700 hover:bg-slate-750"
              >
                📱 SIM Swap & Gmail Takeover
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider opacity-70">
                  Incident Classification:
                </label>
                <select
                  value={incidentType}
                  onChange={(e) => setIncidentType(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-700/60 bg-slate-900/60 text-sm focus:outline-none focus:border-cyan-500"
                >
                  <option value="bank_fraud">Bank & Credit Card Fraud / Unauthorized Wire</option>
                  <option value="credential_theft">Credential Phishing / Password Leak</option>
                  <option value="account_takeover">SIM Swap / Email Account Takeover</option>
                  <option value="ransomware">Ransomware / Malware Infection</option>
                  <option value="crypto_drain">Web3 Crypto Wallet Drain</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider opacity-70">
                  Estimated Financial / Data Loss:
                </label>
                <input
                  type="text"
                  value={incidentLoss}
                  onChange={(e) => setIncidentLoss(e.target.value)}
                  placeholder="e.g. $1,250 or Compromised Payroll Info"
                  className="w-full px-4 py-3 rounded-xl border border-slate-700/60 bg-slate-900/60 text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider opacity-70">
                What Happened? (Describe narrative, timestamps, and suspect links/numbers):
              </label>
              <textarea
                rows={4}
                value={incidentDetails}
                onChange={(e) => setIncidentDetails(e.target.value)}
                placeholder="Explain what happened: e.g. Received a fake text from bank, clicked link, gave 2FA code, money left account..."
                className="w-full p-4 rounded-xl border border-slate-700/60 bg-slate-900/60 text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleRunIncidentResponse}
                disabled={incidentLoading || !incidentDetails.trim()}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-rose-600/25 transition-all flex items-center space-x-2"
              >
                <Siren className="w-4 h-4" />
                <span>{incidentLoading ? 'Formulating Emergency Defense...' : 'Deploy Incident Response'}</span>
              </button>
            </div>

            {/* Incident Response Output */}
            {incidentResult && (
              <div className="pt-6 border-t border-slate-700/40 space-y-6">
                {/* Header Verdict */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <div className="space-y-1">
                    <span className="text-xs uppercase font-mono text-rose-400 font-bold">Emergency Incident Protocol</span>
                    <h4 className="text-lg font-bold">{incidentResult.summary || 'Immediate containment initiated'}</h4>
                  </div>
                  <RiskBadge risk={incidentResult.severity || 'HIGH'} size="lg" />
                </div>

                {/* Containment Timeline */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-wider flex items-center space-x-2 text-cyan-400">
                    <Clock className="w-4 h-4" />
                    <span>3-Phase Tactical Containment Action Plan</span>
                  </h4>

                  {Array.isArray(incidentResult.containment_timeline) ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {incidentResult.containment_timeline.map((ph, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black uppercase text-rose-400">{ph.phase}</span>
                          </div>
                          <ul className="space-y-2 text-xs text-slate-200">
                            {ph.actions?.map((act, i) => (
                              <li key={i} className="flex items-start space-x-2">
                                <span className="font-bold text-rose-400 flex-shrink-0">•</span>
                                <span>{act}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Phase 1: 0-15 Min */}
                      <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-900/60 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black uppercase text-rose-400">Phase 1: Immediate</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                            0 - 15 Mins
                          </span>
                        </div>
                        <ul className="space-y-2 text-xs text-rose-100">
                          {incidentResult.containment_plan?.immediate_0_to_15m?.map((step, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <span className="font-bold text-rose-400 flex-shrink-0">•</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Phase 2: 1-2 Hours */}
                      <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-900/60 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black uppercase text-amber-400">Phase 2: Lockdown</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                            1 - 2 Hours
                          </span>
                        </div>
                        <ul className="space-y-2 text-xs text-amber-100">
                          {incidentResult.containment_plan?.short_term_1_to_2h?.map((step, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <span className="font-bold text-amber-400 flex-shrink-0">•</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Phase 3: 24-48 Hours */}
                      <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-900/60 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black uppercase text-emerald-400">Phase 3: Remediation</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                            24 - 48 Hours
                          </span>
                        </div>
                        <ul className="space-y-2 text-xs text-emerald-100">
                          {incidentResult.containment_plan?.resolution_24_to_48h?.map((step, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <span className="font-bold text-emerald-400 flex-shrink-0">•</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                {/* Dispute & Police Documents */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                  {/* Formal Bank Dispute Notice */}
                  {(incidentResult.dispute_letter_template || incidentResult.bank_dispute_letter) && (
                    <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-cyan-400">
                          <FileCheck className="w-4 h-4" />
                          <h5 className="text-xs font-bold uppercase tracking-wider">
                            Formal Bank Dispute Letter (Reg E)
                          </h5>
                        </div>
                        <button
                          onClick={() => copyToClipboard(incidentResult.dispute_letter_template || incidentResult.bank_dispute_letter, 'bank_letter')}
                          className="flex items-center space-x-1 text-xs px-2.5 py-1 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-300 hover:bg-cyan-900"
                        >
                          {copiedKey === 'bank_letter' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedKey === 'bank_letter' ? 'Copied' : 'Copy Notice'}</span>
                        </button>
                      </div>
                      <pre className="text-[11px] font-mono whitespace-pre-wrap p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 max-h-60 overflow-y-auto leading-relaxed">
                        {cleanText(incidentResult.dispute_letter_template || incidentResult.bank_dispute_letter)}
                      </pre>
                    </div>
                  )}

                  {/* Formal Police Cybercrime Complaint */}
                  {incidentResult.police_report_draft && (
                    <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-rose-400">
                          <ShieldAlert className="w-4 h-4" />
                          <h5 className="text-xs font-bold uppercase tracking-wider">
                            Police Cybercrime Complaint Draft (IC3)
                          </h5>
                        </div>
                        <button
                          onClick={() => copyToClipboard(incidentResult.police_report_draft, 'police_letter')}
                          className="flex items-center space-x-1 text-xs px-2.5 py-1 rounded-lg bg-rose-950 border border-rose-800 text-rose-300 hover:bg-rose-900"
                        >
                          {copiedKey === 'police_letter' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedKey === 'police_letter' ? 'Copied' : 'Copy Draft'}</span>
                        </button>
                      </div>
                      <pre className="text-[11px] font-mono whitespace-pre-wrap p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 max-h-60 overflow-y-auto leading-relaxed">
                        {cleanText(incidentResult.police_report_draft)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TOOL 2: DARK WEB BREACH RADAR                        */}
      {/* ---------------------------------------------------- */}
      {activeTool === 'breach' && (
        <div className="space-y-6">
          <div className="cyber-card rounded-3xl p-6 sm:p-8 space-y-6 border">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                <Search className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Dark Web Exposure & Credential Stuffing Radar</h3>
                <p className="text-xs opacity-70">
                  Inspect simulated historical database leaks, compromised passwords, and dark web pastebin dumps for any identity.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider opacity-70">
                Email Address or Username:
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={breachQuery}
                  onChange={(e) => setBreachQuery(e.target.value)}
                  placeholder="e.g. john.doe@corporate.com"
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-700/60 bg-slate-900/60 text-sm focus:outline-none focus:border-cyan-500"
                />
                <button
                  onClick={() => handleRunBreachCheck()}
                  disabled={breachLoading || !breachQuery.trim()}
                  className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <Search className="w-4 h-4" />
                  <span>{breachLoading ? 'Searching Dumps...' : 'Search Dark Web'}</span>
                </button>
              </div>
            </div>

            {/* Quick Demo Preloads */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="opacity-60">Test Samples:</span>
              <button
                onClick={() => { setBreachQuery('ceo.victim@techcorp.io'); handleRunBreachCheck('ceo.victim@techcorp.io'); }}
                className="px-2.5 py-1 rounded-lg bg-slate-800 text-rose-300 border border-slate-700 hover:bg-slate-750"
              >
                High-Exposure Identity
              </button>
              <button
                onClick={() => { setBreachQuery('clean.user2026@proton.me'); handleRunBreachCheck('clean.user2026@proton.me'); }}
                className="px-2.5 py-1 rounded-lg bg-slate-800 text-emerald-300 border border-slate-700 hover:bg-slate-750"
              >
                Clean Account
              </button>
            </div>

            {/* Breach Results */}
            {breachResult && (
              <div className="pt-6 border-t border-slate-700/40 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <div className="space-y-1">
                    <span className="text-xs uppercase font-mono text-cyan-400 font-bold">Target Identity: {breachResult.query}</span>
                    <h4 className="text-xl font-extrabold">{breachResult.threat_rating || breachResult.compromise_status || 'Compromise Detected'}</h4>
                    <p className="text-xs opacity-70">
                      Total historical incidents: {breachResult.total_breaches_found || breachResult.breach_count || breachResult.breaches?.length || 0} databases
                      {breachResult.credential_stuffing_risk && ` • Stuffing Risk: ${breachResult.credential_stuffing_risk}`}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    {breachResult.compromise_score !== undefined && (
                      <div className="text-right">
                        <span className="text-xs font-mono opacity-60">Compromise Index</span>
                        <div className="text-2xl font-black text-rose-400">{breachResult.compromise_score}/100</div>
                      </div>
                    )}
                    <RiskBadge risk={breachResult.risk_level || (breachResult.compromise_score > 40 ? 'HIGH' : 'LOW')} size="lg" />
                  </div>
                </div>

                {/* Breached Databases Table */}
                {breachResult.breaches && breachResult.breaches.length > 0 && (
                  <div className="space-y-3">
                    <h5 className="text-xs font-bold uppercase tracking-wider opacity-70">
                      Associated Breach Incidents
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {breachResult.breaches.map((b, i) => {
                        const dataList = b.data || b.data_classes || [];
                        return (
                          <div key={i} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-sm text-cyan-300">{b.name}</span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                                {b.year || b.date}
                              </span>
                            </div>
                            <div className="text-xs opacity-70">
                              <strong>Exposed Data: </strong>
                              {Array.isArray(dataList) ? dataList.join(', ') : String(dataList)}
                            </div>
                            {b.records && (
                              <div className="text-[11px] font-mono text-slate-400">
                                Total leaked accounts: {b.records}
                              </div>
                            )}
                            {b.description && (
                              <p className="text-[11px] opacity-60 leading-relaxed italic">{b.description}</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Priority Rotation Roadmap */}
                {(breachResult.password_rotation_plan || breachResult.rotation_plan) && (
                  <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-900/40 space-y-3">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center space-x-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Immediate Credential Rotation Roadmap</span>
                    </h5>
                    <div className="space-y-2">
                      {(breachResult.password_rotation_plan || breachResult.rotation_plan).map((step, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-xs text-amber-100">
                          <ArrowRight className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                          <span>{step}</span>
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

      {/* ---------------------------------------------------- */}
      {/* TOOL 3: WEB3 & CRYPTO SCAM AUDITOR                   */}
      {/* ---------------------------------------------------- */}
      {activeTool === 'crypto' && (
        <div className="space-y-6">
          <div className="cyber-card rounded-3xl p-6 sm:p-8 space-y-6 border">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                <Coins className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Web3 Smart Contract & Wallet Drainer Auditor</h3>
                <p className="text-xs opacity-70">
                  Inspect Permit2 unlimited drain requests, malicious ERC-20 approvals, fake airdrop signatures, and honeypot lockups.
                </p>
              </div>
            </div>

            {/* Quick Demo Preloads */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="opacity-60">Test Samples:</span>
              <button
                onClick={() => loadCryptoSample('permit2')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 text-rose-300 border border-slate-700 hover:bg-slate-750"
              >
                ☠️ Permit2 Unlimited Drainer Signature
              </button>
              <button
                onClick={() => loadCryptoSample('airdrop')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 text-amber-300 border border-slate-700 hover:bg-slate-750"
              >
                🎁 Fake Uniswap/Blur Airdrop Claim
              </button>
              <button
                onClick={() => loadCryptoSample('legit')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 text-emerald-300 border border-slate-700 hover:bg-slate-750"
              >
                ✅ Official Uniswap V3 Swap Router
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider opacity-70">
                Paste Smart Contract Code, Address, or Wallet Signature Request:
              </label>
              <textarea
                rows={6}
                value={cryptoPayload}
                onChange={(e) => setCryptoPayload(e.target.value)}
                placeholder="Paste contract address, ABI, function call, or wallet signature request..."
                className="w-full p-4 rounded-xl border border-slate-700/60 bg-slate-900/60 font-mono text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => handleRunCryptoAudit()}
                disabled={cryptoLoading || !cryptoPayload.trim()}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 disabled:opacity-50 text-slate-950 font-bold text-sm shadow-md transition-all flex items-center space-x-2"
              >
                <Coins className="w-4 h-4" />
                <span>{cryptoLoading ? 'Auditing Bytecode & Signatures...' : 'Audit Web3 Safety'}</span>
              </button>
            </div>

            {/* Crypto Result */}
            {cryptoResult && (
              <div className="pt-6 border-t border-slate-700/40 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs uppercase font-mono opacity-60">Web3 Threat Classification</span>
                      {cryptoResult.drain_risk_level && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold">
                          {cryptoResult.drain_risk_level}
                        </span>
                      )}
                    </div>
                    <h4 className="text-xl font-extrabold">{cryptoResult.threat_classification || cryptoResult.threat_type}</h4>
                    <p className="text-xs opacity-70">{cryptoResult.explanation || cryptoResult.summary}</p>
                    {cryptoResult.attack_vector && (
                      <p className="text-xs text-amber-300/90 font-mono">
                        Vector: {cryptoResult.attack_vector}
                      </p>
                    )}
                  </div>
                  <RiskBadge risk={cryptoResult.risk_tier || cryptoResult.risk || 'CRITICAL'} size="lg" />
                </div>

                {/* Red Flags / Indicators */}
                {((cryptoResult.red_flags && cryptoResult.red_flags.length > 0) || (cryptoResult.indicators && cryptoResult.indicators.length > 0)) && (
                  <div className="space-y-2">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-rose-300">
                      Identified Malicious Exploits & Bytecode Signals
                    </h5>
                    <div className="space-y-2">
                      {(cryptoResult.red_flags || cryptoResult.indicators).map((flag, idx) => (
                        <div key={idx} className="flex items-center space-x-2 p-3 rounded-xl bg-rose-950/30 border border-rose-900/60 text-xs text-rose-200">
                          <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                          <span>{flag}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {cryptoResult.recommendations && cryptoResult.recommendations.length > 0 && (
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                      Defender Mitigation Steps
                    </h5>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {cryptoResult.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <span className="font-bold text-cyan-400 flex-shrink-0">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Revoke Advice */}
                <div className="p-4 rounded-xl bg-slate-900 border border-cyan-900/40 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-cyan-400 uppercase">Emergency Revoke Recommendation</span>
                    <p className="text-xs opacity-75">{cryptoResult.revoke_action || 'Inspect active token allowances and immediately revoke any unverified addresses.'}</p>
                  </div>
                  <a
                    href="https://revoke.cash"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 text-xs font-bold flex items-center space-x-1.5 flex-shrink-0"
                  >
                    <span>Revoke.cash</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TOOL 4: PSYCHOLOGICAL MANIPULATION RADAR             */}
      {/* ---------------------------------------------------- */}
      {activeTool === 'psych' && (
        <div className="space-y-6">
          <div className="cyber-card rounded-3xl p-6 sm:p-8 space-y-6 border">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Social Engineering & Psychological Trigger Radar</h3>
                <p className="text-xs opacity-70">
                  Deconstructs deceptive messages across Cialdini's persuasion spectrum (Urgency, Fear, Authority, Scarcity, Greed) and exposes cognitive bias manipulation.
                </p>
              </div>
            </div>

            {/* Quick Demo Preloads */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="opacity-60">Test Samples:</span>
              <button
                onClick={() => loadPsychSample('ceo')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 text-purple-300 border border-slate-700 hover:bg-slate-750"
              >
                💼 Fake CEO Gift Card Lure
              </button>
              <button
                onClick={() => loadPsychSample('irs')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 text-rose-300 border border-slate-700 hover:bg-slate-750"
              >
                ⚖️ IRS / Law Enforcement Intimidation
              </button>
              <button
                onClick={() => loadPsychSample('crypto')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 text-amber-300 border border-slate-700 hover:bg-slate-750"
              >
                🚀 100x Crypto Presale FOMO Trap
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider opacity-70">
                Paste Suspicious Message, Voicemail Transcript, or Email:
              </label>
              <textarea
                rows={5}
                value={psychInput}
                onChange={(e) => setPsychInput(e.target.value)}
                placeholder="Paste suspect text to deconstruct attacker psychological levers..."
                className="w-full p-4 rounded-xl border border-slate-700/60 bg-slate-900/60 text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => handleRunPsychAudit()}
                disabled={psychLoading || !psychInput.trim()}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-purple-600/25 transition-all flex items-center space-x-2"
              >
                <Brain className="w-4 h-4" />
                <span>{psychLoading ? 'Deconstructing Tactics...' : 'Deconstruct Psychology'}</span>
              </button>
            </div>

            {/* Psych Result */}
            {psychResult && (
              <div className="pt-6 border-t border-slate-700/40 space-y-6">
                {/* Header overview */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <div className="space-y-1">
                    <span className="text-xs uppercase font-mono text-purple-400 font-bold">Psychological Deconstruction</span>
                    <h4 className="text-xl font-extrabold">{psychResult.primary_vector || 'Social Engineering Exploit'}</h4>
                    {psychResult.psychological_breakdown && (
                      <p className="text-xs opacity-75 leading-relaxed mt-1">{psychResult.psychological_breakdown}</p>
                    )}
                  </div>
                  {psychResult.manipulation_score !== undefined && (
                    <div className="text-right flex-shrink-0">
                      <span className="text-xs font-mono opacity-60">Manipulation Index</span>
                      <div className="text-2xl font-black text-purple-400">{psychResult.manipulation_score}/100</div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(psychResult.cialdini_principles || psychResult.influence_vectors || {}).map(([key, item]) => {
                    const score = typeof item === 'object' && item !== null ? item.score : Number(item) || 0;
                    const note = typeof item === 'object' && item !== null ? item.notes : '';
                    return (
                      <div key={key} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold uppercase tracking-wider capitalize text-slate-200">
                            {key.replace('_', ' ')}
                          </span>
                          <span className="font-mono font-extrabold text-purple-400 text-sm">{score}%</span>
                        </div>
                        <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${getMeterColor(score)} transition-all duration-700`}
                            style={{ width: `${Math.min(Math.max(score, 5), 100)}%` }}
                          />
                        </div>
                        {note && <p className="text-[11px] opacity-70 italic">{note}</p>}
                      </div>
                    );
                  })}
                </div>

                {/* Cognitive Biases */}
                {((psychResult.exploited_cognitive_bias) || (psychResult.cognitive_biases && psychResult.cognitive_biases.length > 0)) && (
                  <div className="p-5 rounded-2xl bg-purple-950/20 border border-purple-900/40 space-y-3">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-purple-300">
                      Cognitive Biases Targeted By Attacker
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {(Array.isArray(psychResult.exploited_cognitive_bias)
                        ? psychResult.exploited_cognitive_bias
                        : psychResult.exploited_cognitive_bias
                        ? [psychResult.exploited_cognitive_bias]
                        : psychResult.cognitive_biases || []
                      ).map((b, i) => (
                        <span key={i} className="px-3 py-1 rounded-xl text-xs font-bold bg-purple-950/90 border border-purple-800 text-purple-200">
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Countermeasure */}
                {psychResult.countermeasure && (
                  <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-900/40 space-y-1.5">
                    <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Recommended Cognitive Firewall Action</span>
                    </div>
                    <p className="text-xs text-emerald-100 leading-relaxed font-sans">
                      {psychResult.countermeasure}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TOOL 5: PASSWORD SENTINEL (EXISTING)                 */}
      {/* ---------------------------------------------------- */}
      {activeTool === 'password' && (
        <div className="space-y-6">
          <div className="cyber-card rounded-3xl p-6 sm:p-8 space-y-6 border">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                <Lock className="w-6 h-6" />
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
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-700/60 bg-slate-900/60 text-sm focus:outline-none focus:border-cyan-500"
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
                className="px-2.5 py-1 rounded-lg bg-slate-800 text-rose-300 border border-slate-700 hover:bg-slate-750"
              >
                Weak ("123456")
              </button>
              <button
                onClick={() => { setPasswordInput('P@ssw0rd2024'); handleAuditPassword('P@ssw0rd2024'); }}
                className="px-2.5 py-1 rounded-lg bg-slate-800 text-amber-300 border border-slate-700 hover:bg-slate-750"
              >
                Moderate ("P@ssw0rd2024")
              </button>
              <button
                onClick={() => { setPasswordInput('cosmic-velvet-falcon92#'); handleAuditPassword('cosmic-velvet-falcon92#'); }}
                className="px-2.5 py-1 rounded-lg bg-slate-800 text-emerald-300 border border-slate-700 hover:bg-slate-750"
              >
                Quantum Grade Passphrase
              </button>
            </div>

            {/* Result Area */}
            {pwResult && (
              <div className="pt-6 border-t border-slate-700/40 space-y-6">
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

      {/* ---------------------------------------------------- */}
      {/* TOOL 6: EMAIL HEADER SENTRY                          */}
      {/* ---------------------------------------------------- */}
      {activeTool === 'header' && (
        <div className="space-y-6">
          <div className="cyber-card rounded-3xl p-6 sm:p-8 space-y-6 border">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                <Mail className="w-6 h-6" />
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
                    className="text-xs px-2.5 py-1 rounded bg-slate-800 text-rose-300 hover:bg-slate-750 border border-slate-700"
                  >
                    Load Spoofed Bank Header
                  </button>
                  <button
                    onClick={() => loadSampleHeader('valid')}
                    className="text-xs px-2.5 py-1 rounded bg-slate-800 text-emerald-300 hover:bg-slate-750 border border-slate-700"
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
                className="w-full p-4 rounded-xl border border-slate-700/60 bg-slate-900/60 text-xs font-mono focus:outline-none focus:border-cyan-500"
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
              <div className="pt-6 border-t border-slate-700/40 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div>
                    <span className="text-xs font-semibold uppercase opacity-60">Verification Verdict</span>
                    <h4 className="text-xl font-bold">{headerResult.verdict}</h4>
                    <p className="text-xs opacity-70 mt-1">{headerResult.recommendation}</p>
                  </div>
                  <RiskBadge risk={headerResult.risk} size="lg" />
                </div>

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

      {/* ---------------------------------------------------- */}
      {/* TOOL 7: QR CODE QUISHING SCANNER                     */}
      {/* ---------------------------------------------------- */}
      {activeTool === 'qr' && (
        <div className="space-y-6">
          <div className="cyber-card rounded-3xl p-6 sm:p-8 space-y-6 border">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                <QrCode className="w-6 h-6" />
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
              <div className="pt-6 border-t border-slate-700/40 space-y-6">
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
