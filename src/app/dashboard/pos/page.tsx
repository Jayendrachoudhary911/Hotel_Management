'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { formatMoney } from '@/lib/utils/money';
import {
  INITIAL_OUTLETS,
  INITIAL_RESTAURANT_CATEGORIES,
  INITIAL_CAFE_CATEGORIES,
  INITIAL_PROPERTY,
} from '@/lib/data/initial-data';
import type { MenuItem, MenuCategory } from '@/lib/types';
import {
  Receipt,
  Plus,
  Minus,
  CreditCard,
  Banknote,
  QrCode,
  Printer,
  CheckCircle2,
  Trash2,
  RotateCcw,
} from 'lucide-react';

export default function POSTerminalPage() {
  const [selectedOutletId, setSelectedOutletId] = useState(INITIAL_OUTLETS[0].id);
  const [mode, setMode] = useState<'dine_in' | 'pickup' | 'delivery'>('dine_in');
  const [cart, setCart] = useState<{ [id: string]: { item: MenuItem; quantity: number } }>({});
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'upi' | 'card'>('upi');
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  // Live Menu Categories
  const [categories, setCategories] = useState<MenuCategory[]>(INITIAL_RESTAURANT_CATEGORIES);

  const fetchLiveMenu = useCallback(async (outletId: string) => {
    try {
      const res = await fetch(`/api/menu?outletId=${outletId}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.categories) && data.categories.length > 0) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error('Failed to fetch live menu for POS:', err);
    }
  }, []);

  useEffect(() => {
    fetchLiveMenu(selectedOutletId);
  }, [selectedOutletId, fetchLiveMenu]);

  // Completed Bill State
  const [completedBill, setCompletedBill] = useState<{
    billNumber: string;
    orderLines: { name: string; qty: number; unitPrice: number; total: number }[];
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    paymentMethod: string;
    createdAt: string;
  } | null>(null);

  const currentOutlet =
    INITIAL_OUTLETS.find((o) => o.id === selectedOutletId) || INITIAL_OUTLETS[0];

  const addToCart = (item: MenuItem) => {
    setCart((prev) => ({
      ...prev,
      [item.id]: { item, quantity: (prev[item.id]?.quantity || 0) + 1 },
    }));
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => {
      if (!prev[itemId]) return prev;
      if (prev[itemId].quantity <= 1) {
        const next = { ...prev };
        delete next[itemId];
        return next;
      }
      return {
        ...prev,
        [itemId]: { ...prev[itemId], quantity: prev[itemId].quantity - 1 },
      };
    });
  };

  const clearCart = () => setCart({});

  // Calculations in minor integer units
  const cartList = Object.values(cart);
  const subtotalMinor = cartList.reduce((sum, ci) => sum + ci.item.price_minor * ci.quantity, 0);
  const discountMinor = Math.round((subtotalMinor * discountPercent) / 100);
  const taxableMinor = Math.max(0, subtotalMinor - discountMinor);
  const taxMinor = Math.round((taxableMinor * currentOutlet.tax_rate_bps) / 10000);
  const totalMinor = taxableMinor + taxMinor;

  const handleGenerateBill = async () => {
    if (cartList.length === 0) return;

    const fallbackBillNumber = `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;

    setIsSubmittingOrder(true);
    let finalBillNumber = fallbackBillNumber;

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          outlet_id: selectedOutletId,
          channel: 'pos',
          fulfilment_mode: mode,
          pickup_name: mode === 'pickup' ? 'POS Counter Pickup' : undefined,
          delivery_name: mode === 'delivery' ? 'POS Counter Delivery' : undefined,
          delivery_address: mode === 'delivery' ? 'Front Desk / Express Dispatch' : undefined,
          delivery_fee_minor: 0,
          subtotal_minor: subtotalMinor,
          discount_minor: discountMinor,
          tax_minor: taxMinor,
          total_minor: totalMinor,
          order_lines: cartList.map((ci) => ({
            menu_item_id: ci.item.id,
            item_name_snapshot: ci.item.name,
            quantity: ci.quantity,
            unit_price_minor: ci.item.price_minor,
            subtotal_minor: ci.item.price_minor * ci.quantity,
            total_minor: ci.item.price_minor * ci.quantity,
          })),
        }),
      });

      const data = await res.json();
      if (data.success && data.order?.order_number) {
        finalBillNumber = data.order.order_number;
      }
    } catch (err) {
      console.error('Error posting POS order to Supabase:', err);
    } finally {
      setIsSubmittingOrder(false);
    }

    const bill = {
      billNumber: finalBillNumber,
      orderLines: cartList.map((ci) => ({
        name: ci.item.name,
        qty: ci.quantity,
        unitPrice: ci.item.price_minor,
        total: ci.item.price_minor * ci.quantity,
      })),
      subtotal: subtotalMinor,
      tax: taxMinor,
      discount: discountMinor,
      total: totalMinor,
      paymentMethod,
      createdAt: new Date().toLocaleTimeString(),
    };

    setCompletedBill(bill);
    clearCart();
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#3D352C]">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#670E10] text-white text-[11px] font-bold border border-[#B08D57]/40">
              Point of Sale & Billing
            </span>
            <span className="text-xs text-[#B08D57] font-semibold">Offline/Online Terminal</span>
          </div>
          <h1 className="font-heritage text-2xl sm:text-3xl font-bold text-[#FAF8F3]">
            Billing & POS Terminal
          </h1>
        </div>

        {/* Outlet Switcher & Mode */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-[#2A2420] p-1 rounded-xl border border-[#3D352C]">
            {INITIAL_OUTLETS.map((outlet) => (
              <button
                key={outlet.id}
                onClick={() => {
                  setSelectedOutletId(outlet.id);
                  clearCart();
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedOutletId === outlet.id
                    ? 'bg-[#670E10] text-white shadow-sm'
                    : 'text-[#D4CBBB] hover:text-white'
                }`}
              >
                {outlet.name}
              </button>
            ))}
          </div>

          <div className="flex bg-[#2A2420] p-1 rounded-xl border border-[#3D352C]">
            {(['dine_in', 'pickup', 'delivery'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                  mode === m
                    ? 'bg-[#B08D57] text-[#1C1814] font-bold shadow'
                    : 'text-[#D4CBBB] hover:text-white'
                }`}
              >
                {m.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* POS Grid: Menu Items (Left) vs Running Ticket (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Quick Item Selection */}
        <div className="lg:col-span-7 space-y-6">
          {categories.map((category) => (
            <div key={category.id} className="space-y-3">
              <h3 className="font-heritage text-sm font-bold text-[#C9A96E] uppercase tracking-wider">
                {category.name}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {category.items?.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => addToCart(item)}
                    className="p-3.5 rounded-xl bg-[#241F1A] border border-[#3D352C] hover:border-[#B08D57] text-left transition-all active:scale-[0.98] group flex flex-col justify-between h-24 cursor-pointer"
                  >
                    <span className="text-xs font-bold text-[#FAF8F3] group-hover:text-[#C9A96E] line-clamp-2">
                      {item.name}
                    </span>
                    <span className="text-xs font-heritage font-bold text-[#B08D57] mt-2">
                      {formatMoney(item.price_minor)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right: Active Ticket & Tender */}
        <div className="lg:col-span-5">
          <div className="sticky top-6 p-6 rounded-2xl bg-[#241F1A] border-2 border-[#B08D57]/40 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#3D352C]">
              <div className="flex items-center space-x-2">
                <Receipt className="w-5 h-5 text-[#B08D57]" />
                <h3 className="font-heritage text-lg font-bold text-[#FAF8F3]">Live Ticket</h3>
              </div>
              {cartList.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-[#9B2226] hover:text-red-400 font-semibold flex items-center cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" /> Clear
                </button>
              )}
            </div>

            {cartList.length === 0 ? (
              <div className="text-center py-10 text-[#9A8E7F] text-xs">
                No items on ticket. Click menu items on the left to add.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {cartList.map((ci) => (
                  <div
                    key={ci.item.id}
                    className="flex justify-between items-center p-2 rounded-lg bg-[#2A2420] text-xs border border-[#3D352C]"
                  >
                    <div>
                      <span className="font-semibold text-[#FAF8F3] block">{ci.item.name}</span>
                      <span className="text-[#8F7245] text-[10px]">
                        {formatMoney(ci.item.price_minor)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => removeFromCart(ci.item.id)}
                        className="p-1 rounded bg-[#3D352C] text-[#FAF8F3] hover:text-[#B08D57] cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-bold text-[#C9A96E] text-xs w-4 text-center">
                        {ci.quantity}
                      </span>
                      <button
                        onClick={() => addToCart(ci.item)}
                        className="p-1 rounded bg-[#3D352C] text-[#FAF8F3] hover:text-[#B08D57] cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Calculations & Discounts */}
            <div className="pt-3 border-t border-[#3D352C] space-y-3">
              {/* Discount Selector */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#D4CBBB]">Royal Privilege Discount:</span>
                <div className="flex space-x-1.5">
                  {[0, 5, 10, 15].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDiscountPercent(d)}
                      className={`px-2.5 py-0.5 rounded text-[11px] font-bold cursor-pointer ${
                        discountPercent === d
                          ? 'bg-[#B08D57] text-[#1C1814]'
                          : 'bg-[#2A2420] text-[#D4CBBB] border border-[#3D352C]'
                      }`}
                    >
                      {d}%
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-[#D4CBBB]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-[#FAF8F3]">{formatMoney(subtotalMinor)}</span>
                </div>
                {discountMinor > 0 && (
                  <div className="flex justify-between text-[#2D6A4F]">
                    <span>Discount ({discountPercent}%)</span>
                    <span>-{formatMoney(discountMinor)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>GST ({currentOutlet.tax_rate_bps / 100}%)</span>
                  <span className="text-[#FAF8F3]">{formatMoney(taxMinor)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-[#FAF8F3] pt-2 border-t border-[#3D352C]">
                  <span>Total Amount Due</span>
                  <span className="font-heritage text-[#C9A96E] text-xl">{formatMoney(totalMinor)}</span>
                </div>
              </div>

              {/* Payment Tender */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] uppercase tracking-wider text-[#8F7245] font-bold block">
                  Tender Payment Method
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-2.5 rounded-xl border text-center text-xs font-semibold flex flex-col items-center justify-center cursor-pointer ${
                      paymentMethod === 'upi'
                        ? 'border-[#B08D57] bg-[#B08D57]/20 text-[#FAF8F3]'
                        : 'border-[#3D352C] bg-[#2A2420] text-[#D4CBBB]'
                    }`}
                  >
                    <QrCode className="w-4 h-4 mb-1 text-[#B08D57]" />
                    <span>UPI QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-2.5 rounded-xl border text-center text-xs font-semibold flex flex-col items-center justify-center cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'border-[#B08D57] bg-[#B08D57]/20 text-[#FAF8F3]'
                        : 'border-[#3D352C] bg-[#2A2420] text-[#D4CBBB]'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 mb-1 text-[#B08D57]" />
                    <span>Card / POS</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-2.5 rounded-xl border text-center text-xs font-semibold flex flex-col items-center justify-center cursor-pointer ${
                      paymentMethod === 'cash'
                        ? 'border-[#B08D57] bg-[#B08D57]/20 text-[#FAF8F3]'
                        : 'border-[#3D352C] bg-[#2A2420] text-[#D4CBBB]'
                    }`}
                  >
                    <Banknote className="w-4 h-4 mb-1 text-[#B08D57]" />
                    <span>Cash</span>
                  </button>
                </div>
              </div>

              <Button
                size="lg"
                variant="primary"
                onClick={handleGenerateBill}
                disabled={cartList.length === 0}
                className="w-full shadow-lg"
              >
                Settle &amp; Print Bill ({formatMoney(totalMinor)})
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bill Receipt Thermal Modal */}
      {completedBill && (
        <Modal
          isOpen={true}
          onClose={() => setCompletedBill(null)}
          title="Tax Invoice / Receipt"
          description={`Settlement completed via ${completedBill.paymentMethod.toUpperCase()}`}
        >
          <div className="space-y-4">
            <div className="p-6 bg-white text-black font-mono text-xs rounded-xl border border-zinc-300 space-y-3">
              <div className="text-center pb-3 border-b border-dashed border-zinc-400">
                <span className="font-bold text-sm block tracking-widest uppercase">
                  {INITIAL_PROPERTY.name}
                </span>
                <span className="text-[10px] block text-zinc-600">{currentOutlet.name}</span>
                <span className="text-[10px] block text-zinc-500">{INITIAL_PROPERTY.address}</span>
                <span className="text-[10px] block text-zinc-500">Ph: {INITIAL_PROPERTY.phone}</span>
                <span className="text-[10px] font-bold block mt-1">GSTIN: 08AAACH1234F1Z8</span>
              </div>

              <div className="flex justify-between text-[11px] pb-2 border-b border-dashed border-zinc-400">
                <span>Inv: {completedBill.billNumber}</span>
                <span>{completedBill.createdAt}</span>
              </div>

              <div className="space-y-1.5 py-1">
                {completedBill.orderLines.map((line, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>
                      {line.qty}x {line.name}
                    </span>
                    <span>{formatMoney(line.total)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-dashed border-zinc-400 space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatMoney(completedBill.subtotal)}</span>
                </div>
                {completedBill.discount > 0 && (
                  <div className="flex justify-between">
                    <span>Discount</span>
                    <span>-{formatMoney(completedBill.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>CGST (2.5%) + SGST (2.5%)</span>
                  <span>{formatMoney(completedBill.tax)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm pt-2 border-t border-black">
                  <span>NET PAYABLE</span>
                  <span>{formatMoney(completedBill.total)}</span>
                </div>
              </div>

              <div className="text-center pt-3 text-[10px] text-zinc-600">
                <p>Thank you for dining at Aura Grand!</p>
                <p>Visit again soon.</p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-[#3D352C]">
              <Button variant="ghost" onClick={() => setCompletedBill(null)}>
                Close
              </Button>
              <Button
                onClick={() => {
                  window.print();
                  setCompletedBill(null);
                }}
                className="flex items-center space-x-1.5"
              >
                <Printer className="w-4 h-4 mr-1" />
                <span>Print Thermal Receipt</span>
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
