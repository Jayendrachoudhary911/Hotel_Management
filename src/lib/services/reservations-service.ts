import { getSupabaseClient } from './supabase-helper';
import { dataRepository } from '@/lib/data/repository';
import type { Reservation, ReservationStatus } from '@/lib/types';

export const reservationsService = {
  async getReservations(): Promise<Reservation[]> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('reservations')
        .select('*, guests(*), room_types(*), rooms(*)')
        .order('created_at', { ascending: false });
      if (!error && data) return data as Reservation[];
    }
    return dataRepository.getReservations();
  },

  async getReservationByReference(reference: string): Promise<Reservation | undefined> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('reservations')
        .select('*, guests(*), room_types(*), rooms(*)')
        .eq('reference_code', reference.toUpperCase())
        .maybeSingle();
      if (!error && data) return data as Reservation;
    }
    return dataRepository.getReservationByReference(reference);
  },

  async createReservation(data: {
    roomTypeId: string;
    checkIn: string;
    checkOut: string;
    partySize: number;
    guestName: string;
    guestPhone: string;
    guestEmail?: string;
    notes?: string;
  }): Promise<Reservation> {
    const supabase = getSupabaseClient();
    if (supabase) {
      // 1. Get or create guest
      let guestId: string | null = null;
      const { data: existingGuest } = await supabase
        .from('guests')
        .select('id')
        .eq('phone', data.guestPhone)
        .maybeSingle();

      if (existingGuest) {
        guestId = existingGuest.id;
      } else {
        const { data: newGuest } = await supabase
          .from('guests')
          .insert({
            name: data.guestName,
            phone: data.guestPhone,
            email: data.guestEmail || null,
          })
          .select('id')
          .single();
        if (newGuest) guestId = newGuest.id;
      }

      // 2. Fetch room type rate
      const { data: rt } = await supabase
        .from('room_types')
        .select('*')
        .eq('id', data.roomTypeId)
        .single();

      if (rt) {
        const startDate = new Date(data.checkIn);
        const endDate = new Date(data.checkOut);
        const nights = Math.max(1, Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
        const totalMinor = rt.base_rate_minor * nights;
        const depositMinor = Math.round(totalMinor * 0.2);
        const ref = `RES-AUR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

        const { data: res, error } = await supabase
          .from('reservations')
          .insert({
            property_id: rt.property_id,
            guest_id: guestId,
            room_type_id: data.roomTypeId,
            check_in: data.checkIn,
            check_out: data.checkOut,
            party_size: data.partySize,
            status: 'confirmed',
            total_amount_minor: totalMinor,
            deposit_amount_minor: depositMinor,
            balance_due_minor: totalMinor - depositMinor,
            reference_code: ref,
            notes: data.notes || null,
          })
          .select('*, guests(*), room_types(*)')
          .single();

        if (!error && res) return res as Reservation;
      }
    }

    return dataRepository.createReservation(data);
  },

  async updateReservationStatus(id: string, status: ReservationStatus): Promise<Reservation | null> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('reservations')
        .update({ status })
        .eq('id', id)
        .select('*, guests(*), room_types(*)')
        .single();
      if (!error && data) return data as Reservation;
    }
    return dataRepository.updateReservationStatus(id, status);
  },
};
