import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Analyze from './pages/Analyze';
import History from './pages/History';
import Report from './pages/Report';
import Coach from './pages/Coach';
import { Shield } from 'lucide-react';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [analyzeTab, setAnalyzeTab] = useState('text');
  const [reportId, setReportId] = useState(null);

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <Home setActivePage={setActivePage} setAnalyzeTab={setAnalyzeTab} />;
      case 'dashboard':
        return (
          <Dashboard
            setActivePage={setActivePage}
            setReportId={setReportId}
            setAnalyzeTab={setAnalyzeTab}
          />
        );
      case 'analyze':
        return <Analyze initialTab={analyzeTab} />;
      case 'history':
        return <History setActivePage={setActivePage} setReportId={setReportId} />;
      case 'report':
        return <Report reportId={reportId} setActivePage={setActivePage} />;
      case 'coach':
        return <Coach />;
      default:
        return <Home setActivePage={setActivePage} setAnalyzeTab={setAnalyzeTab} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar activePage={activePage} setActivePage={setActivePage} />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-8 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white">
              <Shield className="w-3.5 h-3.5" />
            </div>
            <span className="text-sm font-bold text-white tracking-tight">SAFE<span className="text-cyan-400">AI</span></span>
            <span className="text-xs text-slate-500">• Personal Cybersecurity Assistant</span>
          </div>

          <p className="text-xs text-slate-500 text-center">
            "Don't just detect the threat. Understand it." • Powered by Deterministic Cybersecurity Rules & AI
          </p>

          <div className="flex items-center space-x-4 text-xs text-slate-400">
            <button onClick={() => setActivePage('analyze')} className="hover:text-cyan-400 transition-colors">
              Analyze
            </button>
            <button onClick={() => setActivePage('coach')} className="hover:text-cyan-400 transition-colors">
              Coach
            </button>
            <button onClick={() => setActivePage('history')} className="hover:text-cyan-400 transition-colors">
              History
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
