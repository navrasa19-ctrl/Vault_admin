import React, { useState } from 'react';
import {
  Gift,
  Award,
  Users,
  TrendingUp,
  Coins,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Sparkles,
  Share2
} from 'lucide-react';
import { exportToCsv } from '../utils/exportCsv';

export default function ReferralsTab({ referrals = [], users = [] }) {
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Compute metrics
  const totalInvites = referrals.length;
  const completedConversions = referrals.filter(r => r.status === 'COMPLETED').length;
  const conversionRate = totalInvites > 0 ? Math.round((completedConversions / totalInvites) * 100) : 0;
  const totalCreditsAwarded = referrals.reduce((sum, r) => sum + (r.rewardCredits || 0), 0);

  // Top Referrers Leaderboard
  const referrersMap = {};
  users.forEach(u => {
    if (u.referralCount > 0) {
      referrersMap[u.id || u._id] = {
        name: u.name || 'Anonymous',
        code: u.referralCode || 'VAULT',
        count: u.referralCount || 0,
        credits: u.referralCredits || 0,
        plan: u.plan || 'PREMIUM'
      };
    }
  });

  const leaderboard = Object.values(referrersMap)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const filteredReferrals = referrals.filter(r => {
    if (filterStatus === 'ALL') return true;
    return r.status === filterStatus;
  });

  const handleExport = () => {
    const data = filteredReferrals.map(r => ({
      'Referral Code': r.referralCode,
      'Referrer Name': r.referrerName,
      'Referred User': r.referredUserName,
      'Reward Type': r.rewardType,
      'Credits / GB': r.rewardCredits,
      'Status': r.status,
      'Date': r.createdAt
    }));
    exportToCsv('vault_refer_and_earn_ledger', data);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0F1523]/80 border border-slate-800 backdrop-blur-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Gift className="w-5 h-5 text-pink-400" />
            Refer & Earn Growth Engine & Conversion Tracking
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Track organic viral invite codes, bonus storage allocations, conversion funnel, and referral payouts.
          </p>
        </div>
        <button
          onClick={handleExport}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition flex items-center gap-2"
        >
          <span>Export CSV</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-[#0F1523]/80 border border-slate-800 backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-3">
            <span>Total Referrals Triggered</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">{totalInvites}</div>
          <div className="text-xs text-indigo-400 mt-1 font-medium">+18% this month</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F1523]/80 border border-slate-800 backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-3">
            <span>Completed Conversions</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{completedConversions}</div>
          <div className="text-xs text-slate-400 mt-1">Qualified vault registrations</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F1523]/80 border border-slate-800 backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-3">
            <span>Conversion Velocity</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-400">{conversionRate}%</div>
          <div className="text-xs text-slate-400 mt-1">Invite-to-activation ratio</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0F1523]/80 border border-slate-800 backdrop-blur-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-3">
            <span>Rewards Allocated</span>
            <Coins className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">{totalCreditsAwarded} GB</div>
          <div className="text-xs text-slate-400 mt-1">Bonus cloud storage granted</div>
        </div>
      </div>

      {/* Top Referrers Leaderboard & Rewards Structure */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leaderboard */}
        <div className="p-6 rounded-2xl bg-[#0F1523]/80 border border-slate-800 backdrop-blur-xl lg:col-span-2">
          <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
            <Award className="w-4 h-4 text-amber-400" />
            Top Community Champions (Leaderboard)
          </h3>
          <div className="space-y-3">
            {leaderboard.length > 0 ? (
              leaderboard.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                      idx === 0
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : idx === 1
                        ? 'bg-slate-300/20 text-slate-200 border border-slate-300/30'
                        : 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                    }`}>
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-white text-sm">{item.name}</div>
                      <div className="text-[11px] font-mono text-indigo-400">Code: {item.code}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-right">
                    <div>
                      <div className="font-bold text-white text-sm">{item.count}</div>
                      <div className="text-[10px] text-slate-400 uppercase">Invites</div>
                    </div>
                    <div>
                      <div className="font-bold text-emerald-400 text-sm">+{item.credits} GB</div>
                      <div className="text-[10px] text-slate-400 uppercase">Bonus Earned</div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500 text-xs">No referrals logged yet</div>
            )}
          </div>
        </div>

        {/* Reward Rules Widget */}
        <div className="p-6 rounded-2xl bg-gradient-to-b from-purple-950/30 to-[#0F1523]/80 border border-purple-500/20 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Program Rules</span>
            </div>
            <h4 className="font-bold text-white text-base">Referral Incentives</h4>
            <ul className="mt-4 space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Referrer receives <strong className="text-white">+1 GB</strong> extra cloud storage on friend signup.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Invited friend gets <strong className="text-white">Premium Tier</strong> 30-day trial for free.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Maximum 50 GB storage bonus cap per account.</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <span className="text-[11px] text-slate-400">Automated verification via OTP & device ID fingerprint</span>
          </div>
        </div>
      </div>

      {/* Referral Activity Logs Table */}
      <div className="rounded-2xl bg-[#0F1523]/80 border border-slate-800 overflow-hidden shadow-2xl backdrop-blur-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-semibold text-white text-sm">Referral Activity Stream</h3>
          <div className="flex items-center gap-2">
            {['ALL', 'COMPLETED', 'PENDING'].map(s => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  filterStatus === s
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Referrer</th>
                <th className="py-3 px-4">Code Used</th>
                <th className="py-3 px-4">Referred User</th>
                <th className="py-3 px-4">Bonus Granted</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredReferrals.length > 0 ? (
                filteredReferrals.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 px-4 font-medium text-white">{r.referrerName || 'Community Member'}</td>
                    <td className="py-3 px-4 font-mono text-indigo-400 font-semibold">{r.referralCode}</td>
                    <td className="py-3 px-4 text-slate-300">{r.referredUserName || 'New Signee'}</td>
                    <td className="py-3 px-4 font-semibold text-emerald-400">+{r.rewardCredits || 1} GB Storage</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        r.status === 'COMPLETED'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {r.status || 'COMPLETED'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                      {new Date(r.createdAt || Date.now()).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-500 text-xs">
                    No referral entries matched the selected filter.
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
