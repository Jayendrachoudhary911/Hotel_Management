import { getSupabaseClient, isSupabaseConfigured } from './supabase-helper';
import { dataRepository } from '@/lib/data/repository';
import type { Room, RoomType, HousekeepingState, AvailabilityResult } from '@/lib/types';

export const roomsService = {
  async getRoomTypes(): Promise<RoomType[]> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('room_types')
        .select('*')
        .eq('is_active', true);
      if (!error && data) return data as RoomType[];
    }
    return dataRepository.getRoomTypes();
  },

  async getRooms(): Promise<Room[]> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('rooms')
        .select('*, room_types(*)');
      if (!error && data) {
        return data.map((r: any) => ({
          id: r.id,
          room_type_id: r.room_type_id,
          room_number: r.room_number,
          housekeeping_state: r.housekeeping_state as HousekeepingState,
          notes: r.notes,
          room_type: r.room_types,
        }));
      }
    }
    return dataRepository.getRooms();
  },

  async addRoom(roomData: {
    room_number: string;
    room_type_id: string;
    housekeeping_state: HousekeepingState;
    notes?: string | null;
  }): Promise<Room> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('rooms')
        .insert({
          room_number: roomData.room_number,
          room_type_id: roomData.room_type_id,
          housekeeping_state: roomData.housekeeping_state,
          notes: roomData.notes || null,
        })
        .select('*, room_types(*)')
        .single();
      if (!error && data) {
        return {
          id: data.id,
          room_type_id: data.room_type_id,
          room_number: data.room_number,
          housekeeping_state: data.housekeeping_state,
          notes: data.notes,
          room_type: data.room_types,
        };
      }
    }
    return dataRepository.addRoom(roomData);
  },

  async updateRoomHousekeeping(roomId: string, state: HousekeepingState): Promise<Room | null> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('rooms')
        .update({ housekeeping_state: state })
        .eq('id', roomId)
        .select('*, room_types(*)')
        .single();
      if (!error && data) {
        return {
          id: data.id,
          room_type_id: data.room_type_id,
          room_number: data.room_number,
          housekeeping_state: data.housekeeping_state,
          notes: data.notes,
          room_type: data.room_types,
        };
      }
    }
    return dataRepository.updateRoomHousekeeping(roomId, state);
  },

  async searchAvailability(checkIn: string, checkOut: string, guests: number): Promise<AvailabilityResult[]> {
    return dataRepository.searchAvailability(checkIn, checkOut, guests);
  },
};
