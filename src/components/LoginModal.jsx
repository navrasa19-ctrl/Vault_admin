import React, { useState } from 'react';
import { Shield, Key, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';

export default function LoginModal({ onLogin, onClose }) {
  const [email, setEmail] = useState('admin@beememvault.com');
  const [otp, setOtp] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const success = await onLogin(email, otp);
    if (!success) {
      setError('Invalid admin credentials. Please use admin@beememvault.com and OTP 123456.');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg animate-fadeIn">
      <div className="relative w-full max-w-md rounded-3xl bg-[#0F1523] border border-indigo-500/30 p-8 shadow-2xl shadow-indigo-500/10">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-4">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Admin Vault Authorization</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            Authenticate using cryptographic OTP token to access Vault master controls.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Admin Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Security OTP Token</label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white tracking-widest font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold text-xs hover:from-indigo-600 hover:to-purple-700 transition shadow-lg shadow-indigo-500/20 active:scale-95 flex items-center justify-center gap-2 mt-6"
          >
            <span>{loading ? 'Authenticating...' : 'Enter Admin Vault'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
          <p className="text-[11px] text-slate-400">
            Demo pre-seeded: <strong className="text-indigo-300">admin@beememvault.com</strong> / OTP: <strong className="text-indigo-300">123456</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
