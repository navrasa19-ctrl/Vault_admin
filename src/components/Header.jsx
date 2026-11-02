import React, { useState } from 'react';
import { ShieldCheck, Search, Bell, Globe, LogOut, Download, Sparkles, UserCheck } from 'lucide-react';
import { exportToCsv } from '../utils/exportCsv';

export default function Header({ user, onLogout, onOpenLogin, onSearch, currentLang, setLang, stats, users }) {
  const [searchVal, setSearchVal] = useState('');

  const handleSearchChange = (e) => {
    setSearchVal(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  const handleExportAll = () => {
    if (!users || !users.length) return;
    exportToCsv('vault_full_user_roster', users, [
      { key: 'name', label: 'Full Name' },
      { key: 'email', label: 'Email Address' },
      { key: 'phone', label: 'Phone' },
      { key: 'plan', label: 'Subscription Plan' },
      { key: 'role', label: 'Access Role' },
      { key: 'state', label: 'State / Region' },
      { key: 'documentCount', label: 'Total Vaulted Docs' },
      { key: 'storageMB', label: 'Storage Used (MB)' },
      { key: 'createdAt', label: 'Registration Date' }
    ]);
  };

  return (
    <header className="sticky top-0 z-30 h-20 bg-[#080B11]/80 backdrop-blur-xl border-b border-white/[0.08] px-6 flex items-center justify-between">
      {/* Brand & Live Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white font-['Space_Grotesk']">VAULT</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                Mission Control
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Enterprise Security & System Ops</p>
          </div>
        </div>

        {/* Live operational badge */}
        <div className="hidden lg:flex items-center gap-2 ml-4 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>AWS Mumbai (ap-south-1) · Live</span>
        </div>
      </div>

      {/* Center Search Input */}
      <div className="hidden md:flex items-center relative w-96">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
        <input
          type="text"
          value={searchVal}
          onChange={handleSearchChange}
          placeholder="Search users, documents, shares, states..."
          className="w-full bg-[#111827]/80 text-sm text-slate-200 placeholder-slate-500 pl-10 pr-4 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/50 transition-all"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Export All Quick Button */}
        <button
          onClick={handleExportAll}
          title="Export Users to CSV"
          className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>

        {/* Language Pill Selector */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#141C2E] border border-white/10 text-xs text-slate-300">
          <Globe className="w-3.5 h-3.5 text-indigo-400" />
          <select
            value={currentLang}
            onChange={(e) => setLang(e.target.value)}
            className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="en" className="bg-[#141C2E]">English (EN)</option>
            <option value="hi" className="bg-[#141C2E]">हिन्दी (HI)</option>
            <option value="mr" className="bg-[#141C2E]">मराठी (MR)</option>
            <option value="gu" className="bg-[#141C2E]">ગુજરાતી (GU)</option>
            <option value="bn" className="bg-[#141C2E]">বাংলা (BN)</option>
          </select>
        </div>

        {/* User / Login Button */}
        {user ? (
          <div className="flex items-center gap-3 pl-2 border-l border-white/10">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center font-bold text-sm text-white shadow-md">
              {user.name ? user.name[0].toUpperCase() : 'A'}
            </div>
            <div className="hidden xl:block text-left">
              <p className="text-xs font-semibold text-white leading-none">{user.name || 'Administrator'}</p>
              <p className="text-[10px] text-indigo-400 font-medium capitalize mt-0.5">{user.role || 'Super Admin'}</p>
            </div>
            <button
              onClick={onLogout}
              title="Logout"
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenLogin}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/30 transition-all"
          >
            <UserCheck className="w-4 h-4" />
            <span>Admin Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
}
