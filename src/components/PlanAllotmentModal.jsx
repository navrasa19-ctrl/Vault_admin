import React, { useState } from 'react';
import { X, CreditCard, Sparkles } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#111827] border border-slate-800 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Allot Subscription Plan</h3>
            <p className="text-xs text-slate-500">
              Grant custom plan permissions for <strong className="text-indigo-600">{user?.name || user?.email}</strong>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Select Plan Tier
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['FREE', 'PREMIUM', 'FAMILY', 'BUSINESS'].map((tier) => (
                <button
                  type="button"
                  key={tier}
                  onClick={() => setSelectedPlan(tier)}
                  className={`p-3 rounded-2xl border text-left transition ${
                    selectedPlan === tier
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-900 font-bold shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-xs">{tier}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {tier === 'FREE' ? '1 GB' : tier === 'PREMIUM' ? '50 GB' : tier === 'FAMILY' ? '200 GB' : '500 GB'} Storage
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Validity Period
            </label>
            <select
              value={durationMonths}
              onChange={(e) => setDurationMonths(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 font-medium focus:outline-none focus:border-indigo-500"
            >
              <option value="1">1 Month</option>
              <option value="3">3 Months (Quarterly)</option>
              <option value="6">6 Months (Half-Yearly)</option>
              <option value="12">12 Months (1 Year - Standard)</option>
              <option value="999">Lifetime / Unlimited</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Bonus Cloud Storage (Add-on GB)
            </label>
            <input
              type="number"
              min="0"
              max="1000"
              value={bonusStorageGB}
              onChange={(e) => setBonusStorageGB(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              placeholder="e.g. 10"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Audit Note / Reason
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              placeholder="Audit log reason..."
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-400 text-xs font-semibold hover:bg-slate-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-md shadow-indigo-500/20 active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Confirm Plan Allotment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
