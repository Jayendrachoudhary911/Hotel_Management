'use client';

import React, { useState, useMemo } from 'react';
import { formatMoney } from '@/lib/utils/money';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import type { Reservation, Room } from '@/lib/types';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
  Phone,
  BedDouble,
  LogIn,
  LogOut,
  AlertCircle,
} from 'lucide-react';

interface TapeChartProps {
  reservations: Reservation[];
  rooms: Room[];
  onCheckIn?: (res: Reservation, roomId?: string) => void;
  onCheckOut?: (res: Reservation) => void;
  onRefresh?: () => void;
}

export function TapeChart({
  reservations,
  rooms,
  onCheckIn,
  onCheckOut,
  onRefresh,
}: TapeChartProps) {
  const [startDate, setStartDate] = useState<Date>(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null);

  // Generate 14 days from startDate
  const days = useMemo(() => {
    const arr: Date[] = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      arr.push(d);
    }
    return arr;
  }, [startDate]);

  const todayStr = useMemo(() => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }, []);

  const formatDateStr = (d: Date) => d.toISOString().split('T')[0];

  const handlePrev7Days = () => {
    setStartDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 7);
      return d;
    });
  };

  const handleNext7Days = () => {
    setStartDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 7);
      return d;
    });
  };

  const handleToday = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    setStartDate(d);
  };

  // Unassigned reservations (room_id is null)
  const unassignedReservations = useMemo(() => {
    return reservations.filter(
      (r) => !r.room_id && r.status !== 'cancelled' && r.status !== 'checked_out'
    );
  }, [reservations]);

  // Sort rooms by room_number
  const sortedRooms = useMemo(() => {
    return [...rooms].sort((a, b) => a.room_number.localeCompare(b.room_number, undefined, { numeric: true }));
  }, [rooms]);

  // Map of dateStr -> reservation for each room
  // Check if a room is occupied on dateStr
  const getReservationForRoomDate = (roomId: string, dateStr: string) => {
    return reservations.find((r) => {
      if (r.status === 'cancelled') return false;
      if (r.room_id !== roomId) return false;
      const inDate = r.check_in;
      const outDate = r.check_out;
      return dateStr >= inDate && dateStr < outDate;
    });
  };

  return (
    <div className="space-y-6">
      {/* Tape Chart Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#241F1A] border border-[#3D352C]">
        <div className="flex items-center space-x-3">
          <Calendar className="w-5 h-5 text-[#B08D57]" />
          <div>
            <h3 className="font-heritage text-lg font-bold text-[#FAF8F3]">
              14-Day Room Tape Chart &amp; Visual Grid
            </h3>
            <p className="text-xs text-[#9A8E7F]">
              Live chamber occupancy, turnover status, and stay timelines
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handlePrev7Days}
            className="text-xs text-[#FAF8F3] border-[#3D352C] hover:bg-[#2A2420]"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> -7 Days
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={handleToday}
            className="text-xs font-bold"
          >
            Today
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleNext7Days}
            className="text-xs text-[#FAF8F3] border-[#3D352C] hover:bg-[#2A2420]"
          >
            +7 Days <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Legend & Summary */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-[#9A8E7F] px-1">
        <span className="font-semibold text-[#FAF8F3]">Legend:</span>
        <div className="flex items-center space-x-1.5">
          <span className="w-3.5 h-3.5 rounded bg-emerald-600/80 border border-emerald-400 inline-block" />
          <span className="text-[#FAF8F3]">In-House / Checked In</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-3.5 h-3.5 rounded bg-amber-600/80 border border-amber-400 inline-block" />
          <span className="text-[#FAF8F3]">Confirmed / Arriving</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-3.5 h-3.5 rounded bg-sky-700/80 border border-sky-400 inline-block" />
          <span className="text-[#FAF8F3]">Departed / Checked Out</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-3.5 h-3.5 rounded bg-[#2A2420] border border-[#3D352C] inline-block" />
          <span className="text-[#9A8E7F]">Vacant / Available</span>
        </div>
      </div>

      {/* Unassigned Reservations Callout (If any) */}
      {unassignedReservations.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-600/50 text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-amber-100">
                {unassignedReservations.length} Unassigned Reservation(s) Need Chamber Assignment:
              </p>
              <div className="flex flex-wrap gap-2 mt-1">
                {unassignedReservations.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRes(r)}
                    className="text-[11px] px-2 py-0.5 rounded bg-amber-900/80 border border-amber-500 hover:bg-amber-800 transition-colors cursor-pointer text-amber-100 font-mono"
                  >
                    {r.reference_code} &bull; {r.guest?.name} ({r.room_type?.name})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid Matrix Table */}
      <div className="rounded-2xl bg-[#241F1A] border border-[#3D352C] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-[#1C1814] text-[#B08D57] border-b border-[#3D352C]">
                {/* Room column header */}
                <th className="py-3 px-4 font-heritage font-bold text-xs sticky left-0 bg-[#1C1814] z-10 w-48 min-w-48 border-r border-[#3D352C]">
                  Chamber / Room
                </th>

                {/* 14 Date headers */}
                {days.map((d) => {
                  const dStr = formatDateStr(d);
                  const isToday = dStr === todayStr;
                  const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
                  const dayNum = d.getDate();
                  const monthName = d.toLocaleDateString('en-US', { month: 'short' });

                  return (
                    <th
                      key={dStr}
                      className={`py-2 px-1 text-center font-medium border-r border-[#3D352C] min-w-[70px] ${
                        isToday ? 'bg-[#670E10]/40 text-[#FAF8F3] font-bold ring-1 ring-[#B08D57]' : 'text-[#FAF8F3]'
                      }`}
                    >
                      <div className="text-[10px] text-[#9A8E7F] uppercase">{dayName}</div>
                      <div className="text-xs font-bold">{dayNum} {monthName}</div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody className="divide-y divide-[#3D352C]">
              {sortedRooms.map((room) => {
                const hk = room.housekeeping_state;
                return (
                  <tr key={room.id} className="hover:bg-[#2A2420]/50 transition-colors h-14">
                    {/* Room label sticky cell */}
                    <td className="py-2 px-4 sticky left-0 bg-[#241F1A] z-10 border-r border-[#3D352C] whitespace-nowrap">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center space-x-2">
                          <BedDouble className="w-4 h-4 text-[#B08D57] shrink-0" />
                          <div>
                            <span className="font-bold text-[#FAF8F3] text-sm block">
                              Room {room.room_number}
                            </span>
                            <span className="text-[10px] text-[#9A8E7F] truncate max-w-[110px] block">
                              {room.room_type?.name || 'Heritage Suite'}
                            </span>
                          </div>
                        </div>

                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-bold shrink-0 ${
                            hk === 'available'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-700'
                              : hk === 'occupied'
                              ? 'bg-rose-950 text-rose-400 border border-rose-700'
                              : hk === 'dirty'
                              ? 'bg-amber-950 text-amber-400 border border-amber-700'
                              : 'bg-stone-900 text-stone-400 border border-stone-700'
                          }`}
                        >
                          {hk}
                        </span>
                      </div>
                    </td>

                    {/* Date cells */}
                    {days.map((d) => {
                      const dStr = formatDateStr(d);
                      const isToday = dStr === todayStr;
                      const res = getReservationForRoomDate(room.id, dStr);

                      if (!res) {
                        return (
                          <td
                            key={dStr}
                            className={`p-1 border-r border-[#3D352C] text-center ${
                              isToday ? 'bg-[#670E10]/10' : ''
                            }`}
                          >
                            <span className="text-[10px] text-[#3D352C]">&bull;</span>
                          </td>
                        );
                      }

                      // Check if this date is the check_in date or the start of visible range
                      const isFirstDay = dStr === res.check_in || dStr === formatDateStr(days[0]);
                      const isCheckedIn = res.status === 'checked_in';
                      const isConfirmed = res.status === 'confirmed';

                      return (
                        <td
                          key={dStr}
                          onClick={() => setSelectedRes(res)}
                          className={`p-1 border-r border-[#3D352C] cursor-pointer transition-opacity hover:opacity-90 ${
                            isToday ? 'bg-[#670E10]/20' : ''
                          }`}
                        >
                          <div
                            className={`h-10 rounded px-1.5 py-1 text-[10px] font-semibold truncate flex flex-col justify-center border shadow-xs ${
                              isCheckedIn
                                ? 'bg-emerald-900/80 border-emerald-500 text-emerald-100'
                                : isConfirmed
                                ? 'bg-amber-900/80 border-amber-500 text-amber-100'
                                : 'bg-sky-900/80 border-sky-500 text-sky-100'
                            }`}
                          >
                            {isFirstDay ? (
                              <>
                                <span className="font-bold truncate">
                                  {res.guest?.name || 'Guest'}
                                </span>
                                <span className="text-[9px] opacity-80 truncate font-mono">
                                  {res.reference_code}
                                </span>
                              </>
                            ) : (
                              <span className="opacity-70 text-center font-bold">&bull;&bull;&bull;</span>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reservation Details Drawer Modal */}
      {selectedRes && (
        <Modal
          isOpen={!!selectedRes}
          onClose={() => setSelectedRes(null)}
          title={`Reservation ${selectedRes.reference_code}`}
        >
          <div className="space-y-4 text-xs text-[#241F1A]">
            <div className="p-4 rounded-xl bg-[#FAF8F3] border border-[#D4CBBB] space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-heritage text-lg font-bold text-[#670E10]">
                    {selectedRes.guest?.name || 'Walk-in Guest'}
                  </h4>
                  <div className="flex items-center space-x-2 text-[#6B6155] mt-1">
                    <Phone className="w-3.5 h-3.5 text-[#8F7245]" />
                    <span>{selectedRes.guest?.phone}</span>
                  </div>
                </div>
                <Badge
                  variant={
                    selectedRes.status === 'checked_in'
                      ? 'emerald'
                      : selectedRes.status === 'confirmed'
                      ? 'gold'
                      : 'slate'
                  }
                >
                  {selectedRes.status.replace('_', ' ')}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-[#FAF8F3] border border-[#D4CBBB]">
                <span className="text-[#6B6155] block font-medium">Assigned Room:</span>
                <span className="font-bold text-[#241F1A] text-sm">
                  {selectedRes.room?.room_number ? `Room ${selectedRes.room.room_number}` : 'Unassigned'}
                </span>
                <span className="text-[11px] text-[#8F7245] block">
                  {selectedRes.room_type?.name}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-[#FAF8F3] border border-[#D4CBBB]">
                <span className="text-[#6B6155] block font-medium">Tariff Rate:</span>
                <span className="font-bold text-[#670E10] text-sm font-mono">
                  {formatMoney(selectedRes.rate_snapshot_minor)}
                </span>
                <span className="text-[11px] text-[#6B6155] block">
                  {selectedRes.party_size} Guests
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#FAF8F3] border border-[#D4CBBB] space-y-1">
              <div className="flex justify-between">
                <span className="text-[#6B6155]">Check-In Date:</span>
                <span className="font-bold text-[#241F1A]">{selectedRes.check_in}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B6155]">Check-Out Date:</span>
                <span className="font-bold text-[#241F1A]">{selectedRes.check_out}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-2 border-t border-[#D4CBBB] flex flex-wrap gap-2 justify-end">
              {selectedRes.status === 'confirmed' && (
                <Button
                  size="sm"
                  variant="gold"
                  onClick={() => {
                    if (onCheckIn) onCheckIn(selectedRes, selectedRes.room_id || undefined);
                    setSelectedRes(null);
                  }}
                  className="flex items-center space-x-1"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Check In Guest</span>
                </Button>
              )}

              {selectedRes.status === 'checked_in' && (
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => {
                    if (onCheckOut) onCheckOut(selectedRes);
                    setSelectedRes(null);
                  }}
                  className="flex items-center space-x-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Check Out Guest</span>
                </Button>
              )}

              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedRes(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
