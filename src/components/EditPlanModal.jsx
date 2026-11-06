import React, { useState, useEffect } from "react";
import { X, CreditCard, Loader2, AlertCircle, Plus, Check, Trash2, Sparkles } from "lucide-react";

// Standard Enum List of Predefined Features
export const PRESET_ENUM_FEATURES = [
  { key: "aiOcr", label: "AI OCR Instant Document Extraction", isSwitch: true },
  { key: "bulkOcr", label: "Bulk OCR Processing & Tagging", isSwitch: true },
  { key: "secureShareLinks", label: "Password Protected Secure Share Links", isSwitch: true },
  { key: "expiryReminders", label: "Automated Expiry Push Reminders", isSwitch: true },
  { key: "biometricLock", label: "Biometric FaceID / Fingerprint Lock", isSwitch: true },
  { key: "lang10", label: "10 Official Indian Languages", isPreset: true },
  { key: "enc256", label: "AES-256 Military Vault Encryption", isPreset: true },
  { key: "prioritySupport", label: "Priority 24/7 Dedicated Support", isPreset: true },
  { key: "cloudSync", label: "Automated Cloud Backup & Device Sync", isPreset: true },
  { key: "familySharing", label: "Multi-Device Family Sharing", isPreset: true },
  { key: "zeroKnowledge", label: "Zero-Knowledge Client Encryption", isPreset: true },
  { key: "unlimitedTags", label: "Document Versioning & Unlimited Tags", isPreset: true }
];

