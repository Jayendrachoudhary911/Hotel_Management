'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Calendar,
  Download,
  TrendingUp,
  BedDouble,
  UtensilsCrossed,
  CreditCard,
  QrCode,
  Banknote,
  ArrowUpRight,
  RefreshCw,
  Receipt,
  AlertCircle,
} from 'lucide-react';

interface ReportKpis {
  totalRevenueMinor: number;
  roomsRevenueMinor: number;
  fbRevenueMinor: number;
  occupancyPercent: number;
  occupiedRooms: number;
  totalRooms: number;
  adrMinor: number;
  revParMinor: number;
  totalOrdersCount: number;
  totalReservationsCount: number;
}

interface OutletShare {
  name: string;
  category: string;
  amountMinor: number;
  ordersCount: number;
  share: number;
}

interface TenderShare {
  mode: string;
  amountMinor: number;
  count: number;
  percent: number;
}

interface RecentTransaction {
  id: string;
  date: string;
  timestamp: number;
  ref: string;
  desc: string;
  tender: string;
  amountMinor: number;
  type: 'order' | 'reservation';
}

interface ReportResponse {
  success: boolean;
  range: string;
  kpis: ReportKpis;
  outlets: OutletShare[];
  tenders: TenderShare[];
  recentTransactions: RecentTransaction[];
}

