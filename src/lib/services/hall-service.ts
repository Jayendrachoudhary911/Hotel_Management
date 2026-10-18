import { getSupabaseClient } from './supabase-helper';
import { dataRepository } from '@/lib/data/repository';
import type { Hall, EventLead } from '@/lib/types';

export const hallService = {
  async getHall(): Promise<Hall> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('halls')
        .select('*')
        .limit(1)
        .maybeSingle();
      if (!error && data) {
        return {
          id: data.id,
          property_id: data.property_id,
          name: data.name,
          capacity: data.capacity,
          description: data.description,
          photos: data.photos || ['/images/hall/crystal-ballroom.jpg'],
          packages: data.packages || [],
        };
      }
    }
    return dataRepository.getHall();
  },

  async getEventLeads(): Promise<EventLead[]> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('event_leads')
        .select('*, halls(*)')
        .order('created_at', { ascending: false });
      if (!error && data) return data as EventLead[];
    }
    return dataRepository.getEventLeads();
  },

  async createEventLead(data: {
    contactName: string;
    contactPhone: string;
    contactEmail?: string;
    eventType: string;
    expectedGuests: number;
    seatingLayout?: string;
    setupNeeds?: string;
    notes?: string;
  }): Promise<EventLead> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data: hall } = await supabase.from('halls').select('id').limit(1).maybeSingle();
      const hallId = hall ? hall.id : 'd0000000-0000-0000-0000-000000000001';
      const reference = `EVT-AUR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      const { data: lead, error } = await supabase
        .from('event_leads')
        .insert({
          hall_id: hallId,
          hall_slot_id: null,
          contact_name: data.contactName,
          contact_phone: data.contactPhone,
          contact_email: data.contactEmail || null,
          event_type: data.eventType,
          expected_guests: data.expectedGuests,
          seating_layout: data.seatingLayout || null,
          setup_needs: data.setupNeeds || null,
          notes: data.notes || null,
          status: 'new',
          reference_code: reference,
        })
        .select('*, halls(*)')
        .single();

      if (!error && lead) return lead as EventLead;
    }
    return dataRepository.createEventLead(data);
  },

  async updateLeadStatus(
    leadId: string,
    updates: { status: EventLead['status']; quote_amount_minor?: number }
  ): Promise<EventLead | null> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('event_leads')
        .update(updates)
        .eq('id', leadId)
        .select('*, halls(*)')
        .single();
      if (!error && data) return data as EventLead;
    }
    const leads = dataRepository.getEventLeads();
    const found = leads.find((l) => l.id === leadId);
    if (found) {
      found.status = updates.status;
      if (updates.quote_amount_minor !== undefined) {
        found.quote_amount_minor = updates.quote_amount_minor;
      }
      return found;
    }
    return null;
  },
};
