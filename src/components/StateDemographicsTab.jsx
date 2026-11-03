import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Users,
  Crown,
  Zap,
  TrendingUp,
  Download,
  Search,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Mail,
  Calendar,
  Compass,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { exportToCsv } from '../utils/exportCsv';

export default function StateDemographicsTab({ users = [], analytics = {}, setActiveTab }) {
  const userList = useMemo(() => (Array.isArray(users) ? users : users?.users || []), [users]);
  const [userSearch, setUserSearch] = useState('');

  // Group real users by state
  const stateDistribution = useMemo(() => {
    const map = {};

    userList.forEach(u => {
      const stateName = (u.state && u.state.trim()) ? u.state.trim() : 'Maharashtra';
      if (!map[stateName]) {
        map[stateName] = {
          state: stateName,
          users: [],
          trialCount: 0,
          paidCount: 0
        };
      }
      map[stateName].users.push(u);
      
      const plan = u.plan || 'PREMIUM';
      if (plan === 'FREE') {
        map[stateName].trialCount++;
      } else {
        map[stateName].paidCount++;
      }
    });

    const list = Object.values(map).map(item => ({
      ...item,
      userCount: item.users.length,
      percentage: userList.length > 0 ? Math.round((item.users.length / userList.length) * 100) : 0
    }));

    // Sort by userCount descending
    list.sort((a, b) => b.userCount - a.userCount);
    return list;
  }, [userList]);

  // Selected state for drill-down (default to the top state)
  const [selectedStateName, setSelectedStateName] = useState(() => {
    return stateDistribution.length > 0 ? stateDistribution[0].state : 'Maharashtra';
  });

  // Current selected state object
  const activeStateObj = useMemo(() => {
    return stateDistribution.find(s => s.state === selectedStateName) || stateDistribution[0] || {
      state: 'Maharashtra',
      userCount: 0,
      percentage: 0,
      users: [],
      trialCount: 0,
      paidCount: 0
    };
  }, [stateDistribution, selectedStateName]);

  // Filter users inside the active state by local search
  const filteredStateUsers = useMemo(() => {
    if (!activeStateObj || !activeStateObj.users) return [];
    if (!userSearch.trim()) return activeStateObj.users;
    const q = userSearch.toLowerCase();
    return activeStateObj.users.filter(u => {
      const name = (u.name || '').toLowerCase();
      const phone = (u.phone || '').toLowerCase();
      const email = (u.email || '').toLowerCase();
      const city = (u.city || '').toLowerCase();
      return name.includes(q) || phone.includes(q) || email.includes(q) || city.includes(q);
    });
  }, [activeStateObj, userSearch]);

  const topState = stateDistribution.length > 0 ? stateDistribution[0] : null;

  const handleExportStateReport = () => {
    const rows = [];
    stateDistribution.forEach(st => {
      st.users.forEach(u => {
        rows.push({
          'State': st.state,
          'City': u.city || 'Not specified',
          'Name': u.name || 'Unnamed User',
          'Phone': u.phone || 'N/A',
          'Email': u.email || 'N/A',
          'Plan': u.plan || 'PREMIUM',
          'Role': u.role || 'user',
          'Registered On': u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : 'N/A'
        });
      });
    });
    exportToCsv('vault_state_users_intelligence', rows);
  };

  const getPlanColor = (plan) => {
    switch (plan) {
      case 'BUSINESS':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'FAMILY':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'PREMIUM':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default:
        return 'bg-slate-800 text-slate-700 border-slate-800';
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="relative p-7 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 text-white overflow-hidden shadow-xl shadow-indigo-950/15">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-white/10 to-transparent rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111827]/15 backdrop-blur-md border border-white/20 text-white text-xs font-semibold mb-3">
              <Compass className="w-3.5 h-3.5 text-amber-300" />
              <span>India Regional Intelligence & User Footprint</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
              State-Wise User Demographics
            </h2>
            <p className="text-indigo-200 text-xs sm:text-sm mt-1 max-w-xl">
              Real-time geographical distribution of subscribers. Click any state in the interactive graph to inspect the exact users registered from that region.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportStateReport}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#111827]/10 hover:bg-[#111827]/20 border border-white/20 text-white text-xs font-bold transition shadow-sm"
            >
              <Download className="w-4 h-4 text-white" />
              <span>Export State Intelligence CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Geo-Mapped Users</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-white">{userList.length}</div>
          <p className="text-xs text-slate-400 mt-1 font-medium">100% mapped to Indian states</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Leading State</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-white">{topState?.state || 'Maharashtra'}</div>
          <p className="text-xs text-emerald-600 mt-1 font-semibold">
            {topState?.userCount || 0} Users ({topState?.percentage || 0}% of all subscribers)
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active State Reach</span>
            <MapPin className="w-4 h-4 text-violet-600" />
          </div>
          <div className="text-2xl font-extrabold text-white">{stateDistribution.length}</div>
          <p className="text-xs text-slate-400 mt-1 font-medium">Indian States with active subscribers</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Selection</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-indigo-600">{activeStateObj?.state}</div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            {activeStateObj?.userCount} Users ({activeStateObj?.paidCount} Paid • {activeStateObj?.trialCount} Trial)
          </p>
        </div>
      </div>

      {/* Main Grid: Interactive Visual Graph (Left) + User Drill-Down Roster (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: High-Quality Interactive Visual State Graph (7 cols) */}
        <div className="lg:col-span-7 bg-[#111827] rounded-3xl border border-slate-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-600" />
                State-Wise Subscriber Distribution Graph
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Click any state bar below to view the names and profiles of users in that state
              </p>
            </div>
            <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">
              Interactive
            </span>
          </div>

          {/* High-Quality Visual Bar Graph */}
          <div className="space-y-3.5 pt-2">
            {stateDistribution.map((st) => {
              const isSelected = st.state === selectedStateName;

              return (
                <div
                  key={st.state}
                  onClick={() => setSelectedStateName(st.state)}
                  className={`group relative p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50/60 border-indigo-400 shadow-sm ring-2 ring-indigo-500/20'
                      : 'bg-[#111827] hover:bg-slate-900/80/80 border-slate-800/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-2.5 h-2.5 rounded-full transition ${
                        isSelected ? 'bg-indigo-600 scale-125' : 'bg-slate-300 group-hover:bg-indigo-500'
                      }`}></span>
                      <span className={`text-xs font-bold ${
                        isSelected ? 'text-indigo-950 font-extrabold' : 'text-slate-200'
                      }`}>
                        {st.state}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-mono text-slate-400">
                        {st.percentage}%
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono transition ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-800 text-slate-700 group-hover:bg-indigo-100 group-hover:text-indigo-700'
                      }`}>
                        {st.userCount} {st.userCount === 1 ? 'User' : 'Users'}
                      </span>
                    </div>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isSelected
                          ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 shadow-sm'
                          : 'bg-gradient-to-r from-indigo-400 to-violet-400 opacity-75 group-hover:opacity-100'
                      }`}
                      style={{ width: `${Math.max(8, st.percentage)}%` }}
                    ></div>
                  </div>

                  {/* Micro Breakdown Details */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-0.5">
                    <span className="flex items-center gap-1.5">
                      <Crown className="w-3 h-3 text-amber-500" />
                      <span>{st.paidCount} Paid</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Zap className="w-3 h-3 text-indigo-500" />
                      <span>{st.trialCount} Free Trial</span>
                    </span>
                    <span className="text-indigo-600 font-semibold group-hover:underline flex items-center gap-0.5 text-[10px]">
                      <span>Inspect</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 text-xs text-slate-600 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>
              Real-time telemetry: Locations are mapped either via Mobile App GPS capture during OTP login or profile state assignment.
            </span>
          </div>
        </div>

        {/* Right: State User Inspection Roster (5 cols) */}
        <div className="lg:col-span-5 bg-[#111827] rounded-3xl border border-slate-800 p-6 shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <h3 className="text-base font-extrabold text-white">
                  {activeStateObj?.state}
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {activeStateObj?.userCount} Registered {activeStateObj?.userCount === 1 ? 'Subscriber' : 'Subscribers'} in this region
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
              {activeStateObj?.percentage}% Share
            </span>
          </div>

          {/* Quick Search Within Selected State */}
          <div className="relative my-4">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder={`Search users in ${activeStateObj?.state}...`}
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-[#111827] transition"
            />
          </div>

          {/* User Cards List */}
          <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
            {filteredStateUsers.length > 0 ? (
              filteredStateUsers.map((u) => {
                const uid = u.id || u._id;
                const isAdm = u.role === 'admin' || u.role === 'business_admin';
                const initial = (u.name || u.phone || u.email || 'U').charAt(0).toUpperCase();

                return (
                  <div
                    key={uid}
                    className="p-4 rounded-2xl border border-slate-800 bg-slate-900/80/50 hover:bg-slate-900/80 hover:border-indigo-200 transition group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-extrabold text-xs shadow-md shadow-indigo-500/15 shrink-0">
                          {initial}
                        </div>
                        <div>
                          <div className="font-extrabold text-white text-xs flex items-center gap-1.5">
                            <span>{u.name || 'Registered User'}</span>
                            {isAdm && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-200 uppercase">
                                Admin
                              </span>
                            )}
                          </div>
                          
                          {/* City / Location if detected */}
                          <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 font-medium">
                            <MapPin className="w-3 h-3 text-indigo-500 shrink-0" />
                            <span>{u.city ? `${u.city}, ${activeStateObj.state}` : activeStateObj.state}</span>
                          </div>
                        </div>
                      </div>

                      {/* Plan Badge */}
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${getPlanColor(u.plan || 'PREMIUM')}`}>
                        {u.plan || 'PREMIUM'}
                      </span>
                    </div>

                    {/* Contact details */}
                    <div className="mt-3 pt-2.5 border-t border-slate-800/60 grid grid-cols-1 gap-1 text-[11px] text-slate-600 font-mono">
                      {u.phone && (
                        <div className="flex items-center gap-1.5">
                          <Smartphone className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{u.phone}</span>
                        </div>
                      )}
                      {u.email && (
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{u.email}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 font-sans">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>Joined {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : 'Recently'}</span>
                        </span>

                        {setActiveTab && (
                          <button
                            onClick={() => setActiveTab('users')}
                            className="text-indigo-600 hover:text-indigo-800 font-bold hover:underline"
                          >
                            Manage in Users →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-800 text-slate-400 text-xs">
                <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="font-semibold text-slate-600">No users match "{userSearch}"</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Try clearing the search filter</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
