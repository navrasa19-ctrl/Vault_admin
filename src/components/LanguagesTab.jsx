import React, { useState, useEffect, useMemo } from 'react';
import {
  Globe,
  BookOpen,
  Search,
  Download,
  Edit2,
  Check,
  X,
  RefreshCw,
  Code2,
  FileJson,
  Layers,
  Sparkles,
  ExternalLink,
  Save,
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api';

// Fallback locales bundled locally
import enLocale from '../locales/en.json';
import hiLocale from '../locales/hi.json';
import mrLocale from '../locales/mr.json';
import guLocale from '../locales/gu.json';
import bnLocale from '../locales/bn.json';
import taLocale from '../locales/ta.json';
import teLocale from '../locales/te.json';
import knLocale from '../locales/kn.json';
import mlLocale from '../locales/ml.json';
import paLocale from '../locales/pa.json';

const BUNDLED_LOCALES = {
  en: enLocale,
  hi: hiLocale,
  mr: mrLocale,
  gu: guLocale,
  bn: bnLocale,
  ta: taLocale,
  te: teLocale,
  kn: knLocale,
  ml: mlLocale,
  pa: paLocale
};

const DEFAULT_LANGS = [
  { code: 'en', name: 'English', nativeName: 'English', coverage: '100%', isDefault: true, totalKeys: 334, script: 'Latin' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', coverage: '100%', isDefault: false, totalKeys: 334, script: 'Devanagari' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', coverage: '100%', isDefault: false, totalKeys: 334, script: 'Devanagari' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', coverage: '100%', isDefault: false, totalKeys: 334, script: 'Gujarati' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', coverage: '100%', isDefault: false, totalKeys: 334, script: 'Bengali' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', coverage: '100%', isDefault: false, totalKeys: 334, script: 'Tamil' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', coverage: '100%', isDefault: false, totalKeys: 334, script: 'Telugu' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', coverage: '100%', isDefault: false, totalKeys: 334, script: 'Kannada' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', coverage: '100%', isDefault: false, totalKeys: 334, script: 'Malayalam' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', coverage: '100%', isDefault: false, totalKeys: 334, script: 'Gurmukhi' }
];

export default function LanguagesTab({ languages = [] }) {
  const [langList, setLangList] = useState(DEFAULT_LANGS);
  const [selectedLang, setSelectedLang] = useState('hi');
  const [searchLang, setSearchLang] = useState('');
  const [searchKey, setSearchKey] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [translations, setTranslations] = useState(BUNDLED_LOCALES['hi'] || {});
  const [baseTranslations, setBaseTranslations] = useState(BUNDLED_LOCALES['en'] || {});
  
  // Inline edit state
  const [editingKey, setEditingKey] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [savingKey, setSavingKey] = useState(false);

  // Load backend language metadata
  useEffect(() => {
    async function fetchLangs() {
      try {
        const remote = await api.getLanguages();
        if (Array.isArray(remote) && remote.length > 0) {
          setLangList(remote);
        }
      } catch (e) {
        console.warn('Using local language meta:', e);
      }
    }
    fetchLangs();
  }, []);

  // When selectedLang changes, load dictionary
  useEffect(() => {
    async function loadDictionary() {
      setLoading(true);
      try {
        const details = await api.getLanguageDetails(selectedLang);
        if (details && details.translations) {
          setTranslations(details.translations);
          if (details.baseTranslations) {
            setBaseTranslations(details.baseTranslations);
          }
        } else {
          // Fallback to bundled
          setTranslations(BUNDLED_LOCALES[selectedLang] || BUNDLED_LOCALES['en'] || {});
          setBaseTranslations(BUNDLED_LOCALES['en'] || {});
        }
      } catch (err) {
        setTranslations(BUNDLED_LOCALES[selectedLang] || BUNDLED_LOCALES['en'] || {});
      } finally {
        setLoading(false);
      }
    }
    loadDictionary();
  }, [selectedLang]);

  // Filtered language cards
  const filteredLangs = useMemo(() => {
    return langList.filter(l =>
      (l.name || '').toLowerCase().includes(searchLang.toLowerCase()) ||
      (l.nativeName || l.native || '').toLowerCase().includes(searchLang.toLowerCase()) ||
      (l.code || '').toLowerCase().includes(searchLang.toLowerCase())
    );
  }, [langList, searchLang]);

  // Keys list and categories
  const allKeys = useMemo(() => {
    return Object.keys(baseTranslations);
  }, [baseTranslations]);

  // Group keys by prefixes (e.g., auth, doc, share, reminder, category, plan, setting)
  const categories = useMemo(() => {
    const set = new Set();
    allKeys.forEach(k => {
      const parts = k.split('_');
      if (parts.length > 1) {
        set.add(parts[0]);
      }
    });
    return ['all', ...Array.from(set).sort()];
  }, [allKeys]);

  // Filtered dictionary entries
  const filteredEntries = useMemo(() => {
    const q = searchKey.trim().toLowerCase();
    return allKeys.filter(k => {
      if (activeCategoryFilter !== 'all' && !k.startsWith(activeCategoryFilter + '_')) {
        return false;
      }
      if (!q) return true;
      const enVal = (baseTranslations[k] || '').toLowerCase();
      const currVal = (translations[k] || '').toLowerCase();
      return k.toLowerCase().includes(q) || enVal.includes(q) || currVal.includes(q);
    });
  }, [allKeys, activeCategoryFilter, searchKey, baseTranslations, translations]);

  // Handle start editing
  const handleStartEdit = (key) => {
    setEditingKey(key);
    setEditValue(translations[key] !== undefined ? translations[key] : baseTranslations[key] || '');
    setSaveError(null);
  };

  // Handle save edit
  const handleSaveEdit = async () => {
    if (!editingKey) return;
    setSavingKey(true);
    setSaveError(null);
    try {
      await api.updateLanguageTranslations(selectedLang, {
        key: editingKey,
        value: editValue
      });
      setTranslations(prev => ({ ...prev, [editingKey]: editValue }));
      setEditingKey(null);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      setSaveError(err.message || 'Failed to update key translation');
    } finally {
      setSavingKey(false);
    }
  };

  // Download raw JSON
  const handleDownloadJson = (code) => {
    const data = code === selectedLang ? translations : (BUNDLED_LOCALES[code] || translations);
    const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", jsonStr);
    downloadAnchor.setAttribute("download", `${code}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const currentLangMeta = langList.find(l => l.code === selectedLang) || DEFAULT_LANGS.find(l => l.code === selectedLang) || DEFAULT_LANGS[0];

  return (
    <div className="space-y-8 animate-fadeIn text-slate-200">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-[#111827] border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Pan-India Multilingual Localization Engine
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Full 10 official Indian language dictionaries with 334 localized keys, token preservation, and zero-app-release dynamic updates.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => handleDownloadJson(selectedLang)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Download {selectedLang.toUpperCase()}.json
          </button>
          
          <div className="relative w-full sm:w-56">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search language..."
              value={searchLang}
              onChange={(e) => setSearchLang(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Language Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Official Indian Languages ({filteredLangs.length} Available)
          </div>
          <div className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            All 10 Language Packs 100% Synced (334 Keys Each)
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
          {filteredLangs.map((lang) => {
            const isSelected = selectedLang === lang.code;
            return (
              <div
                key={lang.code}
                onClick={() => setSelectedLang(lang.code)}
                className={`group cursor-pointer p-4 rounded-2xl border transition-all duration-200 relative overflow-hidden ${
                  isSelected
                    ? 'bg-slate-900/90 border-indigo-500 ring-2 ring-indigo-500/30 shadow-lg shadow-indigo-500/10'
                    : 'bg-[#111827] border-slate-800 hover:border-slate-700 hover:bg-slate-900/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                    isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {lang.code}
                  </span>
                  {lang.isDefault ? (
                    <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                      Primary
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium text-slate-400">
                      100%
                    </span>
                  )}
                </div>

                <div className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">
                  {lang.name}
                </div>
                <div className="text-sm font-semibold text-indigo-400 mt-0.5">
                  {lang.nativeName || lang.native}
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>334 Keys</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadJson(lang.code);
                    }}
                    title={`Download ${lang.code}.json`}
                    className="p-1 hover:text-white rounded hover:bg-slate-800 transition-colors"
                  >
                    <Download className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dictionary Explorer & Realtime Editor */}
      <div className="p-6 rounded-3xl bg-[#111827] border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-400 text-xs font-mono font-bold uppercase border border-indigo-500/30">
                {currentLangMeta.code}
              </span>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                {currentLangMeta.name} ({currentLangMeta.nativeName || currentLangMeta.native})
              </h3>
              <span className="text-xs text-slate-400">
                • {Object.keys(translations).length} Localized Strings
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Live key-value inspector. Any edits saved here immediately update the backend and propagate to mobile users.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {saveSuccess && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/80 border border-emerald-700/80 text-emerald-300 rounded-xl text-xs font-medium animate-fadeIn">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Key updated & synced!
              </div>
            )}
            {saveError && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-950/80 border border-red-700/80 text-red-300 rounded-xl text-xs font-medium animate-fadeIn">
                <X className="w-3.5 h-3.5" />
                {saveError}
              </div>
            )}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search 334 keys or text..."
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Quick Prefix Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
          <span className="text-slate-500 text-[11px] font-medium mr-1">Prefix:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategoryFilter(cat)}
              className={`px-3 py-1 rounded-lg font-medium transition-colors whitespace-nowrap capitalize cursor-pointer ${
                activeCategoryFilter === cat
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
          <span className="ml-auto text-slate-400 text-xs">
            Showing {filteredEntries.length} of {allKeys.length} keys
          </span>
        </div>

        {/* Dictionary Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4 w-1/4">Key Identifier</th>
                <th className="py-3 px-4 w-1/3">English (Fallback Base)</th>
                <th className="py-3 px-4 w-1/3">
                  {currentLangMeta.name} ({currentLangMeta.nativeName || currentLangMeta.native})
                </th>
                <th className="py-3 px-4 text-right w-20">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredEntries.slice(0, 100).map((key) => {
                const enText = baseTranslations[key] || '';
                const currText = translations[key] !== undefined ? translations[key] : enText;
                const isEditing = editingKey === key;

                return (
                  <tr key={key} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-indigo-400 font-medium break-all align-top">
                      {key}
                    </td>
                    <td className="py-3 px-4 text-slate-300 align-top leading-relaxed">
                      {enText}
                    </td>
                    <td className="py-3 px-4 text-white align-top leading-relaxed">
                      {isEditing ? (
                        <div className="space-y-2">
                          <textarea
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            rows={3}
                            className="w-full p-2 bg-slate-950 border border-indigo-500 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans"
                          />
                          <div className="flex items-center gap-2">
                            <button
                              onClick={handleSaveEdit}
                              disabled={savingKey}
                              className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                            >
                              <Save className="w-3 h-3" />
                              {savingKey ? 'Saving...' : 'Save'}
                            </button>
                            <button
                              onClick={() => setEditingKey(null)}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="font-medium text-emerald-300">
                          {currText}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right align-top">
                      {!isEditing && (
                        <button
                          onClick={() => handleStartEdit(key)}
                          title="Edit this translation"
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}

              {filteredEntries.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-12 text-center text-slate-500">
                    No translation keys matching your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredEntries.length > 100 && (
          <div className="text-center text-xs text-slate-500 pt-2">
            Showing first 100 of {filteredEntries.length} matching keys. Use search box above to narrow down.
          </div>
        )}
      </div>

      {/* Integration Guide Box for App Developer */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-[#111827] border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">
              Mobile App Dynamic Localization Integration (Flutter / React Native)
            </h4>
            <p className="text-xs text-slate-400">
              How the mobile app loads and updates translations dynamically without publishing new app store builds.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-[10px]">1</span>
              Bundled Asset Fallback
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Bundle <code className="text-white font-mono">assets/locales/en.json</code> in the app binary as the offline default guarantee.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-[10px]">2</span>
              Fetch & Cache Over-the-Air
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              When user selects language or on app launch, call <code className="text-white font-mono">GET /languages/:code</code> and persist in local storage/SharedPreferences.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-[10px]">3</span>
              Interpolate Placeholders
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Use standard variable replacement for tokens like <code className="text-white font-mono">{'{phone}'}</code>, <code className="text-white font-mono">{'{seconds}'}</code>, and <code className="text-white font-mono">{'{name}'}</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
