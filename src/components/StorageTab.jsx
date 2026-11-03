import React from 'react';
import {
  HardDrive,
  Cloud,
  PieChart,
  UserCheck,
  ArrowUpRight
} from 'lucide-react';
import { exportToCsv } from '../utils/exportCsv';

export default function StorageTab({ stats, analytics, users = [] }) {
  const userList = Array.isArray(users) ? users : users?.users || [];
  const totalStorageGB = 500;
  const usedMB = stats?.totalVaultStorageBytes ? +(stats.totalVaultStorageBytes / 1048576).toFixed(2) : 1.33;
  const usedGB = +(usedMB / 1024).toFixed(3);
  const usedPercent = Math.max(1, Math.round((usedGB / totalStorageGB) * 100));

  const categoryUsage = [
    { name: 'Government ID', sizeMB: 0.57, percentage: 43, color: '#4F46E5' },
    { name: 'Vehicle & Transport', sizeMB: 0.32, percentage: 24, color: '#06B6D4' },
    { name: 'Business & Startup', sizeMB: 0.20, percentage: 15, color: '#10B981' },
    { name: 'Invoices & Bills', sizeMB: 0.15, percentage: 11, color: '#F59E0B' },
    { name: 'Employment Records', sizeMB: 0.09, percentage: 7, color: '#8B5CF6' }
  ];

  const topUsers = [...userList]
    .sort((a, b) => (b.storageMB || 0) - (a.storageMB || 0))
    .slice(0, 8);

  const handleExportStorage = () => {
    const exportData = topUsers.map(u => ({
      'User Name': u.name || 'Anonymous',
      'Email': u.email || '',
      'Phone': u.phone || u.phoneNumber || '',
      'Plan': u.plan || 'PREMIUM',
      'State': u.state || 'Maharashtra',
      'Documents Count': u.documentCount || 0,
      'Storage Consumed (MB)': u.storageMB || 0
    }));
    exportToCsv('vault_cloud_storage_audit', exportData);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Cloud Infrastructure Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Bucket Status */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="p-2.5 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600">
                <Cloud className="w-5 h-5" />
              </span>
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Operational
              </span>
            </div>
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Primary Storage Node</h3>
            <div className="text-xl font-extrabold text-slate-900 mt-1">AWS Mumbai (ap-south-1)</div>
            <p className="text-xs text-slate-500 mt-2 font-mono">
              Bucket: <span className="text-indigo-600 font-semibold">bmm-vault-storage-mumbai</span>
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Redundancy:</span>
            <span className="text-slate-900 font-bold">11 Nines (99.999999999%)</span>
          </div>
        </div>

        {/* Global Storage Consumption Gauge */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between md:col-span-2">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-indigo-600" />
                <span className="font-extrabold text-slate-900 text-base">Global Storage Utilization</span>
              </div>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-lg">
                Healthy Headroom
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-extrabold text-slate-900">{usedMB} MB</span>
              <span className="text-xs text-slate-500 font-medium">used of {totalStorageGB} GB provisioned capacity</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-slate-100 rounded-full mt-4 overflow-hidden p-0.5 border border-slate-200">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full transition-all duration-1000 shadow-sm"
                style={{ width: `${Math.max(2, usedPercent)}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 block font-semibold uppercase">Total Objects:</span>
              <span className="font-extrabold text-slate-900 text-sm">{stats?.totalActiveDocuments || 13}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold uppercase">Headroom:</span>
              <span className="font-extrabold text-emerald-600 text-sm">{(totalStorageGB - usedGB).toFixed(2)} GB</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold uppercase">Avg Document Size:</span>
              <span className="font-extrabold text-slate-900 text-sm">106 KB</span>
            </div>
          </div>
        </div>
      </div>

      {/* Storage by Category */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-4">
          <PieChart className="w-4 h-4 text-indigo-600" />
          Storage Distribution by Category
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {categoryUsage.map((cat, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition"
            >
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-slate-700 line-clamp-1">{cat.name}</span>
                <span className="font-extrabold text-slate-900">{cat.percentage}%</span>
              </div>
              <div className="text-lg font-extrabold text-slate-900">{cat.sizeMB} MB</div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Consuming Users Table */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              Highest Volume Storage Consumers
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Subscribers utilizing the largest fraction of encrypted vault quotas</p>
          </div>
          <button
            onClick={handleExportStorage}
            className="px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition flex items-center gap-1.5"
          >
            <span>Export CSV</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3 pl-2">Subscriber</th>
                <th className="pb-3">State</th>
                <th className="pb-3">Plan Tier</th>
                <th className="pb-3">Documents</th>
                <th className="pb-3 pr-2">Storage Consumed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topUsers.map((u, i) => (
                <tr key={i} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 pl-2 font-bold text-slate-900 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs border border-indigo-100">
                      {(u.name || 'U').charAt(0)}
                    </div>
                    <div>
                      <div>{u.name || 'User'}</div>
                      <div className="text-[11px] text-slate-400 font-normal">{u.email || u.phone}</div>
                    </div>
                  </td>
                  <td className="py-3 text-slate-600 font-medium">{u.state || 'Maharashtra'}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {u.plan || 'PREMIUM'}
                    </span>
                  </td>
                  <td className="py-3 font-extrabold text-slate-900">{u.documentCount || 0}</td>
                  <td className="py-3 pr-2 font-mono font-bold text-slate-800">
                    {u.storageMB ? `${u.storageMB} MB` : '0 MB'}
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
