import React, { useState } from 'react';
import {
  Shield,
  UserPlus,
  Users,
  CheckCircle2,
  Lock,
  Unlock,
  KeyRound,
  Trash2,
  Edit3,
  Mail,
  Calendar,
  Sparkles,
  AlertTriangle,
  X
} from 'lucide-react';

export const MODULE_CATALOG = [
  { id: 'overview', label: 'Command Overview', desc: 'System telemetry, KPI cards, and storage charts' },
  { id: 'users', label: 'Users & Subscription Plans', desc: 'Subscriber roster, 30-day trial tracking, and plan allotment' },
  { id: 'geo', label: 'State Demographics (India)', desc: 'Regional user distribution map and click-to-inspect roster' },
  { id: 'categories', label: 'Categories & Taxonomy', desc: 'Create, update, and delete document folders & subcategories' },
  { id: 'plans', label: 'Monetization Plans', desc: 'Create pricing tiers, storage quotas, and feature flags' },
  { id: 'storage', label: 'Cloud Storage', desc: 'AWS Mumbai cluster storage consumption and audit' },
  { id: 'shares', label: 'Shared Links', desc: 'Active secure links telemetry and instant revocation' },
  { id: 'referrals', label: 'Refer & Earn', desc: 'Track organic user shares and download ledger' },
  { id: 'languages', label: 'Languages (10)', desc: 'Pan-India 10 official languages localization' }
];