export default function EditPlanModal({ plan, onClose, onSave }) {
  const [name, setName] = useState("");
  const [badge, setBadge] = useState("");
  const [monthlyPrice, setMonthlyPrice] = useState(0);
  const [quarterlyPrice, setQuarterlyPrice] = useState(0);
  const [yearlyPrice, setYearlyPrice] = useState(0);
  const [storageLimitGB, setStorageLimitGB] = useState(10);
  const [peopleLimit, setPeopleLimit] = useState(1);
  const [maxFileSizeMB, setMaxFileSizeMB] = useState(25);

  // Enum Feature Switches & Presets
  const [featureSwitches, setFeatureSwitches] = useState({
    aiOcr: false,
    bulkOcr: false,
    secureShareLinks: false,
    expiryReminders: false,
    biometricLock: false
  });

  const [selectedPresets, setSelectedPresets] = useState([]);

  // Manually Added Custom Features List
  const [customFeatures, setCustomFeatures] = useState([]);
  const [newCustomFeatureInput, setNewCustomFeatureInput] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (plan) {
      setName(plan.name || "");
      setBadge(plan.badge || plan.tier || plan.planId || "");
      const mPrice = plan.pricing?.monthly !== undefined ? plan.pricing.monthly : (plan.price || 0);
      setMonthlyPrice(mPrice);
      setQuarterlyPrice(plan.pricing?.quarterly !== undefined ? plan.pricing.quarterly : mPrice * 3);
      setYearlyPrice(plan.pricing?.yearly !== undefined ? plan.pricing.yearly : mPrice * 10);
      setStorageLimitGB(plan.storageLimitGB || 10);
      setPeopleLimit(plan.peopleLimit || 1);
      setMaxFileSizeMB(plan.maxFileSizeMB || 25);

      // Initialize feature switches
      if (plan.features && typeof plan.features === "object") {
        setFeatureSwitches({
          aiOcr: Boolean(plan.features.aiOcr),
          bulkOcr: Boolean(plan.features.bulkOcr),
          secureShareLinks: Boolean(plan.features.secureShareLinks),
          expiryReminders: Boolean(plan.features.expiryReminders),
          biometricLock: Boolean(plan.features.biometricLock)
        });
      }

      // Initialize custom features
      if (Array.isArray(plan.customFeatures)) {
        setCustomFeatures([...plan.customFeatures]);
      } else {
        setCustomFeatures([]);
      }

      // Determine selected non-switch preset items
      const initialPresets = [];
      PRESET_ENUM_FEATURES.filter((f) => f.isPreset).forEach((p) => {
        // If plan is not FREE or if it's default security, mark as selected
        if (p.key === "lang10" || p.key === "enc256" || p.key === "cloudSync") {
          initialPresets.push(p.label);
        }
      });
      setSelectedPresets(initialPresets);
    }
  }, [plan]);

  const handleMonthlyChange = (val) => {
    const num = Number(val) || 0;
    setMonthlyPrice(num);
    setQuarterlyPrice(Math.round(num * 3 * 0.9)); // 10% discount
    setYearlyPrice(Math.round(num * 12 * 0.67)); // 33% discount
  };

  const handleTogglePreset = (label) => {
    setSelectedPresets((prev) =>
      prev.includes(label) ? prev.filter((p) => p !== label) : [...prev, label]
    );
  };

  const handleAddCustomFeature = (e) => {
    if (e) e.preventDefault();
    const clean = newCustomFeatureInput.trim();
    if (!clean) return;
    if (!customFeatures.includes(clean)) {
      setCustomFeatures((prev) => [...prev, clean]);
    }
    setNewCustomFeatureInput("");
  };

  const handleRemoveCustomFeature = (featureToRemove) => {
    setCustomFeatures((prev) => prev.filter((f) => f !== featureToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) {
      setError("Plan Name is required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        name: cleanName,
        badge: badge.trim() || cleanName.toUpperCase(),
        pricing: {
          monthly: Number(monthlyPrice) || 0,
          quarterly: Number(quarterlyPrice) || Number(monthlyPrice) * 3,
          semiAnnual: Math.round(Number(monthlyPrice) * 6 * 0.8),
          yearly: Number(yearlyPrice) || Number(monthlyPrice) * 10
        },
        storageLimitGB: Number(storageLimitGB) || 1,
        peopleLimit: Number(peopleLimit) || 1,
        maxFileSizeMB: Number(maxFileSizeMB) || 10,
        features: {
          ...featureSwitches,
          bulkUploadLimit: Number(peopleLimit) > 1 ? 50 : 10
        },
        customFeatures: [
          ...selectedPresets,
          ...customFeatures
        ]
      };

      const planId = plan.planId || plan.id || plan._id;
      await onSave(planId, payload);
    } catch (err) {
      setError(err.message || "Failed to update plan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#111827] border border-slate-800 p-6 sm:p-7 shadow-2xl max-h-[90vh] overflow-y-auto">
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
            <h3 className="text-lg font-bold text-white">Update Monetization Plan</h3>
            <p className="text-xs text-slate-400 font-mono">
              Tier: {plan.planId || plan.badge} • Database Node
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/70 border border-rose-800/80 text-rose-300 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Plan Name & Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Plan Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError("");
                }}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Badge / Tier Code
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white uppercase focus:outline-none focus:border-indigo-500 font-mono font-bold"
              />
            </div>
          </div>

          {/* Pricing Row */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Pricing Structure (INR ₹)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Monthly (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={monthlyPrice}
                  onChange={(e) => handleMonthlyChange(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-indigo-500 font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Quarterly (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={quarterlyPrice}
                  onChange={(e) => setQuarterlyPrice(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Yearly (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={yearlyPrice}
                  onChange={(e) => setYearlyPrice(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Quotas Row: Storage, Devices, Max File Size */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Storage Quota (GB)
              </label>
              <input
                type="number"
                min="1"
                required
                value={storageLimitGB}
                onChange={(e) => setStorageLimitGB(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Devices / Members
              </label>
              <input
                type="number"
                min="1"
                required
                value={peopleLimit}
                onChange={(e) => setPeopleLimit(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Max File Size (MB)
              </label>
              <input
                type="number"
                min="5"
                required
                value={maxFileSizeMB}
                onChange={(e) => setMaxFileSizeMB(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 font-mono font-bold"
              />
            </div>
          </div>

          {/* Features Included: 1) Predefined Enum List */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                  Existing Features (Enum Checklist)
                </span>
                <span className="text-[11px] text-slate-400">
                  Select and toggle standard built-in vault feature capabilities
                </span>
              </div>
              <Sparkles className="w-4 h-4 text-indigo-400" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {PRESET_ENUM_FEATURES.map((feat) => {
                const isChecked = feat.isSwitch
                  ? Boolean(featureSwitches[feat.key])
                  : selectedPresets.includes(feat.label);

                return (
                  <label
                    key={feat.key}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                      isChecked
                        ? "bg-indigo-950/60 border-indigo-600/80 text-white font-medium shadow-sm"
                        : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {
                        if (feat.isSwitch) {
                          setFeatureSwitches((prev) => ({
                            ...prev,
                            [feat.key]: !prev[feat.key]
                          }));
                        } else {
                          handleTogglePreset(feat.label);
                        }
                      }}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="truncate">{feat.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Features Included: 2) Manually Add More Option */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div>
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                Manually Add Custom Features
              </span>
              <span className="text-[11px] text-slate-400">
                Type any custom marketing bullet or perk to include in this plan
              </span>
            </div>

            {/* Input + Add button */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="e.g. 500 GB Drive Backup, Dedicated SLA..."
                value={newCustomFeatureInput}
                onChange={(e) => setNewCustomFeatureInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCustomFeature();
                  }
                }}
                className="flex-1 px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddCustomFeature}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-sm active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add More</span>
              </button>
            </div>

            {/* Rendered Custom Features Chips */}
            {customFeatures.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-2">
                {customFeatures.map((feat, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-xl text-xs bg-slate-950 text-indigo-300 border border-indigo-900/60 shadow-sm"
                  >
                    <span>{feat}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomFeature(feat)}
                      className="text-slate-400 hover:text-rose-400 transition"
                      title="Remove feature"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-[11px] text-slate-500 italic pt-1">
                No custom manual features added yet. Type above and click "Add More".
              </div>
            )}
          </div>

          {/* Action Buttons */}
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
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
