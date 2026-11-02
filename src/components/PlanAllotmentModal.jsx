import React, { useState } from 'react';
import {
  X,
  Shield,
  CreditCard,
  HardDrive,
  Calendar,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export default function PlanAllotmentModal({ user, plans = [], onClose, onAllotPlan }) {
  const [selectedPlan, setSelectedPlan] = useState(user?.plan || 'PREMIUM');
  const [durationMonths, setDurationMonths] = useState(12);
  const [bonusStorageGB, setBonusStorageGB] = useState(0);
  const [reason, setReason] = useState('Enterprise Tier Customer Upgrade');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onAllotPlan(user.id || user._id, {
      plan: selectedPlan,
      durationMonths: Number(durationMonths),
      bonusStorageGB: Number(bonusStorageGB),
      reason
    });
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0F1523] border border-indigo-500/30 p-6 shadow-2xl shadow-indigo-500/10">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Allot Subscription Plan</h3>
            <p className="text-xs text-slate-400">
              Grant custom plan permissions, duration, and bonus quota for <strong className="text-indigo-300">{user?.name || user?.email}</strong>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Plan Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Select Plan Tier
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['FREE', 'PREMIUM', 'FAMILY', 'BUSINESS'].map((tier) => (
                <button
                  type="button"
                  key={tier}
                  onClick={() => setSelectedPlan(tier)}
                  className={`p-3 rounded-xl border text-left transition ${
                    selectedPlan === tier
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-xs">{tier}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {tier === 'FREE' ? '5 GB' : tier === 'PREMIUM' ? '25 GB' : tier === 'FAMILY' ? '100 GB' : '500 GB'} Storage
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Validity Period
            </label>
            <select
              value={durationMonths}
              onChange={(e) => setDurationMonths(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="1">1 Month</option>
              <option value="3">3 Months (Quarterly)</option>
              <option value="6">6 Months (Half-Yearly)</option>
              <option value="12">12 Months (1 Year - Standard)</option>
              <option value="24">24 Months (2 Years)</option>
              <option value="999">Lifetime / Unlimited</option>
            </select>
          </div>

          {/* Bonus Storage */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Bonus Cloud Storage (Add-on GB)
            </label>
            <input
              type="number"
              min="0"
              max="1000"
              value={bonusStorageGB}
              onChange={(e) => setBonusStorageGB(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              placeholder="e.g. 10"
            />
          </div>

          {/* Administrative Reason */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Audit Note / Reason
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              placeholder="Audit log reason..."
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-semibold hover:from-indigo-600 hover:to-purple-700 transition shadow-lg shadow-indigo-500/20 active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Confirm Plan Allotment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
