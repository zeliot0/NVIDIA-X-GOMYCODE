import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, AlertCircle, Lightbulb } from 'lucide-react';
import { sendChatMessage } from '../services/api';

const STARTER_QUESTIONS = [
  "Why should I never share an OTP?",
  "How can I recognize a phishing email?",
  "What should I do if I clicked a suspicious link?",
  "Why do scammers create urgent deadlines?",
];

export default function ChatBox() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hello! I am your **SAFEAI Cybersecurity Coach**.\n\nAsk me anything about suspicious emails, scam techniques, passwords, two-factor authentication, or how to verify links safely.",
      tips: [
        "Never disclose one-time passwords (OTPs) over phone calls.",
        "Always verify unexpected account alerts through independent official apps.",
      ],
      suggested: STARTER_QUESTIONS,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (queryText) => {
    const textToSend = queryText || input;
    if (!textToSend || !textToSend.trim() || loading) return;

    const userMessage = { role: 'user', content: textToSend };
    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    try {
      const historyPayload = newHistory
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .slice(-6);

      const res = await sendChatMessage(textToSend, historyPayload);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: res.response,
          tips: res.educational_tips || [],
          suggested: res.suggested_questions || [],
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "Sorry, I encountered an issue connecting to the cybersecurity coach engine. Please try again.",
          tips: [],
          suggested: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[700px] cyber-card rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-slate-900/90 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <span>SAFEAI Cyber Coach</span>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-1.5 py-0.2 rounded border border-cyan-800">
                Interactive AI
              </span>
            </h3>
            <p className="text-xs text-slate-400">Security education, phishing prevention & safe habits</p>
          </div>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        {messages.map((msg, idx) => {
          const isUser = msg.role === 'user';
          return (
            <div key={idx} className={`flex space-x-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
              {!isUser && (
                <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 flex-shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-xl space-y-3 ${isUser ? 'items-end' : 'items-start'}`}>
                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    isUser
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-none shadow-md'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                  }`}
                >
                  <div className="whitespace-pre-line font-sans">{msg.content}</div>
                </div>

                {/* Educational tips pill list if present */}
                {!isUser && msg.tips && msg.tips.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    {msg.tips.map((tip, tIdx) => (
                      <div
                        key={tIdx}
                        className="flex items-center space-x-2 text-xs text-cyan-300 bg-cyan-950/40 border border-cyan-900/50 px-3 py-1.5 rounded-lg"
                      >
                        <Lightbulb className="w-3.5 h-3.5 flex-shrink-0 text-cyan-400" />
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Suggested follow-up questions */}
                {!isUser && msg.suggested && msg.suggested.length > 0 && idx === messages.length - 1 && (
                  <div className="pt-2">
                    <p className="text-[11px] font-semibold text-slate-400 mb-1.5 flex items-center space-x-1">
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      <span>Suggested Questions:</span>
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggested.map((q, qIdx) => (
                        <button
                          key={qIdx}
                          onClick={() => handleSend(q)}
                          className="text-xs text-left px-3 py-1.5 rounded-full bg-slate-900 hover:bg-cyan-950/60 hover:text-cyan-300 text-slate-300 border border-slate-800 hover:border-cyan-800 transition-colors"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 flex-shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center space-x-3 text-sm text-cyan-400">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="flex space-x-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <div className="p-4 bg-slate-900/90 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about phishing, passwords, MFA, suspicious links..."
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white shadow-md shadow-cyan-500/20 transition-all flex items-center space-x-1.5"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
