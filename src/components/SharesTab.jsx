import React, { useState } from 'react';
import {
  Share2,
  Lock,
  Unlock,
  Clock,
  Eye,
  Trash2,
  Copy,
  Check,
  ShieldAlert,
  Search,
  Filter,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { exportToCsv } from '../utils/exportCsv';

export default function SharesTab({ shares = [], onRevokeShare }) {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // ALL, PROTECTED, ACTIVE, EXPIRED
  const [copiedId, setCopiedId] = useState(null);

  const filteredShares = shares.filter(share => {
    const matchesSearch = 
      (share.documentName || '').toLowerCase().includes(search.toLowerCase()) ||
      (share.userName || '').toLowerCase().includes(search.toLowerCase()) ||
      (share.shareId || '').toLowerCase().includes(search.toLowerCase());

    const isExpired = new Date(share.expiresAt) < new Date();
    if (filterType === 'PROTECTED') return matchesSearch && share.isPasswordProtected;
    if (filterType === 'ACTIVE') return matchesSearch && !isExpired && !share.isRevoked;
    if (filterType === 'EXPIRED') return matchesSearch && isExpired;
    return matchesSearch;
  });

  const handleCopy = (share) => {
    const url = `https://beememvault.com/share/${share.shareId || share.id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(share.id || share.shareId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExport = () => {
    const data = filteredShares.map(s => ({
      'Document': s.documentName,
      'Owner': s.userName,
      'Share ID': s.shareId,
      'Password Protected': s.isPasswordProtected ? 'YES' : 'NO',
      'Views/Clicks': s.viewCount || 0,
      'Created At': s.createdAt,
      'Expires At': s.expiresAt,
      'Status': s.isRevoked ? 'REVOKED' : new Date(s.expiresAt) < new Date() ? 'EXPIRED' : 'ACTIVE'
    }));
    exportToCsv('vault_shared_links_audit', data);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0F1523]/80 border border-slate-800 backdrop-blur-xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Share2 className="w-5 h-5 text-indigo-400" />
            Password-Protected Shared Links & Expiry Tracker
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time telemetry on all public/private shared document links, expiration timers, and instant link revocation.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition flex items-center gap-2"
          >
            <span>Export CSV</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[#0F1523]/90 border border-slate-800">
        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by document, owner, or share token..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['ALL', 'ACTIVE', 'PROTECTED', 'EXPIRED'].map(f => (
            <button
              key={f}
              onClick={() => setFilterType(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filterType === f
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Shares Table */}
      <div className="rounded-2xl bg-[#0F1523]/80 border border-slate-800 overflow-hidden shadow-2xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Document / Owner</th>
                <th className="py-3.5 px-4">Protection Status</th>
                <th className="py-3.5 px-4">Expiry Countdown</th>
                <th className="py-3.5 px-4">Impressions / Views</th>
                <th className="py-3.5 px-4">Share URL</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredShares.length > 0 ? (
                filteredShares.map((s) => {
                  const sId = s.id || s.shareId;
                  const isExpired = new Date(s.expiresAt) < new Date();
                  const remainingMs = new Date(s.expiresAt) - new Date();
                  const hoursRemaining = Math.max(0, Math.round(remainingMs / (1000 * 60 * 60)));

                  return (
                    <tr key={sId} className="hover:bg-slate-800/30 transition">
                      {/* Doc & Owner */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white text-sm">{s.documentName || 'Confidential Document'}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span>Owner: {s.userName || 'Subscriber'}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                          <span className="font-mono text-slate-500">{s.shareId?.substring(0, 10)}...</span>
                        </div>
                      </td>

                      {/* Protection Badge */}
                      <td className="py-3.5 px-4">
                        {s.isPasswordProtected ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <Lock className="w-3 h-3" />
                            Password Protected
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <Unlock className="w-3 h-3" />
                            Direct Token Link
                          </span>
                        )}
                      </td>

                      {/* Expiry */}
                      <td className="py-3.5 px-4">
                        {s.isRevoked ? (
                          <span className="inline-flex items-center gap-1 text-rose-400 font-semibold">
                            <ShieldAlert className="w-3.5 h-3.5" />
                            Revoked by Admin
                          </span>
                        ) : isExpired ? (
                          <span className="inline-flex items-center gap-1 text-slate-500 font-medium">
                            <Clock className="w-3.5 h-3.5" />
                            Expired
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-indigo-300 font-medium">
                            <Clock className="w-3.5 h-3.5 text-indigo-400" />
                            {hoursRemaining > 24 ? `${Math.round(hoursRemaining / 24)} days left` : `${hoursRemaining} hrs left`}
                          </span>
                        )}
                      </td>

                      {/* Views */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                          <span>{s.viewCount || 0}</span>
                          <span className="text-[10px] text-slate-500 font-normal">clicks</span>
                        </div>
                      </td>

                      {/* URL Copy */}
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleCopy(s)}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition"
                        >
                          {copiedId === sId ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-[11px] text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-slate-400" />
                              <span className="text-[11px] font-mono">Copy Link</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        {!s.isRevoked && !isExpired && (
                          <button
                            onClick={() => onRevokeShare && onRevokeShare(sId)}
                            className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition text-xs font-semibold inline-flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Revoke</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500 text-sm">
                    No matching shared document links found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
