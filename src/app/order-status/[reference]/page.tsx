'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatMoney } from '@/lib/utils/money';
import { INITIAL_ORDERS } from '@/lib/data/initial-data';
import type { Order } from '@/lib/types';
import {
  Clock,
  CheckCircle2,
  ChefHat,
  UtensilsCrossed,
  Truck,
  RotateCw,
  ShoppingBag,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

function OrderStatusContent() {
  const params = useParams();
  const reference = params.reference as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${reference}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data.order);
      } else {
        // Fallback to sample orders if reference matches
        const found = INITIAL_ORDERS.find(
          (o) => o.order_number.toUpperCase() === reference.toUpperCase()
        );
        if (found) setOrder(found);
      }
    } catch {
      const found = INITIAL_ORDERS.find(
        (o) => o.order_number.toUpperCase() === reference.toUpperCase()
      );
      if (found) setOrder(found);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 6000); // Polling every 6 seconds
    return () => clearInterval(interval);
  }, [reference]);

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <RotateCw className="w-8 h-8 text-[#670E10] animate-spin mx-auto mb-4" />
        <p className="text-[#6B6155] text-sm font-medium">Locating your royal order status...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="heritage-card bg-white p-8 rounded-2xl border border-[#D4CBBB] shadow-md">
          <h1 className="font-heritage text-2xl font-bold text-[#241F1A] mb-2">Order Not Found</h1>
          <p className="text-xs text-[#6B6155] mb-6">
            We could not locate an active order matching reference #{reference}.
          </p>
          <Link href="/">
            <Button variant="outline">Return to Palace Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Define steps according to fulfilment mode
  const getSteps = () => {
    if (order.fulfilment_mode === 'delivery') {
      return [
        { key: 'new', label: 'Received' },
        { key: 'accepted', label: 'Accepted' },
        { key: 'preparing', label: 'In Kitchen' },
        { key: 'ready', label: 'Packed' },
        { key: 'out_for_delivery', label: 'Out for Delivery' },
        { key: 'delivered', label: 'Delivered' },
      ];
    }
    if (order.fulfilment_mode === 'pickup') {
      return [
        { key: 'new', label: 'Received' },
        { key: 'accepted', label: 'Accepted' },
        { key: 'preparing', label: 'In Kitchen' },
        { key: 'ready', label: 'Ready for Pickup' },
        { key: 'completed', label: 'Collected' },
      ];
    }
    // dine_in
    return [
      { key: 'new', label: 'Order Sent' },
      { key: 'accepted', label: 'Accepted' },
      { key: 'preparing', label: 'Khansama Cooking' },
      { key: 'ready', label: 'Plated & Ready' },
      { key: 'served', label: 'Served to Table' },
    ];
  };

  const steps = getSteps();
  const currentStepIndex = Math.max(
    0,
    steps.findIndex((s) => s.key === order.status)
  );

  return (
    <div className="bg-[#F5F1E8] min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-[#670E10] hover:text-[#8A1518]"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Return to Palace Home
          </Link>
        </div>

        <div className="heritage-card bg-white p-6 sm:p-10 rounded-3xl border-2 border-[#B08D57]/40 shadow-xl space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#D4CBBB]">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Badge variant="maroon">
                  {order.fulfilment_mode.replace('_', ' ').toUpperCase()}
                </Badge>
                <span className="text-xs text-[#8F7245] font-semibold">Live Kitchen Tracking</span>
              </div>
              <h1 className="font-heritage text-2xl sm:text-3xl font-bold text-[#241F1A]">
                Order #{order.order_number}
              </h1>
            </div>

            <div className="flex items-center space-x-2 text-xs text-[#6B6155]">
              <Clock className="w-4 h-4 text-[#670E10]" />
              <span>
                Placed at {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8F7245]">Current Status</span>
              <span className="text-xs font-bold text-[#670E10] capitalize">
                {order.status.replace(/_/g, ' ')}
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2 text-center">
              {steps.slice(0, 5).map((step, idx) => {
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                return (
                  <div key={step.key} className="space-y-2">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-500 ${
                        isPassed ? 'bg-[#670E10]' : 'bg-[#EBE5D6]'
                      }`}
                    />
                    <span
                      className={`text-[10px] block font-semibold ${
                        isCurrent
                          ? 'text-[#670E10] font-bold'
                          : isPassed
                          ? 'text-[#241F1A]'
                          : 'text-[#9A8E7F]'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Details Breakdown */}
          <div className="p-6 rounded-2xl bg-[#FAF8F3] border border-[#D4CBBB] space-y-4">
            <h3 className="font-heritage text-base font-bold text-[#241F1A] pb-2 border-b border-[#D4CBBB]">
              Order Items Summary
            </h3>

            <div className="divide-y divide-[#D4CBBB]/60 text-xs text-[#3D352C]">
              {(order.order_lines || []).map((line) => (
                <div key={line.id} className="py-2.5 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-[#241F1A] block">{line.item_name_snapshot}</span>
                    <span className="text-[#8F7245]">
                      Qty: {line.quantity} × {formatMoney(line.unit_price_snapshot_minor)}
                    </span>
                    {line.notes && (
                      <span className="text-[11px] text-[#6B6155] italic block mt-0.5">Note: {line.notes}</span>
                    )}
                  </div>
                  <span className="font-heritage font-bold text-[#670E10] text-sm">
                    {formatMoney(line.line_total_minor)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#D4CBBB] space-y-1.5 text-xs text-[#6B6155]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#241F1A]">{formatMoney(order.subtotal_minor)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST Tax</span>
                <span className="font-semibold text-[#241F1A]">{formatMoney(order.tax_minor)}</span>
              </div>
              {order.delivery_fee_minor > 0 && (
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-semibold text-[#241F1A]">{formatMoney(order.delivery_fee_minor)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-[#241F1A] pt-2 border-t border-[#D4CBBB]">
                <span>Total Amount Paid / Due</span>
                <span className="font-heritage text-[#670E10] text-xl">
                  {formatMoney(order.total_minor)}
                </span>
              </div>
            </div>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-[#6B6155]">
              Status updates automatically every few seconds as our culinary team prepares your dishes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderStatusPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-[#670E10] font-bold">Loading royal order tracking...</div>}>
      <OrderStatusContent />
    </Suspense>
  );
}
