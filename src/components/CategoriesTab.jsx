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
    return name.includes(search.toLowerCase());
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#111827] border border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            Taxonomy & Category Architecture
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real MongoDB Category nodes and subcategories. Changes reflect instantly in mobile and web apps.
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
              className="w-full pl-9 pr-4 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <button
            onClick={onAddCategory}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition shadow-md shadow-indigo-500/20 active:scale-95 whitespace-nowrap"
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
              className="p-6 rounded-3xl bg-[#111827] border border-slate-800 hover:border-indigo-500/50 shadow-sm hover:shadow-lg transition flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 shadow-sm"
                    >
                      <Layers className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base tracking-tight flex items-center gap-2">
                        {catName}
                        {cat.isHomeTile && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Home Tile
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        {cat.id || cat._id}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteCategory && onDeleteCategory(cat.id || cat._id, catName)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Delete category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Document count pill */}
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
                  <FileText className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Enrolled Documents:</span>
                  <span className="font-bold text-white ml-auto">{cat.documentCount || cat.docCount || 0}</span>
                </div>

                {/* Subcategories list */}
                <div className="mt-5">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Subcategories ({subcategories.length})
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                    {subcategories.length > 0 ? (
                      subcategories.map((sub, idx) => {
                        const sName = getSubName(sub);
                        const sId = getSubId(sub);
                        return (
                          <span
                            key={sId || idx}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-slate-800 text-slate-300 border border-slate-800 group/tag hover:border-slate-300 transition"
                          >
                            <span>{sName}</span>
                            <button
                              onClick={() => onDeleteSubcategory && onDeleteSubcategory(cat.id || cat._id, sId)}
                              className="text-slate-400 hover:text-rose-600 transition"
                              title="Remove subcategory"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        );
                      })
                    ) : (
                      <span className="text-xs text-slate-400 italic">No subcategories defined</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Add Subcategory input */}
              <div className="mt-6 pt-4 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="New subcategory..."
                    value={newSubInput[catId] || ''}
                    onChange={(e) => setNewSubInput({ ...newSubInput, [catId]: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddSub(cat.id || cat._id);
                    }}
                    className="flex-1 px-3 py-1.5 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={() => handleAddSub(cat.id || cat._id)}
                    className="p-2 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200 transition text-xs font-semibold"
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
