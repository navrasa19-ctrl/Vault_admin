import React, { useState } from 'react';
import {
  Gift,
  Users,
  CheckCircle2,
  TrendingUp,
  Download,
  Search,
  ArrowUpRight,
  Sparkles,
  Award,
  Share2,
  Copy,
  Clock,
  ShieldCheck,
  Smartphone,
  ExternalLink
} from 'lucide-react';
import { exportToCsv } from '../utils/exportCsv';

export default function ReferralsTab({ referrals = {}, users = [] }) {
  const [search, setSearch] = useState('');
  const [copiedCode, setCopiedCode] = useState(null);

  const metrics = referrals?.metrics || {
    totalReferralInstalls: 0,
    activePromoters: 0,
    totalTrackedPromoters: 0
  };

  // Promoter list: users with their referral code and downloads count
  const userList = Array.isArray(users) ? users : users?.users || [];
  const promoterList = Array.isArray(referrals?.topReferrers) && referrals.topReferrers.length > 0
    ? referrals.topReferrers
    : userList;

  // Real install activity ledger
  const activityList = Array.isArray(referrals?.recentReferrals)
    ? referrals.recentReferrals
    : (Array.isArray(referrals) ? referrals : []);

  // Filter promoters by search
  const filteredPromoters = promoterList.filter((p) => {
    const q = search.toLowerCase();
    const name = (p.name || '').toLowerCase();
    const email = (p.email || '').toLowerCase();
    const phone = (p.phone || '').toLowerCase();
    const code = (p.referralCode || '').toLowerCase();
    return !q || name.includes(q) || email.includes(q) || phone.includes(q) || code.includes(q);
  });

  const totalDownloads = promoterList.reduce((acc, p) => acc + (p.referralCount || 0), 0);
  const activeSharers = promoterList.filter(p => (p.referralCount || 0) > 0).length;
  const topPromoter = promoterList.reduce((top, p) => ((p.referralCount || 0) > (top?.referralCount || 0) ? p : top), promoterList[0]);

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleExport = () => {
    const data = promoterList.map((p) => ({
      'Promoter Name': p.name || 'Unnamed User',
      'Contact Phone': p.phone || 'N/A',
      'Email': p.email || 'N/A',
      'Unique Referral Code': p.referralCode || 'N/A',
      'Share Link': `https://beememvault.com/join?ref=${p.referralCode || ''}`,
      'App Downloads Generated': p.referralCount || 0,
      'Referred By': p.referredBy || 'Organic / Direct',
      'Registered Date': p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-IN') : 'N/A'
    }));
    exportToCsv('vault_referral_app_downloads_report', data);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="relative p-7 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 text-white overflow-hidden shadow-xl shadow-indigo-950/15">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-white/10 to-transparent rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-semibold mb-3">
              <Share2 className="w-3.5 h-3.5 text-amber-300" />
              <span>Organic App Growth & Invite Tracking</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
              Refer & Earn (App Share & Download Tracking)
            </h2>
            <p className="text-indigo-200 text-xs sm:text-sm mt-1 max-w-2xl">
              Live dashboard tracking which users are sharing the app and how many successful app downloads and signups have occurred through each user's unique referral link.
            </p>
          </div>

          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition shadow-sm shrink-0"
          >
            <Download className="w-4 h-4 text-white" />
            <span>Export Referral Roster CSV</span>
          </button>
        </div>
      </div>

      {/* 4 Metric KPI Cards (Clean Download Counts - No Unconfirmed Rewards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">App Downloads via Share</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-emerald-600">{totalDownloads}</div>
          <p className="text-xs text-slate-400 mt-1 font-medium">Verified app registrations through links</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Promoters</span>
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{activeSharers}</div>
          <p className="text-xs text-slate-400 mt-1 font-medium">Users who brought &ge; 1 successful download</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Top Promoter Champion</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-slate-900 truncate">
            {topPromoter ? (topPromoter.name || topPromoter.phone || 'Dev Varshney') : 'None Yet'}
          </div>
          <p className="text-xs text-amber-600 mt-1 font-semibold">
            {topPromoter?.referralCount || 0} Downloads Generated
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Reward Policy</span>
            <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-sm font-extrabold text-slate-800">Count-Only Mode</div>
          <p className="text-xs text-slate-400 mt-1 font-medium">Rewards will be configured as per client policy</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by user name, phone, email, or referral code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-sm"
          />
        </div>
        <span className="text-xs font-semibold text-slate-500 font-mono">
          {filteredPromoters.length} Users Tracked
        </span>
      </div>

      {/* Main Table: User-Wise Share Codes & Downloads Generated */}
      <div className="rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              User Share Codes & Downloads Ledger
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Every user's unique invite code and the total app downloads generated through their shares
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-5">User (Promoter)</th>
                <th className="py-3.5 px-4">Unique Invite Code</th>
                <th className="py-3.5 px-4">Shareable App Link</th>
                <th className="py-3.5 px-4">App Downloads Generated</th>
                <th className="py-3.5 px-4">Referred By</th>
                <th className="py-3.5 px-4">Joined On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPromoters.length > 0 ? (
                filteredPromoters.map((u, i) => {
                  const uid = u.id || u._id || i;
                  const count = u.referralCount || 0;
                  const code = u.referralCode || 'VAULT';
                  const link = `https://beememvault.com/join?ref=${code}`;

                  return (
                    <tr key={uid} className="hover:bg-slate-50/80 transition">
                      {/* User */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-extrabold text-xs shadow-md shadow-indigo-500/20 shrink-0">
                            {(u.name || u.phone || u.email || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{u.name || 'Registered User'}</div>
                            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                              {u.phone || u.email || 'No contact'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Unique Referral Code with Copy Button */}
                      <td className="py-3.5 px-4">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-indigo-50 text-indigo-700 font-mono font-bold border border-indigo-200/80">
                          <span>{code}</span>
                          <button
                            onClick={() => copyToClipboard(code)}
                            title="Copy Code"
                            className="text-indigo-400 hover:text-indigo-700 transition"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                        {copiedCode === code && (
                          <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
                            Copied!
                          </span>
                        )}
                      </td>

                      {/* Share Link */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px] max-w-xs truncate">
                          <span className="truncate">{link}</span>
                          <button
                            onClick={() => copyToClipboard(link)}
                            title="Copy Link"
                            className="text-slate-400 hover:text-indigo-600 shrink-0"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      </td>

                      {/* App Downloads Generated */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold font-mono border ${
                            count > 0
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-slate-50 text-slate-500 border-slate-200'
                          }`}>
                            {count} {count === 1 ? 'Download' : 'Downloads'}
                          </span>
                          {count > 0 && (
                            <span className="text-[10px] text-emerald-600 font-bold uppercase">
                              Active
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Referred By */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                        {u.referredBy ? (
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                            {u.referredBy}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-sans italic">Direct Signup</span>
                        )}
                      </td>

                      {/* Joined Date */}
                      <td className="py-3.5 px-4 font-medium text-slate-500 text-[11px]">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : 'Recently'}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400 text-xs">
                    No users found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Verified App Installs Log (Recent Conversions) */}
      {activityList.length > 0 && (
        <div className="rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-sm">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Live Verified App Installs Log
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time stream of friends who downloaded and registered via member links
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {activityList.length} Total Verified
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-5">Referrer (Who Shared)</th>
                  <th className="py-3.5 px-4">Invite Code</th>
                  <th className="py-3.5 px-4">New User Installed</th>
                  <th className="py-3.5 px-4">Timestamp</th>
                  <th className="py-3.5 px-5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {activityList.map((r, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-5 font-semibold text-slate-900">
                      {r.referrerName || r.referrerEmail || 'Promoter User'}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-indigo-600 font-bold">
                      {r.code || 'VAULT'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {r.referredName || r.referredEmail || 'New App User'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 text-[11px] font-mono">
                      {r.createdAt ? new Date(r.createdAt).toLocaleString('en-IN') : 'Just now'}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        <span>Verified App Install</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
