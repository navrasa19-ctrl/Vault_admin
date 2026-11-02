import React from 'react';
import {
  Users,
  FileText,
  HardDrive,
  Share2,
  TrendingUp,
  MapPin,
  Shield,
  Layers,
  ArrowUpRight,
  Sparkles,
  PieChart
} from 'lucide-react';
import { exportToCsv } from '../utils/exportCsv';

export default function OverviewTab({ stats, analytics, users, setActiveTab }) {
  const stateData = analytics?.stateBreakdown || [];
  const categoryData = analytics?.categories || [];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="relative p-8 rounded-3xl bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-[#0F1523] border border-indigo-500/20 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-indigo-500/10 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Vault Operational Command & Control</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
            System Telemetry & User Intelligence
          </h1>
          <p className="text-slate-300 text-sm mt-2 leading-relaxed">
            Real-time monitoring across encrypted document packages, subscriber plan allocations, storage volume, and state-wise Indian demographic metrics.
          </p>
        </div>
      </div>

      {/* 4 Key KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Users */}
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Registered Users</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-white font-['Space_Grotesk']">{stats?.totalUsers || 8}</span>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+{stats?.newUsers7d || 3} this week</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Active biometric & OTP accounts</p>
        </div>

        {/* Total Documents */}
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Vaulted Documents</span>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-white font-['Space_Grotesk']">{stats?.totalActiveDocuments || 42}</span>
            <span className="text-xs font-medium text-slate-400">
              avg ~{stats?.totalUsers ? (stats.totalActiveDocuments / stats.totalUsers).toFixed(1) : 4.5} per user
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Zero-disk RAM streamed bundles</p>
        </div>

        {/* Cloud Storage */}
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cloud Storage Volume</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <HardDrive className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-['Space_Grotesk']">{stats?.totalVaultStorageGB || 0.144}</span>
            <span className="text-sm font-semibold text-slate-400">GB</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '15%' }}></div>
          </div>
        </div>

        {/* Active Shares */}
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Protected Share Links</span>
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform">
              <Share2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-white font-['Space_Grotesk']">{stats?.shares?.active || 8}</span>
            <span className="text-xs font-bold text-indigo-400">Active</span>
            <span className="text-xs text-slate-400">({stats?.shares?.total || 14} total)</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">100% time-limited & PIN protected</p>
        </div>
      </div>

      {/* State-Wise Distribution & Storage Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: State-wise Indian Analytics */}
        <div className="lg:col-span-2 glass-card p-6 rounded-3xl border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-400" />
                <h3 className="font-bold text-lg text-white">State-Wise Demographic Distribution</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">User adoption and vaulted document density across Indian states</p>
            </div>
            <button
              onClick={() => exportToCsv('state_distribution_report', stateData, [
                { key: 'state', label: 'State' },
                { key: 'userCount', label: 'User Count' },
                { key: 'documentCount', label: 'Document Count' },
                { key: 'storageMB', label: 'Storage (MB)' }
              ])}
              className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/10 text-xs font-semibold text-slate-300 border border-white/10 transition-all flex items-center gap-1.5"
            >
              Export State CSV
            </button>
          </div>

          <div className="space-y-4">
            {stateData.slice(0, 6).map((item, idx) => {
              const maxDocs = 20;
              const pct = Math.min(100, Math.round(((item.documentCount || 1) / maxDocs) * 100));

              return (
                <div key={idx} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-indigo-500/30 transition-all">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-indigo-500/15 text-indigo-300 font-bold flex items-center justify-center text-[10px]">
                        #{idx + 1}
                      </span>
                      <span className="font-bold text-white text-sm">{item.state}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-slate-300 font-medium"><strong>{item.userCount}</strong> Users</span>
                      <span className="text-indigo-400 font-semibold"><strong>{item.documentCount}</strong> Docs</span>
                      <span className="text-slate-400">{item.storageMB || 12} MB</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full rounded-full transition-all duration-700"
                      style={{ width: `${Math.max(8, pct)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Category Storage Breakdown */}
        <div className="glass-card p-6 rounded-3xl border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <PieChart className="w-4 h-4 text-purple-400" />
              <h3 className="font-bold text-lg text-white">Storage by Category</h3>
            </div>
            <p className="text-xs text-slate-400 mb-6">Distribution across Indian document categories</p>

            <div className="space-y-3.5">
              {categoryData.slice(0, 5).map((cat, i) => (
                <div key={i} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-white/[0.02]">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-400"></span>
                    <span className="font-semibold text-slate-200 capitalize">
                      {cat.categoryId.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-white block">{cat.docCount} docs</span>
                    <span className="text-[10px] text-slate-400">{cat.totalMB} MB</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('categories')}
            className="w-full mt-6 py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <span>Manage All 8 Categories</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
