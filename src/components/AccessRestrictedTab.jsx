import React from 'react';
import { Lock, ShieldAlert, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';

export default function AccessRestrictedTab({ activeTab, user, onSwitchUser, setActiveTab }) {
  const tabNames = {
    overview: 'Command Overview',
    users: 'Users & Subscription Plans',
    geo: 'State Demographics (India)',
    categories: 'Categories & Taxonomy CRUD',
    plans: 'Monetization Plans CRUD',
    storage: 'Cloud Storage Cluster',
    shares: 'Protected Share Links',
    referrals: 'Refer & Earn Growth',
    languages: 'Languages & i18n Localization',
    admins: 'Sub-Admin Roles & Permissions'
  };

  const featureTitle = tabNames[activeTab] || activeTab;

  return (
    <div className="min-h-[500px] flex items-center justify-center p-6 animate-fadeIn">
      <div className="max-w-lg w-full bg-[#111827] rounded-3xl border border-slate-800 shadow-xl p-8 text-center relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-gradient-to-b from-rose-500/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 rounded-3xl bg-rose-950/60 border border-rose-800/60 flex items-center justify-center text-rose-400 shadow-lg shadow-rose-500/10 mb-4 animate-bounce">
            <Lock className="w-8 h-8" />
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-950/60 text-rose-400 border border-rose-800/60 uppercase tracking-wider mb-2">
            Module Restricted
          </span>

          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Access to {featureTitle} is Locked
          </h2>

          <p className="text-xs text-slate-500 mt-2 leading-relaxed max-w-sm">
            You are logged in as <strong className="text-slate-200">{user?.name || 'Sub-Admin'}</strong> (<span className="font-mono text-indigo-600">{user?.email}</span>). 
            Your account does not have permission to access or modify this module.
          </p>

          <div className="mt-6 w-full p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-left">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Your Active Assigned Permissions</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(user?.permissions || ['overview']).map(perm => (
                <span
                  key={perm}
                  onClick={() => setActiveTab && setActiveTab(perm)}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-950/60 text-indigo-400 border border-indigo-800/60 cursor-pointer hover:bg-indigo-900/80 transition capitalize"
                >
                  {tabNames[perm] || perm} &rarr;
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 w-full">
            <button
              onClick={() => setActiveTab && setActiveTab('overview')}
              className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Overview</span>
            </button>

            {onSwitchUser && (
              <button
                onClick={onSwitchUser}
                className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>Switch / Login Super Admin</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
