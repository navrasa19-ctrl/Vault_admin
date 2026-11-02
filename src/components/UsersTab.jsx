import React, { useState } from 'react';
import { Search, Filter, ShieldCheck, Download, MoreVertical, Edit2, Crown, UserCheck } from 'lucide-react';
import { exportToCsv } from '../utils/exportCsv';

export default function UsersTab({ users, onAllotPlan, onUpdateRole }) {
  const [search, setSearch] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('ALL');
  const [selectedState, setSelectedState] = useState('ALL');

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.phone.includes(search);

    const matchesPlan = selectedPlan === 'ALL' || u.plan === selectedPlan;
    const matchesState = selectedState === 'ALL' || u.state === selectedState;

    return matchesSearch && matchesPlan && matchesState;
  });

  const handleExportUsers = () => {
    exportToCsv('vault_users_roster', filteredUsers, [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'plan', label: 'Plan' },
      { key: 'role', label: 'Role' },
      { key: 'state', label: 'State' },
      { key: 'documentCount', label: 'Documents' },
      { key: 'storageMB', label: 'Storage Used (MB)' },
      { key: 'createdAt', label: 'Registration Date' }
    ]);
  };

  const getPlanBadge = (plan) => {
    switch (plan) {
      case 'BUSINESS':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
      case 'FAMILY':
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
      case 'PREMIUM':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      default:
        return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Registered Vault Accounts</h2>
          <p className="text-xs text-slate-400 mt-1">
            Displaying {filteredUsers.length} of {users.length} total users with document counts and storage usage
          </p>
        </div>

        <button
          onClick={handleExportUsers}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Export Users CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card p-4 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user by name, email, phone..."
              className="w-full bg-[#0F1523] text-xs text-slate-200 placeholder-slate-500 pl-9 pr-4 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400 font-medium">Plan:</span>
          {['ALL', 'FREE', 'PREMIUM', 'FAMILY', 'BUSINESS'].map((plan) => (
            <button
              key={plan}
              onClick={() => setSelectedPlan(plan)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedPlan === plan
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white/[0.04] text-slate-400 hover:bg-white/[0.08] hover:text-slate-200'
              }`}
            >
              {plan}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.02] text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">User / Account</th>
                <th className="py-4 px-4">Contact</th>
                <th className="py-4 px-4">Plan & Expiry</th>
                <th className="py-4 px-4">State</th>
                <th className="py-4 px-4 text-center">Docs</th>
                <th className="py-4 px-4">Storage Used</th>
                <th className="py-4 px-4">Role</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05] text-xs">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600/30 to-purple-600/30 border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-300">
                        {u.name ? u.name[0].toUpperCase() : 'U'}
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm leading-tight">{u.name || 'Unnamed'}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">ID: {String(u.id).slice(-8)}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <p className="text-slate-300 font-medium">{u.email || '—'}</p>
                    <p className="text-slate-500 text-[11px]">{u.phone || '—'}</p>
                  </td>

                  <td className="py-4 px-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getPlanBadge(u.plan)}`}>
                      {u.plan}
                    </span>
                    {u.extraStorageBytes > 0 && (
                      <span className="block text-[10px] text-emerald-400 mt-0.5">+{u.extraStorageGB} GB Bonus</span>
                    )}
                  </td>

                  <td className="py-4 px-4 text-slate-300">
                    {u.state || 'Maharashtra'}
                  </td>

                  <td className="py-4 px-4 text-center">
                    <span className="inline-block px-2.5 py-1 rounded-md bg-white/[0.05] text-indigo-300 font-bold text-xs">
                      {u.documentCount || 0}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-slate-300 font-medium">
                    {u.storageMB || 0} MB
                  </td>

                  <td className="py-4 px-4">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                      u.role === 'admin' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-slate-500/10 text-slate-400'
                    }`}>
                      {u.role}
                    </span>
                  </td>

                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => onAllotPlan(u)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 font-semibold text-xs transition-all mr-2"
                    >
                      Allot Plan
                    </button>
                    {u.role !== 'admin' && (
                      <button
                        onClick={() => onUpdateRole(u.id, 'admin')}
                        title="Make Admin"
                        className="px-2 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white text-xs font-medium transition-all"
                      >
                        Make Admin
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
