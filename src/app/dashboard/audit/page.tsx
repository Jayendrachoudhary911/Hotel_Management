'use client';

import React, { useState } from 'react';
import {
  History,
  Search,
  Filter,
  ShieldCheck,
  AlertTriangle,
  FileText,
  DollarSign,
  UserCheck,
  Calendar,
  Lock,
} from 'lucide-react';

interface AuditRecord {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: string;
  category: 'price_override' | 'void_refund' | 'discount' | 'status_override' | 'role_change' | 'security';
  entity: string;
  reference: string;
  description: string;
  reason: string;
  terminal: string;
}

export default function DashboardAuditPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const auditRecords: AuditRecord[] = [
    {
      id: 'aud-109',
      timestamp: '2026-10-18 19:12:44',
      actor: 'Ranveer Rathore',
      actorRole: 'Duty Manager',
      category: 'discount',
      entity: 'Order / Bill',
      reference: 'INV-202610-0041',
      description: 'Applied 10% Royal Heritage Club Courtesy Discount (-₹157.50)',
      reason: 'VIP guest loyalty privilege authorized by GM',
      terminal: 'POS Terminal 1',
    },
    {
      id: 'aud-108',
      timestamp: '2026-10-18 17:45:10',
      actor: 'Maharaja Vikram Singh',
      actorRole: 'Owner / Admin',
      category: 'price_override',
      entity: 'Menu Item',
      reference: 'Mewari Dal Baati Churma Thali',
      description: 'Base price updated from ₹480 to ₹520 (+₹40.00)',
      reason: 'Seasonal organic ghee procurement revision',
      terminal: 'Admin Console (Desktop)',
    },
    {
      id: 'aud-107',
      timestamp: '2026-10-18 15:30:22',
      actor: 'Ranveer Rathore',
      actorRole: 'Duty Manager',
      category: 'void_refund',
      entity: 'Order Line',
      reference: 'ORD-202610-0038',
      description: 'Voided 1x Masala Chai (₹120) before preparation started',
      reason: 'Guest changed mind for Cold Brew Coffee',
      terminal: 'Café POS Station',
    },
    {
      id: 'aud-106',
      timestamp: '2026-10-18 14:10:05',
      actor: 'Divya Shekhawat',
      actorRole: 'Front Desk',
      category: 'status_override',
      entity: 'Chamber Room 102',
      reference: 'Room 102 (Haveli Suite)',
      description: 'Manually expedited housekeeping status from "Dirty" to "Cleaning"',
      reason: 'Early guest arrival anticipated at 14:30',
      terminal: 'Front Desk Terminal',
    },
    {
      id: 'aud-105',
      timestamp: '2026-10-18 11:20:18',
      actor: 'Maharaja Vikram Singh',
      actorRole: 'Owner / Admin',
      category: 'role_change',
      entity: 'Staff Account',
      reference: 'User: Kishan Lal',
      description: 'Promoted role from "Trainee" to "Cashier / POS Operator"',
      reason: 'Probation completed with cashier certification',
      terminal: 'Admin Console',
    },
    {
      id: 'aud-104',
      timestamp: '2026-10-17 21:05:30',
      actor: 'Kishan Lal',
      actorRole: 'Cashier',
      category: 'void_refund',
      entity: 'Invoice',
      reference: 'INV-202610-0032',
      description: 'Issued Full UPI Refund for cancelled delivery order (-₹840.00)',
      reason: 'Address beyond active delivery radius; customer notified',
      terminal: 'POS Terminal 2',
    },
    {
      id: 'aud-103',
      timestamp: '2026-10-17 14:15:00',
      actor: 'System Automation',
      actorRole: 'Cron Worker',
      category: 'security',
      entity: 'Database Backup',
      reference: 'PG-DUMP-20261017',
      description: 'Automated encrypted PostgreSQL database snapshot taken',
      reason: 'Scheduled daily off-site snapshot backup',
      terminal: 'Automated Server',
    },
  ];

  const filteredRecords = auditRecords.filter((rec) => {
    if (selectedCategory !== 'all' && rec.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        rec.reference.toLowerCase().includes(q) ||
        rec.actor.toLowerCase().includes(q) ||
        rec.description.toLowerCase().includes(q) ||
        rec.reason.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getCategoryBadge = (cat: AuditRecord['category']) => {
    switch (cat) {
      case 'price_override':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-950 text-blue-400 border border-blue-600/40">Price Override</span>;
      case 'void_refund':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-950 text-red-400 border border-red-600/40">Void / Refund</span>;
      case 'discount':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-950 text-amber-400 border border-amber-600/40">Discount</span>;
      case 'status_override':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-950 text-purple-400 border border-purple-600/40">Status Override</span>;
      case 'role_change':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-950 text-emerald-400 border border-emerald-600/40">Role Change</span>;
      case 'security':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-gray-800 text-gray-300 border border-gray-600/40">Security</span>;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#B08D57] flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" /> Immutable Audit Protocol (ADMIN-06)
          </span>
          <h1 className="font-heritage text-2xl sm:text-3xl font-bold text-[#FAF8F3] mt-0.5">
            Security & Financial Audit Trail
          </h1>
          <p className="text-xs sm:text-sm text-[#A89E92]">
            Permanent historical log of high-impact mutations: price changes, voids, refunds, discounts, and role promotions.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#A89E92] bg-[#241F1A] p-2.5 rounded-xl border border-[#3D352C]">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Write-Only Ledger • Deletion Restricted</span>
        </div>
      </div>

      {/* ── CONTROLS & FILTERS ── */}
      <div className="bg-[#241F1A] border border-[#3D352C] rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#A89E92] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by actor, reference, reason, or action..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#1C1814] border border-[#3D352C] text-xs text-[#FAF8F3] placeholder-[#6E6356] focus:outline-none focus:border-[#B08D57]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          <Filter className="w-3.5 h-3.5 text-[#A89E92] shrink-0" />
          <span className="text-[11px] text-[#A89E92] font-semibold shrink-0">Filter:</span>
          {[
            { id: 'all', label: 'All Actions' },
            { id: 'price_override', label: 'Price Changes' },
            { id: 'void_refund', label: 'Voids & Refunds' },
            { id: 'discount', label: 'Discounts' },
            { id: 'role_change', label: 'Role Changes' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-md text-[11px] font-medium transition-all shrink-0 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#B08D57] text-[#241F1A] font-bold'
                  : 'bg-[#1C1814] text-[#A89E92] hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── AUDIT LOG TABLE ── */}
      <div className="bg-[#241F1A] border border-[#3D352C] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#1C1814] text-[#A89E92] border-b border-[#3D352C] uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Date & Time (IST)</th>
                <th className="py-3 px-4">Staff Actor</th>
                <th className="py-3 px-4">Action Category</th>
                <th className="py-3 px-4">Target Reference</th>
                <th className="py-3 px-4">Action Summary</th>
                <th className="py-3 px-4">Authorized Justification</th>
                <th className="py-3 px-4">Terminal / Station</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3D352C]">
              {filteredRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-[#2A2420] transition-colors">
                  <td className="py-3.5 px-4 font-mono text-[#A89E92] text-[11px] whitespace-nowrap">
                    {rec.timestamp}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-[#FAF8F3] block">{rec.actor}</span>
                    <span className="text-[10px] text-[#B08D57] block">{rec.actorRole}</span>
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getCategoryBadge(rec.category)}
                  </td>

                  <td className="py-3.5 px-4 font-mono font-medium text-[#E5C388]">
                    {rec.reference}
                  </td>

                  <td className="py-3.5 px-4 max-w-xs text-[#FAF8F3]">
                    {rec.description}
                  </td>

                  <td className="py-3.5 px-4 max-w-xs text-[#A89E92] italic">
                    &ldquo;{rec.reason}&rdquo;
                  </td>

                  <td className="py-3.5 px-4 text-[#A89E92] text-[11px] whitespace-nowrap">
                    {rec.terminal}
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
