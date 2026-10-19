'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Utensils,
  Bike,
  Package,
  QrCode,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronRight,
  Eye,
  FileText,
  Printer,
  XCircle,
  Phone,
  MapPin,
  Calendar,
  Receipt,
  RotateCw,
} from 'lucide-react';
import { formatMoney } from '@/lib/utils/money';
import type { Order, OrderStatus, FulfilmentMode, OrderLine, ModifierSnapshot } from '@/lib/types';
import { Button } from '@/components/ui/button';

export default function DashboardOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModeTab, setActiveModeTab] = useState<'all' | 'dine_in' | 'pickup' | 'delivery' | 'pos'>('all');
  const [activeStatus, setActiveStatus] = useState<'all' | OrderStatus>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const loadOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success && Array.isArray(data.orders)) {
        setOrders(data.orders);
        if (selectedOrder) {
          const fresh = data.orders.find(
            (o: Order) => o.id === selectedOrder.id || o.order_number === selectedOrder.order_number
          );
          if (fresh) setSelectedOrder(fresh);
        }
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedOrder]);

  useEffect(() => {
    loadOrders();
  }, []);

  // Helper functions for order fields
  const getGuestName = (order: Order) => {
    if (order.pickup_name) return order.pickup_name;
    if (order.delivery_name) return order.delivery_name;
    if (order.table) return `Table ${order.table.table_number}`;
    return 'Walk-in Guest';
  };

  const getGuestPhone = (order: Order) => {
    return order.pickup_phone || order.delivery_phone || '';
  };

  // Counters
  const totalCount = orders.length;
  const qrCount = orders.filter((o) => o.fulfilment_mode === 'dine_in').length;
  const pickupCount = orders.filter((o) => o.fulfilment_mode === 'pickup').length;
  const deliveryCount = orders.filter((o) => o.fulfilment_mode === 'delivery').length;
  const posCount = orders.filter((o) => o.channel === 'pos').length;
  const activeCount = orders.filter((o) => ['new', 'accepted', 'preparing', 'ready'].includes(o.status)).length;

  // Filtered orders
  const filteredOrders = orders.filter((order) => {
    if (activeModeTab === 'pos') {
      if (order.channel !== 'pos') return false;
    } else if (activeModeTab !== 'all') {
      if (order.fulfilment_mode !== activeModeTab) return false;
    }

    if (activeStatus !== 'all' && order.status !== activeStatus) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const num = (order.order_number || order.id).toLowerCase();
      const guestName = getGuestName(order).toLowerCase();
      const guestPhone = getGuestPhone(order).toLowerCase();
      const table = (order.table?.table_number || '').toLowerCase();
      if (!num.includes(q) && !guestName.includes(q) && !guestPhone.includes(q) && !table.includes(q)) {
        return false;
      }
    }
    return true;
  });

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      // Optimistic update
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId || o.order_number === orderId ? { ...o, status: newStatus } : o
        )
      );
      if (selectedOrder && (selectedOrder.id === orderId || selectedOrder.order_number === orderId)) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
      }

      await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      await loadOrders();
    } catch (err) {
      console.error('Failed to update order status:', err);
      await loadOrders();
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'new':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-950/80 text-rose-300 border border-rose-600/50">New Order</span>;
      case 'accepted':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-300 border border-amber-600/50">Accepted</span>;
      case 'preparing':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-950/80 text-orange-300 border border-orange-600/50">In Kitchen</span>;
      case 'ready':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-950/80 text-blue-300 border border-blue-600/50">Ready</span>;
      case 'served':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-600/50">Served</span>;
      case 'out_for_delivery':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-950/80 text-purple-300 border border-purple-600/50">Out for Delivery</span>;
      case 'delivered':
      case 'collected':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-600/50">Fulfilled</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-950/80 text-red-300 border border-red-600/40">Cancelled</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-xs bg-gray-800 text-gray-300">{status}</span>;
    }
  };

  const getModeBadge = (order: Order) => {
    if (order.channel === 'pos') {
      return <span className="flex items-center text-xs text-blue-300 font-medium"><Receipt className="w-3.5 h-3.5 mr-1" /> POS Cashier</span>;
    }
    switch (order.fulfilment_mode) {
      case 'dine_in':
        return <span className="flex items-center text-xs text-[#E5C388] font-medium"><QrCode className="w-3.5 h-3.5 mr-1" /> Dine-In QR</span>;
      case 'pickup':
        return <span className="flex items-center text-xs text-amber-300 font-medium"><Package className="w-3.5 h-3.5 mr-1" /> Takeaway Pickup</span>;
      case 'delivery':
        return <span className="flex items-center text-xs text-emerald-300 font-medium"><Bike className="w-3.5 h-3.5 mr-1" /> Doorstep Delivery</span>;
      default:
        return <span className="text-xs text-gray-300">{order.fulfilment_mode}</span>;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#B08D57]">
            F&B Service Central
          </span>
          <h1 className="font-heritage text-2xl sm:text-3xl font-bold text-[#FAF8F3] mt-0.5">
            Orders Management Hub
          </h1>
          <p className="text-xs sm:text-sm text-[#A89E92] mt-1">
            Real-time fulfillment across Dine-in QR, Takeaway pickup, Doorstep delivery & POS counter.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={loadOrders}
            disabled={isLoading}
            className="border-[#3D352C] bg-[#241F1A] text-[#FAF8F3] hover:bg-[#3D352C] flex items-center gap-1.5"
          >
            <RotateCw className={`w-4 h-4 text-[#B08D57] ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* ── METRIC STAT CARDS ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="p-4 rounded-xl bg-[#241F1A] border border-[#3D352C] text-left">
          <span className="text-xs text-[#A89E92] block">Total Orders</span>
          <span className="text-xl sm:text-2xl font-bold font-mono text-[#FAF8F3] mt-1 block">
            {totalCount}
          </span>
          <span className="text-[10px] text-emerald-400 mt-1 block font-medium">All channels</span>
        </div>

        <div className="p-4 rounded-xl bg-[#241F1A] border border-[#3D352C] text-left">
          <span className="text-xs text-[#A89E92] block">Active In-Kitchen</span>
          <span className="text-xl sm:text-2xl font-bold font-mono text-amber-400 mt-1 block">
            {activeCount}
          </span>
          <span className="text-[10px] text-amber-300 mt-1 block font-medium">Pending fulfillment</span>
        </div>

        <div className="p-4 rounded-xl bg-[#241F1A] border border-[#3D352C] text-left">
          <span className="text-xs text-[#A89E92] block">Dine-in QR</span>
          <span className="text-xl sm:text-2xl font-bold font-mono text-[#E5C388] mt-1 block">
            {qrCount}
          </span>
          <span className="text-[10px] text-[#B08D57] mt-1 block font-medium">Table orders</span>
        </div>

        <div className="p-4 rounded-xl bg-[#241F1A] border border-[#3D352C] text-left">
          <span className="text-xs text-[#A89E92] block">Takeaway Pickup</span>
          <span className="text-xl sm:text-2xl font-bold font-mono text-amber-300 mt-1 block">
            {pickupCount}
          </span>
          <span className="text-[10px] text-amber-400 mt-1 block font-medium">Guest collection</span>
        </div>

        <div className="p-4 rounded-xl bg-[#241F1A] border border-[#3D352C] text-left">
          <span className="text-xs text-[#A89E92] block">Delivery & POS</span>
          <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 mt-1 block">
            {deliveryCount + posCount}
          </span>
          <span className="text-[10px] text-emerald-300 mt-1 block font-medium">Direct & external</span>
        </div>
      </div>

      {/* ── CHANNEL & FULFILMENT TABS ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#3D352C] pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All Orders', count: totalCount },
            { id: 'dine_in', label: 'Dine-In QR', count: qrCount, icon: QrCode },
            { id: 'pickup', label: 'Pickup', count: pickupCount, icon: Package },
            { id: 'delivery', label: 'Delivery', count: deliveryCount, icon: Bike },
            { id: 'pos', label: 'POS Counter', count: posCount, icon: Receipt },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeModeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveModeTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#670E10] text-[#FAF8F3] border border-[#B08D57]/60 shadow-md'
                    : 'bg-[#241F1A] text-[#A89E92] border border-transparent hover:border-[#3D352C] hover:text-[#FAF8F3]'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${isActive ? 'bg-[#FAF8F3]/20 text-[#FAF8F3]' : 'bg-[#1C1814] text-[#A89E92]'}`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Status filter dropdown pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'new', 'accepted', 'preparing', 'ready', 'served', 'delivered'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setActiveStatus(st as any)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium capitalize transition-all cursor-pointer ${
                activeStatus === st
                  ? 'bg-[#C59B63] text-[#4A0A0C] font-bold shadow'
                  : 'bg-[#1C1814] text-[#A89E92] hover:text-[#FAF8F3]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* ── SEARCH & ACTIVE CONTROLS ── */}
      <div className="flex items-center gap-3 bg-[#241F1A] p-3 rounded-xl border border-[#3D352C]">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#A89E92] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by order #, guest name, phone, or table number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1C1814] border border-[#3D352C] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#FAF8F3] placeholder-[#A89E92] focus:outline-none focus:border-[#B08D57]"
          />
        </div>
      </div>

      {/* ── ORDERS TABLE ── */}
      <div className="rounded-2xl border border-[#3D352C] bg-[#241F1A] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1C1814] text-[#B08D57] uppercase font-bold tracking-wider border-b border-[#3D352C]">
              <tr>
                <th className="py-3 px-4">Order Ref</th>
                <th className="py-3 px-4">Channel / Mode</th>
                <th className="py-3 px-4">Guest Info</th>
                <th className="py-3 px-4">Outlet</th>
                <th className="py-3 px-4">Items Summary</th>
                <th className="py-3 px-4">Amount &amp; Payment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3D352C]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#A89E92]">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const refCode = order.order_number || order.id.slice(0, 8);
                  const lines = order.order_lines || [];
                  const itemsCount = lines.reduce((sum, l) => sum + l.quantity, 0);
                  const itemsSummary = lines.map((l) => `${l.quantity}x ${l.item_name_snapshot}`).join(', ');

                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-[#2A2420] transition-colors cursor-pointer"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-[#FAF8F3] block">
                          {refCode}
                        </span>
                        <span className="text-[10px] text-[#A89E92]">
                          {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          {getModeBadge(order)}
                          {order.table && (
                            <span className="text-[11px] text-[#A89E92] block">
                              Table #{order.table.table_number}
                            </span>
                          )}
                          {order.delivery_address && (
                            <span className="text-[11px] text-[#A89E92] truncate max-w-[140px] block" title={order.delivery_address}>
                              {order.delivery_address}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-[#FAF8F3] block truncate max-w-[130px]">
                          {getGuestName(order)}
                        </span>
                        <span className="text-[10px] text-[#A89E92] block">
                          {getGuestPhone(order) || '—'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-[#D4CBBB]">
                        <span className="capitalize">{order.outlet_id ? 'Restaurant' : 'Café'}</span>
                      </td>

                      <td className="py-3.5 px-4 max-w-[200px]">
                        <span className="text-[11px] text-[#FAF8F3] line-clamp-1">
                          {itemsSummary || `${itemsCount} item(s)`}
                        </span>
                        <span className="text-[10px] text-[#A89E92]">
                          {itemsCount} item{itemsCount > 1 ? 's' : ''}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-bold text-[#E5C388] block font-mono">
                          {formatMoney(order.total_minor)}
                        </span>
                        <span className="text-[10px] text-emerald-400 capitalize">
                          {order.payments?.[0]?.payment_status || 'Paid via UPI'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {getStatusBadge(order.status)}
                      </td>

                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {order.status === 'new' && (
                            <Button
                              size="sm"
                              onClick={() => handleUpdateStatus(order.id, 'accepted')}
                              className="bg-amber-600 hover:bg-amber-700 text-white text-[11px] px-2.5 py-1"
                            >
                              Accept
                            </Button>
                          )}
                          {order.status === 'accepted' && (
                            <Button
                              size="sm"
                              onClick={() => handleUpdateStatus(order.id, 'preparing')}
                              className="bg-orange-600 hover:bg-orange-700 text-white text-[11px] px-2.5 py-1"
                            >
                              Cook
                            </Button>
                          )}
                          {order.status === 'preparing' && (
                            <Button
                              size="sm"
                              onClick={() => handleUpdateStatus(order.id, 'ready')}
                              className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] px-2.5 py-1"
                            >
                              Ready
                            </Button>
                          )}
                          {order.status === 'ready' && (
                            <Button
                              size="sm"
                              onClick={() => handleUpdateStatus(order.id, order.fulfilment_mode === 'delivery' ? 'out_for_delivery' : 'served')}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] px-2.5 py-1"
                            >
                              {order.fulfilment_mode === 'delivery' ? 'Dispatch' : 'Serve'}
                            </Button>
                          )}
                          {order.status === 'out_for_delivery' && (
                            <Button
                              size="sm"
                              onClick={() => handleUpdateStatus(order.id, 'delivered')}
                              className="bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] px-2.5 py-1"
                            >
                              Deliver
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedOrder(order)}
                            className="text-[#A89E92] hover:text-[#FAF8F3] p-1"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── SLIDE-OVER / MODAL: ORDER INSPECTOR ── */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-[#241F1A] border border-[#3D352C] p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#3D352C] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xl font-bold text-[#FAF8F3]">
                    {selectedOrder.order_number || selectedOrder.id}
                  </span>
                  {getStatusBadge(selectedOrder.status)}
                </div>
                <span className="text-xs text-[#A89E92] mt-1 block">
                  Received on {new Date(selectedOrder.created_at).toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-lg text-[#A89E92] hover:text-white hover:bg-[#3D352C]"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Fulfilment & Guest Card */}
            <div className="p-4 rounded-xl bg-[#1C1814] border border-[#3D352C] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#A89E92] uppercase font-bold tracking-wider">Mode</span>
                {getModeBadge(selectedOrder)}
              </div>
              {selectedOrder.table && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#A89E92]">Assigned Table:</span>
                  <span className="font-semibold text-[#FAF8F3]">Table #{selectedOrder.table.table_number}</span>
                </div>
              )}
              {selectedOrder.delivery_address && (
                <div className="text-xs space-y-1">
                  <span className="text-[#A89E92] block">Delivery Destination:</span>
                  <p className="font-medium text-[#FAF8F3] bg-[#2A2420] p-2 rounded border border-[#3D352C]/60 flex items-start gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{selectedOrder.delivery_address}</span>
                  </p>
                </div>
              )}
              <div className="pt-2 border-t border-[#2A2420] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[#A89E92] block text-[10px]">Guest Name</span>
                  <span className="font-semibold text-[#FAF8F3]">{getGuestName(selectedOrder)}</span>
                </div>
                {getGuestPhone(selectedOrder) && (
                  <div className="text-right">
                    <span className="text-[#A89E92] block text-[10px]">Contact</span>
                    <a href={`tel:${getGuestPhone(selectedOrder)}`} className="text-[#B08D57] hover:underline flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      <span>{getGuestPhone(selectedOrder)}</span>
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Itemized Lines */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#B08D57]">
                Order Items &amp; Modifiers
              </h4>
              <div className="divide-y divide-[#3D352C] border-y border-[#3D352C]">
                {(selectedOrder.order_lines || []).map((line: OrderLine, idx: number) => (
                  <div key={idx} className="py-2.5 flex items-start justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#FAF8F3]">{line.quantity}x</span>
                        <span className="font-medium text-[#FAF8F3]">{line.item_name_snapshot}</span>
                      </div>
                      {line.modifiers_snapshot && line.modifiers_snapshot.length > 0 && (
                        <div className="text-[11px] text-[#A89E92] pl-5 mt-0.5 space-y-0.5">
                          {line.modifiers_snapshot.map((m: ModifierSnapshot, mIdx: number) => (
                            <span key={mIdx} className="block">• {m.name} (+{formatMoney(m.price_minor)})</span>
                          ))}
                        </div>
                      )}
                      {line.notes && (
                        <p className="text-[11px] text-amber-300 italic pl-5 mt-0.5">
                          Note: {line.notes}
                        </p>
                      )}
                    </div>
                    <span className="font-mono text-[#E5C388] font-semibold">
                      {formatMoney(line.line_total_minor)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bill & Tax Breakdown */}
            <div className="p-4 rounded-xl bg-[#1C1814] border border-[#3D352C] space-y-2 text-xs">
              <div className="flex justify-between text-[#A89E92]">
                <span>Subtotal</span>
                <span className="font-mono text-[#FAF8F3]">{formatMoney(selectedOrder.subtotal_minor)}</span>
              </div>
              <div className="flex justify-between text-[#A89E92]">
                <span>Food GST (5%)</span>
                <span className="font-mono text-[#FAF8F3]">{formatMoney(selectedOrder.tax_minor)}</span>
              </div>
              {selectedOrder.delivery_fee_minor ? (
                <div className="flex justify-between text-[#A89E92]">
                  <span>Doorstep Delivery Fee</span>
                  <span className="font-mono text-[#FAF8F3]">{formatMoney(selectedOrder.delivery_fee_minor)}</span>
                </div>
              ) : null}
              <div className="pt-2 border-t border-[#3D352C] flex justify-between text-sm font-bold text-[#E5C388]">
                <span>Total Amount</span>
                <span className="font-mono text-base">{formatMoney(selectedOrder.total_minor)}</span>
              </div>
              <div className="pt-1 flex items-center justify-between text-[11px] text-emerald-400">
                <span>Payment Settlement:</span>
                <span className="font-semibold uppercase">{selectedOrder.payments?.[0]?.payment_status || 'Paid via UPI'}</span>
              </div>
            </div>

            {/* Actions in Modal */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                className="border-[#3D352C] text-[#FAF8F3] hover:bg-[#3D352C] flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4 text-[#B08D57]" />
                <span>Print Invoice</span>
              </Button>

              <div className="flex items-center gap-2">
                {selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'delivered' && selectedOrder.status !== 'served' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'cancelled')}
                    className="text-rose-400 hover:bg-rose-950/60"
                  >
                    Cancel Order
                  </Button>
                )}
                {selectedOrder.status === 'new' && (
                  <Button
                    size="sm"
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'accepted')}
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    Accept Order
                  </Button>
                )}
                {selectedOrder.status === 'accepted' && (
                  <Button
                    size="sm"
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'preparing')}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    Send to Kitchen
                  </Button>
                )}
                {selectedOrder.status === 'preparing' && (
                  <Button
                    size="sm"
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'ready')}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Mark Ready
                  </Button>
                )}
                {selectedOrder.status === 'ready' && (
                  <Button
                    size="sm"
                    onClick={() => handleUpdateStatus(selectedOrder.id, selectedOrder.fulfilment_mode === 'delivery' ? 'out_for_delivery' : 'served')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    {selectedOrder.fulfilment_mode === 'delivery' ? 'Out for Delivery' : 'Mark Served'}
                  </Button>
                )}
                {selectedOrder.status === 'out_for_delivery' && (
                  <Button
                    size="sm"
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'delivered')}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white"
                  >
                    Mark Delivered
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
