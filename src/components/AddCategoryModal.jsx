import React, { useState } from "react";
import { X, FolderPlus, Loader2, AlertCircle } from "lucide-react";

export default function AddCategoryModal({ onClose, onSave }) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#4F46E5");
  const [subcategoriesStr, setSubcategoriesStr] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const colors = ["#4F46E5", "#10B981", "#F59E0B", "#EC4899", "#8B5CF6", "#3B82F6", "#06B6D4"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) {
      setError("Please enter a category name.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const autoId = cleanName.toLowerCase().replace(/[^a-z0-9_]/g, "_").replace(/^_+|_+$/g, "") || `cat_${Date.now()}`;

      const subcategories = subcategoriesStr
        .split(",")
        .map(s => s.trim())
        .filter(Boolean)
        .map((s, idx) => {
          let sId = s.toLowerCase().replace(/[^a-z0-9_]/g, "_").replace(/^_+|_+$/g, "");
          if (!sId) sId = `sub_${idx + 1}`;
          return {
            id: sId,
            name: { en: s, hi: "" },
            supportsExpiry: false
          };
        });

      await onSave({
        id: autoId,
        name: { en: cleanName, hi: "" },
        colour: color,
        color: color,
        icon: "folder",
        subcategories
      });
    } catch (err) {
      setError(err.message || "Failed to create category. Please try again.");
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
            <FolderPlus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Create New Category</h3>
            <p className="text-xs text-slate-400">Add a new document taxonomy node and classifications</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/70 border border-rose-800/80 text-rose-300 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Category Name
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="e.g. Legal & Contracts"
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
              Accent Color
            </label>
            <div className="flex items-center gap-2.5">
              {colors.map(c => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full border-2 transition ${color === c ? "border-white scale-110 shadow-lg ring-2 ring-indigo-500/50" : "border-transparent opacity-80 hover:opacity-100"}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Initial Subcategories (comma separated)
            </label>
            <textarea
              rows="3"
              placeholder="e.g. Agreements, Court Deeds, Affidavits, Power of Attorney"
              value={subcategoriesStr}
              onChange={(e) => setSubcategoriesStr(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
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
                <span>Save Category</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
