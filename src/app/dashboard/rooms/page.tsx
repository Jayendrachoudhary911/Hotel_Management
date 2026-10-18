'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { dataRepository } from '@/lib/data/repository';
import type { Room, HousekeepingState, RoomType } from '@/lib/types';
import {
  BedDouble,
  Sparkles,
  AlertCircle,
  Wrench,
  CheckCircle2,
  RotateCw,
  Plus,
  Building,
  ClipboardList,
} from 'lucide-react';

export default function RoomsHousekeepingPage() {
  const [rooms, setRooms] = useState<Room[]>(dataRepository.getRooms());
  const [roomTypes] = useState<RoomType[]>(dataRepository.getRoomTypes());
  const [filterState, setFilterState] = useState<string>('all');

  // Add room modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newRoomNumber, setNewRoomNumber] = useState('');
  const [newRoomTypeId, setNewRoomTypeId] = useState(roomTypes[0]?.id || '');
  const [newRoomState, setNewRoomState] = useState<HousekeepingState>('available');
  const [newRoomNotes, setNewRoomNotes] = useState('');

  const refreshRooms = () => {
    setRooms([...dataRepository.getRooms()]);
  };

  const handleStateChange = (roomId: string, newState: HousekeepingState) => {
    dataRepository.updateRoomHousekeeping(roomId, newState);
    refreshRooms();
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomNumber || !newRoomTypeId) return;

    dataRepository.addRoom({
      room_number: newRoomNumber,
      room_type_id: newRoomTypeId,
      housekeeping_state: newRoomState,
      notes: newRoomNotes || null,
    });

    setIsAddModalOpen(false);
    setNewRoomNumber('');
    setNewRoomNotes('');
    refreshRooms();
  };

  const filteredRooms = rooms.filter((r) => {
    if (filterState === 'all') return true;
    return r.housekeeping_state === filterState;
  });

  // Metric counts
  const availableCount = rooms.filter((r) => r.housekeeping_state === 'available').length;
  const occupiedCount = rooms.filter((r) => r.housekeeping_state === 'occupied').length;
  const dirtyCount = rooms.filter((r) => r.housekeeping_state === 'dirty').length;
  const cleaningCount = rooms.filter((r) => r.housekeeping_state === 'cleaning').length;
  const maintCount = rooms.filter((r) => r.housekeeping_state === 'maintenance').length;

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#3D352C]">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#670E10] text-white text-[11px] font-bold border border-[#B08D57]/40">
              Housekeeping &amp; Chambers
            </span>
            <span className="text-xs text-[#B08D57] font-semibold">Live Room States &amp; Inventory</span>
          </div>
          <h1 className="font-heritage text-2xl sm:text-3xl font-bold text-[#FAF8F3]">
            Chamber Housekeeping Board
          </h1>
          <p className="text-xs text-[#9A8E7F] mt-1">
            Real-time turnover tracking, cleaning inspection &amp; maintenance logs for all suites.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#C9A96E] hover:bg-[#B08D57] text-[#241F1A] font-bold text-xs px-4 py-2 rounded-xl flex items-center space-x-1.5 shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Add Chamber / Room</span>
          </Button>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-[#241F1A] p-3 rounded-xl border border-[#3D352C]">
          <span className="text-[11px] text-[#9A8E7F] block">Total Chambers</span>
          <span className="text-xl font-bold text-[#FAF8F3] font-mono">{rooms.length}</span>
        </div>
        <div className="bg-[#241F1A] p-3 rounded-xl border border-emerald-900/40">
          <span className="text-[11px] text-emerald-400 block">Clean &amp; Ready</span>
          <span className="text-xl font-bold text-emerald-400 font-mono">{availableCount}</span>
        </div>
        <div className="bg-[#241F1A] p-3 rounded-xl border border-[#B08D57]/40">
          <span className="text-[11px] text-[#B08D57] block">Occupied</span>
          <span className="text-xl font-bold text-[#B08D57] font-mono">{occupiedCount}</span>
        </div>
        <div className="bg-[#241F1A] p-3 rounded-xl border border-amber-900/40">
          <span className="text-[11px] text-amber-400 block">In Cleaning</span>
          <span className="text-xl font-bold text-amber-400 font-mono">{cleaningCount}</span>
        </div>
        <div className="bg-[#241F1A] p-3 rounded-xl border border-rose-900/40">
          <span className="text-[11px] text-rose-400 block">Dirty / Turnover</span>
          <span className="text-xl font-bold text-rose-400 font-mono">{dirtyCount}</span>
        </div>
      </div>

      {/* Filter Tabs */}
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
                  {room.notes ? (
                    <span className="text-[#C9A96E] text-[11px] block bg-[#1C1814] p-2 rounded-lg border border-[#3D352C]">
                      Staff Note: {room.notes}
                    </span>
                  ) : (
                    <span className="text-[#9A8E7F] text-[11px] block italic">
                      No maintenance notes.
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

                {state !== 'maintenance' && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-[#9A8E7F] hover:text-[#FAF8F3] text-[11px] px-2 py-1"
                    onClick={() => handleStateChange(room.id, 'maintenance')}
                  >
                    Maintenance
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── MODAL: ADD CHAMBER / ROOM ── */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Physical Chamber / Room"
      >
        <form onSubmit={handleCreateRoom} className="space-y-4 text-left">
          <p className="text-xs text-[#9A8E7F]">
            Register a new physical room number and bind it to a heritage room suite type.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#D4CBBB]">Room Number *</label>
              <Input
                required
                placeholder="e.g. 107 or 204"
                value={newRoomNumber}
                onChange={(e) => setNewRoomNumber(e.target.value)}
                className="bg-[#1C1814] border-[#3D352C] text-[#FAF8F3]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#D4CBBB]">Heritage Suite Type *</label>
              <select
                required
                value={newRoomTypeId}
                onChange={(e) => setNewRoomTypeId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#1C1814] text-[#FAF8F3] rounded-lg border border-[#3D352C] focus:outline-none focus:border-[#B08D57]"
              >
                {roomTypes.map((rt) => (
                  <option key={rt.id} value={rt.id}>
                    {rt.name} (Cap: {rt.capacity})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#D4CBBB]">Initial Housekeeping Status</label>
            <select
              value={newRoomState}
              onChange={(e) => setNewRoomState(e.target.value as HousekeepingState)}
              className="w-full px-3 py-2 text-xs bg-[#1C1814] text-[#FAF8F3] rounded-lg border border-[#3D352C] focus:outline-none focus:border-[#B08D57]"
            >
              <option value="available">Available (Clean &amp; Inspected)</option>
              <option value="cleaning">In Cleaning</option>
              <option value="dirty">Dirty (Turnover Required)</option>
              <option value="maintenance">Under Maintenance</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#D4CBBB]">Housekeeping / Chamber Notes</label>
            <Input
              placeholder="e.g. Balcony facing Lake Pichola, fresh floral arrangement requested"
              value={newRoomNotes}
              onChange={(e) => setNewRoomNotes(e.target.value)}
              className="bg-[#1C1814] border-[#3D352C] text-[#FAF8F3]"
            />
          </div>

          <div className="pt-4 border-t border-[#3D352C] flex items-center justify-end space-x-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsAddModalOpen(false)}
              className="text-xs text-[#9A8E7F]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#670E10] hover:bg-[#821215] text-white text-xs font-bold px-4 py-2"
            >
              Save Chamber
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