export default function AdminsTab({ subAdmins = [], onCreateSubAdmin, onUpdateSubAdmin, onDeleteSubAdmin }) {
  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [permissions, setPermissions] = useState(['overview', 'users']);
  const [error, setError] = useState('');

  const openCreateModal = () => {
    setEditingAdmin(null);
    setName('');
    setEmail('');
    setPassword('');
    setPermissions(['overview', 'users']);
    setError('');
    setShowModal(true);
  };

  const openEditModal = (admin) => {
    setEditingAdmin(admin);
    setName(admin.name || '');
    setEmail(admin.email || '');
    setPassword('');
    setPermissions(admin.permissions || ['overview']);
    setError('');
    setShowModal(true);
  };

  const togglePermission = (permId) => {
    setPermissions(prev =>
      prev.includes(permId) ? prev.filter(p => p !== permId) : [...prev, permId]
    );
  };

  const selectAllPermissions = () => {
    setPermissions(MODULE_CATALOG.map(m => m.id));
  };

  const clearAllPermissions = () => {
    setPermissions(['overview']);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim()) {
      setError('Name and Email are required.');
      return;
    }

    if (!editingAdmin && !password.trim()) {
      setError('Password is required for new sub-admin.');
      return;
    }

    try {
      if (editingAdmin) {
        const payload = {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          permissions
        };
        if (password.trim()) payload.password = password.trim();
        await onUpdateSubAdmin(editingAdmin.id || editingAdmin._id, payload);
      } else {
        await onCreateSubAdmin({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password: password.trim(),
          permissions
        });
      }
      setShowModal(false);
    } catch (err) {
      setError(err.message || 'Operation failed.');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="relative p-7 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 text-white overflow-hidden shadow-xl shadow-indigo-950/15">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-white/10 to-transparent rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111827]/15 backdrop-blur-md border border-white/20 text-white text-xs font-semibold mb-3">
              <Shield className="w-3.5 h-3.5 text-amber-300" />
              <span>Role-Based Access Control (RBAC) System</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
              Sub-Admin Team & Permission Roles
            </h2>
            <p className="text-indigo-200 text-xs sm:text-sm mt-1 max-w-xl">
              Super Admin can create Sub-Admins with custom credentials and assign specific module permissions. Features without permission will remain locked for the Sub-Admin.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#111827] text-indigo-900 hover:bg-indigo-950/60 text-xs font-bold transition shadow-lg shadow-black/10 shrink-0"
          >
            <UserPlus className="w-4 h-4 text-indigo-400" />
            <span>Create New Sub-Admin</span>
          </button>
        </div>
      </div>

      {/* Roster of Admin Accounts */}
      <div className="rounded-3xl bg-[#111827] border border-slate-800 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              Active Admin & Sub-Admin Accounts
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage credentials, permissions, and lock status for all administrative staff
            </p>
          </div>
          <span className="text-xs font-bold font-mono text-indigo-400 bg-indigo-950/60 px-3 py-1 rounded-xl border border-indigo-100">
            {subAdmins.length} Total Admins
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80/80 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3.5 px-6">Admin User</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Login Email ID</th>
                <th className="py-3.5 px-4">Assigned Feature Permissions</th>
                <th className="py-3.5 px-4">Created Date</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subAdmins.map((adm) => {
                const isSuper = adm.role === 'super_admin';
                const adminId = adm.id || adm._id;
                const perms = adm.permissions || (isSuper ? MODULE_CATALOG.map(m => m.id) : ['overview']);

                return (
                  <tr key={adminId} className="hover:bg-slate-900/80/80 transition">
                    {/* Name */}
                    <td className="py-4 px-6 font-semibold text-white">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white font-extrabold text-xs shadow-md ${
                          isSuper
                            ? 'bg-gradient-to-tr from-amber-500 to-amber-600 shadow-amber-500/20'
                            : 'bg-gradient-to-tr from-indigo-600 to-violet-600 shadow-indigo-500/20'
                        }`}>
                          {(adm.name || 'A').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-extrabold text-white text-xs flex items-center gap-1.5">
                            <span>{adm.name}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">ID: {String(adminId).slice(-6)}</span>
                        </div>
                      </div>
                    </td>

                    {/* Role Badge */}
                    <td className="py-4 px-4">
                      {isSuper ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-wider">
                          <Shield className="w-3 h-3 text-amber-600" />
                          <span>Super Admin</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-950/60 text-indigo-300 border border-indigo-800/60 uppercase tracking-wider">
                          <Lock className="w-3 h-3 text-indigo-400" />
                          <span>Sub Admin</span>
                        </span>
                      )}
                    </td>

                    {/* Login Email */}
                    <td className="py-4 px-4 font-mono text-slate-300 text-xs">
                      {adm.email}
                    </td>

                    {/* Permissions Badges */}
                    <td className="py-4 px-4">
                      {isSuper ? (
                        <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200">
                          Full Master Access (All Modules)
                        </span>
                      ) : (
                        <div className="flex flex-wrap gap-1 max-w-md">
                          {perms.map(p => (
                            <span
                              key={p}
                              className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-800 capitalize"
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>

                    {/* Created Date */}
                    <td className="py-4 px-4 text-slate-500 text-[11px]">
                      {adm.createdAt ? new Date(adm.createdAt).toLocaleDateString('en-IN') : 'Default System'}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      {!isSuper ? (
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => openEditModal(adm)}
                            className="p-1.5 rounded-lg border border-slate-800 hover:bg-indigo-950/60 hover:border-indigo-300 text-slate-400 hover:text-indigo-400 transition"
                            title="Edit Permissions or Password"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteSubAdmin(adminId, adm.name)}
                            className="p-1.5 rounded-lg border border-slate-800 hover:bg-rose-50 hover:border-rose-300 text-slate-400 hover:text-rose-600 transition"
                            title="Remove Sub-Admin"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] font-mono font-semibold text-slate-400">Master Account</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create or Edit Sub-Admin */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-xl rounded-3xl bg-[#111827] border border-slate-800 shadow-2xl p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-indigo-950/60 border border-indigo-800/60 text-indigo-400 flex items-center justify-center">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">
                    {editingAdmin ? 'Edit Sub-Admin Permissions & Password' : 'Create New Sub-Admin Account'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {editingAdmin ? 'Update credentials and assigned feature modules' : 'Set login credentials and choose feature access'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-300 hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 focus:bg-[#111827]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Login Email ID</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. rahul.admin@beememvault.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 focus:bg-[#111827]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  {editingAdmin ? 'New Password (Leave empty to keep current)' : 'Login Password'}
                </label>
                <input
                  type="password"
                  placeholder={editingAdmin ? 'Enter new password if changing' : 'Set a secure password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 focus:bg-[#111827] font-mono"
                />
              </div>

              {/* Permission Checkboxes Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-white">
                    Assign Feature Permissions ({permissions.length} Selected)
                  </label>
                  <div className="flex items-center gap-2 text-[11px]">
                    <button
                      type="button"
                      onClick={selectAllPermissions}
                      className="text-indigo-400 font-bold hover:underline"
                    >
                      Select All
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={clearAllPermissions}
                      className="text-slate-500 hover:text-slate-300"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-52 overflow-y-auto p-1 border border-slate-800 rounded-2xl bg-slate-900/50">
                  {MODULE_CATALOG.map((mod) => {
                    const isChecked = permissions.includes(mod.id);
                    return (
                      <label
                        key={mod.id}
                        className={`p-2.5 rounded-xl border cursor-pointer transition flex items-start gap-2.5 ${
                          isChecked
                            ? 'bg-[#111827] border-indigo-300 shadow-xs ring-1 ring-indigo-500/20'
                            : 'bg-[#111827]/60 border-slate-800 hover:bg-[#111827]'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => togglePermission(mod.id)}
                          className="mt-0.5 rounded text-indigo-400 focus:ring-indigo-500"
                        />
                        <div>
                          <div className="font-bold text-slate-200 text-xs">{mod.label}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5 leading-snug">{mod.desc}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-800 text-slate-400 text-xs font-bold hover:bg-slate-900/80 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-md shadow-indigo-500/20"
                >
                  {editingAdmin ? 'Save Changes' : 'Create Sub-Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
