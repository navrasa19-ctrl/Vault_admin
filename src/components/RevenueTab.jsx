import React, { useState } from "react";
import {
  IndianRupee,
  Users,
  CreditCard,
  TrendingUp,
  Search,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Download,
  Filter,
  ArrowUpRight,
  Sparkles,
  Layers,
  ChevronRight
} from "lucide-react";
import { exportToCsv } from "../utils/exportCsv";

export default function RevenueTab({ revenueData, onRefresh }) {
  const summary = revenueData?.summary || {
    totalRevenue: 0,
    pendingRevenue: 0,
    grossRevenue: 0,
    totalTransactions: 0,
    activeSubscribers: 0,
    totalUsers: 0,
    currency: "INR"
  };

  const planWiseRevenue = revenueData?.planWiseRevenue || [];

  // Selected plan filter: null means "All Plans", or a planId string like "PREMIUM", "FAMILY"
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Collect all purchasers from all plans or selected plan
  const selectedPlanObj = selectedPlanId
    ? planWiseRevenue.find((p) => p.planId === selectedPlanId)
    : null;

  const rawPurchasers = selectedPlanObj
    ? selectedPlanObj.purchasers || []
    : planWiseRevenue.flatMap((p) => p.purchasers || []);

  // Filter purchasers by search and status
  const filteredPurchasers = rawPurchasers.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      item.name?.toLowerCase().includes(q) ||
      item.email?.toLowerCase().includes(q) ||
      item.phone?.toLowerCase().includes(q) ||
      item.plan?.toLowerCase().includes(q) ||
      item.razorpayOrderId?.toLowerCase().includes(q) ||
      item.razorpayPaymentId?.toLowerCase().includes(q);

    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && item.status === "active") ||
      (statusFilter === "pending" && item.status === "pending") ||
      (statusFilter === "admin_allotted" && item.status === "admin_allotted");

    return matchSearch && matchStatus;
  });

  const handleExportCsv = () => {
    const rows = filteredPurchasers.map((p) => ({
      name: p.name,
      email: p.email,
      phone: p.phone,
      plan: p.plan,
      amountPaid: p.amountPaid,
      billingCycle: p.billingCycle,
      status: p.status,
      purchaseDate: p.purchaseDate ? new Date(p.purchaseDate).toLocaleDateString() : "N/A",
      paymentId: p.razorpayPaymentId || p.razorpayOrderId || "Direct",
      state: p.state || "India"
    }));

    exportToCsv(
      selectedPlanId ? `revenue_ledger_${selectedPlanId}` : "revenue_ledger_all_plans",
      rows,
      [
        { key: "name", label: "User Name" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        { key: "plan", label: "Plan Tier" },
        { key: "amountPaid", label: "Amount Paid (INR)" },
        { key: "billingCycle", label: "Billing Cycle" },
        { key: "status", label: "Status" },
        { key: "purchaseDate", label: "Purchase Date" },
        { key: "paymentId", label: "Payment Reference" },
        { key: "state", label: "State" }
      ]
    );
  };

  const formatCurrency = (val) => {
    const num = Number(val) || 0;
    return `₹${num.toLocaleString("en-IN")}`;
  };

  return (
    <div className="space-y-8 animate-fadeIn text-slate-100">
      {/* Hero Banner */}
      <div className="relative p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/20 text-white overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-500/10 via-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 backdrop-blur-md border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Real-Time Financial Telemetry</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight leading-tight">
              Revenue & Subscription Ledger
            </h2>
            <p className="text-slate-300 text-xs mt-2 leading-relaxed">
              Monetary collections breakdown by plan tier, gross checkout receipts, and per-plan purchaser audit trails across all subscribed accounts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition active:scale-95 shadow-sm"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Export Ledger (CSV)</span>
            </button>
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-md shadow-indigo-500/20 active:scale-95"
              >
                Refresh Data
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4 Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Confirmed Revenue */}
        <div className="p-6 rounded-2xl bg-[#111827] border border-slate-800 shadow-xl hover:border-emerald-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Money Received</span>
            <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-400">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {formatCurrency(summary.totalRevenue)}
            </span>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded-md border border-emerald-800/70">
              Confirmed
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Active & verified subscriber receipts
          </p>
        </div>

        {/* Card 2: Gross Checkout Value */}
        <div className="p-6 rounded-2xl bg-[#111827] border border-slate-800 shadow-xl hover:border-indigo-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Gross Checkout Orders</span>
            <div className="p-2.5 rounded-xl bg-indigo-950/80 border border-indigo-800/80 text-indigo-400">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {formatCurrency(summary.grossRevenue)}
            </span>
            <span className="text-xs font-bold text-indigo-400 bg-indigo-950/70 px-2 py-0.5 rounded-md border border-indigo-800/70">
              {summary.totalTransactions} Orders
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Includes ₹{(summary.pendingRevenue || 0).toLocaleString("en-IN")} pending checkouts
          </p>
        </div>

        {/* Card 3: Active Paid Subscribers */}
        <div className="p-6 rounded-2xl bg-[#111827] border border-slate-800 shadow-xl hover:border-violet-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Paid Subscribers</span>
            <div className="p-2.5 rounded-xl bg-violet-950/80 border border-violet-800/80 text-violet-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {summary.activeSubscribers || 0}
            </span>
            <span className="text-xs font-bold text-violet-400 bg-violet-950/70 px-2 py-0.5 rounded-md border border-violet-800/70">
              of {summary.totalUsers || 0} Total
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Currently active paid subscriptions
          </p>
        </div>

        {/* Card 4: Average Order Value */}
        <div className="p-6 rounded-2xl bg-[#111827] border border-slate-800 shadow-xl hover:border-sky-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Avg Transaction Value</span>
            <div className="p-2.5 rounded-xl bg-sky-950/80 border border-sky-800/80 text-sky-400">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {summary.totalTransactions > 0
                ? formatCurrency(Math.round((summary.totalRevenue || summary.grossRevenue) / summary.totalTransactions))
                : "₹0"}
            </span>
            <span className="text-xs font-bold text-sky-400 bg-sky-950/70 px-2 py-0.5 rounded-md border border-sky-800/70">
              AOV
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Mean receipt across subscription orders
          </p>
        </div>
      </div>

      {/* Plan-Wise Revenue Matrix (Click any plan to view its purchasers) */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-400" />
              <span>Plan-Wise Revenue Matrix</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Click on any plan card below to filter and inspect the user list who purchased that plan.
            </p>
          </div>

          {selectedPlanId && (
            <button
              onClick={() => setSelectedPlanId(null)}
              className="self-start sm:self-auto text-xs px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 font-semibold transition"
            >
              Show All Plans ({planWiseRevenue.length})
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {planWiseRevenue.map((plan) => {
            const isSelected = selectedPlanId === plan.planId;
            const monthlyPrice = plan.pricing?.monthly !== undefined ? plan.pricing.monthly : (plan.price || 0);

            return (
              <div
                key={plan.planId}
                onClick={() => setSelectedPlanId(isSelected ? null : plan.planId)}
                className={`relative rounded-3xl p-5 border cursor-pointer transition-all duration-300 text-left select-none ${
                  isSelected
                    ? "bg-gradient-to-b from-indigo-950/90 via-[#111827] to-[#111827] border-indigo-500 shadow-xl shadow-indigo-500/20 ring-2 ring-indigo-500 scale-[1.02]"
                    : "bg-[#111827] border-slate-800 hover:border-slate-700 hover:shadow-lg hover:scale-[1.01]"
                }`}
              >
                {isSelected && (
                  <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-extrabold uppercase tracking-wider shadow">
                    Active Filter
                  </div>
                )}

                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-extrabold text-white text-base tracking-tight">{plan.name}</h4>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 mt-0.5 inline-block font-bold">
                      {plan.badge || plan.planId}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400 font-medium">Price</div>
                    <div className="text-sm font-bold text-slate-200">₹{monthlyPrice}/mo</div>
                  </div>
                </div>

                {/* Plan Total Money Received */}
                <div className="mt-3 p-3 rounded-2xl bg-slate-900/90 border border-slate-800/80">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Total Money Received
                  </div>
                  <div className="text-2xl font-black text-emerald-400 mt-0.5">
                    {formatCurrency(plan.totalRevenue)}
                  </div>
                  {plan.pendingRevenue > 0 && (
                    <div className="text-[11px] text-amber-400/90 mt-1">
                      + {formatCurrency(plan.pendingRevenue)} pending orders
                    </div>
                  )}
                </div>

                {/* Plan Statistics */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs text-slate-400">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Purchases</span>
                    <span className="font-bold text-white text-sm">{plan.totalPurchases || 0}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Active Subscribers</span>
                    <span className="font-bold text-emerald-400 text-sm">{plan.activeSubscribers || 0}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-indigo-400 font-semibold group">
                  <span>{isSelected ? "Filtering this plan" : "Click to view purchasers"}</span>
                  <ChevronRight className={`w-4 h-4 transition ${isSelected ? "rotate-90 text-indigo-300" : ""}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Purchasers Ledger Table */}
      <div className="rounded-3xl bg-[#111827] border border-slate-800 p-6 shadow-xl space-y-5">
        {/* Table Controls */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-400" />
              <span>
                {selectedPlanObj
                  ? `Purchasers for ${selectedPlanObj.name} (${selectedPlanObj.badge || selectedPlanObj.planId})`
                  : "All Plan Purchasers & Subscribers"}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                {filteredPurchasers.length} Accounts
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {selectedPlanObj
                ? `Showing subscribers and purchase transactions for ${selectedPlanObj.name}. Total collected: ${formatCurrency(selectedPlanObj.totalRevenue)}.`
                : "Showing all registered customers across all subscription plans."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search name, phone, order..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="pending">Pending Orders</option>
              <option value="admin_allotted">Admin Granted</option>
            </select>
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">User / Purchaser</th>
                <th className="py-3 px-4">Plan Tier</th>
                <th className="py-3 px-4">Amount Paid</th>
                <th className="py-3 px-4">Billing Cycle</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Purchase Date</th>
                <th className="py-3 px-4">Payment Reference</th>
                <th className="py-3 px-4">State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-[#111827]">
              {filteredPurchasers.length > 0 ? (
                filteredPurchasers.map((p, idx) => {
                  const isSuccess = p.status === "active";
                  const isPending = p.status === "pending";
                  const isAdminGrant = p.status === "admin_allotted";

                  return (
                    <tr key={p.id || idx} className="hover:bg-slate-800/40 transition">
                      {/* User Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-600/20 text-indigo-400 font-bold flex items-center justify-center text-xs shrink-0 border border-indigo-500/30">
                            {(p.name || p.phone || "U").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-white text-xs">{p.name || "Subscriber"}</div>
                            <div className="text-[11px] text-slate-400">
                              {p.email || p.phone || "No contact info"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Plan */}
                      <td className="py-3.5 px-4 font-mono">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-indigo-300 border border-slate-700">
                          {p.plan}
                        </span>
                      </td>

                      {/* Amount Paid */}
                      <td className="py-3.5 px-4 font-bold text-white">
                        <span className={p.amountPaid > 0 ? "text-emerald-400 font-mono text-sm" : "text-slate-400"}>
                          {p.amountPaid > 0 ? formatCurrency(p.amountPaid) : "₹0 (Grant)"}
                        </span>
                      </td>

                      {/* Billing Cycle */}
                      <td className="py-3.5 px-4 capitalize text-slate-300 font-medium">
                        {p.billingCycle}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {isSuccess && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800/80">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            Active
                          </span>
                        )}
                        {isPending && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950/80 text-amber-400 border border-amber-800/80">
                            <Clock className="w-3 h-3 text-amber-400" />
                            Pending Order
                          </span>
                        )}
                        {isAdminGrant && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-violet-950/80 text-violet-400 border border-violet-800/80">
                            <ShieldCheck className="w-3 h-3 text-violet-400" />
                            Admin Grant
                          </span>
                        )}
                        {!isSuccess && !isPending && !isAdminGrant && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400">
                            {p.status}
                          </span>
                        )}
                      </td>

                      {/* Purchase Date */}
                      <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                        {p.purchaseDate ? new Date(p.purchaseDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        }) : "N/A"}
                      </td>

                      {/* Payment ID / Order ID */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                        {p.razorpayPaymentId || p.razorpayOrderId || "Direct Allotment"}
                      </td>

                      {/* State */}
                      <td className="py-3.5 px-4 text-slate-300">
                        {p.state || "India"}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-500 text-xs">
                    No purchasers found for the selected criteria.
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
