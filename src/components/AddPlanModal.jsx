import React, { useState } from "react";
import { X, CreditCard, Loader2, AlertCircle } from "lucide-react";

export default function AddPlanModal({ onClose, onSave }) {
  const [name, setName] = useState("");
  const [tier, setTier] = useState("ENTERPRISE");
  const [price, setPrice] = useState(499);
  const [storageLimitGB, setStorageLimitGB] = useState(100);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanTier = tier.trim().toUpperCase();

    if (!cleanName) {
      setError("Please enter a plan name.");
      return;
    }
    if (!cleanTier) {
      setError("Please enter a tier code.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const numPrice = Number(price) || 0;
      const numStorage = Number(storageLimitGB) || 10;

      await onSave({
        planId: cleanTier,
        tier: cleanTier,
        name: cleanName,
        badge: cleanTier,
        price: numPrice,
        pricing: {
          monthly: numPrice,
          quarterly: numPrice * 3,
          semiAnnual: numPrice * 6,
          yearly: numPrice * 10
        },
        storageLimitGB: numStorage,
        storageLimitBytes: numStorage * (1024 ** 3),
        maxDocuments: null,
        maxFileSizeMB: 50,
        maxFileSizeBytes: 50 * (1024 ** 2),
        peopleLimit: 1
      });
    } catch (err) {
      setError(err.message || "Failed to create plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md rounded-3xl bg-[#111827] border border-slate-800 p-6 sm:p-7 shadow-2xl">
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-indigo-950/80 border border-indigo-800/80 text-indigo-400">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Create Subscription Tier</h3>
            <p className="text-xs text-slate-400">Define pricing and storage quotas</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/70 border border-rose-800/80 text-rose-300 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Plan Name
              </label>
              <input
                type="text"
                required
                autoFocus
                placeholder="Enterprise Pro"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError("");
                }}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Tier Code
              </label>
              <input
                type="text"
                required
                placeholder="ENTERPRISE"
                value={tier}
                onChange={(e) => {
                  setTier(e.target.value);
                  if (error) setError("");
                }}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white uppercase focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 font-mono font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Price (INR ₹)
              </label>
              <input
                type="number"
                min="0"
                required
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                  if (error) setError("");
                }}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Storage (GB)
              </label>
              <input
                type="number"
                min="1"
                required
                value={storageLimitGB}
                onChange={(e) => {
                  setStorageLimitGB(e.target.value);
                  if (error) setError("");
                }}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 font-mono"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-500/25 flex items-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Plan</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
