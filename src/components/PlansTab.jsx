import React, { useState } from 'react';
import {
  CreditCard,
  Plus,
  Check,
  Shield,
  HardDrive,
  Users,
  Edit2,
  Trash2,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  FileCheck
} from 'lucide-react';

export default function PlansTab({ plans = [], onAddPlan, onEditPlan, onDeletePlan, onTogglePlan }) {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0F1523]/80 border border-slate-800 backdrop-blur-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-purple-400" />
            Subscription Tiers & Monetization Matrix
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Define storage thresholds, monthly/annual Indian Rupee pricing tiers, feature gates, and plan quotas.
          </p>
        </div>
        <button
          onClick={onAddPlan}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium text-xs hover:from-purple-600 hover:to-indigo-700 transition shadow-lg shadow-purple-500/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Plan</span>
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {plans.map((plan) => {
          const planId = plan.id || plan._id;
          const isPremium = plan.tier === 'PREMIUM' || plan.name?.toLowerCase().includes('premium');
          const isFamily = plan.tier === 'FAMILY' || plan.name?.toLowerCase().includes('family');

          return (
            <div
              key={planId}
              className={`relative rounded-3xl p-6 border flex flex-col justify-between transition-all duration-300 hover:shadow-2xl ${
                isPremium
                  ? 'bg-gradient-to-b from-indigo-950/40 via-[#0F1523] to-[#0B0F19] border-indigo-500/40 shadow-indigo-500/10'
                  : isFamily
                  ? 'bg-gradient-to-b from-purple-950/40 via-[#0F1523] to-[#0B0F19] border-purple-500/40 shadow-purple-500/10'
                  : 'bg-[#0F1523]/90 border-slate-800 hover:border-slate-700'
              }`}
            >
              {isPremium && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[10px] font-bold tracking-wider uppercase shadow-md">
                  Most Popular
                </div>
              )}

              <div>
                {/* Plan Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">{plan.name}</h3>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 mt-1 inline-block">
                      {plan.tier || 'STANDARD'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditPlan && onEditPlan(plan)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition"
                      title="Edit plan"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {!['FREE', 'PREMIUM'].includes(plan.tier) && (
                      <button
                        onClick={() => onDeletePlan && onDeletePlan(planId, plan.name)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                        title="Delete plan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Price Display */}
                <div className="mt-5 pb-5 border-b border-slate-800/80">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-white">
                      ₹{plan.price !== undefined ? plan.price : 0}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">/{plan.interval || 'month'}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{plan.description || 'High-security encrypted vault storage'}</p>
                </div>

                {/* Core Metrics */}
                <div className="py-4 space-y-2.5 text-xs border-b border-slate-800/80">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-2 text-slate-400">
                      <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
                      Storage Allocation:
                    </span>
                    <span className="font-semibold text-white">{plan.storageLimitGB || plan.storageLimit || 5} GB</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-2 text-slate-400">
                      <Users className="w-3.5 h-3.5 text-purple-400" />
                      Active Subscribers:
                    </span>
                    <span className="font-semibold text-white">{plan.activeUsersCount || 0}</span>
                  </div>
                </div>

                {/* Features List */}
                <div className="mt-4 space-y-2">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Features Included</div>
                  <ul className="space-y-1.5">
                    {(plan.features || [
                      'AES-256 Military Encryption',
                      '10 Indian Languages Support',
                      'Password Protected Share Links',
                      'Instant Refer & Earn Bonus'
                    ]).map((feat, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Status and Toggle */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                  plan.isActive !== false
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                }`}>
                  {plan.isActive !== false ? 'Active & Published' : 'Disabled'}
                </span>
                <button
                  onClick={() => onTogglePlan && onTogglePlan(planId, !plan.isActive)}
                  className="text-xs text-slate-400 hover:text-white transition flex items-center gap-1 font-medium"
                >
                  {plan.isActive !== false ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <ToggleRight className="w-5 h-5" /> Live
                    </span>
                  ) : (
                    <span className="text-slate-500 flex items-center gap-1">
                      <ToggleLeft className="w-5 h-5" /> Off
                    </span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
