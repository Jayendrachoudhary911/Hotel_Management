'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  Calendar,
  Download,
  TrendingUp,
  DollarSign,
  BedDouble,
  Utensils,
  Sparkles,
  CreditCard,
  QrCode,
  Banknote,
  ArrowUpRight,
  Filter,
} from 'lucide-react';
import { formatMoney } from '@/lib/utils/money';

export default function DashboardReportsPage() {
  const [dateRange, setDateRange] = useState<'today' | '7days' | 'month' | 'all'>('month');

  // Realistic reporting data
  const reportData = {
    totalRevenueMinor: 48500000, // Rs 4,85,000.00
    roomsRevenueMinor: 28500000, // Rs 2,85,000.00
    fbRevenueMinor: 14500000, // Rs 1,45,000.00
    hallRevenueMinor: 5500000, // Rs 55,000.00
    occupancyPercent: 83.3,
    occupiedRooms: 5,
    totalRooms: 6,
    adrMinor: 570000, // Rs 5,700.00
    revParMinor: 475000, // Rs 4,750.00

    outlets: [
      { name: 'Heritage Suites & Chambers', category: 'Rooms', amountMinor: 28500000, ordersCount: 42, share: 58.7 },
      { name: 'Saffron & Spice Fine Dining', category: 'F&B', amountMinor: 9800000, ordersCount: 124, share: 20.2 },
      { name: 'The Velvet Roast Artisan Café', category: 'F&B', amountMinor: 4700000, ordersCount: 98, share: 9.7 },
      { name: 'Crystal Ballroom & Banquets', category: 'Events', amountMinor: 5500000, ordersCount: 3, share: 11.4 },
    ],

    tenders: [
      { mode: 'UPI & Instant QR', amountMinor: 26800000, count: 182, percent: 55.3, icon: QrCode, color: 'text-emerald-400' },
      { mode: 'Credit & Debit Cards', amountMinor: 15400000, count: 64, percent: 31.7, icon: CreditCard, color: 'text-blue-400' },
      { mode: 'Cash Counter Settlement', amountMinor: 6300000, count: 48, percent: 13.0, icon: Banknote, color: 'text-amber-400' },
    ],

    recentTransactions: [
      { date: '2026-10-18 19:15', ref: 'INV-202610-0041', desc: 'Saffron & Spice • Table 2 (Laal Maas x2, Dal Baati)', tender: 'UPI QR', amountMinor: 157500 },
      { date: '2026-10-18 18:40', ref: 'INV-202610-0040', desc: 'The Velvet Roast • Spanish Latte & Croissant', tender: 'Credit Card', amountMinor: 52500 },
      { date: '2026-10-18 16:30', ref: 'RES-AUR-2026-8841', desc: 'Haveli Heritage Suite • 3 Nights Check-In', tender: 'UPI QR', amountMinor: 480000 },
      { date: '2026-10-18 14:10', ref: 'INV-202610-0039', desc: 'Doorstep Delivery • Royal Thali Feast', tender: 'UPI QR', amountMinor: 120000 },
      { date: '2026-10-18 11:45', ref: 'EVT-AUR-2026-1092', desc: 'Crystal Ballroom • Deposit Advance (Royal Reception)', tender: 'Bank Transfer', amountMinor: 2500000 },
    ],
  };

  const exportToCsv = () => {
    const headers = ['Transaction Date', 'Invoice / Ref Code', 'Description', 'Payment Tender', 'Amount (INR)'];
    const rows = reportData.recentTransactions.map((tx) => [
      `"${tx.date}"`,
      `"${tx.ref}"`,
      `"${tx.desc}"`,
      `"${tx.tender}"`,
      (tx.amountMinor / 100).toFixed(2),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `rajmahal_revenue_report_${dateRange}_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#B08D57]">
            Financial & Operational Intelligence
          </span>
          <h1 className="font-heritage text-2xl sm:text-3xl font-bold text-[#FAF8F3] mt-0.5">
            Revenue & Sales Reports
          </h1>
          <p className="text-xs sm:text-sm text-[#A89E92]">
            Detailed revenue breakdowns by outlet, payment tender reconciliation, and room occupancy yields.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Date Range Selector */}
          <div className="flex items-center bg-[#241F1A] border border-[#3D352C] rounded-lg p-1 text-xs">
            {[
              { id: 'today', label: 'Today' },
              { id: '7days', label: '7 Days' },
              { id: 'month', label: 'This Month' },
              { id: 'all', label: 'All Time' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setDateRange(tab.id as any)}
                className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                  dateRange === tab.id
                    ? 'bg-[#670E10] text-white font-bold'
                    : 'text-[#A89E92] hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* CSV Export Button */}
          <button
            onClick={exportToCsv}
            className="px-4 py-2 rounded-lg bg-[#2A2420] hover:bg-[#B08D57] hover:text-[#241F1A] text-[#FAF8F3] text-xs font-semibold border border-[#3D352C] flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* ── TOP KPI CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#241F1A] border border-[#3D352C] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-[#A89E92] text-xs font-semibold">
            <span>Gross Platform Turnover</span>
            <span className="flex items-center text-emerald-400 text-[11px] font-bold">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +18.4%
            </span>
          </div>
          <span className="font-heritage text-3xl font-bold text-[#E5C388] mt-2 block">
            {formatMoney(reportData.totalRevenueMinor)}
          </span>
          <span className="text-[11px] text-[#A89E92] mt-1 block">
            Reconciled across all 4 outlets & channels
          </span>
        </div>

        <div className="bg-[#241F1A] border border-[#3D352C] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-[#A89E92] text-xs font-semibold">
            <span>Rooms & Suites Turnover</span>
            <BedDouble className="w-4 h-4 text-[#B08D57]" />
          </div>
          <span className="font-heritage text-3xl font-bold text-[#FAF8F3] mt-2 block">
            {formatMoney(reportData.roomsRevenueMinor)}
          </span>
          <span className="text-[11px] text-emerald-400 mt-1 block font-medium">
            ADR: {formatMoney(reportData.adrMinor)} • RevPAR: {formatMoney(reportData.revParMinor)}
          </span>
        </div>

        <div className="bg-[#241F1A] border border-[#3D352C] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-[#A89E92] text-xs font-semibold">
            <span>Food & Beverage Turnover</span>
            <Utensils className="w-4 h-4 text-[#B08D57]" />
          </div>
          <span className="font-heritage text-3xl font-bold text-[#FAF8F3] mt-2 block">
            {formatMoney(reportData.fbRevenueMinor)}
          </span>
          <span className="text-[11px] text-[#A89E92] mt-1 block">
            Restaurant + Café + Direct Deliveries
          </span>
        </div>

        <div className="bg-[#241F1A] border border-[#3D352C] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-[#A89E92] text-xs font-semibold">
            <span>Room Occupancy Rate</span>
            <span className="text-emerald-400 text-xs font-bold">{reportData.occupancyPercent}%</span>
          </div>
          <span className="font-heritage text-3xl font-bold text-[#FAF8F3] mt-2 block">
            {reportData.occupiedRooms} / {reportData.totalRooms} Suites
          </span>
          <div className="w-full bg-[#1C1814] h-2 rounded-full mt-2 overflow-hidden border border-[#3D352C]">
            <div
              className="bg-[#670E10] h-full rounded-full transition-all"
              style={{ width: `${reportData.occupancyPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── TWO-COLUMN BREAKDOWN: OUTLETS & TENDERS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Outlets Performance Table */}
        <div className="lg:col-span-7 bg-[#241F1A] border border-[#3D352C] rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#3D352C] pb-3">
            <div>
              <h3 className="font-heritage text-lg font-bold text-[#FAF8F3]">Turnover by Revenue Stream</h3>
              <p className="text-xs text-[#A89E92]">Sales volume and contribution percentage per outlet.</p>
            </div>
            <BarChart3 className="w-5 h-5 text-[#B08D57]" />
          </div>

          <div className="space-y-4">
            {reportData.outlets.map((outlet, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-[#FAF8F3]">{outlet.name}</span>
                    <span className="text-[10px] text-[#A89E92] ml-2 font-mono">({outlet.ordersCount} transactions)</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#E5C388] font-mono">{formatMoney(outlet.amountMinor)}</span>
                    <span className="text-[11px] text-[#A89E92] ml-2">({outlet.share}%)</span>
                  </div>
                </div>
                {/* Visual Progress Bar */}
                <div className="w-full bg-[#1C1814] h-2 rounded-full overflow-hidden border border-[#3D352C]/60">
                  <div
                    className="bg-gradient-to-r from-[#670E10] to-[#B08D57] h-full rounded-full"
                    style={{ width: `${outlet.share}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Tender Settlement */}
        <div className="lg:col-span-5 bg-[#241F1A] border border-[#3D352C] rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#3D352C] pb-3">
            <div>
              <h3 className="font-heritage text-lg font-bold text-[#FAF8F3]">Payment Settlement</h3>
              <p className="text-xs text-[#A89E92]">Tender reconciliation across transactions.</p>
            </div>
            <CreditCard className="w-5 h-5 text-[#B08D57]" />
          </div>

          <div className="space-y-3">
            {reportData.tenders.map((tender, idx) => {
              const Icon = tender.icon;
              return (
                <div key={idx} className="p-3.5 rounded-xl bg-[#1C1814] border border-[#3D352C] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#2A2420] border border-[#3D352C] flex items-center justify-center">
                      <Icon className={`w-5 h-5 ${tender.color}`} />
                    </div>
                    <div>
                      <span className="font-semibold text-xs text-[#FAF8F3] block">{tender.mode}</span>
                      <span className="text-[10px] text-[#A89E92]">{tender.count} receipts issued</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-xs text-[#FAF8F3] font-mono block">
                      {formatMoney(tender.amountMinor)}
                    </span>
                    <span className="text-[10px] text-[#A89E92]">{tender.percent}% of total</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── RECENT RECONCILED TRANSACTIONS TABLE ── */}
      <div className="bg-[#241F1A] border border-[#3D352C] rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[#3D352C] flex items-center justify-between">
          <h3 className="font-heritage text-base font-bold text-[#FAF8F3]">Recent Invoices & Folio Dispatches</h3>
          <span className="text-xs text-[#A89E92]">Exportable for bookkeeping & auditing</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#1C1814] text-[#A89E92] border-b border-[#3D352C] uppercase text-[10px]">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Invoice / Folio Ref</th>
                <th className="py-3 px-4">Transaction Details</th>
                <th className="py-3 px-4">Payment Tender</th>
                <th className="py-3 px-4 text-right">Settled Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3D352C]">
              {reportData.recentTransactions.map((tx, idx) => (
                <tr key={idx} className="hover:bg-[#2A2420]">
                  <td className="py-3 px-4 text-[#A89E92]">{tx.date}</td>
                  <td className="py-3 px-4 font-mono font-bold text-[#E5C388]">{tx.ref}</td>
                  <td className="py-3 px-4 text-[#FAF8F3]">{tx.desc}</td>
                  <td className="py-3 px-4 text-[#A89E92]">{tx.tender}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400">
                    {formatMoney(tx.amountMinor)}
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
