'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { dataRepository } from '@/lib/data/repository';
import type { Room, HousekeepingState } from '@/lib/types';
import { BedDouble, Sparkles, AlertCircle, Wrench, CheckCircle2, RotateCw } from 'lucide-react';

export default function RoomsHousekeepingPage() {
  const [rooms, setRooms] = useState<Room[]>(dataRepository.getRooms());
  const [filterState, setFilterState] = useState<string>('all');

  const handleStateChange = (roomId: string, newState: HousekeepingState) => {
    dataRepository.updateRoomHousekeeping(roomId, newState);
    setRooms([...dataRepository.getRooms()]);
  };

  const filteredRooms = rooms.filter((r) => {
    if (filterState === 'all') return true;
    return r.housekeeping_state === filterState;
  });

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#3D352C]">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#670E10] text-white text-[11px] font-bold border border-[#B08D57]/40">
              Housekeeping & Chambers
            </span>
            <span className="text-xs text-[#B08D57] font-semibold">Live Room States</span>
          </div>
          <h1 className="font-heritage text-2xl sm:text-3xl font-bold text-[#FAF8F3]">
            Chamber Housekeeping Board
          </h1>
          <p className="text-xs text-[#9A8E7F] mt-1">
            Real-time turnover tracking, cleaning inspection & maintenance logs
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(['all', 'available', 'occupied', 'dirty', 'cleaning', 'maintenance'] as const).map(
            (st) => (
              <button
                key={st}
                onClick={() => setFilterState(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                  filterState === st
                    ? 'bg-[#670E10] text-white border border-[#B08D57]'
                    : 'bg-[#2A2420] text-[#D4CBBB] hover:text-white'
                }`}
              >
                {st}
              </button>
            )
          )}
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRooms.map((room) => {
          const state = room.housekeeping_state;

          const getBadgeVariant = () => {
            if (state === 'available') return 'emerald';
            if (state === 'occupied') return 'gold';
            if (state === 'dirty') return 'rose';
            if (state === 'cleaning') return 'amber';
            return 'slate';
          };

          return (
            <div
              key={room.id}
              className={`p-5 rounded-2xl flex flex-col justify-between border-2 transition-all shadow-sm ${
                state === 'dirty'
                  ? 'border-[#9B2226] bg-[#341618]'
                  : state === 'cleaning'
                  ? 'border-[#B08D57] bg-[#2E2419]'
                  : 'border-[#3D352C] bg-[#241F1A]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#3D352C]">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xl font-bold text-[#FAF8F3]">
                      Room {room.room_number}
                    </span>
                  </div>
                  <Badge size="sm" variant={getBadgeVariant()}>
                    {state}
                  </Badge>
                </div>

                <div className="space-y-1 mb-4 text-xs text-[#D4CBBB]">
                  <span className="text-[#FAF8F3] font-bold block">
                    {room.room_type?.name || 'Deluxe Chamber'}
                  </span>
                  {room.notes && (
                    <span className="text-[#C9A96E] text-[11px] block bg-[#1C1814] p-2 rounded-lg border border-[#3D352C]">
                      Staff Note: {room.notes}
                    </span>
                  )}
                </div>
              </div>

              {/* Quick Action Buttons for State Transitions */}
              <div className="pt-3 border-t border-[#3D352C] flex flex-wrap gap-2">
                {state !== 'available' && (
                  <Button
                    size="sm"
                    className="bg-[#2D6A4F] hover:bg-[#1E4835] text-white text-[11px] px-2.5 py-1"
                    onClick={() => handleStateChange(room.id, 'available')}
                  >
                    Mark Clean
                  </Button>
                )}

                {state !== 'cleaning' && state !== 'occupied' && (
                  <Button
                    size="sm"
                    variant="gold"
                    className="text-[11px] px-2.5 py-1"
                    onClick={() => handleStateChange(room.id, 'cleaning')}
                  >
                    Set Cleaning
                  </Button>
                )}

                {state !== 'dirty' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-[#9B2226] hover:bg-[#9B2226]/20 text-[11px] px-2.5 py-1"
                    onClick={() => handleStateChange(room.id, 'dirty')}
                  >
                    Mark Dirty
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
