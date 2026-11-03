import React, { useState } from 'react';
import {
  Search,
  Download,
  Edit2,
  Crown,
  Clock,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Filter
} from 'lucide-react';
import { exportToCsv } from '../utils/exportCsv';

export default function UsersTab({ users = [], onAllotPlan }) {
  const [search, setSearch] = useState('');
  const [selectedSegment, setSelectedSegment] = useState('ALL'); // ALL, TRIAL, PAID, EXPIRING_SOON, EXPIRED
  const [selectedPlan, setSelectedPlan] = useState('ALL');

  const userList = Array.isArray(users) ? users : users?.users || [];
  const now = Date.now();

  // Helper to compute user lifecycle telemetry
  const getUserLifecycle = (u) => {
    const createdTime = u.createdAt ? new Date(u.createdAt).getTime() : now;
    const trialEndsAt = u.trialEndsAt ? new Date(u.trialEndsAt) : new Date(createdTime + 30 * 24 * 60 * 60 * 1000);
    const msLeftInTrial = trialEndsAt.getTime() - now;
    const trialDaysLeft = u.trialDaysLeft !== undefined ? u.trialDaysLeft : Math.max(0, Math.ceil(msLeftInTrial / (1000 * 60 * 60 * 24)));

    let hasPaidPlan = Boolean(u.planExpiresAt) || (u.plan && u.plan !== 'FREE');
    let subscriptionDaysLeft = u.subscriptionDaysLeft;

    if (u.planExpiresAt) {
      const expTime = new Date(u.planExpiresAt).getTime();
      subscriptionDaysLeft = Math.ceil((expTime - now) / (1000 * 60 * 60 * 24));
    }

    const isExpired = subscriptionDaysLeft !== null ? subscriptionDaysLeft <= 0 : trialDaysLeft <= 0;
    const isExpiringSoon = (subscriptionDaysLeft !== null && subscriptionDaysLeft > 0 && subscriptionDaysLeft <= 7) ||
                          (!u.planExpiresAt && trialDaysLeft > 0 && trialDaysLeft <= 7);

    // If user has a planExpiresAt in future, they are PAID. If not, they are on the initial 30-Day Trial.
    const isTrial = !u.planExpiresAt && trialDaysLeft > 0;
    const isPaid = Boolean(u.planExpiresAt && subscriptionDaysLeft > 0);

    return {
      createdTime,
      trialEndsAt,
      trialDaysLeft,
      hasPaidPlan,
      subscriptionDaysLeft,
      isTrial,
      isPaid,
      isExpiringSoon,
      isExpired
    };
  };

  // Metrics calculation
  let trialCount = 0;
  let paidCount = 0;
  let expiringSoonCount = 0;
  let expiredCount = 0;

  userList.forEach(u => {
    const l = getUserLifecycle(u);
    if (l.isTrial) trialCount++;
    if (l.isPaid) paidCount++;
    if (l.isExpiringSoon) expiringSoonCount++;
    if (l.isExpired) expiredCount++;
  });

  // Filtered Users
  const filteredUsers = userList.filter((u) => {
    const name = (u.name || '').toLowerCase();
    const email = (u.email || '').toLowerCase();
    const phone = (u.phone || u.phoneNumber || '');
    const s = search.toLowerCase();

    const matchesSearch = !s || name.includes(s) || email.includes(s) || phone.includes(s);
    const matchesPlan = selectedPlan === 'ALL' || (u.plan || 'PREMIUM') === selectedPlan;

    const lifecycle = getUserLifecycle(u);
    let matchesSegment = true;
    if (selectedSegment === 'TRIAL') matchesSegment = lifecycle.isTrial;
    if (selectedSegment === 'PAID') matchesSegment = lifecycle.isPaid;
    if (selectedSegment === 'EXPIRING_SOON') matchesSegment = lifecycle.isExpiringSoon;
    if (selectedSegment === 'EXPIRED') matchesSegment = lifecycle.isExpired;

    return matchesSearch && matchesPlan && matchesSegment;
  });

  const handleExportUsers = () => {
    const exportData = filteredUsers.map(u => {
      const l = getUserLifecycle(u);
      return {
        'Name': u.name || 'Unnamed User',
        'Email': u.email || 'N/A',
        'Phone': u.phone || u.phoneNumber || 'N/A',
        'Plan': u.plan || 'PREMIUM',
        'Lifecycle Status': l.isTrial ? '30-Day Free Trial' : l.isPaid ? 'Active Paid' : 'Expired',
        'Days Left': l.subscriptionDaysLeft !== null ? l.subscriptionDaysLeft : l.trialDaysLeft,
        'Registered On': new Date(u.createdAt).toLocaleDateString('en-IN'),
        'Expires On': u.planExpiresAt ? new Date(u.planExpiresAt).toLocaleDateString('en-IN') : l.trialEndsAt.toLocaleDateString('en-IN'),
        'Documents Count': u.documentCount || 0,
        'Storage Used (MB)': u.storageMB || 0
      };
    });
    exportToCsv('vault_subscribers_lifecycle_roster', exportData);
  };

  const getPlanBadge = (plan) => {
    switch (plan) {
      case 'BUSINESS':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'FAMILY':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'PREMIUM':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 4 Plan Lifecycle Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Roster */}
        <div
          onClick={() => setSelectedSegment('ALL')}
          className={`cursor-pointer p-5 rounded-3xl border transition-all duration-200 ${
            selectedSegment === 'ALL'
              ? 'bg-white border-indigo-500 shadow-md shadow-indigo-500/10 scale-[1.01]'
              : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Enrolled</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{userList.length}</span>
            <span className="text-xs font-bold text-slate-500">Accounts</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1 font-medium">All registered app profiles</p>
        </div>

        {/* Card 2: 30-Day Free Trial Users */}
        <div
          onClick={() => setSelectedSegment('TRIAL')}
          className={`cursor-pointer p-5 rounded-3xl border transition-all duration-200 ${
            selectedSegment === 'TRIAL'
              ? 'bg-amber-50/50 border-amber-500 shadow-md shadow-amber-500/10 scale-[1.01]'
              : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">30-Day Free Trial</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-600">{trialCount}</span>
            <span className="text-xs font-bold text-amber-700 bg-amber-100/60 px-2 py-0.5 rounded-md">
              In Trial Window
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">Trial period countdown active</p>
        </div>

        {/* Card 3: Paid Active Subscriptions */}
        <div
          onClick={() => setSelectedSegment('PAID')}
          className={`cursor-pointer p-5 rounded-3xl border transition-all duration-200 ${
            selectedSegment === 'PAID'
              ? 'bg-emerald-50/50 border-emerald-500 shadow-md shadow-emerald-500/10 scale-[1.01]'
              : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Paid Subscribers</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Crown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-600">{paidCount}</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-md">
              Converted
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">Active paying memberships</p>
        </div>

        {/* Card 4: Expiring Soon (< 7 Days) */}
        <div
          onClick={() => setSelectedSegment('EXPIRING_SOON')}
          className={`cursor-pointer p-5 rounded-3xl border transition-all duration-200 ${
            selectedSegment === 'EXPIRING_SOON'
              ? 'bg-rose-50/50 border-rose-500 shadow-md shadow-rose-500/10 scale-[1.01]'
              : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-700">Expiring &lt; 7 Days</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-600">{expiringSoonCount}</span>
            <span className="text-xs font-bold text-rose-700 bg-rose-100/60 px-2 py-0.5 rounded-md">
              Urgent Leads
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">Renewal reminder candidates</p>
        </div>
      </div>

      {/* Segment Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'ALL', label: 'All Users', count: userList.length },
            { id: 'TRIAL', label: '⚡ 30-Day Free Trial', count: trialCount },
            { id: 'PAID', label: '👑 Active Paid Subscriptions', count: paidCount },
            { id: 'EXPIRING_SOON', label: '⏳ Expiring Soon (< 7 Days)', count: expiringSoonCount },
            { id: 'EXPIRED', label: '⚠️ Expired / Churned', count: expiredCount }
          ].map(seg => (
            <button
              key={seg.id}
              onClick={() => setSelectedSegment(seg.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                selectedSegment === seg.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200/80 hover:bg-slate-100'
              }`}
            >
              <span>{seg.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                selectedSegment === seg.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {seg.count}
              </span>
            </button>
          ))}
        </div>

        <button
          onClick={handleExportUsers}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 transition shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export Plan Roster CSV</span>
        </button>
      </div>

      {/* Search & Plan Filter Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by subscriber name, phone, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-sm"
          />
        </div>

        <select
          value={selectedPlan}
          onChange={(e) => setSelectedPlan(e.target.value)}
          className="px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 font-bold focus:outline-none focus:border-indigo-500 shadow-sm"
        >
          <option value="ALL">All Tier Types</option>
          <option value="FREE">FREE</option>
          <option value="PREMIUM">PREMIUM</option>
          <option value="FAMILY">FAMILY</option>
          <option value="BUSINESS">BUSINESS</option>
        </select>
      </div>

      {/* Comprehensive Subscribers & Plan Lifecycle Table */}
      <div className="rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-5">Subscriber</th>
                <th className="py-3.5 px-4">Current Plan</th>
                <th className="py-3.5 px-4">Lifecycle &amp; Trial Status</th>
                <th className="py-3.5 px-4">Validity &amp; Days Remaining</th>
                <th className="py-3.5 px-4">Subscribed / Joined</th>
                <th className="py-3.5 px-4">Documents</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => {
                  const uid = u.id || u._id;
                  const isAdm = u.role === 'admin' || u.role === 'business_admin';
                  const lifecycle = getUserLifecycle(u);

                  return (
                    <tr key={uid} className="hover:bg-slate-50/80 transition">
                      {/* Name & ID */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-indigo-500/20">
                            {(u.name || u.phone || u.email || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              <span>{u.name || u.phone || 'Registered User'}</span>
                              {isAdm && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200 uppercase">
                                  <Crown className="w-2.5 h-2.5" />
                                  Admin
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              {u.email || u.phone || uid.substring(0, 10)}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Plan Badge */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getPlanBadge(u.plan || 'PREMIUM')}`}>
                          {u.plan || 'PREMIUM'}
                        </span>
                      </td>

                      {/* Lifecycle Status */}
                      <td className="py-3.5 px-4">
                        {lifecycle.isTrial ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold">
                            <Zap className="w-3.5 h-3.5 text-amber-600" />
                            <span>30-Day Free Trial</span>
                          </div>
                        ) : lifecycle.isPaid ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
                            <Crown className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Paid Subscription</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                            <span>Expired</span>
                          </div>
                        )}
                      </td>

                      {/* Validity & Countdown (DAYS LEFT) */}
                      <td className="py-3.5 px-4">
                        {lifecycle.isTrial ? (
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-extrabold text-amber-700 font-mono">
                                {lifecycle.trialDaysLeft} Days Left
                              </span>
                            </div>
                            <div className="w-28 h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"
                                style={{ width: `${Math.min(100, Math.round((lifecycle.trialDaysLeft / 30) * 100))}%` }}
                              ></div>
                            </div>
                            <span className="text-[10px] text-slate-400 mt-1 block">
                              Ends: {lifecycle.trialEndsAt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </span>
                          </div>
                        ) : lifecycle.isPaid ? (
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-extrabold text-emerald-700 font-mono">
                                {lifecycle.subscriptionDaysLeft !== null ? `${lifecycle.subscriptionDaysLeft} Days Left` : 'Lifetime / Active'}
                              </span>
                            </div>
                            {u.planExpiresAt && (
                              <span className="text-[10px] text-slate-400 mt-0.5 block">
                                Till: {new Date(u.planExpiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                            Expired (Needs Plan)
                          </span>
                        )}
                      </td>

                      {/* Subscribed / Joined Date */}
                      <td className="py-3.5 px-4 font-medium text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{new Date(u.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                      </td>

                      {/* Documents */}
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-slate-900">{u.documentCount || 0} Docs</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {u.storageMB ? `${u.storageMB} MB` : '0 MB'}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right">
                        <button
                          onClick={() => onAllotPlan && onAllotPlan(u)}
                          className="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 border border-indigo-200 hover:border-indigo-600 transition text-xs font-bold inline-flex items-center gap-1.5 active:scale-95 shadow-sm"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Allot / Upgrade</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400 text-sm">
                    No subscribers found matching the selected plan segment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
