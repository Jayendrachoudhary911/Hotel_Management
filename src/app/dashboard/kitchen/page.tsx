'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  ChefHat,
  Clock,
  RotateCw,
  CheckCircle2,
  AlertTriangle,
  UtensilsCrossed,
  BedDouble,
  Bike,
  Package,
  Search,
  Filter,
  Check,
  X,
  Play,
} from 'lucide-react';
import { dataRepository } from '@/lib/data/repository';
import type { Order, Outlet } from '@/lib/types';

export default function KitchenOrderBoardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [selectedOutlet, setSelectedOutlet] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = () => {
    setOrders(dataRepository.getOrders());
    setOutlets(dataRepository.getOutlets());
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = (orderId: string, nextStatus: Order['status'], reason?: string) => {
    dataRepository.updateOrderStatus(orderId, nextStatus, reason);
    loadData();
  };

  // Only active kitchen orders
  const activeOrders = useMemo(() => {
    return orders.filter((o) => {
      const isKitchenActive = ['new', 'accepted', 'preparing', 'ready'].includes(o.status);
      const matchesOutlet = selectedOutlet === 'all' || o.outlet_id === selectedOutlet;
      const matchesSource = sourceFilter === 'all' || o.order_type === sourceFilter;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        o.order_number.toLowerCase().includes(q) ||
        (o.table?.table_number && o.table.table_number.toLowerCase().includes(q)) ||
        (o.room_number && o.room_number.toLowerCase().includes(q));
      return isKitchenActive && matchesOutlet && matchesSource && matchesSearch;
    });
  }, [orders, selectedOutlet, sourceFilter, searchQuery]);

  const newOrders = activeOrders.filter((o) => o.status === 'new' || o.status === 'accepted');
  const preparingOrders = activeOrders.filter((o) => o.status === 'preparing');
  const readyOrders = activeOrders.filter((o) => o.status === 'ready');

  const getSourceIcon = (type: Order['order_type']) => {
    switch (type) {
      case 'dine_in':
        return <UtensilsCrossed className="w-3.5 h-3.5 text-[#8F6628]" />;
      case 'room_service':
        return <BedDouble className="w-3.5 h-3.5 text-[#B78A48]" />;
      case 'delivery':
        return <Bike className="w-3.5 h-3.5 text-[#4F0809]" />;
      case 'pickup':
        return <Package className="w-3.5 h-3.5 text-[#2E7D32]" />;
    }
  };

  const renderTicket = (order: Order) => {
    const isRoom = order.order_type === 'room_service';
    const destination = isRoom
      ? `Suite ${order.room_number || '201'}`
      : order.table?.table_number
      ? order.table.table_number
      : order.order_type === 'delivery'
      ? 'Online Delivery'
      : 'Counter Pickup';

    return (
      <div
        key={order.id}
        className="bg-white border border-[#E8DCD2] rounded-xl p-3 shadow-xs hover:shadow-md transition flex flex-col justify-between"
      >
        <div>
          {/* Ticket Header */}
          <div className="flex items-start justify-between gap-1 pb-2 mb-2 border-b border-[#E8DCD2]">
            <div>
              <span className="font-mono font-bold text-xs text-[#4F0809]">
                KOT #{order.order_number}
              </span>
              <div className="flex items-center gap-1 text-[10px] text-[#81736D] mt-0.5">
                <Clock className="w-3 h-3 text-[#B78A48]" />
                <span>
                  {new Date(order.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 capitalize text-[10px] font-semibold px-2 py-0.5 bg-[#F6EAE0] rounded text-[#302421]">
              {getSourceIcon((order.order_type || order.fulfilment_mode || 'dine_in') as any)}
              <span>{(order.order_type || order.fulfilment_mode || 'dine_in').replace('_', ' ')}</span>
            </div>
          </div>

          {/* Table / Room Banner */}
          <div className="px-2 py-1.5 rounded-lg bg-[#FBF6EF] border border-[#E8DCD2] mb-2.5 flex items-center justify-between">
            <span className="font-bold text-xs text-[#4F0809]">{destination}</span>
            <span className="text-[10px] text-[#81736D]">{order.outlet?.name || 'Restaurant'}</span>
          </div>

          {/* Items List */}
          <div className="space-y-1.5 mb-3">
            {((order.items || order.order_lines || []) as any[]).map((it, idx) => (
              <div key={idx} className="text-xs text-[#302421] border-b border-dashed border-[#E8DCD2]/60 pb-1">
                <div className="flex justify-between">
                  <span className="font-bold text-[#4F0809]">{it.quantity}x</span>
                  <span className="font-medium flex-1 ml-2">
                    {it.menu_item?.name || it.item_name_snapshot || 'Palace Specialty'}
                  </span>
                </div>
                {it.notes && (
                  <div className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded mt-0.5">
                    Note: {it.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-[#E8DCD2] flex items-center justify-between gap-1.5">
          {(order.status === 'new' || order.status === 'accepted') && (
            <button
              onClick={() => handleUpdateStatus(order.id, 'preparing')}
              className="w-full py-1.5 rounded-lg bg-[#4F0809] hover:bg-[#6B1518] text-white text-xs font-semibold flex items-center justify-center gap-1 shadow-xs transition"
            >
              <Play className="w-3.5 h-3.5 text-[#D8AA67]" />
              Start Cooking
            </button>
          )}

          {order.status === 'preparing' && (
            <button
              onClick={() => handleUpdateStatus(order.id, 'ready')}
              className="w-full py-1.5 rounded-lg bg-[#2E7D32] hover:bg-[#256629] text-white text-xs font-semibold flex items-center justify-center gap-1 shadow-xs transition"
            >
              <Check className="w-3.5 h-3.5" />
              Mark Ready at Pass
            </button>
          )}

          {order.status === 'ready' && (
            <div className="w-full py-1 rounded bg-[#2E7D32]/10 text-[#2E7D32] text-xs font-bold text-center">
              ✓ Ready for Steward Pickup
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#E8DCD2]">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#2E7D32] text-white text-[10px] font-bold uppercase tracking-wider">
              Live Kitchen Display System (KDS)
            </span>
            <span className="w-2 h-2 rounded-full bg-[#2E7D32] animate-pulse" />
          </div>
          <h1
            className="text-2xl font-bold text-[#4F0809] mt-0.5"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Royal Kitchen (KOT) Display
          </h1>
          <p className="text-xs text-[#81736D] mt-0.5">
            Real-time live queue for Head Chef, Sous Chefs, and Tandoor stations across all palace dining venues
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E8DCD2] bg-white text-[#4F0809] hover:bg-[#F6EAE0] text-xs font-medium shadow-xs transition"
          >
            <RotateCw className="w-3.5 h-3.5" />
            Refresh Queue
          </button>
        </div>
      </div>

      {/* ── Filter Controls Bar ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white border border-[#E8DCD2] rounded-xl p-3 shadow-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedOutlet}
            onChange={(e) => setSelectedOutlet(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-[#E8DCD2] text-xs bg-white font-medium focus:ring-1 focus:ring-[#4F0809] focus:outline-none"
          >
            <option value="all">All Palace Kitchens</option>
            {outlets.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name}
              </option>
            ))}
          </select>

          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-[#E8DCD2] text-xs bg-white focus:ring-1 focus:ring-[#4F0809] focus:outline-none"
          >
            <option value="all">All Order Channels</option>
            <option value="dine_in">Dine-in Tables</option>
            <option value="room_service">Suite Room Service</option>
            <option value="delivery">Online Delivery</option>
            <option value="pickup">Takeaway Pickup</option>
          </select>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#81736D]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search KOT #, table, or suite..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-[#E8DCD2] text-xs bg-[#FBF6EF]/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#4F0809]"
          />
        </div>
      </div>

      {/* ── 3-Column Kitchen Display Board ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Column 1: New / Accepted */}
        <div className="space-y-3">
          <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                New Tickets ({newOrders.length})
              </span>
            </div>
            <span className="text-[10px] text-amber-700">Awaiting prep</span>
          </div>

          <div className="space-y-3">
            {newOrders.length === 0 ? (
              <div className="p-8 text-center bg-white border border-[#E8DCD2] rounded-xl text-xs text-[#81736D]">
                No new pending tickets.
              </div>
            ) : (
              newOrders.map((ord) => renderTicket(ord))
            )}
          </div>
        </div>

        {/* Column 2: In Preparation */}
        <div className="space-y-3">
          <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                Cooking on Stoves ({preparingOrders.length})
              </span>
            </div>
            <span className="text-[10px] text-blue-700">In preparation</span>
          </div>

          <div className="space-y-3">
            {preparingOrders.length === 0 ? (
              <div className="p-8 text-center bg-white border border-[#E8DCD2] rounded-xl text-xs text-[#81736D]">
                No tickets currently cooking.
              </div>
            ) : (
              preparingOrders.map((ord) => renderTicket(ord))
            )}
          </div>
        </div>

        {/* Column 3: Ready at Pass */}
        <div className="space-y-3">
          <div className="p-2.5 bg-green-50 border border-green-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D32]" />
              <span className="text-xs font-bold text-green-900 uppercase tracking-wider">
                Ready at Pass ({readyOrders.length})
              </span>
            </div>
            <span className="text-[10px] text-green-700">For steward pickup</span>
          </div>

          <div className="space-y-3">
            {readyOrders.length === 0 ? (
              <div className="p-8 text-center bg-white border border-[#E8DCD2] rounded-xl text-xs text-[#81736D]">
                Pass is clear.
              </div>
            ) : (
              readyOrders.map((ord) => renderTicket(ord))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
