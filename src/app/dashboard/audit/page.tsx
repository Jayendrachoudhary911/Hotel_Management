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

  const [auditRecords] = useState<AuditRecord[]>([]);

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
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#A89E92]">
                    <ShieldCheck className="w-8 h-8 text-[#A89E92]/50 mx-auto mb-2" />
                    <p className="text-sm font-medium">No audit log records found</p>
                    <p className="text-xs text-[#A89E92]/60 mt-0.5">Manager approvals and security actions will be recorded here automatically.</p>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => (
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
              ))
            )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
