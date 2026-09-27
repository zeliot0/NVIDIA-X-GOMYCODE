import React, { useState } from 'react';
import { Swords, Trophy, CheckCircle2, XCircle, ArrowRight, RotateCcw, AlertTriangle, ShieldCheck, Sparkles, Award } from 'lucide-react';

const SCENARIOS = [
  {
    id: 1,
    title: 'Urgent Delivery Notification',
    context: 'You receive an SMS on Saturday afternoon while expecting an online shopping order.',
    content: 'USPS Notice: Your package US-8921-22 cannot be delivered due to missing house number. Please update details within 12h at: https://usps-redelivery-postal.xyz/tracking to avoid return fees.',
    isMalicious: true,
    correctAnswer: 'MALICIOUS',
    category: 'Smishing / Urgency Lure',
    explanation: 'Notice the domain: "usps-redelivery-postal.xyz". Legitimate postal services use their apex domain (.com / .gov), never disposable .xyz domains. The 12-hour deadline creates artificial panic.',
    attackerGoal: 'Harvest credit card numbers under the guise of a $1.50 redelivery fee.',
  },
  {
    id: 2,
    title: 'Internal IT Department Password Expiry',
    context: 'An email arrives in your corporate inbox from internal IT.',
    content: 'From: IT Helpdesk <support@company.com>\nSubject: Password Expiry Notice\n\nYour workstation password will expire in 48 hours. Please change your password using the Windows standard Ctrl+Alt+Del menu or via the verified company SSO portal at https://sso.company.com.',
    isMalicious: false,
    correctAnswer: 'SAFE',
    category: 'Standard IT Security Notice',
    explanation: 'Notice that the email directs you to standard operating procedures (Ctrl+Alt+Del) or the exact internal SSO domain without requesting your current password or offering suspicious third-party links.',
    attackerGoal: 'None (Standard security hygiene reminder).',
  },
  {
    id: 3,
    title: 'Emergency Phone Call From Grandson',
    context: 'You receive a frantic phone call from someone who sounds identical to your grandson.',
    content: 'Voice: "Grandpa! I was in a car accident while on a trip and the police arrested me for damages. My phone died so I am calling from an attorney\'s burner phone. Please wire $2,500 cash via MoneyGram right now before they book me in jail!"',
    isMalicious: true,
    correctAnswer: 'MALICIOUS',
    category: 'AI Voice Cloning / Vishing',
    explanation: 'Criminals use short audio clips from TikTok or Instagram to clone a relative\'s voice. They manufacture extreme panic, forbid you from contacting parents, and demand non-reversible cash/crypto wire transfers.',
    attackerGoal: 'Extort thousands of dollars via unrecoverable cash wires.',
  },
  {
    id: 4,
    title: 'Restaurant Table QR Code',
    context: 'You sit down at a popular outdoor patio and notice a QR code sticker on the table.',
    content: 'The sticker says: "Scan to view Menu & Pay". Upon close inspection, a shiny corner is peeling off, revealing an older paper QR code underneath. The peeled sticker decodes to: "http://45.33.32.156/pay-menu".',
    isMalicious: true,
    correctAnswer: 'MALICIOUS',
    category: 'Quishing / Physical Tampering',
    explanation: 'Attackers physically overlay their own malicious QR stickers on public tables. The URL points to a raw IP address (45.33.32.156) instead of the restaurant domain, designed to steal credit card details.',
    attackerGoal: 'Intercept food payments and harvest card numbers.',
  },
  {
    id: 5,
    title: 'GitHub Security Vulnerability Notification',
    context: 'You receive an automated security notification regarding a repository you maintain.',
    content: 'From: GitHub <notifications@github.com>\nSubject: [Security] Dependabot alert for lodash vulnerability\n\nDependabot detected a High severity vulnerability in lodash. Review the Dependabot security advisory in your GitHub repository pull request: https://github.com/my-org/my-project/pull/42',
    isMalicious: false,
    correctAnswer: 'SAFE',
    category: 'Legitimate Developer Security Alert',
    explanation: 'The link points directly to the official github.com domain and references your actual repository pull request without asking for login credentials or personal information.',
    attackerGoal: 'None (Standard automated Dependabot security notice).',
  }
];

