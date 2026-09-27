import React, { useState } from 'react';
import {
  MessageSquare,
  Globe,
  Image as ImageIcon,
  FileText,
  Mic,
  QrCode,
  Search,
  Loader2,
  Sparkles,
  RefreshCw,
  Download,
  Check
} from 'lucide-react';
import {
  analyzeText,
  analyzeUrl,
  analyzeImage,
  analyzeDocument,
  analyzeVoice,
  scanQrCode
} from '../services/api';
import AnalysisCard from '../components/AnalysisCard';
import UploadBox from '../components/UploadBox';

export default function Analyze({ initialTab = 'text' }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [textInput, setTextInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [exported, setExported] = useState(false);

  const tabs = [
    { id: 'text', label: 'Message / Text', icon: MessageSquare },
    { id: 'url', label: 'Safe URL', icon: Globe },
    { id: 'image', label: 'Screenshot', icon: ImageIcon },
    { id: 'document', label: 'Document', icon: FileText },
    { id: 'voice', label: 'Voice Audio', icon: Mic },
    { id: 'qr', label: 'QR Quishing', icon: QrCode },
  ];

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    setSelectedFile(null);
    setError(null);
  };

  const handleRunAnalysis = async (e) => {
    if (e) e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let res;
      if (activeTab === 'text') {
        if (!textInput.trim()) throw new Error('Please enter a message or text to inspect.');
        res = await analyzeText(textInput);
      } else if (activeTab === 'url') {
        if (!urlInput.trim()) throw new Error('Please enter a URL to inspect.');
        res = await analyzeUrl(urlInput);
      } else if (activeTab === 'image') {
        if (!selectedFile) throw new Error('Please select or drop an image file.');
        res = await analyzeImage(selectedFile);
      } else if (activeTab === 'document') {
        if (!selectedFile) throw new Error('Please select or drop a document file (PDF, DOCX, TXT).');
        res = await analyzeDocument(selectedFile);
      } else if (activeTab === 'voice') {
        if (!selectedFile) throw new Error('Please select or drop an audio file (WAV, MP3, M4A).');
        res = await analyzeVoice(selectedFile);
      } else if (activeTab === 'qr') {
        if (!selectedFile) throw new Error('Please select or drop a QR code image to inspect.');
        const qrScanRes = await scanQrCode(selectedFile);
        if (!qrScanRes.found_qr) throw new Error(qrScanRes.message || 'No QR code found.');
        if (qrScanRes.url_analysis) {
          res = {
            success: true,
            input_type: 'qr',
            analysis: qrScanRes.url_analysis,
          };
        } else {
          res = {
            success: true,
            input_type: 'qr',
            analysis: {
              risk: 'LOW',
              score: 0,
              threat_type: 'Plain Text QR Payload',
              explanation: `Decoded text payload: "${qrScanRes.payload}". Not an active web link.`,
              indicators: [],
              recommendations: ['No active web redirection detected in this QR payload.'],
              educational_tip: 'Always verify QR codes before opening unknown links.',
            }
          };
        }
      }
      setResult(res);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'An error occurred during analysis.');
    } finally {
      setLoading(false);
    }
  };

  // Demo sample loaders
  const loadTextSample = (type) => {
    if (type === 'phish') {
      setTextInput("URGENT! Your bank account has been suspended. Click here immediately to verify your password.");
    } else if (type === 'french') {
      setTextInput("Votre compte bancaire a été suspendu. Cliquez ici immédiatement pour vérifier votre mot de passe.");
    } else if (type === 'arabic') {
      setTextInput("عاجل! تم تعليق حسابك البنكي. اضغط هنا لتأكيد كلمة المرور.");
    } else {
      setTextInput("Hey, are we still meeting for lunch tomorrow at noon?");
    }
  };

  const loadUrlSample = (type) => {
    if (type === 'ip') {
      setUrlInput("http://192.168.1.1/paypal-login/verify-password");
    } else if (type === 'subdomain') {
      setUrlInput("https://secure-bank-login.example.com/verify");
    } else {
      setUrlInput("https://www.google.com");
    }
  };

  const loadFileMockSample = (name, type) => {
    const dummyBlob = new Blob(["Sample inspection data for SAFEAI security audit"], { type });
    const file = new File([dummyBlob], name, { type });
    setSelectedFile(file);
  };

  const handleExportJson = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SAFEAI_Report_${Date.now()}.json`;
    a.click();
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  };

  return (
    <div className="space-y-8 py-6 max-w-5xl mx-auto px-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight">Security Threat Analyzer</h1>
        <p className="text-sm opacity-70 max-w-xl mx-auto">
          Submit suspicious messages, links, screenshots, documents, audio messages, or QR codes for immediate AI cybersecurity assessment.
        </p>
      </div>

      {/* Input Box Card */}
      <div className="cyber-card rounded-2xl border p-6 sm:p-8 space-y-6 shadow-2xl">
        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1 sm:space-x-2 border-b border-slate-700/40 pb-4 overflow-x-auto">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isTabActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => handleTabChange(t.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  isTabActive
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                    : 'opacity-70 hover:opacity-100 hover:bg-slate-800/40'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Text */}
        {activeTab === 'text' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider opacity-70">
                Paste suspicious message, SMS, or email content:
              </label>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] opacity-60">Quick Samples:</span>
                <button
                  type="button"
                  onClick={() => loadTextSample('phish')}
                  className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-[11px] text-cyan-300 border border-slate-700"
                >
                  Bank SMS (EN)
                </button>
                <button
                  type="button"
                  onClick={() => loadTextSample('french')}
                  className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-[11px] text-cyan-300 border border-slate-700"
                >
                  Banque (FR)
                </button>
                <button
                  type="button"
                  onClick={() => loadTextSample('arabic')}
                  className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-[11px] text-cyan-300 border border-slate-700"
                >
                  رسالة بنك (AR)
                </button>
                <button
                  type="button"
                  onClick={() => loadTextSample('safe')}
                  className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-[11px] text-emerald-300 border border-slate-700"
                >
                  Safe Message
                </button>
              </div>
            </div>

            <textarea
              rows={5}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="e.g. URGENT! Your account has been suspended. Click here to verify your password immediately..."
              className="w-full p-4 rounded-xl border border-slate-700/60 bg-slate-900/40 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        )}

        {/* Tab 2: URL */}
        {activeTab === 'url' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider opacity-70">
                Enter Web URL or link destination:
              </label>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] opacity-60">Quick Samples:</span>
                <button
                  type="button"
                  onClick={() => loadUrlSample('ip')}
                  className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-[11px] text-rose-300 border border-slate-700"
                >
                  Raw IP Phishing
                </button>
                <button
                  type="button"
                  onClick={() => loadUrlSample('subdomain')}
                  className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-[11px] text-amber-300 border border-slate-700"
                >
                  Fake Subdomain
                </button>
                <button
                  type="button"
                  onClick={() => loadUrlSample('safe')}
                  className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-[11px] text-emerald-300 border border-slate-700"
                >
                  Google.com (Safe)
                </button>
              </div>
            </div>

            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://secure-bank-login.example.com/verify"
              className="w-full p-4 rounded-xl border border-slate-700/60 bg-slate-900/40 text-sm focus:outline-none focus:border-cyan-500 transition-colors"
            />
            <p className="text-[11px] opacity-60 font-mono">
              Note: SAFEAI analyzes links safely without executing or browsing untrusted code.
            </p>
          </div>
        )}

        {/* Tab 3: Screenshot */}
        {activeTab === 'image' && (
          <div className="space-y-4">
            <UploadBox
              type="image"
              onFileSelected={(file) => setSelectedFile(file)}
              selectedFile={selectedFile}
              onClear={() => setSelectedFile(null)}
            />
            <div className="flex items-center space-x-2">
              <span className="text-xs opacity-60">Quick Demo Test:</span>
              <button
                type="button"
                onClick={() => loadFileMockSample('fake_bank_login.png', 'image/png')}
                className="text-xs px-2.5 py-1 rounded bg-slate-800 text-cyan-300 border border-slate-700 hover:bg-slate-700"
              >
                Load Bank Login Screenshot Sample
              </button>
            </div>
          </div>
        )}

        {/* Tab 4: Document */}
        {activeTab === 'document' && (
          <div className="space-y-4">
            <UploadBox
              type="document"
              onFileSelected={(file) => setSelectedFile(file)}
              selectedFile={selectedFile}
              onClear={() => setSelectedFile(null)}
            />
            <div className="flex items-center space-x-2">
              <span className="text-xs opacity-60">Quick Demo Test:</span>
              <button
                type="button"
                onClick={() => loadFileMockSample('overdue_invoice.pdf', 'application/pdf')}
                className="text-xs px-2.5 py-1 rounded bg-slate-800 text-cyan-300 border border-slate-700 hover:bg-slate-700"
              >
                Load Overdue Invoice Sample
              </button>
            </div>
          </div>
        )}

        {/* Tab 5: Voice */}
        {activeTab === 'voice' && (
          <div className="space-y-4">
            <UploadBox
              type="voice"
              onFileSelected={(file) => setSelectedFile(file)}
              selectedFile={selectedFile}
              onClear={() => setSelectedFile(null)}
            />
            <div className="flex items-center space-x-2">
              <span className="text-xs opacity-60">Quick Demo Test:</span>
              <button
                type="button"
                onClick={() => loadFileMockSample('bank_security_call.mp3', 'audio/mp3')}
                className="text-xs px-2.5 py-1 rounded bg-slate-800 text-cyan-300 border border-slate-700 hover:bg-slate-700"
              >
                Load Bank Vishing Call Sample
              </button>
            </div>
          </div>
        )}

        {/* Tab 6: QR Quishing */}
        {activeTab === 'qr' && (
          <div className="space-y-4">
            <UploadBox
              type="image"
              onFileSelected={(file) => setSelectedFile(file)}
              selectedFile={selectedFile}
              onClear={() => setSelectedFile(null)}
            />
            <p className="text-[11px] opacity-70">
              Upload a QR code sticker from parking meters, emails, or menus to decode and safely inspect its destination before scanning.
            </p>
          </div>
        )}

        {/* Error notification */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-sm">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={handleRunAnalysis}
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white shadow-lg shadow-cyan-500/25 flex items-center justify-center space-x-2 transition-all hover:scale-105"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Running Cybersecurity Analysis...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Analyze Security Risk</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Output Section */}
      {result && result.analysis && (
        <div className="pt-4 space-y-4">
          <div className="flex justify-end">
            <button
              onClick={handleExportJson}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              {exported ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5" />}
              <span>{exported ? 'Downloaded JSON' : 'Export JSON Audit'}</span>
            </button>
          </div>

          <AnalysisCard
            analysis={result.analysis}
            inputType={result.input_type || activeTab}
            recordId={result.record_id}
          />
        </div>
      )}
    </div>
  );
}
