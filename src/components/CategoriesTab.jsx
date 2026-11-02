import React, { useState } from 'react';
import {
  FolderPlus,
  Trash2,
  Plus,
  X,
  FileText,
  Layers,
  Search
} from 'lucide-react';

export default function CategoriesTab({ categories = [], onAddCategory, onDeleteCategory, onAddSubcategory, onDeleteSubcategory }) {
  const [search, setSearch] = useState('');
  const [newSubInput, setNewSubInput] = useState({});

  const catList = Array.isArray(categories) ? categories : categories?.categories || [];

  const getCatName = (cat) => {
    if (!cat) return 'Category';
    if (typeof cat.name === 'string') return cat.name;
    return cat.name?.en || cat.name?.hi || cat.id || 'Category';
  };

  const getCatDesc = (cat) => {
    if (!cat) return '';
    if (typeof cat.description === 'string') return cat.description;
    return cat.homeTileName || 'Vault encrypted classification';
  };

  const getSubName = (sub) => {
    if (!sub) return '';
    if (typeof sub === 'string') return sub;
    return sub.name?.en || sub.name?.hi || sub.id || 'Subcategory';
  };

  const getSubId = (sub) => {
    if (!sub) return '';
    if (typeof sub === 'string') return sub.toLowerCase().replace(/[^a-z0-9_]/g, '_');
    return sub.id || sub.name?.en || 'sub';
  };

  const filteredCategories = catList.filter(c => {
    const name = getCatName(c).toLowerCase();
    const matchesSearch = name.includes(search.toLowerCase());
    return matchesSearch;
  });

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
            Real MongoDB Category nodes and subcategories. Changes reflect instantly in mobile & web apps.
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
          const catName = getCatName(cat);
          const subcategories = Array.isArray(cat.subcategories) ? cat.subcategories : [];

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
                      style={{
                        backgroundColor: (cat.colour || cat.color || '#6366f1') + '25',
                        color: cat.colour || cat.color || '#818cf8',
                        border: `1px solid ${cat.colour || cat.color || '#818cf8'}40`
                      }}
                    >
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-base tracking-tight flex items-center gap-2">
                        {catName}
                        {cat.isHomeTile && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Home Tile
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1 font-mono">
                        {cat.id || cat._id}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                    <button
                      onClick={() => onDeleteCategory && onDeleteCategory(cat.id || cat._id, catName)}
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
                  <span className="font-semibold text-white ml-auto">{cat.documentCount || cat.docCount || 0}</span>
                </div>

                {/* Subcategories list */}
                <div className="mt-5">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Subcategories ({subcategories.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                    {subcategories.length > 0 ? (
                      subcategories.map((sub, idx) => {
                        const sName = getSubName(sub);
                        const sId = getSubId(sub);
                        return (
                          <span
                            key={sId || idx}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-slate-800/80 text-slate-300 border border-slate-700/60 group/tag hover:border-slate-600"
                          >
                            <span>{sName}</span>
                            <button
                              onClick={() => onDeleteSubcategory && onDeleteSubcategory(cat.id || cat._id, sId)}
                              className="text-slate-500 hover:text-rose-400 transition"
                              title="Remove subcategory"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        );
                      })
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
                      if (e.key === 'Enter') handleAddSub(cat.id || cat._id);
                    }}
                    className="flex-1 px-3 py-1.5 bg-slate-900/90 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                  />
                  <button
                    onClick={() => handleAddSub(cat.id || cat._id)}
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
