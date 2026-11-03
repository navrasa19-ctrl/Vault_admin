import React, { useState } from 'react';
import { Shield, Key, Mail, Lock, ArrowRight, Sparkles, Check, KeyRound } from 'lucide-react';

export default function LoginModal({ onLogin, onClose }) {
  const [email, setEmail] = useState('admin@beememvault.com');
  const [password, setPassword] = useState('SuperAdmin@2026');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const demoAccounts = [
    {
      title: '👑 Super Admin',
      email: 'admin@beememvault.com',
      pass: 'SuperAdmin@2026',
      badge: 'All Modules'
    },
    {
      title: '🛡️ Support Sub-Admin',
      email: 'support.admin@beememvault.com',
      pass: 'Support@2026',
      badge: 'Users & Referrals Only'
    },
    {
      title: '📁 Catalog Sub-Admin',
      email: 'catalog.admin@beememvault.com',
      pass: 'Catalog@2026',
      badge: 'Categories & i18n Only'
    }
  ];

  const pickDemo = (demo) => {
    setEmail(demo.email);
    setPassword(demo.pass);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await onLogin(email, password);
    } catch (err) {
      setError(err.message || 'Invalid admin credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md rounded-3xl bg-white border border-slate-200/90 p-8 shadow-2xl">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 mb-3">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Admin Console Login</h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xs">
            Authenticate using Super Admin or Sub-Admin credentials.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs text-center font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Login Email ID</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:outline-none focus:border-indigo-500 focus:bg-white transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-xs hover:from-indigo-700 hover:to-violet-700 transition shadow-lg shadow-indigo-500/25 active:scale-95 flex items-center justify-center gap-2 mt-5"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Console'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Login Switcher */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5 text-center">
            Quick 1-Click Role Switcher
          </div>
          <div className="space-y-1.5">
            {demoAccounts.map((d, i) => (
              <button
                key={i}
                type="button"
                onClick={() => pickDemo(d)}
                className={`w-full p-2 rounded-xl border text-left transition flex items-center justify-between text-xs ${
                  email === d.email
                    ? 'bg-indigo-50/80 border-indigo-300 ring-1 ring-indigo-500/20'
                    : 'bg-slate-50/60 hover:bg-slate-50 border-slate-200/80'
                }`}
              >
                <div>
                  <span className="font-bold text-slate-900 block">{d.title}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{d.email}</span>
                </div>
                <span className="text-[10px] font-bold text-indigo-700 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                  {d.badge}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
