import React from 'react';
import {
  HardDrive,
  Cloud,
  Server,
  Database,
  ShieldCheck,
  TrendingUp,
  FileCheck2,
  PieChart,
  Layers,
  ArrowUpRight,
  UserCheck
} from 'lucide-react';
import { exportToCsv } from '../utils/exportCsv';

export default function StorageTab({ stats, analytics, users = [] }) {
  const totalStorageGB = stats?.totalStorageGB || 500;
  const usedStorageGB = stats?.usedStorageGB || 124.8;
  const usedPercent = Math.min(100, Math.round((usedStorageGB / totalStorageGB) * 100));

  // Category breakdown
  const categoryUsage = analytics?.categoryStorage || [
    { name: 'Personal Identity', sizeGB: 45.2, percentage: 36, color: '#6366F1' },
    { name: 'Financial & Banking', sizeGB: 32.1, percentage: 26, color: '#10B981' },
    { name: 'Property & Land', sizeGB: 22.4, percentage: 18, color: '#F59E0B' },
    { name: 'Healthcare & Medical', sizeGB: 15.6, percentage: 12, color: '#EC4899' },
    { name: 'Academic & Career', sizeGB: 9.5, percentage: 8, color: '#8B5CF6' }
  ];

  // Top users by storage
  const topUsers = [...users]
    .sort((a, b) => (b.storageUsedMB || 0) - (a.storageUsedMB || 0))
    .slice(0, 8);

  const handleExportStorage = () => {
    const exportData = topUsers.map(u => ({
      'User Name': u.name || 'Anonymous',
      'Email': u.email || '',
      'Phone': u.phoneNumber || '',
      'Plan': u.plan || 'PREMIUM',
      'State': u.state || 'N/A',
      'Documents Count': u.documentCount || 0,
      'Storage Consumed (MB)': u.storageUsedMB || 0
    }));
    exportToCsv('vault_cloud_storage_audit', exportData);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Cloud Infrastructure Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Bucket Status */}
        <div className="p-6 rounded-2xl bg-[#0F1523]/80 border border-slate-800 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Cloud className="w-5 h-5" />
              </span>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Operational
              </span>
            </div>
            <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Storage Node</h3>
            <div className="text-xl font-bold text-white mt-1">AWS Mumbai (ap-south-1)</div>
            <p className="text-xs text-slate-400 mt-2 font-mono">
              Bucket: <span className="text-indigo-300">bmm-vault-storage-mumbai</span>
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Redundancy:</span>
            <span className="text-white font-medium">99.999999999% (11 9s)</span>
          </div>
        </div>

        {/* Global Storage Consumption Gauge */}
        <div className="p-6 rounded-2xl bg-[#0F1523]/80 border border-slate-800 backdrop-blur-xl flex flex-col justify-between md:col-span-2">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-purple-400" />
                <span className="font-semibold text-white text-base">Global Storage Utilization</span>
              </div>
              <span className="text-sm font-bold text-white bg-slate-800 px-3 py-1 rounded-lg">
                {usedPercent}% Allocated
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-extrabold text-white">{usedStorageGB} GB</span>
              <span className="text-sm text-slate-400">used of {totalStorageGB} GB provisioned capacity</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3.5 bg-slate-900 rounded-full mt-4 overflow-hidden p-0.5 border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-1000 shadow-lg shadow-indigo-500/20"
                style={{ width: `${usedPercent}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-slate-800/80 text-xs">
            <div>
              <span className="text-slate-400 block">Total Objects:</span>
              <span className="font-bold text-white text-sm">{stats?.totalDocuments || 1420}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Available Headroom:</span>
              <span className="font-bold text-emerald-400 text-sm">{(totalStorageGB - usedStorageGB).toFixed(1)} GB</span>
            </div>
            <div>
              <span className="text-slate-400 block">Avg File Size:</span>
              <span className="font-bold text-white text-sm">1.8 MB</span>
            </div>
          </div>
        </div>
      </div>

      {/* Storage by Category Cards */}
      <div className="p-6 rounded-2xl bg-[#0F1523]/80 border border-slate-800 backdrop-blur-xl">
        <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
          <PieChart className="w-4 h-4 text-indigo-400" />
          Storage Distribution by Category
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {categoryUsage.map((cat, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition"
            >
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-medium text-slate-300 line-clamp-1">{cat.name}</span>
                <span className="font-bold text-white">{cat.percentage}%</span>
              </div>
              <div className="text-lg font-bold text-white">{cat.sizeGB} GB</div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
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
      <div className="p-6 rounded-2xl bg-[#0F1523]/80 border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              Highest Volume Storage Consumers
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Subscribers utilizing the largest fraction of encrypted vault quotas</p>
          </div>
          <button
            onClick={handleExportStorage}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition flex items-center gap-2"
          >
            <span>Export CSV</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800/80 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="pb-3 pl-2">Subscriber</th>
                <th className="pb-3">State</th>
                <th className="pb-3">Plan Tier</th>
                <th className="pb-3">Documents</th>
                <th className="pb-3">Storage Consumed</th>
                <th className="pb-3 pr-2">Capacity Bar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {topUsers.map((u, i) => {
                const mb = u.storageUsedMB || 120 + i * 45;
                const quotaMb = (u.plan === 'FAMILY' ? 100 : u.plan === 'PREMIUM' ? 25 : 5) * 1024;
                const pct = Math.min(100, Math.round((mb / quotaMb) * 100));

                return (
                  <tr key={i} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 pl-2 font-medium text-white flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-xs">
                        {(u.name || 'U').charAt(0)}
                      </div>
                      <div>
                        <div>{u.name || 'User'}</div>
                        <div className="text-[11px] text-slate-400">{u.email || u.phoneNumber}</div>
                      </div>
                    </td>
                    <td className="py-3 text-slate-300">{u.state || 'Maharashtra'}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        {u.plan || 'PREMIUM'}
                      </span>
                    </td>
                    <td className="py-3 font-semibold text-white">{u.documentCount || 12}</td>
                    <td className="py-3 text-slate-300 font-mono font-medium">
                      {(mb / 1024).toFixed(2)} GB
                    </td>
                    <td className="py-3 pr-2 w-48">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                            style={{ width: `${Math.max(5, pct)}%` }}
                          ></div>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400 w-8">{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
