import React, { useState, useEffect } from "react";
import { X, Layers, Loader2, AlertCircle, Check } from "lucide-react";

export default function EditCategoryModal({ category, onClose, onSave }) {
  const [nameEn, setNameEn] = useState("");
  const [nameHi, setNameHi] = useState("");
  const [color, setColor] = useState("#4F46E5");
  const [isHomeTile, setIsHomeTile] = useState(false);
  const [homeTileName, setHomeTileName] = useState("");
  const [supportsExpiry, setSupportsExpiry] = useState(false);
  const [displayOrder, setDisplayOrder] = useState(0);
  const [icon, setIcon] = useState("folder");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const presetColors = [
    "#4F46E5", // Indigo
    "#10B981", // Emerald
    "#F59E0B", // Amber
    "#EC4899", // Pink
    "#8B5CF6", // Violet
    "#3B82F6", // Blue
    "#06B6D4", // Cyan
    "#EF4444", // Rose
    "#14B8A6"  // Teal
  ];

  useEffect(() => {
    if (category) {
      if (typeof category.name === "string") {
        setNameEn(category.name);
      } else {
        setNameEn(category.name?.en || "");
        setNameHi(category.name?.hi || "");
      }
      setColor(category.colour || category.color || "#4F46E5");
      setIsHomeTile(Boolean(category.isHomeTile));
      setHomeTileName(category.homeTileName || "");
      setSupportsExpiry(Boolean(category.supportsExpiry));
      setDisplayOrder(Number(category.displayOrder) || 0);
      setIcon(category.icon || "folder");
    }
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanEn = nameEn.trim();
    if (!cleanEn) {
      setError("Category name (English) is required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        name: {
          en: cleanEn,
          hi: nameHi.trim(),
          mr: category.name?.mr || ""
        },
        colour: color,
        color: color,
        isHomeTile,
        homeTileName: isHomeTile ? (homeTileName.trim() || cleanEn) : null,
        supportsExpiry,
        displayOrder: Number(displayOrder) || 0,
        icon
      };

      const catId = category.id || category._id;
      await onSave(catId, payload);
    } catch (err) {
      setError(err.message || "Failed to update category.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#111827] border border-slate-800 p-6 sm:p-7 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg"
            style={{ backgroundColor: color }}
          >
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Update Category Taxonomy</h3>
            <p className="text-xs text-slate-400 font-mono">ID: {category.id || category._id}</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/70 border border-rose-800/80 text-rose-300 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* English Name */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Category Name (English) *
            </label>
            <input
              type="text"
              required
              value={nameEn}
              onChange={(e) => {
                setNameEn(e.target.value);
                if (error) setError("");
              }}
              placeholder="e.g. Identity & Government"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Hindi Name */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Regional Translation (Hindi)
            </label>
            <input
              type="text"
              value={nameHi}
              onChange={(e) => setNameHi(e.target.value)}
              placeholder="e.g. पहचान एवं सरकारी दस्तावेज"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Theme Color Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Theme Color
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {presetColors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-xl transition flex items-center justify-center ring-2 ring-offset-2 ring-offset-[#111827] ${
                    color === c ? "ring-white scale-110" : "ring-transparent hover:scale-105"
                  }`}
                  style={{ backgroundColor: c }}
                >
                  {color === c && <Check className="w-4 h-4 text-white drop-shadow" />}
                </button>
              ))}
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-8 h-8 rounded-xl bg-transparent border-0 cursor-pointer"
                title="Custom Color"
              />
            </div>
          </div>

          {/* Home Tile & Display Order Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Display Order Priority
              </label>
              <input
                type="number"
                min="0"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Document Expiry Tracking
              </label>
              <label className="flex items-center gap-3 px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700 transition">
                <input
                  type="checkbox"
                  checked={supportsExpiry}
                  onChange={(e) => setSupportsExpiry(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span className="text-xs text-slate-200 font-medium">Supports Expiry Alerts</span>
              </label>
            </div>
          </div>

          {/* Home Tile Toggle */}
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-xs font-bold text-white block">Promote as Home Screen Tile</span>
                <span className="text-[11px] text-slate-400">Display prominently on the app home dashboard</span>
              </div>
              <input
                type="checkbox"
                checked={isHomeTile}
                onChange={(e) => setIsHomeTile(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
            </label>

            {isHomeTile && (
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Home Tile Display Label
                </label>
                <input
                  type="text"
                  value={homeTileName}
                  onChange={(e) => setHomeTileName(e.target.value)}
                  placeholder="e.g. Identity & Passports"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
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
                  <span>Updating...</span>
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
