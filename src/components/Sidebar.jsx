import React from "react";
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
} from "lucide-react";

export default function Sidebar({ activeTab, setActiveTab, stats, currentUser }) {
  const isSuper = currentUser?.role === "super_admin";
  const userPerms = currentUser?.permissions || ["overview"];

  const allMenuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard, badge: "Live" },
    { id: "users", label: "Users & Plans", icon: Users, count: stats?.totalUsers || 5 },
    { id: "geo", label: "State Demographics", icon: MapPin, badge: "India" },
    { id: "categories", label: "Categories & Taxonomy", icon: FolderTree },
    { id: "plans", label: "Monetization Plans", icon: CreditCard },
    { id: "storage", label: "Cloud Storage", icon: HardDrive },
    { id: "shares", label: "Shared Links", icon: Share2, count: stats?.shares?.total || 5 },
    { id: "referrals", label: "Refer & Earn", icon: Gift },
    { id: "languages", label: "Languages (10)", icon: Globe, badge: "100%" }
  ];

  if (isSuper) {
    allMenuItems.push({
      id: "admins",
      label: "Sub-Admin Roles",
      icon: UserCheck,
      badge: "RBAC"
    });
  }

  return (
    <aside className="w-72 bg-[#0D1322] border-r border-slate-800/80 flex flex-col justify-between shrink-0 shadow-2xl z-30 select-none">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/10">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-extrabold text-white text-base tracking-tight flex items-center gap-1.5">
                <span>BMM Vault</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  isSuper
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                }`}>
                  {isSuper ? "SUPER" : "SUB"}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-400">
                {isSuper ? "Master Console" : "Restricted Portal"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="p-4 space-y-1.5">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Modules</span>
            {!isSuper && <span className="text-[10px] text-amber-400 font-mono">RBAC Active</span>}
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
                    ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 font-semibold scale-[1.01]"
                    : hasPermission
                    ? "text-slate-300 hover:text-white hover:bg-slate-800/60"
                    : "text-slate-500 hover:text-slate-400 hover:bg-slate-850/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition ${
                    isActive
                      ? "text-white"
                      : hasPermission
                      ? "text-slate-400 group-hover:text-indigo-400"
                      : "text-slate-600"
                  }`} />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {!hasPermission ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800/80 text-slate-400 border border-slate-700/60">
                      <Lock className="w-2.5 h-2.5 text-slate-400" />
                      <span>Locked</span>
                    </span>
                  ) : item.badge ? (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isActive ? "bg-white/20 text-white" : "bg-emerald-950/70 text-emerald-400 border border-emerald-800/60"
                    }`}>
                      {item.badge}
                    </span>
                  ) : item.count !== undefined ? (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                      isActive ? "bg-white/20 text-white" : "bg-slate-800/80 text-slate-300 border border-slate-700/60"
                    }`}>
                      {item.count}
                    </span>
                  ) : null}

                  {!isActive && hasPermission && (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 opacity-0 group-hover:opacity-100 transition -translate-x-1 group-hover:translate-x-0" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cloud Node Status Footer */}
      <div className="p-4 m-4 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="font-semibold text-slate-300 flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-indigo-400" />
            Storage Cluster
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Live
          </span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Logged as <strong className="text-white font-bold">{currentUser?.name || "Admin"}</strong>
        </p>
      </div>
    </aside>
  );
}
