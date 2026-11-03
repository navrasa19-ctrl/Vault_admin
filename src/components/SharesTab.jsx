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
  ArrowUpRight
} from 'lucide-react';
import { exportToCsv } from '../utils/exportCsv';

export default function SharesTab({ shares = [], onRevokeShare }) {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [copiedId, setCopiedId] = useState(null);

  const shareList = Array.isArray(shares) ? shares : shares?.shares || [];

  const filteredShares = shareList.filter(share => {
    const docName = share.documentTitle || share.documentName || '';
    const owner = share.ownerName || share.userName || '';
    const token = share.token || share.shareId || '';

    const matchesSearch = 
      docName.toLowerCase().includes(search.toLowerCase()) ||
      owner.toLowerCase().includes(search.toLowerCase()) ||
      token.toLowerCase().includes(search.toLowerCase());

    const isExpired = share.isExpired || new Date(share.expiresAt) < new Date();
    if (filterType === 'PROTECTED') return matchesSearch && share.isPasswordProtected;
    if (filterType === 'ACTIVE') return matchesSearch && !isExpired && share.status !== 'revoked';
    if (filterType === 'EXPIRED') return matchesSearch && isExpired;
    return matchesSearch;
  });

  const handleCopy = (share) => {
    const token = share.token || share.id || share.shareId;
    const url = `https://share.beememvault.com/d/${token}`;
    navigator.clipboard.writeText(url);
    setCopiedId(token);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExport = () => {
    const data = filteredShares.map(s => ({
      'Document': s.documentTitle || s.documentName,
      'Owner': s.ownerName || s.userName,
      'Token': s.token || s.shareId,
      'Shared With': s.sharedWith || 'Direct Link',
      'Purpose': s.purpose || 'Verification',
      'Password Protected': s.isPasswordProtected ? 'YES' : 'NO',
      'Views': s.viewCount || 0,
      'Created At': s.createdAt,
      'Expires At': s.expiresAt,
      'Status': s.status
    }));
    exportToCsv('vault_shared_links_audit', data);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#111827] border border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Share2 className="w-5 h-5 text-indigo-600" />
            Password-Protected Shared Links & Expiry Tracker
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real MongoDB telemetry on document share tokens, purpose, password protection, and 1-click revocation.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition flex items-center gap-2"
          >
            <span>Export CSV</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#111827] border border-slate-800 shadow-sm">
        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by document, owner, or share token..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['ALL', 'ACTIVE', 'PROTECTED', 'EXPIRED'].map(f => (
            <button
              key={f}
              onClick={() => setFilterType(f)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                filterType === f
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Shares Table */}
      <div className="rounded-3xl bg-[#111827] border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80/80 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-5">Document / Owner</th>
                <th className="py-3.5 px-4">Purpose / Shared With</th>
                <th className="py-3.5 px-4">Protection</th>
                <th className="py-3.5 px-4">Expiry Countdown</th>
                <th className="py-3.5 px-4">Views</th>
                <th className="py-3.5 px-4">Share URL</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredShares.length > 0 ? (
                filteredShares.map((s) => {
                  const sId = s.id || s._id || s.token;
                  const isExpired = s.isExpired || new Date(s.expiresAt) < new Date();
                  const isRevoked = s.status === 'revoked';

                  return (
                    <tr key={sId} className="hover:bg-slate-900/80/80 transition">
                      <td className="py-3.5 px-5">
                        <div className="font-bold text-white text-sm">{s.documentTitle || s.documentName || 'Vault Document'}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span>Owner: {s.ownerName || s.userName || 'Subscriber'}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                          <span className="font-mono text-indigo-600 font-semibold">{s.token || s.shareId}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-slate-200 font-medium">{s.purpose || 'Verification'}</div>
                        <div className="text-[11px] text-slate-400">{s.sharedWith || 'Public Recipient'}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        {s.isPasswordProtected ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <Lock className="w-3 h-3" />
                            Password Protected
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <Unlock className="w-3 h-3" />
                            Token Link
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        {isRevoked ? (
                          <span className="inline-flex items-center gap-1 text-rose-600 font-bold">
                            <ShieldAlert className="w-3.5 h-3.5" />
                            Revoked
                          </span>
                        ) : isExpired ? (
                          <span className="inline-flex items-center gap-1 text-slate-400 font-medium">
                            <Clock className="w-3.5 h-3.5" />
                            Expired
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-indigo-600 font-semibold">
                            <Clock className="w-3.5 h-3.5" />
                            Active
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-slate-300 font-bold">
                          <Eye className="w-3.5 h-3.5 text-slate-400" />
                          <span>{s.viewCount || 0}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleCopy(s)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:bg-slate-800 transition shadow-sm"
                        >
                          {copiedId === (s.token || sId) ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-[11px] font-bold text-emerald-600">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-slate-400" />
                              <span className="text-[11px] font-mono font-medium">Copy Link</span>
                            </>
                          )}
                        </button>
                      </td>

                      <td className="py-3.5 px-5 text-right">
                        {!isRevoked && (
                          <button
                            onClick={() => onRevokeShare && onRevokeShare(s.id || s.token)}
                            className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 border border-rose-200 transition text-xs font-semibold inline-flex items-center gap-1 shadow-sm active:scale-95"
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
                  <td colSpan="7" className="py-12 text-center text-slate-400 text-sm">
                    No matching shared document links found in database.
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
