import React from 'react';
import {
  CreditCard,
  Plus,
  Check,
  HardDrive,
  Users,
  Trash2,
  Sparkles
} from 'lucide-react';

export default function PlansTab({ plans = [], onAddPlan, onDeletePlan }) {
  const planList = Array.isArray(plans) ? plans : plans?.plans || [];

  const getPrice = (plan) => {
    if (plan.price !== undefined) return plan.price;
    if (plan.pricing?.monthly !== undefined) return plan.pricing.monthly;
    return 0;
  };

  const getTier = (plan) => {
    return (plan.tier || plan.badge || plan.planId || 'STANDARD').toUpperCase();
  };

  const getFeaturesList = (plan) => {
    if (Array.isArray(plan.features)) return plan.features;
    if (plan.features && typeof plan.features === 'object') {
      const list = [];
      if (plan.features.aiOcr) list.push('AI OCR Instant Document Extraction');
      if (plan.features.secureShareLinks) list.push('Password Protected Secure Share Links');
      if (plan.features.expiryReminders) list.push('Automated Expiry Push Reminders');
      if (plan.features.biometricLock) list.push('Biometric FaceID / Fingerprint Lock');
      if (plan.features.bulkUploadLimit) list.push(`Bulk Upload Up to ${plan.features.bulkUploadLimit} Files`);
      list.push('10 Official Indian Languages');
      return list;
    }
    return ['AES-256 Military Vault Encryption', '10 Indian Languages', 'Secure Cloud Backup'];
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-indigo-600" />
            Subscription Tiers & Monetization Matrix
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real MongoDB Subscription Plans with storage allowances, feature gates, and INR pricing.
          </p>
        </div>
        <button
          onClick={onAddPlan}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition shadow-md shadow-indigo-500/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Plan</span>
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {planList.map((plan) => {
          const planId = plan.id || plan._id || plan.planId;
          const tier = getTier(plan);
          const price = getPrice(plan);
          const features = getFeaturesList(plan);
          const isPopular = tier === 'PREMIUM';

          return (
            <div
              key={planId}
              className={`relative rounded-3xl p-6 border flex flex-col justify-between transition-all duration-300 hover:shadow-xl ${
                isPopular
                  ? 'bg-gradient-to-b from-indigo-50/50 via-white to-white border-indigo-400 shadow-md shadow-indigo-500/10'
                  : 'bg-white border-slate-200/90 shadow-sm'
              }`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-[10px] font-extrabold tracking-wider uppercase shadow-md">
                  Most Popular
                </div>
              )}

              <div>
                {/* Plan Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">{plan.name || tier}</h3>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 mt-1 inline-block font-bold">
                      {tier}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {!['FREE', 'PREMIUM'].includes(tier) && (
                      <button
                        onClick={() => onDeletePlan && onDeletePlan(plan.planId || tier, plan.name)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Delete plan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Price Display */}
                <div className="mt-5 pb-5 border-b border-slate-100">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-slate-900">
                      ₹{price}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">/{plan.interval || 'month'}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Encrypted personal vault storage tier</p>
                </div>

                {/* Core Metrics */}
                <div className="py-4 space-y-2.5 text-xs border-b border-slate-100">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-2 text-slate-500">
                      <HardDrive className="w-3.5 h-3.5 text-indigo-600" />
                      Storage Allocation:
                    </span>
                    <span className="font-extrabold text-slate-900">{plan.storageLimitGB || 5} GB</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-2 text-slate-500">
                      <Users className="w-3.5 h-3.5 text-violet-600" />
                      Devices / Family:
                    </span>
                    <span className="font-extrabold text-slate-900">{plan.peopleLimit || 1}</span>
                  </div>
                </div>

                {/* Features List */}
                <div className="mt-4 space-y-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Features Included</div>
                  <ul className="space-y-1.5">
                    {features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs px-2.5 py-1 rounded-full font-bold border bg-emerald-50 text-emerald-700 border-emerald-200">
                  Active in Live Database
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
