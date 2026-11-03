import React, { useState } from 'react';
import { Search, Download, Edit2, Crown, UserCheck } from 'lucide-react';
import { exportToCsv } from '../utils/exportCsv';

export default function UsersTab({ users = [], onAllotPlan }) {
  const [search, setSearch] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('ALL');
  const [selectedState, setSelectedState] = useState('ALL');

  const userList = Array.isArray(users) ? users : users?.users || [];

  const filteredUsers = userList.filter((u) => {
    const name = (u.name || '').toLowerCase();
    const email = (u.email || '').toLowerCase();
    const phone = (u.phone || u.phoneNumber || '');
    const s = search.toLowerCase();

    const matchesSearch = !s || name.includes(s) || email.includes(s) || phone.includes(s);
    const matchesPlan = selectedPlan === 'ALL' || (u.plan || 'PREMIUM') === selectedPlan;
    const matchesState = selectedState === 'ALL' || (u.state || 'Maharashtra') === selectedState;

    return matchesSearch && matchesPlan && matchesState;
  });

  const handleExportUsers = () => {
    const exportData = filteredUsers.map(u => ({
      'Name': u.name || 'Unnamed User',
      'Email': u.email || 'N/A',
      'Phone': u.phone || u.phoneNumber || 'N/A',
      'Plan': u.plan || 'PREMIUM',
      'Role': u.role || 'user',
      'State': u.state || 'Maharashtra',
      'Documents Count': u.documentCount || 0,
      'Storage Used (MB)': u.storageMB || 0,
      'Registration Date': u.createdAt
    }));
    exportToCsv('vault_users_roster', exportData);
  };

  const getPlanBadge = (plan) => {
    switch (plan) {
      case 'BUSINESS':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'FAMILY':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'PREMIUM':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const states = Array.from(new Set(userList.map(u => u.state).filter(Boolean)));

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search */}
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search subscribers by name, email, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition"
            />
          </div>

          {/* Plan Filter */}
          <select
            value={selectedPlan}
            onChange={(e) => setSelectedPlan(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-indigo-500 font-medium"
          >
            <option value="ALL">All Plans ({userList.length})</option>
            <option value="FREE">FREE</option>
            <option value="PREMIUM">PREMIUM</option>
            <option value="FAMILY">FAMILY</option>
            <option value="BUSINESS">BUSINESS</option>
          </select>

          {/* State Filter */}
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-indigo-500 font-medium"
          >
            <option value="ALL">All States</option>
            {states.map(st => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleExportUsers}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold border border-indigo-200 transition"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-5">Subscriber Profile</th>
                <th className="py-3.5 px-4">Contact Details</th>
                <th className="py-3.5 px-4">Plan Quota</th>
                <th className="py-3.5 px-4">State</th>
                <th className="py-3.5 px-4">Documents</th>
                <th className="py-3.5 px-4">Storage Consumed</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => {
                  const uid = u.id || u._id;
                  const isAdm = u.role === 'admin' || u.role === 'business_admin';
                  return (
                    <tr key={uid} className="hover:bg-slate-50/80 transition">
                      {/* Name & Role */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-indigo-500/20">
                            {(u.name || u.email || 'U').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              <span>{u.name || 'Unnamed User'}</span>
                              {isAdm && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200 uppercase">
                                  <Crown className="w-2.5 h-2.5" />
                                  Admin
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">{uid.substring(0, 10)}...</div>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-4">
                        <div className="text-slate-800 font-medium">{u.email || 'No email registered'}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{u.phone || u.phoneNumber || 'No phone'}</div>
                      </td>

                      {/* Plan Badge */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getPlanBadge(u.plan || 'PREMIUM')}`}>
                          {u.plan || 'PREMIUM'}
                        </span>
                      </td>

                      {/* State */}
                      <td className="py-3.5 px-4 font-medium text-slate-700">
                        {u.state || 'Maharashtra'}
                      </td>

                      {/* Document count */}
                      <td className="py-3.5 px-4">
                        <span className="font-extrabold text-slate-900 text-sm">{u.documentCount || 0}</span>
                      </td>

                      {/* Storage */}
                      <td className="py-3.5 px-4 text-slate-700 font-mono font-medium">
                        {u.storageMB ? `${u.storageMB} MB` : u.storageBytes ? `${(u.storageBytes/1048576).toFixed(2)} MB` : '0 MB'}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right">
                        <button
                          onClick={() => onAllotPlan && onAllotPlan(u)}
                          className="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 border border-indigo-200 hover:border-indigo-600 transition text-xs font-semibold inline-flex items-center gap-1.5 active:scale-95 shadow-sm"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Allot Plan</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400 text-sm">
                    No registered subscribers found matching query.
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
