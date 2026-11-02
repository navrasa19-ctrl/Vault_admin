import React, { useState } from 'react';
import { X, CreditCard, Sparkles } from 'lucide-react';

export default function AddPlanModal({ onClose, onSave }) {
  const [name, setName] = useState('');
  const [tier, setTier] = useState('BUSINESS');
  const [price, setPrice] = useState(499);
  const [storageLimitGB, setStorageLimitGB] = useState(100);
  const [interval, setInterval] = useState('month');
  const [featuresStr, setFeaturesStr] = useState('Unlimited Encrypted Storage, Multi-device Sync, 10 Languages, Dedicated Support');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const features = featuresStr.split(',').map(f => f.trim()).filter(Boolean);
    onSave({
      name: name.trim(),
      tier: tier.toUpperCase(),
      price: Number(price),
      storageLimitGB: Number(storageLimitGB),
      interval,
      features
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md rounded-3xl bg-[#0F1523] border border-slate-800 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Create Subscription Tier</h3>
            <p className="text-xs text-slate-400">Define pricing and feature gates</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Plan Name</label>
              <input
                type="text"
                required
                placeholder="Enterprise Pro"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Tier Code</label>
              <input
                type="text"
                required
                placeholder="ENTERPRISE"
                value={tier}
                onChange={(e) => setTier(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white uppercase focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Price (INR ₹)</label>
              <input
                type="number"
                min="0"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Storage (GB)</label>
              <input
                type="number"
                min="1"
                required
                value={storageLimitGB}
                onChange={(e) => setStorageLimitGB(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Features (comma separated)</label>
            <textarea
              rows="3"
              value={featuresStr}
              onChange={(e) => setFeaturesStr(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
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
              className="px-5 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold hover:bg-purple-700 transition shadow-lg shadow-purple-500/20"
            >
              Save Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
