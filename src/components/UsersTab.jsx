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
  Filter,
  MapPin,
  HardDrive,
  FileText
} from 'lucide-react';
import { exportToCsv } from '../utils/exportCsv';

export default function UsersTab({ users = [], onAllotPlan }) {
  const [search, setSearch] = useState('');
  const [selectedSegment, setSelectedSegment] = useState('ALL'); // ALL, TRIAL, PAID, EXPIRING_SOON, EXPIRED
  const [selectedPlan, setSelectedPlan] = useState('ALL');

  const userList = Array.isArray(users) ? users : users?.users || [];
  const now = Date.now();

  // Dynamic Lifecycle & Storage Calculations per User
  const getUserLifecycle = (u) => {
    const createdTime = u.createdAt ? new Date(u.createdAt).getTime() : now;
    const trialEndsAt = new Date(createdTime + 30 * 24 * 60 * 60 * 1000);
    const msLeftInTrial = trialEndsAt.getTime() - now;
    const trialDaysLeft = Math.max(0, Math.ceil(msLeftInTrial / (1000 * 60 * 60 * 24)));

    let subscriptionDaysLeft = null;
    let isPaid = false;
    let isTrial = false;
    let isExpired = false;
    let isExpiringSoon = false;

    if (u.planExpiresAt) {
      const expTime = new Date(u.planExpiresAt).getTime();
      subscriptionDaysLeft = Math.ceil((expTime - now) / (1000 * 60 * 60 * 24));
      if (subscriptionDaysLeft <= 0) {
        isExpired = true;
      } else {
        isPaid = true;
        if (subscriptionDaysLeft <= 7) isExpiringSoon = true;
      }
    } else if (u.plan && u.plan !== 'FREE') {
      isPaid = true;
      subscriptionDaysLeft = null; // Auto-renew / Lifetime
    } else if (trialDaysLeft > 0) {
      isTrial = true;
      if (trialDaysLeft <= 7) isExpiringSoon = true;
    } else {
      isExpired = true;
    }

    return {
      trialEndsAt,
      trialDaysLeft,
      subscriptionDaysLeft,
      isTrial,
      isPaid,
      isExpired,
      isExpiringSoon
    };
  };

  // Aggregated Counts for Top KPI Cards
  let trialCount = 0;
  let paidCount = 0;
  let expiringSoonCount = 0;
  let expiredCount = 0;
  let totalVaultStorageMB = 0;
  let totalDocsCount = 0;

  userList.forEach(u => {
    const l = getUserLifecycle(u);
    if (l.isTrial) trialCount++;
    if (l.isPaid) paidCount++;
    if (l.isExpiringSoon) expiringSoonCount++;
    if (l.isExpired) expiredCount++;
    totalVaultStorageMB += (parseFloat(u.storageMB) || 0);
    totalDocsCount += (parseInt(u.documentCount, 10) || 0);
  });

  // Filtered Users
  const filteredUsers = userList.filter((u) => {
    const name = (u.name || '').toLowerCase();
    const email = (u.email || '').toLowerCase();
    const phone = (u.phone || u.phoneNumber || '');
    const state = (u.state || 'No Location').toLowerCase();
    const s = search.toLowerCase();

    const matchesSearch = !s || name.includes(s) || email.includes(s) || phone.includes(s) || state.includes(s);
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
      const usedMB = parseFloat(u.storageMB) || 0;
      const freeLimitMB = 1024;
      const pctUsed = ((usedMB / freeLimitMB) * 100).toFixed(2);
      const remainingMB = Math.max(0, freeLimitMB - usedMB).toFixed(2);

      return {
        'Name': u.name || 'Unnamed User',
        'State': u.state || 'No Location',
        'City': u.city || 'N/A',
        'Email': u.email || 'N/A',
        'Phone': u.phone || u.phoneNumber || 'N/A',
        'Plan': u.plan || 'PREMIUM',
        'Lifecycle Status': l.isTrial ? '30-Day Free Trial' : l.isPaid ? 'Active Paid' : 'Expired',
        'Days Left': l.subscriptionDaysLeft !== null ? l.subscriptionDaysLeft : l.trialDaysLeft,
        'Free Trial Quota (MB)': 1024,
        'Storage Used (MB)': usedMB,
        'Free Storage Left (MB)': remainingMB,
        'Trial Storage Used %': `${pctUsed}%`,
        'Documents Count': u.documentCount || 0,
        'Registered On': new Date(u.createdAt).toLocaleDateString('en-IN'),
        'Expires On': u.planExpiresAt ? new Date(u.planExpiresAt).toLocaleDateString('en-IN') : l.trialEndsAt.toLocaleDateString('en-IN')
      };
    });
    exportToCsv('vault_subscribers_and_storage_roster', exportData);
  };

  const getPlanBadge = (plan) => {
    switch (plan) {
      case 'BUSINESS':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'FAMILY':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'PREMIUM':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const segments = [
    { id: 'ALL', label: 'All Users', count: userList.length },
    { id: 'TRIAL', label: '⚡ 30-Day Free Trial', count: trialCount },
    { id: 'PAID', label: '👑 Active Paid Subscriptions', count: paidCount },
    { id: 'EXPIRING_SOON', label: '⏳ Expiring Soon (< 7 Days)', count: expiringSoonCount },
    { id: 'EXPIRED', label: '⚠️ Expired / Churned', count: expiredCount }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 5 Top Summary Metric Cards (Including Total Storage Consumed) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Total Roster */}
        <div
          onClick={() => setSelectedSegment('ALL')}
          className={`cursor-pointer p-4 rounded-2xl border transition-all duration-200 ${
            selectedSegment === 'ALL'
              ? 'bg-white border-indigo-500 shadow-md shadow-indigo-500/10 scale-[1.01]'
              : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Enrolled</span>
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-slate-900">{userList.length}</span>
            <span className="text-xs font-bold text-slate-500">Users</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Real registered app accounts</p>
        </div>

        {/* Card 2: 30-Day Free Trial Users */}
        <div
          onClick={() => setSelectedSegment('TRIAL')}
          className={`cursor-pointer p-4 rounded-2xl border transition-all duration-200 ${
            selectedSegment === 'TRIAL'
              ? 'bg-amber-50/50 border-amber-500 shadow-md shadow-amber-500/10 scale-[1.01]'
              : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">30-Day Free Trial</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <Zap className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-amber-600">{trialCount}</span>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-100/60 px-1.5 py-0.2 rounded">
              Active Window
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5 font-medium">1 GB free cloud storage included</p>
        </div>

        {/* Card 3: Paid Active Subscriptions */}
        <div
          onClick={() => setSelectedSegment('PAID')}
          className={`cursor-pointer p-4 rounded-2xl border transition-all duration-200 ${
            selectedSegment === 'PAID'
              ? 'bg-emerald-50/50 border-emerald-500 shadow-md shadow-emerald-500/10 scale-[1.01]'
              : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Paid Subscribers</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <Crown className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-emerald-600">{paidCount}</span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/60 px-1.5 py-0.2 rounded">
              Paid Tiers
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Premium / Family / Business</p>
        </div>

        {/* Card 4: Expiring Soon (< 7 Days) */}
        <div
          onClick={() => setSelectedSegment('EXPIRING_SOON')}
          className={`cursor-pointer p-4 rounded-2xl border transition-all duration-200 ${
            selectedSegment === 'EXPIRING_SOON'
              ? 'bg-rose-50/50 border-rose-500 shadow-md shadow-rose-500/10 scale-[1.01]'
              : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">Expiring &lt; 7 Days</span>
            <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-rose-600">{expiringSoonCount}</span>
            <span className="text-[10px] font-bold text-rose-700 bg-rose-100/60 px-1.5 py-0.2 rounded">
              Urgent Leads
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Ready for plan upgrade outreach</p>
        </div>

        {/* Card 5: Total Vault Storage Used */}
        <div className="p-4 rounded-2xl border bg-gradient-to-br from-indigo-50/60 via-violet-50/40 to-white border-indigo-200/80 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-900">Total Storage Used</span>
            <div className="p-1.5 rounded-lg bg-indigo-600 text-white shadow-sm">
              <HardDrive className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-indigo-900">{totalVaultStorageMB.toFixed(2)} MB</span>
          </div>
          <p className="text-[10px] text-indigo-700 font-medium mt-0.5">
            Across {totalDocsCount} active vaulted files
          </p>
        </div>
      </div>

      {/* Segment Navigation Bar & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {segments.map((seg) => (
            <button
              key={seg.id}
              onClick={() => setSelectedSegment(seg.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 ${
                selectedSegment === seg.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
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
          <span>Export Storage & Plans CSV</span>
        </button>
      </div>

      {/* Search & Plan Filter Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by user name, phone, email, state, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-sm"
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

      {/* Comprehensive Subscribers, Storage Quota & Plan Lifecycle Table */}
      <div className="rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-5">Subscriber</th>
                <th className="py-3.5 px-4">Current Plan</th>
                <th className="py-3.5 px-4">Trial / Subscription Status</th>
                <th className="py-3.5 px-4">Validity Countdown</th>
                <th className="py-3.5 px-4">Free Trial Storage (1 GB Quota)</th>
                <th className="py-3.5 px-4">Joined On</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => {
                  const uid = u.id || u._id;
                  const isAdm = u.role === 'admin' || u.role === 'business_admin';
                  const lifecycle = getUserLifecycle(u);
                  const usedMB = parseFloat(u.storageMB) || 0;
                  const freeLimitMB = 1024; // 1 GB free trial storage
                  const pctUsed = Math.min(100, Math.max(usedMB > 0 ? 2 : 0, ((usedMB / freeLimitMB) * 100)));
                  const remainingMB = Math.max(0, freeLimitMB - usedMB).toFixed(1);

                  return (
                    <tr key={uid} className="hover:bg-slate-50/80 transition">
                      {/* Name, Contact & Location */}
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
                            <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5 font-medium">
                              <MapPin className="w-2.5 h-2.5 text-indigo-500 shrink-0" />
                              <span>{u.state ? (u.city ? `${u.city}, ${u.state}` : u.state) : 'No Location'}</span>
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
                        {lifecycle.isTrial && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <Zap className="w-3 h-3 text-amber-500" />
                            <span>30-Day Free Trial</span>
                          </span>
                        )}
                        {lifecycle.isPaid && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <Crown className="w-3 h-3 text-emerald-500" />
                            <span>Active Paid Tier</span>
                          </span>
                        )}
                        {lifecycle.isExpired && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <AlertTriangle className="w-3 h-3 text-rose-500" />
                            <span>Trial Expired</span>
                          </span>
                        )}
                      </td>

                      {/* Validity & Days Remaining */}
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

                      {/* Free Trial Storage Consumption (1 GB Quota) */}
                      <td className="py-3.5 px-4">
                        <div>
                          <div className="flex items-baseline justify-between gap-2">
                            <span className="font-extrabold text-slate-900 font-mono text-xs">
                              {usedMB} MB
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              of 1,024 MB (1 GB)
                            </span>
                          </div>

                          {/* Visual Storage Bar */}
                          <div className="w-36 h-2 bg-slate-100 rounded-full mt-1.5 overflow-hidden p-0.5">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                pctUsed > 80
                                  ? 'bg-rose-500'
                                  : pctUsed > 50
                                  ? 'bg-amber-500'
                                  : 'bg-gradient-to-r from-indigo-500 to-violet-600'
                              }`}
                              style={{ width: `${pctUsed}%` }}
                            ></div>
                          </div>

                          <div className="flex items-center justify-between text-[10px] mt-1 font-mono">
                            <span className="text-slate-500 font-sans font-medium flex items-center gap-1">
                              <FileText className="w-2.5 h-2.5 text-slate-400" />
                              <span>{u.documentCount || 0} Docs</span>
                            </span>
                            <span className="text-emerald-600 font-bold">
                              {remainingMB} MB left
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Joined Date */}
                      <td className="py-3.5 px-4 font-medium text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{new Date(u.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right">
                        <button
                          onClick={() => onAllotPlan && onAllotPlan(u)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200 text-xs font-bold transition shadow-sm"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Change Plan</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400 text-xs font-medium">
                    No subscribers found matching your criteria.
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
