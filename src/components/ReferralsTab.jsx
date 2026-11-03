import React, { useState } from 'react';
import {
  Gift,
  Award,
  Users,
  TrendingUp,
  Coins,
  CheckCircle2,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { exportToCsv } from '../utils/exportCsv';

export default function ReferralsTab({ referrals = {}, users = [] }) {
  const [filterStatus, setFilterStatus] = useState('ALL');

  const metrics = referrals?.metrics || {
    totalReferrals: 0,
    convertedReferrals: 0,
    conversionRate: 0,
    totalStorageBonusGB: 0
  };

  const activityList = Array.isArray(referrals)
    ? referrals
    : Array.isArray(referrals?.recentReferrals)
    ? referrals.recentReferrals
    : [];

  const topReferrers = (Array.isArray(referrals?.topReferrers) && referrals.topReferrers.length > 0)
    ? referrals.topReferrers
    : users.filter(u => u.referralCount > 0);

  const filteredReferrals = activityList.filter(r => {
    if (filterStatus === 'ALL') return true;
    return r.status === filterStatus || r.rewardStatus === filterStatus;
  });

  const handleExport = () => {
    const data = filteredReferrals.map(r => ({
      'Referral Code': r.code || r.referralCode,
      'Referrer Name': r.referrerName,
      'Referred User': r.referredName || r.referredUserName,
      'Reward Status': r.rewardStatus || 'credited',
      'Status': r.status || 'converted',
      'Date': r.createdAt
    }));
    exportToCsv('vault_refer_and_earn_ledger', data);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Gift className="w-5 h-5 text-indigo-600" />
            Refer & Earn Growth Engine & Conversion Tracking
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real MongoDB referral ledger, organic conversion funnel, bonus quotas, and promoter champions.
          </p>
        </div>
        {filteredReferrals.length > 0 && (
          <button
            onClick={handleExport}
            className="px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition flex items-center gap-2"
          >
            <span>Export CSV</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-3 font-semibold uppercase">
            <span>Total Referrals Triggered</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{metrics.totalReferrals || 0}</div>
          <div className="text-xs text-slate-400 mt-1 font-medium">From organic signups</div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-3 font-semibold uppercase">
            <span>Completed Conversions</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600">{metrics.convertedReferrals || 0}</div>
          <div className="text-xs text-slate-500 mt-1 font-medium">Qualified vault registrations</div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-3 font-semibold uppercase">
            <span>Conversion Velocity</span>
            <TrendingUp className="w-4 h-4 text-violet-600" />
          </div>
          <div className="text-3xl font-extrabold text-violet-600">{metrics.conversionRate || 0}%</div>
          <div className="text-xs text-slate-500 mt-1 font-medium">Invite-to-activation ratio</div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-3 font-semibold uppercase">
            <span>Rewards Allocated</span>
            <Coins className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold text-amber-600">{metrics.totalStorageBonusGB || 0} GB</div>
          <div className="text-xs text-slate-500 mt-1 font-medium">Bonus cloud storage granted</div>
        </div>
      </div>

      {/* Top Referrers Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm lg:col-span-2">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
            <Award className="w-4 h-4 text-amber-500" />
            Top Community Champions (Leaderboard)
          </h3>
          <div className="space-y-3">
            {topReferrers.length > 0 ? (
              topReferrers.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                      idx === 0
                        ? 'bg-amber-100 text-amber-700 border border-amber-300'
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{item.name || item.phone || item.email}</div>
                      <div className="text-[11px] font-mono text-indigo-600">{item.email || item.phone}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-right">
                    <div>
                      <div className="font-extrabold text-slate-900 text-sm">{item.referralCount || 0}</div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Invites</div>
                    </div>
                    <div>
                      <div className="font-extrabold text-emerald-600 text-sm">+{item.referralCredits || 0} GB</div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Bonus Earned</div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 text-center text-slate-400 text-xs">
                No active community referrals logged in the database yet. When users share invite codes from the app, top promoters will appear here.
              </div>
            )}
          </div>
        </div>

        {/* Program Rules */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-50/60 via-violet-50/40 to-white border border-indigo-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100/80 text-indigo-700 text-xs font-bold mb-4">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Incentive Mechanics</span>
            </div>
            <h4 className="font-extrabold text-slate-900 text-base">Referral Rules</h4>
            <ul className="mt-4 space-y-3 text-xs text-slate-600 font-medium">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Referrer receives <strong className="text-slate-900">+1 GB</strong> extra cloud storage on friend signup.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Invited friend gets <strong className="text-slate-900">Premium Tier</strong> 30-day trial for free.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Maximum 50 GB storage bonus cap per account.</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-indigo-100 text-center">
            <span className="text-[11px] text-slate-400 font-medium">Automated verification via OTP & device ID fingerprint</span>
          </div>
        </div>
      </div>
    </div>
  );
}
