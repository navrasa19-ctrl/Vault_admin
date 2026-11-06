import React, { useState } from "react";
import { X, CreditCard, Loader2, AlertCircle, Plus, Sparkles } from "lucide-react";
import { PRESET_ENUM_FEATURES } from "./EditPlanModal";

export default function AddPlanModal({ onClose, onSave }) {
  const [name, setName] = useState("");
  const [tier, setTier] = useState("ENTERPRISE");
  const [price, setPrice] = useState(499);
  const [storageLimitGB, setStorageLimitGB] = useState(50);
  const [peopleLimit, setPeopleLimit] = useState(1);
  const [maxFileSizeMB, setMaxFileSizeMB] = useState(50);

  // Enum Feature Switches & Presets
  const [featureSwitches, setFeatureSwitches] = useState({
    aiOcr: true,
    bulkOcr: true,
    secureShareLinks: true,
    expiryReminders: true,
    biometricLock: true
  });

  const [selectedPresets, setSelectedPresets] = useState([
    "10 Official Indian Languages",
    "AES-256 Military Vault Encryption",
    "Automated Cloud Backup & Device Sync"
  ]);

  // Manually Added Custom Features List
  const [customFeatures, setCustomFeatures] = useState([]);
  const [newCustomFeatureInput, setNewCustomFeatureInput] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    const cleanTier = tier.trim().toUpperCase().replace(/[^A-Z0-9_]/g, "_");

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
        maxFileSizeMB: Number(maxFileSizeMB) || 50,
        maxFileSizeBytes: (Number(maxFileSizeMB) || 50) * (1024 ** 2),
        peopleLimit: Number(peopleLimit) || 1,
        features: {
          ...featureSwitches,
          bulkUploadLimit: 50
        },
        customFeatures: [
          ...selectedPresets,
          ...customFeatures
        ]
      });
    } catch (err) {
      setError(err.message || "Failed to create plan. Please try again.");
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
            <h3 className="text-lg font-bold text-white">Create Subscription Tier</h3>
            <p className="text-xs text-slate-400">Define pricing, storage quotas, and feature matrix</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/70 border border-rose-800/80 text-rose-300 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Plan Name *
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
                Tier Code *
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Price (Monthly ₹)
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
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 font-mono font-bold"
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
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 font-mono font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Members / Devices
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
          </div>

          {/* Features Included: 1) Predefined Enum List */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                  Included Features (Enum Checklist)
                </span>
                <span className="text-[11px] text-slate-400">
                  Select predefined capabilities to enable
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
                Type any custom perk to include in this plan
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
                No custom manual features added yet.
              </div>
            )}
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