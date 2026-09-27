import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Analyze from './pages/Analyze';
import Tools from './pages/Tools';
import Arena from './pages/Arena';
import Radar from './pages/Radar';
import History from './pages/History';
import Report from './pages/Report';
import Coach from './pages/Coach';
import { Shield } from 'lucide-react';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [analyzeTab, setAnalyzeTab] = useState('text');
  const [reportId, setReportId] = useState(null);

  // Dark & Light Mode state (persisted)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('safeai_theme');
    return saved !== null ? saved === 'dark' : true;
  });

  useEffect(() => {
    localStorage.setItem('safeai_theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    } else {
      document.body.classList.add('light');
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

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
      case 'tools':
        return <Tools darkMode={darkMode} />;
      case 'arena':
        return <Arena />;
      case 'radar':
        return <Radar />;
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
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Top Navbar with Theme Toggle */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700/40 py-8 no-print transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white">
              <Shield className="w-3.5 h-3.5" />
            </div>
            <span className="text-sm font-bold tracking-tight">SAFE<span className="text-cyan-400">AI</span></span>
            <span className="text-xs opacity-60">• Enterprise-Grade Personal Defense</span>
          </div>

          <p className="text-xs opacity-60 text-center">
            "Don't just detect the threat. Understand it." • Powered by Hybrid Cybersecurity Rules & Groq AI
          </p>

          <div className="flex items-center space-x-4 text-xs opacity-75">
            <button onClick={() => setActivePage('tools')} className="hover:text-cyan-400 transition-colors">
              Tools
            </button>
            <button onClick={() => setActivePage('arena')} className="hover:text-cyan-400 transition-colors">
              Arena
            </button>
            <button onClick={() => setActivePage('radar')} className="hover:text-cyan-400 transition-colors">
              Radar
            </button>
            <button onClick={() => setActivePage('coach')} className="hover:text-cyan-400 transition-colors">
              Coach
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
