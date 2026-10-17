'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatMoney } from '@/lib/utils/money';
import { dataRepository } from '@/lib/data/repository';
import type { Order } from '@/lib/types';
import {
  ChefHat,
  Clock,
  RotateCw,
  CheckCircle2,
  AlertTriangle,
  Utensils,
  ArrowRight,
} from 'lucide-react';

export default function KitchenOrderBoardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOutlet, setSelectedOutlet] = useState<string>('all');
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const loadOrders = () => {
    const all = dataRepository.getOrders();
    setOrders([...all]);
  };

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (orderId: string, nextStatus: Order['status']) => {
    setIsUpdating(orderId);
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      dataRepository.updateOrderStatus(orderId, nextStatus);
      loadOrders();
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (selectedOutlet !== 'all' && o.outlet_id !== selectedOutlet) return false;
    return ['new', 'accepted', 'preparing', 'ready'].includes(o.status);
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#3D352C]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#670E10] text-white text-[11px] font-bold border border-[#B08D57]/40">
              Kitchen Display System (KDS)
            </span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          <h1 className="font-heritage text-2xl sm:text-3xl font-bold text-[#FAF8F3] mt-1">
            Royal Khansama Kitchen Display
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={selectedOutlet}
            onChange={(e) => setSelectedOutlet(e.target.value)}
            className="bg-[#2A2420] border border-[#3D352C] rounded-xl px-3 py-2 text-xs text-[#FAF8F3] focus:outline-none focus:border-[#B08D57]"
          >
            <option value="all">All Culinary Outlets</option>
            <option value="b0000000-0000-0000-0000-000000000001">Saffron &amp; Spice</option>
            <option value="b0000000-0000-0000-0000-000000000002">The Courtyard Cafe</option>
          </select>

          <Button size="sm" variant="secondary" onClick={loadOrders}>
            <RotateCw className="w-3.5 h-3.5 mr-1.5" /> Refresh
          </Button>
        </div>
      </div>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <div className="p-16 text-center rounded-2xl bg-[#241F1A] border border-[#3D352C]">
          <ChefHat className="w-12 h-12 text-[#8F7245] mx-auto mb-4" />
          <h3 className="font-heritage text-lg font-bold text-[#FAF8F3] mb-1">Kitchen Queue Clear</h3>
          <p className="text-xs text-[#9A8E7F]">All incoming royal orders have been prepared and dispatched.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order) => {
            const isCooking = order.status === 'preparing';
            const isReady = order.status === 'ready';

            return (
              <div
                key={order.id}
                className={`p-5 rounded-2xl flex flex-col justify-between border-2 transition-all shadow-md ${
                  isReady
                    ? 'border-emerald-600 bg-[#1E382B]'
                    : isCooking
                    ? 'border-[#B08D57] bg-[#2E2419]'
                    : 'border-[#3D352C] bg-[#241F1A]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#3D352C] mb-3">
                    <div>
                      <span className="font-mono text-base font-bold text-[#FAF8F3] block">
                        #{order.order_number}
                      </span>
                      <span className="text-[11px] text-[#D4CBBB]">
                        {order.fulfilment_mode === 'dine_in'
                          ? 'Dine-In Table ' + (order.table_id ? '1' : 'Counter')
                          : order.fulfilment_mode === 'pickup'
                          ? `Pickup (${order.pickup_name || 'Guest'})`
                          : `Delivery (${order.delivery_name || 'Guest'})`}
                      </span>
                    </div>

                    <Badge
                      size="sm"
                      variant={isReady ? 'emerald' : isCooking ? 'amber' : 'slate'}
                    >
                      {order.status}
                    </Badge>
                  </div>

                  {/* Order Line Items */}
                  <div className="space-y-2 mb-4">
                    {order.order_lines?.map((line, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-[#2A2420] border border-[#3D352C] text-xs text-[#FAF8F3]"
                      >
                        <div className="flex justify-between items-baseline">
                          <span className="font-bold text-sm">
                            {line.quantity}x {line.item_name_snapshot}
                          </span>
                        </div>
                        {line.notes && (
                          <div className="text-[11px] text-[#C9A96E] font-medium mt-1 bg-[#670E10]/30 p-1.5 rounded border border-[#B08D57]/30">
                            Chef Note: {line.notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Advancement Button */}
                <div className="pt-3 border-t border-[#3D352C]">
                  {order.status === 'new' && (
                    <Button
                      size="sm"
                      variant="primary"
                      className="w-full"
                      isLoading={isUpdating === order.order_number}
                      onClick={() => handleUpdateStatus(order.order_number, 'accepted')}
                    >
                      Accept Order
                    </Button>
                  )}

                  {order.status === 'accepted' && (
                    <Button
                      size="sm"
                      variant="gold"
                      className="w-full font-bold"
                      isLoading={isUpdating === order.order_number}
                      onClick={() => handleUpdateStatus(order.order_number, 'preparing')}
                    >
                      Start Cooking &rarr;
                    </Button>
                  )}

                  {order.status === 'preparing' && (
                    <Button
                      size="sm"
                      className="w-full bg-[#2D6A4F] hover:bg-[#1E4835] text-white font-bold"
                      isLoading={isUpdating === order.order_number}
                      onClick={() => handleUpdateStatus(order.order_number, 'ready')}
                    >
                      Mark Food Ready &rarr;
                    </Button>
                  )}

                  {order.status === 'ready' && (
                    <Button
                      size="sm"
                      variant="secondary"
                      className="w-full border-emerald-500 text-emerald-300"
                      isLoading={isUpdating === order.order_number}
                      onClick={() =>
                        handleUpdateStatus(
                          order.order_number,
                          order.fulfilment_mode === 'dine_in'
                            ? 'served'
                            : order.fulfilment_mode === 'pickup'
                            ? 'collected'
                            : 'out_for_delivery'
                        )
                      }
                    >
                      Dispatch / Mark Served &rarr;
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
