import React, { useState } from 'react';
import {
  Globe,
  BookOpen,
  Search
} from 'lucide-react';

export default function LanguagesTab({ languages = [] }) {
  const [search, setSearch] = useState('');
  const [selectedLang, setSelectedLang] = useState('hi');

  const defaultLanguages = [
    { code: 'en', name: 'English', nativeName: 'English', coverage: '100%', words: 4820, isDefault: true },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', coverage: '100%', words: 4820, isDefault: false },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी', coverage: '98%', words: 4724, isDefault: false },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', coverage: '96%', words: 4627, isDefault: false },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', coverage: '95%', words: 4579, isDefault: false },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', coverage: '95%', words: 4579, isDefault: false },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', coverage: '94%', words: 4530, isDefault: false },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', coverage: '92%', words: 4434, isDefault: false },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', coverage: '91%', words: 4386, isDefault: false },
    { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', coverage: '90%', words: 4338, isDefault: false }
  ];

  const langList = Array.isArray(languages) && languages.length > 0 ? languages : defaultLanguages;
  const filtered = langList.filter(l => 
    (l.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (l.nativeName || l.native || '').toLowerCase().includes(search.toLowerCase()) ||
    (l.code || '').toLowerCase().includes(search.toLowerCase())
  );

  const sampleTranslations = {
    'auth.welcome': {
      en: 'Welcome to BMM Vault - Your Encrypted Digital Vault',
      hi: 'बीएमएम वॉल्ट में आपका स्वागत है - आपका एन्क्रिप्टेड डिजिटल वॉल्ट',
      mr: 'बीएमएम व्हॉल्टमध्ये आपले स्वागत आहे - आपले एनक्रिप्टेड डिजिटल व्हॉल्ट',
      bn: 'বিএমএম ভল্টে স্বাগতম - আপনার এনক্রিপ্ট করা ডিজিটাল ভল্ট'
    },
    'doc.upload_success': {
      en: 'Document encrypted and stored securely in AWS Mumbai.',
      hi: 'दस्तावेज़ को एन्क्रिप्ट किया गया और एडब्ल्यूएस मुंबई में सुरक्षित संग्रहीत किया गया।',
      mr: 'दस्तऐवज एनक्रिप्ट केले आणि एडब्ल्यूएस मुंबईमध्ये सुरक्षितपणे साठवले.',
      bn: 'নথিটি এনক্রিপ্ট করা হয়েছে এবং নিরাপদে এডব্লিউএস মুম্বাইতে সংরক্ষণ করা হয়েছে।'
    },
    'share.password_protected': {
      en: 'This document is secured with end-to-end password encryption.',
      hi: 'यह दस्तावेज़ एंड-टू-एंड पासवर्ड एन्क्रिप्शन के साथ सुरक्षित है।',
      mr: 'हा दस्तऐवज एंड-टू-एंड पासवर्ड एनक्रिप्शनसह सुरक्षित आहे.',
      bn: 'এই নথিটি এন্ড-টু-এন্ড পাসওয়ার্ড এনক্রিপশন দিয়ে সুরক্ষিত।'
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-[#111827] border border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-600" />
            Pan-India Multilingual Localization Engine
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Serving citizens across 10 official Indian languages with localized cryptographic keys, error logs, and vault navigation.
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search language..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Languages Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {filtered.map((lang) => (
          <div
            key={lang.code}
            onClick={() => setSelectedLang(lang.code)}
            className={`cursor-pointer p-4 rounded-2xl border transition-all duration-200 ${
              selectedLang === lang.code
                ? 'bg-indigo-50/80 border-indigo-400 shadow-md shadow-indigo-500/10 scale-[1.02]'
                : 'bg-[#111827] border-slate-800 hover:border-slate-300 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-800 text-indigo-700">
                {lang.code}
              </span>
              {lang.isDefault && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Primary
                </span>
              )}
            </div>
            <div className="text-lg font-extrabold text-white">{lang.name}</div>
            <div className="text-sm text-indigo-600 font-bold">{lang.nativeName || lang.native}</div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Coverage:</span>
              <span className="font-bold text-emerald-600">{lang.coverage || '100%'}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Translation Dictionary Preview */}
      <div className="p-6 rounded-3xl bg-[#111827] border border-slate-800 shadow-sm">
        <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
          <BookOpen className="w-4 h-4 text-violet-600" />
          Localization String Dictionary Preview
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Selected locale: <strong className="text-indigo-600 font-mono">{selectedLang.toUpperCase()}</strong>. Real-time translation strings for mobile and web clients.
        </p>

        <div className="space-y-4">
          {Object.entries(sampleTranslations).map(([key, trans]) => (
            <div key={key} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="text-xs font-mono font-bold text-indigo-600 mb-1">{key}</div>
              <div className="text-sm font-bold text-white">
                {trans[selectedLang] || trans['hi'] || trans['en']}
              </div>
              <div className="text-xs text-slate-400 mt-2 font-medium">
                Fallback (English): <span className="italic">{trans['en']}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
