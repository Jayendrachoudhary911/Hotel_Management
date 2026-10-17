'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { formatMoney } from '@/lib/utils/money';
import { dataRepository } from '@/lib/data/repository';
import type { EventLead } from '@/lib/types';
import { Sparkles, Phone, Mail, Calendar, Users, FileText, CheckCircle2 } from 'lucide-react';

export default function HallDashboardPage() {
  const [leads, setLeads] = useState<EventLead[]>(dataRepository.getEventLeads());
  const [selectedLead, setSelectedLead] = useState<EventLead | null>(null);
  const [quoteAmount, setQuoteAmount] = useState<string>('');

  const handleSendQuote = () => {
    if (!selectedLead || !quoteAmount) return;

    selectedLead.status = 'quoted';
    selectedLead.quote_amount_minor = parseInt(quoteAmount, 10) * 100; // Rs to minor units
    setSelectedLead(null);
    setQuoteAmount('');
    setLeads([...dataRepository.getEventLeads()]);
  };

  const handleStatusChange = (lead: EventLead, newStatus: EventLead['status']) => {
    lead.status = newStatus;
    setLeads([...dataRepository.getEventLeads()]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#3D352C]">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#670E10] text-white text-[11px] font-bold border border-[#B08D57]/40">
              Banquets & Events Pipeline
            </span>
            <span className="text-xs text-[#B08D57] font-semibold">WEB-05 Lead Tracking</span>
          </div>
          <h1 className="font-heritage text-2xl sm:text-3xl font-bold text-[#FAF8F3] mt-1">
            Party Hall & Banquet Enquiries
          </h1>
          <p className="text-xs text-[#9A8E7F] mt-1">
            Crystal Ballroom event pipeline, seating layouts, quotations & status tracking
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-[#241F1A] border border-[#3D352C] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#2A2420] text-[#B08D57] uppercase tracking-wider font-semibold border-b border-[#3D352C]">
              <tr>
                <th className="py-3.5 px-4">Ref Code</th>
                <th className="py-3.5 px-4">Organizer</th>
                <th className="py-3.5 px-4">Event Type</th>
                <th className="py-3.5 px-4">Seating Layout</th>
                <th className="py-3.5 px-4">Guests</th>
                <th className="py-3.5 px-4">Quote</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3D352C] text-[#FAF8F3]">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#9A8E7F]">
                    No active banquet enquiries yet. Enquiries submitted on the public hall page will appear here immediately for follow-up.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-[#2A2420]/80 transition-colors">
                    <td className="py-4 px-4 font-mono font-bold text-[#C9A96E]">
                      {lead.reference_code}
                    </td>

                    <td className="py-4 px-4">
                      <span className="font-semibold text-[#FAF8F3] block">{lead.contact_name}</span>
                      <span className="text-[#9A8E7F] text-[11px]">{lead.contact_phone}</span>
                    </td>

                    <td className="py-4 px-4">
                      <span className="text-[#FAF8F3] block font-medium">{lead.event_type}</span>
                      {lead.setup_needs && (
                        <span className="text-[#9A8E7F] text-[11px] line-clamp-1">
                          {lead.setup_needs}
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-[#D4CBBB]">
                      {lead.seating_layout || 'Round Banquet Tables'}
                    </td>

                    <td className="py-4 px-4 font-medium text-[#FAF8F3]">
                      {lead.expected_guests} Guests
                    </td>

                    <td className="py-4 px-4 font-mono font-bold text-[#C9A96E]">
                      {lead.quote_amount_minor ? formatMoney(lead.quote_amount_minor) : 'Pending'}
                    </td>

                    <td className="py-4 px-4">
                      <Badge
                        size="sm"
                        variant={
                          lead.status === 'accepted'
                            ? 'emerald'
                            : lead.status === 'quoted'
                            ? 'amber'
                            : 'gold'
                        }
                      >
                        {lead.status}
                      </Badge>
                    </td>

                    <td className="py-4 px-4 text-right space-x-2">
                      {lead.status === 'new' && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleStatusChange(lead, 'contacted')}
                        >
                          Mark Contacted
                        </Button>
                      )}

                      {lead.status !== 'accepted' && (
                        <Button size="sm" onClick={() => setSelectedLead(lead)}>
                          Issue Quote
                        </Button>
                      )}

                      {lead.status === 'quoted' && (
                        <Button
                          size="sm"
                          className="bg-[#2D6A4F] hover:bg-[#1E4835] text-white"
                          onClick={() => handleStatusChange(lead, 'accepted')}
                        >
                          Confirm &amp; Block Slot
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quote Modal */}
      {selectedLead && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedLead(null)}
          title="Prepare Formal Event Proposal"
          description={`Issuing quotation for ${selectedLead.contact_name} (${selectedLead.event_type})`}
        >
          <div className="space-y-4">
            <Input
              label="Quotation Amount (in INR)"
              type="number"
              placeholder="e.g. 150000"
              value={quoteAmount}
              onChange={(e) => setQuoteAmount(e.target.value)}
              required
            />

            <div className="flex justify-end space-x-3 pt-4 border-t border-[#3D352C]">
              <Button variant="ghost" onClick={() => setSelectedLead(null)}>
                Cancel
              </Button>
              <Button onClick={handleSendQuote}>Send Formal Quote &rarr;</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
