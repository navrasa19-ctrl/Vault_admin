import React from 'react';
import {
  Shield,
  LayoutDashboard,
  Users,
  FolderTree,
  CreditCard,
  HardDrive,
  Share2,
  Gift,
  Globe,
  MapPin,
  Lock,
  ChevronRight,
  Database,
  UserCheck
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, stats, currentUser }) {
  const isSuper = currentUser?.role === 'super_admin';
  const userPerms = currentUser?.permissions || ['overview'];

  const allMenuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, badge: 'Live' },
    { id: 'users', label: 'Users & Plans', icon: Users, count: stats?.totalUsers || 5 },
    { id: 'geo', label: 'State Demographics', icon: MapPin, badge: 'India' },
    { id: 'categories', label: 'Categories & Taxonomy', icon: FolderTree },
    { id: 'plans', label: 'Monetization Plans', icon: CreditCard },
    { id: 'storage', label: 'Cloud Storage', icon: HardDrive },
    { id: 'shares', label: 'Shared Links', icon: Share2, count: stats?.shares?.total || 5 },
    { id: 'referrals', label: 'Refer & Earn', icon: Gift },
    { id: 'languages', label: 'Languages (10)', icon: Globe, badge: '100%' }
  ];

  if (isSuper) {
    allMenuItems.push({
      id: 'admins',
      label: 'Sub-Admin Roles',
      icon: UserCheck,
      badge: 'RBAC'
    });
  }

  return (
    <aside className="w-72 bg-white border-r border-slate-200/90 flex flex-col justify-between shrink-0 shadow-sm z-30 select-none">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-extrabold text-slate-900 text-base tracking-tight flex items-center gap-1.5">
                <span>BMM Vault</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  isSuper
                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                    : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                }`}>
                  {isSuper ? 'SUPER' : 'SUB'}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-400">
                {isSuper ? 'Master Console' : 'Restricted Portal'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="p-4 space-y-1.5">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Modules</span>
            {!isSuper && <span className="text-[10px] text-amber-600 font-mono">RBAC Active</span>}
          </div>

          {allMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const hasPermission = isSuper || userPerms.includes(item.id);

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/25 font-semibold scale-[1.01]'
                    : hasPermission
                    ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition ${
                    isActive
                      ? 'text-white'
                      : hasPermission
                      ? 'text-slate-400 group-hover:text-indigo-600'
                      : 'text-slate-300'
                  }`} />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {!hasPermission ? (
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
                      <Lock className="w-2.5 h-2.5 text-slate-400" />
                      <span>Locked</span>
                    </span>
                  ) : item.badge ? (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isActive ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-600 border border-emerald-200/60'
                    }`}>
                      {item.badge}
                    </span>
                  ) : item.count !== undefined ? (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {item.count}
                    </span>
                  ) : null}

                  {!isActive && hasPermission && (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition -translate-x-1 group-hover:translate-x-0" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cloud Node Status Footer */}
      <div className="p-4 m-4 rounded-2xl bg-slate-50 border border-slate-200/80">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="font-semibold text-slate-700 flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-indigo-600" />
            Storage Cluster
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Live
          </span>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Logged as <strong className="text-slate-800 font-bold">{currentUser?.name || 'Admin'}</strong>
        </p>
      </div>
    </aside>
  );
}