export default function DashboardReportsPage() {
  const [dateRange, setDateRange] = useState<'today' | '7days' | 'month' | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<ReportResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async (range: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/reports?range=${range}`);
      if (!res.ok) throw new Error('Failed to load reports');
      const data: ReportResponse = await res.json();
      if (data.success) {
        setReportData(data);
      } else {
        throw new Error('API returned unsuccessful response');
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching report analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(dateRange);
  }, [dateRange]);

  const exportToCsv = () => {
    if (!reportData || reportData.recentTransactions.length === 0) {
      alert('No transactions to export for the selected period.');
      return;
    }

    const headers = ['Transaction Date,Reference / Folio,Description,Payment Tender,Type,Amount (INR)'];
    const rows = reportData.recentTransactions.map((tx) => [
      `"${tx.date}"`,
      `"${tx.ref}"`,
      `"${tx.desc.replace(/"/g, '""')}"`,
      `"${tx.tender}"`,
      `"${tx.type.toUpperCase()}"`,
      `"₹${(tx.amountMinor / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}"`,
    ].join(','));

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rajmahal_financial_report_${dateRange}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getTenderIcon = (mode: string) => {
    if (mode.toLowerCase().includes('qr') || mode.toLowerCase().includes('upi')) return QrCode;
    if (mode.toLowerCase().includes('card')) return CreditCard;
    return Banknote;
  };

  const kpis = reportData?.kpis || {
    totalRevenueMinor: 0,
    roomsRevenueMinor: 0,
    fbRevenueMinor: 0,
    occupancyPercent: 0,
    occupiedRooms: 0,
    totalRooms: 6,
    adrMinor: 0,
    revParMinor: 0,
    totalOrdersCount: 0,
    totalReservationsCount: 0,
  };

  const outlets = reportData?.outlets || [];
  const tenders = reportData?.tenders || [];
  const recentTransactions = reportData?.recentTransactions || [];

  return (
    <div className="space-y-4">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#E8DCD2]">
        <div>
          <h1
            className="text-2xl font-bold text-[#4F0809]"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Palace Reports &amp; Financial Intelligence
          </h1>
          <p className="text-xs text-[#81736D] mt-0.5">
            Real-time business audit, food &amp; beverage sales channels, room occupancy yields, and tender settlement reconciliation
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Date Range Tabs */}
          <div className="flex items-center bg-white border border-[#E8DCD2] rounded-lg p-0.5 text-xs shadow-xs">
            {[
              { id: 'today', label: 'Today' },
              { id: '7days', label: '7 Days' },
              { id: 'month', label: 'This Month' },
              { id: 'all', label: 'All Time' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setDateRange(tab.id as any)}
                className={`px-3 py-1 rounded-md font-semibold transition cursor-pointer ${
                  dateRange === tab.id
                    ? 'bg-[#4F0809] text-white shadow-xs'
                    : 'text-[#81736D] hover:text-[#302421]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => fetchReports(dateRange)}
            title="Refresh Data"
            className="p-2 rounded-lg border border-[#E8DCD2] bg-white text-[#81736D] hover:text-[#4F0809] hover:bg-[#FBF6EF] transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#4F0809]' : ''}`} />
          </button>

          <button
            onClick={exportToCsv}
            disabled={recentTransactions.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#4F0809] hover:bg-[#6B1518] text-white text-xs font-semibold shadow-xs transition disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#D8AA67]" />
            Export CSV
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* ── 4 Key Performance Indicators ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Revenue */}
        <div className="bg-white border border-[#E8DCD2] rounded-xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-[#81736D] text-[10px] font-bold uppercase tracking-wider">
            <span>Total Palace Revenue</span>
            <span className="flex items-center text-[#2E7D32] font-semibold text-[11px]">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> Reconciled
            </span>
          </div>
          <span
            className="text-2xl font-bold text-[#4F0809] mt-1 block"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            ₹{(kpis.totalRevenueMinor / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[10px] text-[#81736D] mt-0.5 block">
            {kpis.totalOrdersCount} F&amp;B Orders • {kpis.totalReservationsCount} Bookings
          </span>
        </div>

        {/* Room Revenue */}
        <div className="bg-white border border-[#E8DCD2] rounded-xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-[#81736D] text-[10px] font-bold uppercase tracking-wider">
            <span>Suites &amp; Room Revenue</span>
            <BedDouble className="w-4 h-4 text-[#B78A48]" />
          </div>
          <span
            className="text-2xl font-bold text-[#302421] mt-1 block"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            ₹{(kpis.roomsRevenueMinor / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[10px] text-[#2E7D32] mt-0.5 block">
            ADR: ₹{(kpis.adrMinor / 100).toLocaleString('en-IN')} • RevPAR: ₹{(kpis.revParMinor / 100).toLocaleString('en-IN')}
          </span>
        </div>

        {/* F&B Sales */}
        <div className="bg-white border border-[#E8DCD2] rounded-xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-[#81736D] text-[10px] font-bold uppercase tracking-wider">
            <span>Food &amp; Beverage Sales</span>
            <UtensilsCrossed className="w-4 h-4 text-[#B78A48]" />
          </div>
          <span
            className="text-2xl font-bold text-[#302421] mt-1 block"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            ₹{(kpis.fbRevenueMinor / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[10px] text-[#81736D] mt-0.5 block">
            {kpis.totalOrdersCount} Verified F&amp;B Orders Settled
          </span>
        </div>

        {/* Occupancy Yield */}
        <div className="bg-white border border-[#E8DCD2] rounded-xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between text-[#81736D] text-[10px] font-bold uppercase tracking-wider">
            <span>Occupancy Yield</span>
            <span className="text-[#2E7D32] text-xs font-bold">{kpis.occupancyPercent}%</span>
          </div>
          <span
            className="text-2xl font-bold text-[#302421] mt-1 block"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            {kpis.occupiedRooms} / {kpis.totalRooms} Rooms
          </span>
          <div className="w-full bg-[#F6EAE0] h-1.5 rounded-full mt-1.5 overflow-hidden">
            <div
              className="bg-[#4F0809] h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, kpis.occupancyPercent)}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Outlet Revenue Breakdown & Tender Split ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Outlets Share */}
        <div className="bg-white border border-[#E8DCD2] rounded-xl p-4 shadow-xs">
          <h2
            className="text-base font-bold text-[#4F0809] mb-3"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Outlet Performance &amp; Revenue Share
          </h2>
          {outlets.length === 0 ? (
            <div className="p-6 text-center text-xs text-[#81736D]">
              No active outlets registered.
            </div>
          ) : (
            <div className="space-y-3">
              {outlets.map((out, idx) => (
                <div key={idx} className="p-2.5 bg-[#FBF6EF] rounded-lg border border-[#E8DCD2]">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-bold text-[#302421]">{out.name}</span>
                    <span className="font-bold text-[#4F0809]">
                      ₹{(out.amountMinor / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] text-[#81736D] mb-1.5">
                    <span>Category: {out.category} • {out.ordersCount} transactions</span>
                    <span>{out.share}% of total</span>
                  </div>
                  <div className="w-full bg-[#E8DCD2] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#4F0809] h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, out.share)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payment Tenders */}
        <div className="bg-white border border-[#E8DCD2] rounded-xl p-4 shadow-xs">
          <h2
            className="text-base font-bold text-[#4F0809] mb-3"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Payment Reconciliation by Tender
          </h2>
          <div className="space-y-3">
            {tenders.map((tender, idx) => {
              const Icon = getTenderIcon(tender.mode);
              return (
                <div
                  key={idx}
                  className="p-2.5 bg-[#FBF6EF] rounded-lg border border-[#E8DCD2] flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#4F0809] text-[#E1B46F] flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-[#302421]">{tender.mode}</div>
                      <div className="text-[10px] text-[#81736D]">
                        {tender.count} transaction{tender.count === 1 ? '' : 's'} settled
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-xs text-[#4F0809]">
                      ₹{(tender.amountMinor / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-[10px] text-[#2E7D32] font-semibold">
                      {tender.percent}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Recent Reconciled Transactions ── */}
      <div className="bg-white border border-[#E8DCD2] rounded-xl shadow-xs overflow-hidden">
        <div className="p-3 border-b border-[#E8DCD2] bg-[#FBF6EF]/75 flex justify-between items-center">
          <h3
            className="text-sm font-bold text-[#4F0809]"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Recent Reconciled Transactions
          </h3>
          <span className="text-[11px] text-[#81736D]">
            PMS Bookings &amp; F&amp;B Orders Verified ({recentTransactions.length} recorded)
          </span>
        </div>
        <div className="overflow-x-auto">
          {recentTransactions.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#81736D]">
              <Receipt className="w-8 h-8 text-[#D8AA67] mx-auto mb-2 opacity-60" />
              <p className="font-semibold text-[#4F0809]">No transactions recorded for this period</p>
              <p className="text-[11px] text-[#81736D] mt-0.5">
                New room reservations or dining orders will automatically appear here once placed.
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E8DCD2] bg-[#FBF6EF]/50 text-[10px] font-bold uppercase tracking-wider text-[#81736D]">
                  <th className="py-2.5 px-3">Date &amp; Time</th>
                  <th className="py-2.5 px-3">Reference / Folio</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3">Payment Tender</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DCD2]/70 text-[#302421]">
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#FBF6EF]/50 transition-colors">
                    <td className="py-2.5 px-3 text-[#81736D] whitespace-nowrap">{tx.date}</td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-[#4F0809] whitespace-nowrap">
                      {tx.ref}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-[#302421]">{tx.desc}</td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-[#F6EAE0] text-[10px] font-semibold text-[#302421]">
                        {tx.tender}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-[#302421] whitespace-nowrap">
                      ₹{(tx.amountMinor / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