export default function Arena() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const current = SCENARIOS[currentIndex];

  const handleAnswer = (choice) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(choice);
    const isCorrect = choice === current.correctAnswer;
    if (isCorrect) setScore((prev) => prev + 1);
    setAnsweredCount((prev) => prev + 1);
  };

  const handleNext = () => {
    if (currentIndex < SCENARIOS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
    } else {
      setQuizFinished(true);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setAnsweredCount(0);
    setQuizFinished(false);
  };

  const getBadge = () => {
    if (score === 5) return { title: 'Master Cyber Defender', icon: Trophy, color: 'text-amber-400 bg-amber-950 border-amber-800' };
    if (score >= 3) return { title: 'Vigilant Security Sentinel', icon: ShieldCheck, color: 'text-cyan-400 bg-cyan-950 border-cyan-800' };
    return { title: 'Security Apprentice', icon: Award, color: 'text-slate-400 bg-slate-900 border-slate-700' };
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold">
          <Swords className="w-3.5 h-3.5" />
          <span>Interactive Cyber Training Simulator</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">Cyber Resilience Arena</h1>
        <p className="text-sm opacity-70 max-w-xl mx-auto">
          Test your threat detection instincts against realistic social engineering, smishing, quishing, and AI voice cloning attacks.
        </p>
      </div>

      {quizFinished ? (
        /* Results View */
        <div className="cyber-card rounded-3xl p-8 sm:p-12 text-center space-y-6 border shadow-2xl">
          <div className="w-20 h-20 rounded-3xl bg-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center">
            <Trophy className="w-10 h-10 text-cyan-400" />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-black">Simulation Complete!</h2>
            <p className="text-sm opacity-70">
              You scored <span className="font-extrabold text-cyan-400 text-lg">{score}</span> out of <span className="font-bold">{SCENARIOS.length}</span>
            </p>
          </div>

          {/* Badge */}
          {(() => {
            const badge = getBadge();
            const BadgeIcon = badge.icon;
            return (
              <div className={`inline-flex items-center space-x-3 px-6 py-3 rounded-2xl border font-bold text-sm ${badge.color}`}>
                <BadgeIcon className="w-5 h-5" />
                <span>Earned Title: {badge.title}</span>
              </div>
            );
          })()}

          <p className="text-xs opacity-70 max-w-md mx-auto leading-relaxed">
            {score === 5
              ? 'Outstanding performance! You possess razor-sharp cybersecurity instincts capable of spotting advanced deceptive attacks.'
              : 'Good effort! Review the detailed explanations on urgency, domain structures, and physical QR traps to sharpen your reflexes.'}
          </p>

          <div className="pt-4">
            <button
              onClick={handleReset}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-md transition-all flex items-center space-x-2 mx-auto"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Simulation</span>
            </button>
          </div>
        </div>
      ) : (
        /* Active Scenario Card */
        <div className="cyber-card rounded-3xl p-6 sm:p-10 border space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-700/40 pb-4">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                Scenario {currentIndex + 1} of {SCENARIOS.length}
              </span>
              <h3 className="text-xl font-bold">{current.title}</h3>
            </div>
            <div className="text-xs font-mono opacity-60">
              Score: <strong className="text-cyan-400">{score}</strong> / {answeredCount}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider opacity-60">Context</span>
            <p className="text-xs sm:text-sm italic opacity-80">{current.context}</p>
          </div>

          {/* Simulated Message Box */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-xs sm:text-sm text-cyan-200 whitespace-pre-line leading-relaxed shadow-inner">
            {current.content}
          </div>

          {/* Decision Buttons */}
          <div className="pt-2 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider opacity-70 block text-center">
              What is your security verdict?
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => handleAnswer('SAFE')}
                disabled={selectedAnswer !== null}
                className={`p-4 rounded-2xl font-bold text-sm border transition-all flex items-center justify-center space-x-2 ${
                  selectedAnswer === 'SAFE'
                    ? current.correctAnswer === 'SAFE'
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500'
                      : 'bg-rose-950 border-rose-500 text-rose-300 ring-2 ring-rose-500'
                    : 'bg-slate-900/80 hover:bg-slate-850 border-slate-750 hover:border-emerald-500/60'
                }`}
              >
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Legitimate & Safe</span>
              </button>

              <button
                onClick={() => handleAnswer('MALICIOUS')}
                disabled={selectedAnswer !== null}
                className={`p-4 rounded-2xl font-bold text-sm border transition-all flex items-center justify-center space-x-2 ${
                  selectedAnswer === 'MALICIOUS'
                    ? current.correctAnswer === 'MALICIOUS'
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500'
                      : 'bg-rose-950 border-rose-500 text-rose-300 ring-2 ring-rose-500'
                    : 'bg-slate-900/80 hover:bg-slate-850 border-slate-750 hover:border-rose-500/60'
                }`}
              >
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <span>Dangerous / Malicious Scam</span>
              </button>
            </div>
          </div>

          {/* Feedback Section */}
          {selectedAnswer !== null && (
            <div className="pt-4 border-t border-slate-700/40 space-y-4 animate-in fade-in duration-300">
              <div
                className={`p-4 rounded-2xl border flex items-start space-x-3 ${
                  selectedAnswer === current.correctAnswer
                    ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
                    : 'bg-rose-950/40 border-rose-800 text-rose-200'
                }`}
              >
                {selectedAnswer === current.correctAnswer ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                )}
                <div className="space-y-1 text-xs">
                  <strong className="block text-sm font-bold">
                    {selectedAnswer === current.correctAnswer ? 'Correct Analysis!' : 'Incorrect Analysis!'}
                  </strong>
                  <p className="leading-relaxed">{current.explanation}</p>
                  <p className="opacity-80 pt-1">
                    <strong>Attacker Objective:</strong> {current.attackerGoal}
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-2"
                >
                  <span>{currentIndex < SCENARIOS.length - 1 ? 'Next Scenario' : 'View Final Score'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
