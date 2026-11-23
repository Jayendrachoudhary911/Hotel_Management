'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatMoney } from '@/lib/utils/money';
import {
  INITIAL_OUTLETS,
  INITIAL_RESTAURANT_CATEGORIES,
  INITIAL_CAFE_CATEGORIES,
} from '@/lib/data/initial-data';
import type { MenuItem, MenuCategory, Outlet } from '@/lib/types';
import {
  Utensils,
  ShoppingBag,
  Truck,
  Coffee,
  ArrowRight,
  ArrowLeft,
  Check,
  Plus,
  Minus,
  X,
  Search,
  Sparkles,
  Clock,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  MapPin,
  FileText,
  RefreshCw,
} from 'lucide-react';

export type OrderingMethod = 'dine_in' | 'pickup' | 'delivery';
export type VenueType = 'restaurant' | 'cafe';

interface CartItemEntry {
  item: MenuItem;
  quantity: number;
  venueType: VenueType;
  notes?: string;
}

export default function MenuPage() {
  const router = useRouter();

  // ── Customer Flow State ──
  // Step 1: Ordering Method
  const [orderingMethod, setOrderingMethod] = useState<OrderingMethod | null>(null);
  // Step 2: Venue Selection
  const [selectedVenue, setSelectedVenue] = useState<VenueType | null>(null);

  // Cart State (preserved even when changing method or venue)
  const [cart, setCart] = useState<{ [id: string]: CartItemEntry }>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiet, setSelectedDiet] = useState<string>('all');

  // Checkout modal state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [tableOrRoom, setTableOrRoom] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Live Menu Categories from API/Supabase with graceful fallback
  const [liveMenuCategories, setLiveMenuCategories] = useState<MenuCategory[] | null>(null);
  const [isLoadingMenu, setIsLoadingMenu] = useState(false);

  // Fetch live menu categories on mount
  useEffect(() => {
    let isMounted = true;
    async function fetchMenuData() {
      setIsLoadingMenu(true);
      try {
        const res = await fetch('/api/menu');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.categories && data.categories.length > 0) {
            setLiveMenuCategories(data.categories);
          }
        }
      } catch (err) {
        console.error('Menu load error, fallback to initial data:', err);
      } finally {
        if (isMounted) setIsLoadingMenu(false);
      }
    }
    fetchMenuData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Outlets
  const restaurantOutlet =
    INITIAL_OUTLETS.find((o) => o.type === 'restaurant') || INITIAL_OUTLETS[0];
  const cafeOutlet =
    INITIAL_OUTLETS.find((o) => o.type === 'cafe') || INITIAL_OUTLETS[1] || INITIAL_OUTLETS[0];

  const currentOutlet: Outlet = selectedVenue === 'cafe' ? cafeOutlet : restaurantOutlet;

  // Filter categories by selected venue
  const categoriesForVenue: MenuCategory[] = useMemo(() => {
    if (!selectedVenue) return [];

    if (liveMenuCategories && liveMenuCategories.length > 0) {
      // Find matching categories by outlet_id or name/type
      const filtered = liveMenuCategories.filter((cat) => {
        if (selectedVenue === 'restaurant') {
          return cat.outlet_id === restaurantOutlet.id || !cat.outlet_id?.includes('2');
        } else {
          return cat.outlet_id === cafeOutlet.id || cat.outlet_id?.includes('2');
        }
      });
      if (filtered.length > 0) return filtered;
    }

    return selectedVenue === 'restaurant'
      ? INITIAL_RESTAURANT_CATEGORIES
      : INITIAL_CAFE_CATEGORIES;
  }, [selectedVenue, liveMenuCategories, restaurantOutlet.id, cafeOutlet.id]);

  // Flattened items for active venue with search/diet filtering
  const filteredCategories = useMemo(() => {
    return categoriesForVenue
      .map((cat) => {
        const matchingItems = (cat.items || []).filter((item) => {
          // Search query match
          const matchesSearch =
            !searchQuery.trim() ||
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));

          // Dietary match
          let matchesDiet = true;
          if (selectedDiet === 'veg') {
            matchesDiet = (item.dietary_labels || []).some(
              (l) => l.toLowerCase().includes('veg') && !l.toLowerCase().includes('non')
            );
          } else if (selectedDiet === 'non-veg') {
            matchesDiet = (item.dietary_labels || []).some((l) =>
              l.toLowerCase().includes('non-veg')
            );
          } else if (selectedDiet === 'jain') {
            matchesDiet =
              (item.dietary_labels || []).some((l) => l.toLowerCase().includes('jain')) ||
              (!item.description?.toLowerCase().includes('onion') &&
                !item.description?.toLowerCase().includes('garlic'));
          } else if (selectedDiet === 'signature') {
            matchesDiet =
              (item.dietary_labels || []).some(
                (l) =>
                  l.toLowerCase().includes('signature') ||
                  l.toLowerCase().includes('royal') ||
                  l.toLowerCase().includes('special')
              ) || item.price_minor >= 40000;
          }

          return matchesSearch && matchesDiet;
        });

        return {
          ...cat,
          items: matchingItems,
        };
      })
      .filter((cat) => activeCategory === 'all' || cat.id === activeCategory);
  }, [categoriesForVenue, activeCategory, searchQuery, selectedDiet]);

  // Cart operations
  const addToCart = (item: MenuItem) => {
    if (!selectedVenue) return;
    setCart((prev) => ({
      ...prev,
      [item.id]: {
        item,
        quantity: (prev[item.id]?.quantity || 0) + 1,
        venueType: selectedVenue,
      },
    }));
  };

  const decreaseQuantity = (itemId: string) => {
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

  const removeFromCart = (itemId: string) => {
    setCart((prev) => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
  };

  const clearCart = () => {
    setCart({});
  };

  // Cart calculations
  const cartEntries = Object.values(cart);
  const totalCartCount = cartEntries.reduce((sum, ci) => sum + ci.quantity, 0);
  const subtotalMinor = cartEntries.reduce((sum, ci) => sum + ci.item.price_minor * ci.quantity, 0);

  // Use current outlet tax rate or 5% default
  const taxRateBps = currentOutlet.tax_rate_bps || 500;
  const taxMinor = Math.round((subtotalMinor * taxRateBps) / 10000);
  const deliveryFeeMinor = orderingMethod === 'delivery' ? currentOutlet.delivery_fee_minor || 4000 : 0;
  const totalMinor = subtotalMinor + taxMinor + deliveryFeeMinor;

  // Handle Checkout Submission
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (cartEntries.length === 0) {
      setErrorMessage('Your cart is empty. Please select some dishes.');
      return;
    }

    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMessage('Please provide your name and phone number.');
      return;
    }

    if (orderingMethod === 'dine_in' && !tableOrRoom.trim()) {
      setErrorMessage('Please enter your Table or Room number.');
      return;
    }

    if (orderingMethod === 'delivery' && !deliveryAddress.trim()) {
      setErrorMessage('Please provide a delivery address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderLines = cartEntries.map((ci) => ({
        menu_item_id: ci.item.id,
        item_name_snapshot: ci.item.name,
        unit_price_snapshot_minor: ci.item.price_minor,
        quantity: ci.quantity,
        notes: ci.notes || null,
        modifiers_snapshot: null,
        line_total_minor: ci.item.price_minor * ci.quantity,
      }));

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          outlet_id: currentOutlet.id,
          channel: 'web',
          fulfilment_mode: orderingMethod,
          pickup_name: customerName,
          pickup_phone: customerPhone,
          delivery_address: orderingMethod === 'delivery' ? deliveryAddress : null,
          table_id: orderingMethod === 'dine_in' ? tableOrRoom : null,
          delivery_notes: orderNotes || (orderingMethod === 'dine_in' ? `Table/Room: ${tableOrRoom}` : null),
          subtotal_minor: subtotalMinor,
          tax_minor: taxMinor,
          delivery_fee_minor: deliveryFeeMinor,
          total_minor: totalMinor,
          order_lines: orderLines,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit order');

      // Clear cart on successful order
      setCart({});
      setIsCheckoutOpen(false);
      setIsCartOpen(false);

      if (data.order?.order_number) {
        router.push(`/order-status/${data.order.order_number}`);
      } else {
        router.push('/');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to place order';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper method labels
  const methodDetails = {
    dine_in: {
      label: 'Dine In',
      desc: 'Served freshly at your palace table or courtyard lounge',
      icon: Utensils,
      tag: 'Table / Lounge Service',
    },
    pickup: {
      label: 'Pickup',
      desc: 'Takeaway packed and ready for quick collection from the counter',
      icon: ShoppingBag,
      tag: 'Ready in 15–25 mins',
    },
    delivery: {
      label: 'Delivery',
      desc: 'Safely packed royal cuisine delivered to your residence or suite',
      icon: Truck,
      tag: 'Express Delivery',
    },
  };

  const venueDetails = {
    restaurant: {
      title: 'Rajmahal Royal Dining',
      subtitle: 'Authentic Rajasthani Restaurant & Imperial Thalis',
      image: '/images/dining/rajasthani-restaurant.png',
      icon: Utensils,
      timing: '12:30 PM – 11:00 PM',
      tagline: 'Centuries-old royal recipes, hand-ground spices, clay-oven tandoor & shahi thalis',
    },
    cafe: {
      title: 'The Palace Courtyard Café & Lounge',
      subtitle: 'Artisan Brews, Single-Origin Coffees & Viennoiserie',
      image: '/images/dining/cafe-lounge.png',
      icon: Coffee,
      timing: '08:00 AM – 11:00 PM',
      tagline: 'Artisanal Araku pour-overs, kesariya masala chai, delicate flaky pastries & snacks',
    },
  };

  return (
    <div className="min-h-screen bg-[#F5F1E8] text-[#241F1A] pb-24">
      {/* ── TOP PALACE HEADER BANNER ── */}
      <div
        className="w-full py-8 sm:py-12 px-4 sm:px-6 lg:px-8 border-b border-[#D8AA67]/30 relative overflow-hidden shadow-sm"
        style={{ backgroundColor: '#4F0809' }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#D8AA67]/20 border border-[#D8AA67]/50 text-[#D8AA67] text-xs font-bold tracking-[0.2em] uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Royal Culinary Menu</span>
            </div>
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FFF8EB] leading-tight"
              style={{
                fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
              }}
            >
              Order &amp; Feast
            </h1>
            <p className="text-xs sm:text-sm text-[#E6D5B8] max-w-xl mt-1 font-light">
              Experience the regal flavours of Udaipur. Choose your preferred dining method, select a palace venue, and curate your royal feast.
            </p>
          </div>

          {/* Stepper Progress Indicator */}
          <div className="flex items-center space-x-2 sm:space-x-3 bg-black/30 backdrop-blur px-4 py-2.5 rounded-xl border border-[#D8AA67]/30 text-xs">
            {/* Step 1: Method */}
            <button
              type="button"
              onClick={() => {
                setOrderingMethod(null);
                setSelectedVenue(null);
              }}
              className={`flex items-center space-x-1.5 transition-colors cursor-pointer ${
                orderingMethod ? 'text-[#D8AA67] font-semibold hover:underline' : 'text-[#FFF8EB] font-bold'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-[#D8AA67]/20 border border-[#D8AA67] flex items-center justify-center text-[10px]">
                {orderingMethod ? '✓' : '1'}
              </span>
              <span>{orderingMethod ? methodDetails[orderingMethod].label : '1. Order Method'}</span>
            </button>

            <span className="text-[#D8AA67]/50">➔</span>

            {/* Step 2: Venue */}
            <button
              type="button"
              disabled={!orderingMethod}
              onClick={() => setSelectedVenue(null)}
              className={`flex items-center space-x-1.5 transition-colors ${
                !orderingMethod
                  ? 'opacity-40 cursor-not-allowed text-[#E6D5B8]'
                  : selectedVenue
                  ? 'text-[#D8AA67] font-semibold hover:underline cursor-pointer'
                  : 'text-[#FFF8EB] font-bold cursor-pointer'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-[#D8AA67]/20 border border-[#D8AA67] flex items-center justify-center text-[10px]">
                {selectedVenue ? '✓' : '2'}
              </span>
              <span>{selectedVenue ? (selectedVenue === 'restaurant' ? 'Restaurant' : 'Café') : '2. Venue'}</span>
            </button>

            <span className="text-[#D8AA67]/50">➔</span>

            {/* Step 3: Menu */}
            <span
              className={`flex items-center space-x-1.5 ${
                orderingMethod && selectedVenue ? 'text-[#FFF8EB] font-bold' : 'opacity-40 text-[#E6D5B8]'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-[#D8AA67]/20 border border-[#D8AA67] flex items-center justify-center text-[10px]">
                3
              </span>
              <span>3. Menu</span>
            </span>
          </div>
        </div>
      </div>

      {/* ── PERSISTENT SELECTION & CART BAR (WHEN METHOD & VENUE ARE SELECTED) ── */}
      {orderingMethod && selectedVenue && (
        <div className="sticky top-[80px] sm:top-[86px] z-30 bg-[#FFFDF9] border-b border-[#D8AA67]/40 shadow-sm transition-all backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
            {/* Active Selections with quick 'Change' actions */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm">
              {/* Method badge */}
              <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#F5EFE6] border border-[#D8AA67]/40 text-[#4F0809]">
                <span className="text-stone-500 font-medium">Method:</span>
                <span className="font-bold flex items-center gap-1">
                  {React.createElement(methodDetails[orderingMethod].icon, { className: 'w-3.5 h-3.5 text-[#B08D57]' })}
                  {methodDetails[orderingMethod].label}
                </span>
                <button
                  type="button"
                  onClick={() => setOrderingMethod(null)}
                  className="ml-1 text-[11px] text-[#B08D57] hover:underline font-semibold cursor-pointer"
                  title="Change order method (your cart is safe)"
                >
                  (Change)
                </button>
              </div>

              {/* Venue badge */}
              <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#F5EFE6] border border-[#D8AA67]/40 text-[#4F0809]">
                <span className="text-stone-500 font-medium">Venue:</span>
                <span className="font-bold flex items-center gap-1">
                  {React.createElement(venueDetails[selectedVenue].icon, { className: 'w-3.5 h-3.5 text-[#B08D57]' })}
                  {selectedVenue === 'restaurant' ? 'Royal Dining' : 'Courtyard Café'}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedVenue(null)}
                  className="ml-1 text-[11px] text-[#B08D57] hover:underline font-semibold cursor-pointer"
                  title="Change venue (your cart is safe)"
                >
                  (Switch)
                </button>
              </div>
            </div>

            {/* Quick Cart Trigger */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-[#4F0809] hover:bg-[#680E10] text-[#FFF8EB] font-semibold text-xs sm:text-sm transition-all shadow cursor-pointer"
                aria-label={`View Cart with ${totalCartCount} items`}
              >
                <ShoppingBag className="w-4 h-4 text-[#D8AA67]" />
                <span>Cart ({totalCartCount})</span>
                {totalCartCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 rounded bg-[#D8AA67] text-[#4F0809] font-bold text-xs">
                    {formatMoney(totalMinor)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          STAGE 1: CHOOSE ORDERING METHOD
      ═══════════════════════════════════════════════════════════════ */}
      {!orderingMethod && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[#B08D57] text-xs font-bold tracking-[0.25em] uppercase block mb-1">
              Step 1 of 3
            </span>
            <h2
              className="text-3xl sm:text-4xl font-bold text-[#4F0809] mb-3"
              style={{
                fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
              }}
            >
              How would you like your order?
            </h2>
            <p className="text-stone-600 text-sm">
              Please choose an ordering method to get started. You can change this selection at any point without losing your cart.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(['dine_in', 'pickup', 'delivery'] as OrderingMethod[]).map((method) => {
              const details = methodDetails[method];
              const Icon = details.icon;
              return (
                <button
                  key={method}
                  type="button"
                  onClick={() => setOrderingMethod(method)}
                  className="group relative flex flex-col items-center text-center p-8 rounded-2xl bg-white border border-[#D8AA67]/40 hover:border-[#4F0809] shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#4F0809]"
                >
                  <div className="w-16 h-16 rounded-2xl bg-[#F5EFE6] border border-[#D8AA67]/50 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-[#4F0809] transition-all duration-300">
                    <Icon className="w-8 h-8 text-[#4F0809] group-hover:text-[#D8AA67] transition-colors" />
                  </div>

                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#B08D57] mb-1">
                    {details.tag}
                  </span>

                  <h3
                    className="text-2xl font-bold text-[#4F0809] mb-2"
                    style={{
                      fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
                    }}
                  >
                    {details.label}
                  </h3>

                  <p className="text-xs text-stone-600 leading-relaxed font-light mb-6">
                    {details.desc}
                  </p>

                  <div className="mt-auto inline-flex items-center space-x-1.5 text-xs font-bold text-[#4F0809] group-hover:text-[#B08D57] transition-colors">
                    <span>Select {details.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Cart retention note if items exist */}
          {totalCartCount > 0 && (
            <div className="mt-8 p-4 rounded-xl bg-[#FFF8EB] border border-[#D8AA67]/40 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ShoppingBag className="w-5 h-5 text-[#B08D57]" />
                <span className="text-xs text-[#4F0809] font-medium">
                  You have <strong>{totalCartCount} items</strong> in your cart ({formatMoney(totalMinor)}).
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="text-xs font-bold text-[#B08D57] hover:underline cursor-pointer"
              >
                View Cart
              </button>
            </div>
          )}
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          STAGE 2: CHOOSE DINING VENUE
      ═══════════════════════════════════════════════════════════════ */}
      {orderingMethod && !selectedVenue && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="flex items-center justify-between mb-8">
            <button
              type="button"
              onClick={() => setOrderingMethod(null)}
              className="inline-flex items-center space-x-2 text-xs font-semibold text-[#4F0809] hover:text-[#B08D57] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Ordering Method</span>
            </button>

            <span className="px-3 py-1 rounded-full bg-[#F5EFE6] text-xs font-bold text-[#4F0809] border border-[#D8AA67]/40">
              Method: {methodDetails[orderingMethod].label}
            </span>
          </div>

          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[#B08D57] text-xs font-bold tracking-[0.25em] uppercase block mb-1">
              Step 2 of 3
            </span>
            <h2
              className="text-3xl sm:text-4xl font-bold text-[#4F0809] mb-3"
              style={{
                fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
              }}
            >
              Choose a Palace Venue
            </h2>
            <p className="text-stone-600 text-sm">
              Select whether you want to order from the Royal Rajasthani Restaurant or our Courtyard Café.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {(['restaurant', 'cafe'] as VenueType[]).map((vKey) => {
              const venue = venueDetails[vKey];
              const Icon = venue.icon;
              return (
                <div
                  key={vKey}
                  onClick={() => setSelectedVenue(vKey)}
                  className="group relative rounded-2xl bg-white border border-[#D8AA67]/50 shadow-sm hover:shadow-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedVenue(vKey);
                    }
                  }}
                >
                  <div className="relative h-56 w-full overflow-hidden">
                    <Image
                      src={venue.image}
                      alt={venue.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/50 backdrop-blur text-[11px] font-semibold text-[#D8AA67] border border-[#D8AA67]/40 flex items-center space-x-1.5">
                      <Clock className="w-3 h-3" />
                      <span>{venue.timing}</span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                      <h3
                        className="text-2xl font-bold text-[#FFF8EB] leading-tight"
                        style={{
                          fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
                        }}
                      >
                        {venue.title}
                      </h3>
                      <p className="text-xs text-[#D8AA67] font-medium">{venue.subtitle}</p>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <p className="text-xs text-stone-600 leading-relaxed font-light">
                      {venue.tagline}
                    </p>

                    <div className="pt-2 flex items-center justify-between border-t border-stone-100">
                      <span className="text-xs font-bold text-[#4F0809] flex items-center gap-1.5">
                        <Icon className="w-4 h-4 text-[#B08D57]" />
                        <span>Browse Menu</span>
                      </span>

                      <div className="w-8 h-8 rounded-full bg-[#F5EFE6] text-[#4F0809] flex items-center justify-center group-hover:bg-[#4F0809] group-hover:text-[#FFF8EB] transition-colors">
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cart retention note */}
          {totalCartCount > 0 && (
            <div className="mt-8 p-4 rounded-xl bg-[#FFF8EB] border border-[#D8AA67]/40 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ShoppingBag className="w-5 h-5 text-[#B08D57]" />
                <span className="text-xs text-[#4F0809] font-medium">
                  Items in Cart: <strong>{totalCartCount}</strong> ({formatMoney(totalMinor)})
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="text-xs font-bold text-[#B08D57] hover:underline cursor-pointer"
              >
                Review Cart
              </button>
            </div>
          )}
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          STAGE 3: BROWSE VENUE MENU
      ═══════════════════════════════════════════════════════════════ */}
      {orderingMethod && selectedVenue && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          {/* Venue Banner & Switcher header */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#D8AA67]/40 shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center space-x-4">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border border-[#D8AA67]/40">
                <Image
                  src={venueDetails[selectedVenue].image}
                  alt={venueDetails[selectedVenue].title}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-[#B08D57] tracking-wider uppercase">
                    Active Menu
                  </span>
                  <span className="text-stone-300">•</span>
                  <span className="text-xs text-stone-500">{venueDetails[selectedVenue].timing}</span>
                </div>
                <h2
                  className="text-2xl sm:text-3xl font-bold text-[#4F0809]"
                  style={{
                    fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
                  }}
                >
                  {venueDetails[selectedVenue].title}
                </h2>
                <p className="text-xs text-stone-600 font-light mt-0.5">
                  {venueDetails[selectedVenue].tagline}
                </p>
              </div>
            </div>

            {/* Quick Switch to the other venue */}
            <div className="shrink-0 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedVenue(selectedVenue === 'restaurant' ? 'cafe' : 'restaurant')}
                className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl border border-[#D8AA67]/60 bg-[#F5EFE6] hover:bg-[#EBDDC8] text-[#4F0809] text-xs font-semibold transition cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#B08D57]" />
                <span>Switch to {selectedVenue === 'restaurant' ? 'Café & Lounge' : 'Royal Restaurant'}</span>
              </button>
            </div>
          </div>

          {/* Search & Dietary Filter Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search dishes, drinks or ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-white border border-[#D8AA67]/40 focus:outline-none focus:border-[#4F0809] text-[#241F1A] placeholder-stone-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Dietary Filter Pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: 'all', label: 'All Items' },
                { id: 'veg', label: '🟢 Pure Veg' },
                { id: 'jain', label: '🟡 Jain Friendly' },
                { id: 'non-veg', label: '🔴 Non-Veg' },
                { id: 'signature', label: '👑 Royal Signature' },
              ].map((diet) => (
                <button
                  key={diet.id}
                  type="button"
                  onClick={() => setSelectedDiet(diet.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedDiet === diet.id
                      ? 'bg-[#4F0809] text-[#FFF8EB]'
                      : 'bg-white text-stone-600 hover:bg-[#F5EFE6] border border-[#D8AA67]/40'
                  }`}
                >
                  {diet.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sticky Category Tabs Navigation */}
          <div className="sticky top-[138px] sm:top-[144px] z-20 bg-[#F5F1E8] py-2 mb-6">
            <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none pb-1">
              <button
                type="button"
                onClick={() => setActiveCategory('all')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === 'all'
                    ? 'bg-[#4F0809] text-[#FFF8EB] shadow-sm'
                    : 'bg-white text-stone-700 hover:bg-stone-50 border border-[#D8AA67]/40'
                }`}
              >
                All Categories ({categoriesForVenue.length})
              </button>

              {categoriesForVenue.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-[#4F0809] text-[#FFF8EB] shadow-sm'
                      : 'bg-white text-stone-700 hover:bg-stone-50 border border-[#D8AA67]/40'
                  }`}
                >
                  {cat.name} ({cat.items?.length || 0})
                </button>
              ))}
            </div>
          </div>

          {/* ── DISH CATEGORIES & CARDS ── */}
          {isLoadingMenu ? (
            <div className="py-20 text-center">
              <div className="w-8 h-8 border-2 border-[#4F0809] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-[#4F0809] font-medium">Loading palace menu...</p>
            </div>
          ) : categoriesForVenue.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-2xl border border-[#D8AA67]/30 p-8 max-w-lg mx-auto">
              <Utensils className="w-10 h-10 text-[#B08D57] mx-auto mb-3 opacity-60" />
              <h3 className="text-lg font-bold text-[#4F0809]">No dishes available</h3>
              <p className="text-xs text-stone-500 mt-1">
                The menu for this venue is currently empty. You can add categories and dishes from the Staff Menu Builder.
              </p>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-2xl border border-[#D8AA67]/30 p-8">
              <AlertCircle className="w-10 h-10 text-[#B08D57] mx-auto mb-3" />
              <h3 className="text-lg font-bold text-[#4F0809]">No dishes match your filter</h3>
              <p className="text-xs text-stone-500 mt-1">
                Try resetting your search query or dietary preference.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedDiet('all');
                  setActiveCategory('all');
                }}
                className="mt-4 px-4 py-2 rounded-lg bg-[#4F0809] text-[#FFF8EB] text-xs font-semibold"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="space-y-12">
              {filteredCategories.map((category) => (
                <section key={category.id} id={category.id} className="space-y-4">
                  {/* Category Title Heading */}
                  <div className="flex items-center justify-between border-b border-[#D8AA67]/30 pb-2">
                    <h3
                      className="text-xl sm:text-2xl font-bold text-[#4F0809]"
                      style={{
                        fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
                      }}
                    >
                      {category.name}
                    </h3>
                    <span className="text-xs text-stone-500 font-medium">
                      {category.items?.length || 0} items
                    </span>
                  </div>

                  {/* Dishes Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {category.items?.map((item) => {
                      const inCartQty = cart[item.id]?.quantity || 0;
                      const isVeg = (item.dietary_labels || []).some(
                        (l) => l.toLowerCase().includes('veg') && !l.toLowerCase().includes('non')
                      );

                      return (
                        <div
                          key={item.id}
                          className="bg-white rounded-2xl border border-[#D8AA67]/40 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                        >
                          {/* Dish Image */}
                          <div className="relative h-44 w-full bg-stone-100 overflow-hidden">
                            <Image
                              src={item.image_url || '/images/food/restaurant.jpg'}
                              alt={item.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {/* Dietary badge in corner */}
                            <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-white/95 backdrop-blur text-[10px] font-bold shadow-xs flex items-center space-x-1.5">
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  isVeg ? 'bg-emerald-600' : 'bg-red-600'
                                }`}
                              />
                              <span className={isVeg ? 'text-emerald-800' : 'text-red-800'}>
                                {isVeg ? 'Veg' : 'Non-Veg'}
                              </span>
                            </div>

                            {/* Additional labels (e.g. Chef Special, Gluten-Free) */}
                            {item.dietary_labels && item.dietary_labels.length > 1 && (
                              <div className="absolute top-3 right-3 flex flex-col gap-1">
                                {item.dietary_labels
                                  .filter(
                                    (l) =>
                                      !l.toLowerCase().includes('veg') &&
                                      !l.toLowerCase().includes('non')
                                  )
                                  .slice(0, 1)
                                  .map((lbl) => (
                                    <span
                                      key={lbl}
                                      className="px-2 py-0.5 rounded bg-[#4F0809]/90 text-[#FFF8EB] text-[9px] font-semibold"
                                    >
                                      {lbl}
                                    </span>
                                  ))}
                              </div>
                            )}
                          </div>

                          {/* Dish Info & Actions */}
                          <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                            <div>
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="font-bold text-sm sm:text-base text-[#4F0809] leading-snug">
                                  {item.name}
                                </h4>
                              </div>
                              <p className="text-xs text-stone-600 font-light mt-1 line-clamp-2 leading-relaxed">
                                {item.description}
                              </p>
                            </div>

                            <div className="pt-2 flex items-center justify-between border-t border-stone-100">
                              <span
                                className="text-base font-bold text-[#4F0809]"
                                style={{
                                  fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
                                }}
                              >
                                {formatMoney(item.price_minor)}
                              </span>

                              {/* Quantity Stepper or Add button */}
                              {inCartQty === 0 ? (
                                <button
                                  type="button"
                                  onClick={() => addToCart(item)}
                                  className="inline-flex items-center space-x-1 px-3.5 py-1.5 rounded-lg bg-[#4F0809] hover:bg-[#680E10] text-[#FFF8EB] text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                                  aria-label={`Add ${item.name} to order`}
                                >
                                  <Plus className="w-3.5 h-3.5 text-[#D8AA67]" />
                                  <span>Add</span>
                                </button>
                              ) : (
                                <div className="inline-flex items-center rounded-lg bg-[#F5EFE6] border border-[#D8AA67] p-0.5">
                                  <button
                                    type="button"
                                    onClick={() => decreaseQuantity(item.id)}
                                    className="w-7 h-7 rounded flex items-center justify-center text-[#4F0809] hover:bg-[#EBDDC8] transition cursor-pointer"
                                    aria-label={`Decrease quantity of ${item.name}`}
                                  >
                                    <Minus className="w-3.5 h-3.5" />
                                  </button>
                                  <span className="w-8 text-center text-xs font-bold text-[#4F0809]">
                                    {inCartQty}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => addToCart(item)}
                                    className="w-7 h-7 rounded flex items-center justify-center text-[#4F0809] hover:bg-[#EBDDC8] transition cursor-pointer"
                                    aria-label={`Increase quantity of ${item.name}`}
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          )}
        </main>
      )}

      {/* ── FLOATING MOBILE CART BAR ── */}
      {totalCartCount > 0 && !isCartOpen && (
        <div className="md:hidden fixed bottom-16 left-4 right-4 z-40 animate-fade-in-up">
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#4F0809] text-[#FFF8EB] shadow-2xl border border-[#D8AA67]/60 cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-[#D8AA67] text-[#4F0809] flex items-center justify-center font-bold text-xs">
                {totalCartCount}
              </div>
              <div className="text-left">
                <p className="text-xs font-bold leading-tight">View Cart Summary</p>
                <p className="text-[10px] text-[#D8AA67]">
                  {orderingMethod ? methodDetails[orderingMethod].label : 'Order'} • {selectedVenue === 'cafe' ? 'Café' : 'Restaurant'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold text-[#FFF8EB]">{formatMoney(totalMinor)}</span>
              <ArrowRight className="w-4 h-4 text-[#D8AA67]" />
            </div>
          </button>
        </div>
      )}

      {/* ── SLIDE-OVER CART DRAWER (WORKS ON DESKTOP & MOBILE) ── */}
      {isCartOpen && (
        <div
          className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end transition-opacity"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart-drawer-heading"
        >
          <div className="w-full max-w-md bg-[#FFFDF9] h-full shadow-2xl flex flex-col justify-between border-l border-[#D8AA67]/40 animate-slide-left">
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 border-b border-[#D8AA67]/30 flex items-center justify-between bg-[#F5EFE6]">
              <div className="flex items-center space-x-2.5">
                <ShoppingBag className="w-5 h-5 text-[#4F0809]" />
                <h3 id="cart-drawer-heading" className="text-lg font-bold text-[#4F0809]">
                  Your Order Cart ({totalCartCount})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-lg text-stone-500 hover:text-[#4F0809] hover:bg-white/80 transition cursor-pointer"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Context Notice: Order Method & Venue */}
            <div className="px-4 py-2.5 bg-[#FFF8EB] border-b border-[#D8AA67]/30 flex items-center justify-between text-xs text-[#4F0809]">
              <div>
                <span className="font-semibold">Fulfillment:</span>{' '}
                <span>{orderingMethod ? methodDetails[orderingMethod].label : 'Dine In'}</span>
              </div>
              <div>
                <span className="font-semibold">Venue:</span>{' '}
                <span>{selectedVenue === 'cafe' ? 'Courtyard Café' : 'Royal Dining'}</span>
              </div>
            </div>

            {/* Itemized Cart List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
              {cartEntries.length === 0 ? (
                <div className="py-20 text-center text-stone-500 space-y-2">
                  <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto" />
                  <p className="text-sm font-semibold">Your cart is currently empty</p>
                  <p className="text-xs font-light max-w-xs mx-auto">
                    Add dishes from the menu to start your royal feast order.
                  </p>
                </div>
              ) : (
                cartEntries.map(({ item, quantity, venueType }) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-white border border-[#D8AA67]/30 shadow-2xs flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-stone-100">
                        <Image
                          src={item.image_url || '/images/food/restaurant.jpg'}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <h5 className="font-bold text-xs text-[#4F0809] truncate">{item.name}</h5>
                        <p className="text-[11px] text-stone-500">
                          {formatMoney(item.price_minor)} each •{' '}
                          <span className="capitalize">{venueType}</span>
                        </p>
                      </div>
                    </div>

                    {/* Stepper */}
                    <div className="flex items-center space-x-2 shrink-0">
                      <div className="flex items-center border border-[#D8AA67]/60 rounded-md bg-[#F5EFE6]">
                        <button
                          type="button"
                          onClick={() => decreaseQuantity(item.id)}
                          className="w-6 h-6 flex items-center justify-center text-[#4F0809] hover:bg-[#EBDDC8] cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-[#4F0809]">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => addToCart(item)}
                          className="w-6 h-6 flex items-center justify-center text-[#4F0809] hover:bg-[#EBDDC8] cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-bold text-xs text-[#4F0809] w-16 text-right">
                        {formatMoney(item.price_minor * quantity)}
                      </span>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-stone-400 hover:text-red-700 ml-1 cursor-pointer"
                        title="Remove item"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Bill Breakdown & Checkout CTA */}
            {cartEntries.length > 0 && (
              <div className="p-4 sm:p-5 border-t border-[#D8AA67]/40 bg-[#F5EFE6] space-y-3">
                <div className="space-y-1.5 text-xs text-stone-700">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatMoney(subtotalMinor)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (5%):</span>
                    <span>{formatMoney(taxMinor)}</span>
                  </div>
                  {orderingMethod === 'delivery' && (
                    <div className="flex justify-between">
                      <span>Delivery Fee:</span>
                      <span>{formatMoney(deliveryFeeMinor)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-sm text-[#4F0809] pt-2 border-t border-[#D8AA67]/30">
                    <span>Total Amount:</span>
                    <span>{formatMoney(totalMinor)}</span>
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={clearCart}
                    className="px-3 py-2.5 rounded-lg border border-stone-300 text-stone-600 hover:bg-white text-xs font-semibold cursor-pointer"
                  >
                    Clear
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCartOpen(false);
                      setIsCheckoutOpen(true);
                    }}
                    className="flex-1 py-2.5 px-4 rounded-lg bg-[#4F0809] hover:bg-[#680E10] text-[#FFF8EB] text-xs font-bold transition shadow flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>Proceed to Order ({formatMoney(totalMinor)})</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#D8AA67]" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── CHECKOUT COMPLETION MODAL ── */}
      {isCheckoutOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#D8AA67]/50 overflow-hidden animate-fade-in-up">
            {/* Header */}
            <div className="p-5 border-b border-[#D8AA67]/30 bg-[#4F0809] text-[#FFF8EB] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#D8AA67] uppercase font-bold tracking-widest block">
                  Final Step
                </span>
                <h3
                  className="text-xl font-bold"
                  style={{
                    fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
                  }}
                >
                  Confirm Your Royal Order
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCheckoutOpen(false)}
                className="text-[#E6D5B8] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error prompt */}
            {errorMessage && (
              <div className="m-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handlePlaceOrder} className="p-5 space-y-4">
              {/* Order Mode Badge */}
              <div className="p-3 rounded-xl bg-[#F5EFE6] border border-[#D8AA67]/40 flex items-center justify-between text-xs">
                <div>
                  <span className="text-stone-500 font-medium">Method: </span>
                  <span className="font-bold text-[#4F0809]">
                    {orderingMethod ? methodDetails[orderingMethod].label : 'Dine In'}
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 font-medium">Venue: </span>
                  <span className="font-bold text-[#4F0809]">
                    {selectedVenue === 'cafe' ? 'Courtyard Café' : 'Royal Dining'}
                  </span>
                </div>
              </div>

              {/* Guest Details */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maharaja Vikramaditya / Priya Sharma"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 focus:outline-none focus:border-[#4F0809]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Mobile Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 focus:outline-none focus:border-[#4F0809]"
                  />
                </div>

                {/* Conditional Fields based on Ordering Method */}
                {orderingMethod === 'dine_in' && (
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Table Number or Room Suite Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Table T-101 / Suite 204"
                      value={tableOrRoom}
                      onChange={(e) => setTableOrRoom(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 focus:outline-none focus:border-[#4F0809]"
                    />
                  </div>
                )}

                {orderingMethod === 'delivery' && (
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Delivery Address *
                    </label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Street, Landmark, Apartment, Udaipur"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 focus:outline-none focus:border-[#4F0809]"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Kitchen Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mild spice, extra mint chutney, no garlic"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg border border-stone-300 focus:outline-none focus:border-[#4F0809]"
                  />
                </div>
              </div>

              {/* Order summary mini table */}
              <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 text-xs space-y-1">
                <div className="flex justify-between font-medium text-stone-600">
                  <span>{totalCartCount} items</span>
                  <span>{formatMoney(totalMinor)}</span>
                </div>
                <div className="text-[11px] text-stone-400">
                  Includes GST &amp; kitchen ticket generation.
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(false)}
                  className="px-4 py-2.5 rounded-lg border border-stone-300 text-stone-600 hover:bg-stone-50 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 px-4 rounded-lg bg-[#4F0809] hover:bg-[#680E10] text-[#FFF8EB] text-xs font-bold transition shadow flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Placing Order with Kitchen...</span>
                  ) : (
                    <>
                      <span>Submit &amp; Send to Kitchen ({formatMoney(totalMinor)})</span>
                      <CheckCircle2 className="w-4 h-4 text-[#D8AA67]" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
