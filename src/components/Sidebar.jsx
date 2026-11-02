import React from 'react';
import {
  LayoutDashboard,
  Users,
  FolderTree,
  CreditCard,
  HardDrive,
  Share2,
  Gift,
  Languages,
  ShieldAlert,
  Server,
  Sparkles
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, stats }) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, badge: 'Live' },
    { id: 'users', label: 'Users & Documents', icon: Users, count: stats?.totalUsers || 8 },
    { id: 'categories', label: 'Categories & Tags', icon: FolderTree },
    { id: 'plans', label: 'Subscription Plans', icon: CreditCard },
    { id: 'storage', label: 'Cloud Storage', icon: HardDrive, badge: `${stats?.totalVaultStorageGB || 0.14} GB` },
    { id: 'shares', label: 'Secure Share Links', icon: Share2, count: stats?.shares?.active || 8 },
    { id: 'referrals', label: 'Refer & Earn', icon: Gift, badge: 'Active' },
    { id: 'languages', label: 'Language & i18n', icon: Languages, badge: '10' },
    { id: 'audit', label: 'Security & Audit Logs', icon: ShieldAlert }
  ];

  return (
    <aside className="w-72 bg-[#090D16] border-r border-white/[0.08] flex flex-col justify-between p-4 h-[calc(100vh-5rem)] sticky top-20 overflow-y-auto">
      {/* Navigation list */}
      <div className="space-y-1">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-3 py-2">
          Platform Management
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600/20 via-purple-600/15 to-transparent text-white border-l-4 border-indigo-500 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    isActive
                      ? 'bg-indigo-500 text-white'
                      : 'bg-white/[0.08] text-slate-400 group-hover:bg-white/[0.12]'
                  }`}
                >
                  {item.badge}
                </span>
              )}

              {item.count !== undefined && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-white/[0.06] text-slate-300">
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Cloud Infrastructure Card at bottom */}
      <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-[#121828] to-[#0D121F] border border-white/10 relative overflow-hidden">
        <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-indigo-500/10 blur-xl"></div>
        <div className="flex items-center gap-2 mb-2">
          <Server className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">AWS Storage Quota</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2 mb-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 via-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500"
            style={{ width: '18%' }}
          ></div>
        </div>
        <div className="flex justify-between items-center text-[11px] text-slate-400 font-medium">
          <span>{stats?.totalVaultStorageGB || 0.14} GB used</span>
          <span>100 GB Pool</span>
        </div>
      </div>
    </aside>
  );
}
