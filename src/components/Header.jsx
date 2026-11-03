import React, { useState } from "react";
import {
  Search,
  RefreshCw,
  LogOut,
  Shield,
  ShieldCheck,
  User
} from "lucide-react";

export default function Header({ activeTab, searchQuery, setSearchQuery, user, onLogout, onRefresh }) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (onRefresh) await onRefresh();
    setTimeout(() => setRefreshing(false), 600);
  };

  const isSuper = user?.role === "super_admin";

  const getTabTitle = () => {
    switch (activeTab) {
      case "overview": return "Command & Telemetry Overview";
      case "users": return "Subscriber Roster & Storage Usage";
      case "geo": return "India State Demographics & Locations";
      case "categories": return "Category Taxonomy & Document Classification";
      case "plans": return "Monetization Tiers & Storage Quotas";
      case "storage": return "Cloud Storage Health & Vault Quota";
      case "shares": return "Shared Links Telemetry & Revocation";
      case "referrals": return "Refer & Earn Download Tracker";
      case "languages": return "Pan-India Localization Matrix";
      case "admins": return "Sub-Admin Management & Access Control";
      default: return "Admin Console";
    }
  };

  return (
    <header className="h-18 px-8 bg-white/80 border-b border-slate-200/80 backdrop-blur-xl flex items-center justify-between shrink-0 sticky top-0 z-20">
      {/* Title & Breadcrumbs */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <span>BMM Vault Console</span>
          <span>/</span>
          <span className="text-indigo-600 capitalize font-bold">{activeTab}</span>
        </div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
          {getTabTitle()}
        </h1>
      </div>

      {/* Center Search Bar */}
      <div className="relative w-80 hidden lg:block">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Global vault search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-12 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-slate-200/60 border border-slate-300/60">
          ⌘K
        </span>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Refresh Button */}
        <button
          onClick={handleRefresh}
          className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 shadow-sm transition active:scale-95"
          title="Sync with Live Database"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-indigo-600" : ""}`} />
        </button>

        {/* Live System Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-semibold">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>Atlas Live</span>
        </div>

        {/* Admin Session Badge & Logout */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md ${
              isSuper
                ? "bg-gradient-to-tr from-amber-500 to-amber-600 shadow-amber-500/20"
                : "bg-gradient-to-tr from-indigo-600 to-violet-600 shadow-indigo-500/20"
            }`}>
              {(user?.name || "A").charAt(0).toUpperCase()}
            </div>
            <div className="hidden md:block text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900 leading-none">
                  {user?.name || "Admin"}
                </span>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase ${
                  isSuper
                    ? "bg-amber-100 text-amber-800 border border-amber-200"
                    : "bg-indigo-100 text-indigo-800 border border-indigo-200"
                }`}>
                  {isSuper ? "Super Admin" : "Sub-Admin"}
                </span>
              </div>
              <div className="text-[11px] font-medium text-slate-400 mt-1 font-mono">
                {user?.email || "admin@beememvault.com"}
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition border border-transparent hover:border-rose-200"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
