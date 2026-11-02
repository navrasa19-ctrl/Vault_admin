import React, { useState } from 'react';
import {
  FolderPlus,
  Trash2,
  Edit2,
  Plus,
  X,
  FileText,
  Layers,
  Sparkles,
  Shield,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function CategoriesTab({ categories = [], onAddCategory, onDeleteCategory, onAddSubcategory, onDeleteSubcategory }) {
  const [search, setSearch] = useState('');
  const [newSubInput, setNewSubInput] = useState({});
  const [selectedCat, setSelectedCat] = useState(null);

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.subcategories?.some(s => s.toLowerCase().includes(search.toLowerCase()))
  );

  const handleAddSub = (catId) => {
    const subName = newSubInput[catId]?.trim();
    if (!subName) return;
    if (onAddSubcategory) {
      onAddSubcategory(catId, subName);
    }
    setNewSubInput(prev => ({ ...prev, [catId]: '' }));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0F1523]/80 border border-slate-800 backdrop-blur-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            Taxonomy & Category Architecture
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure system categories, classifications, and nested subcategories for multi-tenant document vaults.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search taxonomy..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
            />
          </div>
          <button
            onClick={onAddCategory}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium text-xs hover:from-indigo-600 hover:to-purple-700 transition shadow-lg shadow-indigo-500/20 active:scale-95 whitespace-nowrap"
          >
            <FolderPlus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((cat) => {
          const catId = cat.id || cat._id;
          return (
            <div
              key={catId}
              className="group relative p-6 rounded-2xl bg-[#0F1523]/90 border border-slate-800/80 hover:border-indigo-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/5 flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white shadow-md"
                      style={{ backgroundColor: (cat.color || '#6366f1') + '25', color: cat.color || '#818cf8', border: `1px solid ${cat.color || '#818cf8'}40` }}
                    >
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-base tracking-tight flex items-center gap-2">
                        {cat.name}
                        {cat.isDefault && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Core
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                        {cat.description || 'Vault classified storage section'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                    <button
                      onClick={() => onDeleteCategory && onDeleteCategory(catId, cat.name)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                      title="Delete category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Document count pill */}
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-300 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800/60">
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Enrolled Documents:</span>
                  <span className="font-semibold text-white ml-auto">{cat.docCount || 0}</span>
                </div>

                {/* Subcategories list */}
                <div className="mt-5">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Subcategories ({cat.subcategories?.length || 0})</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                    {cat.subcategories && cat.subcategories.length > 0 ? (
                      cat.subcategories.map((sub, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-slate-800/80 text-slate-300 border border-slate-700/60 group/tag hover:border-slate-600"
                        >
                          <span>{sub}</span>
                          <button
                            onClick={() => onDeleteSubcategory && onDeleteSubcategory(catId, sub)}
                            className="text-slate-500 hover:text-rose-400 transition"
                            title="Remove subcategory"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500 italic">No subcategories defined</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Add Subcategory input */}
              <div className="mt-5 pt-4 border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="New subcategory name..."
                    value={newSubInput[catId] || ''}
                    onChange={(e) => setNewSubInput({ ...newSubInput, [catId]: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddSub(catId);
                    }}
                    className="flex-1 px-3 py-1.5 bg-slate-900/90 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                  />
                  <button
                    onClick={() => handleAddSub(catId)}
                    className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-500/30 transition text-xs font-medium flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
