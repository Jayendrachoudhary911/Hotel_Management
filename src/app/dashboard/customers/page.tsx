'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Search,
  Plus,
  Download,
  Eye,
  Star,
  Award,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  Building,
  UtensilsCrossed,
  Coffee,
  BedDouble,
  RefreshCw,
  MapPin,
  Clock,
  ShoppingBag,
  Receipt,
  X,
  CheckCircle2,
} from 'lucide-react';

interface DiningOrder {
  id: string;
  order_number: string;
  outlet_name: string;
  channel: string;
  fulfilment_mode: string;
  total_minor: number;
  status: string;
  created_at: string;
  items_summary: string;
}

interface HotelStay {
  id: string;
  reference_code: string;
  room_type_name: string;
  check_in: string;
  check_out: string;
  party_size: number;
  status: string;
  total_minor: number;
}

interface TableBooking {
  id: string;
  outlet_name: string;
  table_number: string;
  date: string;
  time: string;
  party_size: number;
  status: string;
}

interface CustomerProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  guest_type: string;
  venue_type: 'hotel' | 'restaurant' | 'cafe' | 'all';
  total_spend_minor: number;
  hotel_spend_minor: number;
  dining_spend_minor: number;
  stays_count: number;
  orders_count: number;
  table_reservations_count: number;
  last_visit: string;
  created_at: string;
  dining_orders: DiningOrder[];
  hotel_stays: HotelStay[];
  table_bookings: TableBooking[];
  notes?: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'hotel' | 'restaurant' | 'cafe' | 'vip'>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile | null>(null);
  const [activeProfileTab, setActiveProfileTab] = useState<'overview' | 'dining' | 'stays' | 'tables'>('overview');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Add customer form
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formGuestType, setFormGuestType] = useState('Royal VIP');
  const [formCity, setFormCity] = useState('New Delhi');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/customers');
      if (res.ok) {
        const data = await res.json();
        setCustomers(data.customers || []);
      }
    } catch (err) {
      console.error('Failed to load customer profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q);

      let matchesTab = true;
      if (activeTab === 'hotel') {
        matchesTab = c.venue_type === 'hotel' || c.venue_type === 'all' || c.stays_count > 0;
      } else if (activeTab === 'restaurant') {
        matchesTab =
          c.venue_type === 'restaurant' ||
          c.venue_type === 'all' ||
          c.dining_orders.some((o) => o.outlet_name.includes('Restaurant'));
      } else if (activeTab === 'cafe') {
        matchesTab =
          c.venue_type === 'cafe' ||
          c.venue_type === 'all' ||
          c.dining_orders.some((o) => o.outlet_name.includes('Café'));
      } else if (activeTab === 'vip') {
        matchesTab = c.guest_type.toLowerCase().includes('vip') || c.venue_type === 'all';
      }

      return matchesSearch && matchesTab;
    });
  }, [customers, searchQuery, activeTab]);

  // Dynamic Calculated Metrics
  const totalCustomers = customers.length;
  const hotelGuestsCount = customers.filter((c) => c.stays_count > 0 || c.venue_type === 'hotel').length;
  const diningCustomersCount = customers.filter(
    (c) => c.orders_count > 0 || c.table_reservations_count > 0 || c.venue_type === 'restaurant' || c.venue_type === 'cafe'
  ).length;
  const totalSpendSum = customers.reduce((sum, c) => sum + (c.total_spend_minor || 0) / 100, 0);

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName.trim(),
          phone: formPhone.trim(),
          email: formEmail.trim(),
          guest_type: formGuestType,
          city: formCity.trim(),
        }),
      });

      if (res.ok) {
        setIsAddModalOpen(false);
        setFormName('');
        setFormPhone('');
        setFormEmail('');
        await loadData();
      }
    } catch (err) {
      console.error('Error creating customer:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'Patron ID,Name,Phone,Email,Venue Category,Guest Type,City,Stays,Dining Orders,Stay Spend,Dining Spend,Total Spend,Last Interaction',
    ];
    const rows = filteredCustomers.map((c) =>
      [
        `"${c.id}"`,
        `"${c.name}"`,
        `"${c.phone}"`,
        `"${c.email}"`,
        `"${c.venue_type}"`,
        `"${c.guest_type}"`,
        `"${c.city}"`,
        c.stays_count,
        c.orders_count,
        `"₹${(c.hotel_spend_minor / 100).toLocaleString('en-IN')}"`,
        `"₹${(c.dining_spend_minor / 100).toLocaleString('en-IN')}"`,
        `"₹${(c.total_spend_minor / 100).toLocaleString('en-IN')}"`,
        `"${c.last_visit}"`,
      ].join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rajmahal_patrons_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#E8DCD2]">
        <div>
          <h1
            className="text-2xl font-bold text-[#4F0809]"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Guest Directory &amp; Patron Profiles
          </h1>
          <p className="text-xs text-[#81736D] mt-0.5">
            Unified patron intelligence across Palace Hotel Suites, Royal Khansama Restaurant, and Jharokha Café
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E8DCD2] bg-white text-[#4F0809] hover:bg-[#F6EAE0] text-xs font-medium shadow-xs transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E8DCD2] bg-white text-[#4F0809] hover:bg-[#F6EAE0] text-xs font-medium shadow-xs transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Directory</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#4F0809] hover:bg-[#6B1518] text-white text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-[#D8AA67]" />
            <span>Register Guest Profile</span>
          </button>
        </div>
      </div>

      {/* ── Metric Summary ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border border-[#E8DCD2] rounded-xl p-3 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#81736D]">
              Total Patrons
            </div>
            <div className="text-xl font-bold text-[#302421] mt-0.5">{totalCustomers}</div>
            <div className="text-[10px] text-[#2E7D32] font-medium mt-0.5">Hotel &amp; dining directory</div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-[#FBF6EF] border border-[#E8DCD2] flex items-center justify-center text-[#4F0809]">
            <Users className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white border border-[#E8DCD2] rounded-xl p-3 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#81736D]">
              Hotel Suite Guests
            </div>
            <div className="text-xl font-bold text-[#4F0809] mt-0.5">{hotelGuestsCount}</div>
            <div className="text-[10px] text-[#B78A48] font-medium mt-0.5">Palace room reservations</div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-[#FBF6EF] border border-[#E8DCD2] flex items-center justify-center text-[#4F0809]">
            <BedDouble className="w-4 h-4 text-[#4F0809]" />
          </div>
        </div>

        <div className="bg-white border border-[#E8DCD2] rounded-xl p-3 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#81736D]">
              Restaurant &amp; Café Diners
            </div>
            <div className="text-xl font-bold text-[#B78A48] mt-0.5">{diningCustomersCount}</div>
            <div className="text-[10px] text-[#81736D] mt-0.5">Dine-in, delivery &amp; tables</div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-[#FBF6EF] border border-[#E8DCD2] flex items-center justify-center text-[#B78A48]">
            <UtensilsCrossed className="w-4 h-4 text-[#B78A48]" />
          </div>
        </div>

        <div className="bg-white border border-[#E8DCD2] rounded-xl p-3 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#81736D]">
              Lifetime Patron Spend
            </div>
            <div className="text-xl font-bold text-[#2E7D32] mt-0.5">
              ₹{Math.round(totalSpendSum).toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-[#2E7D32] font-medium mt-0.5">Suites, dining &amp; café</div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-[#2E7D32]/10 border border-[#2E7D32]/20 flex items-center justify-center text-[#2E7D32]">
            <CreditCard className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* ── Search & Venue Filter Tabs ── */}
      <div className="bg-white border border-[#E8DCD2] rounded-xl p-3 shadow-xs flex flex-col sm:flex-row gap-2.5 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#81736D]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patron name, mobile, email, or city..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-[#E8DCD2] text-xs bg-[#FBF6EF]/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#4F0809]"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {[
            { label: 'All Patrons', value: 'all', icon: Users },
            { label: 'Hotel Guests', value: 'hotel', icon: BedDouble },
            { label: 'Restaurant Diners', value: 'restaurant', icon: UtensilsCrossed },
            { label: 'Café Patrons', value: 'cafe', icon: Coffee },
            { label: 'Royal VIP', value: 'vip', icon: Award },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-[#4F0809] text-white shadow-xs'
                    : 'bg-[#FBF6EF] text-[#81736D] hover:text-[#302421] border border-[#E8DCD2]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#D8AA67]' : 'text-[#81736D]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Customers Table ── */}
      <div className="bg-white border border-[#E8DCD2] rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E8DCD2] bg-[#FBF6EF]/75 text-[10px] font-bold uppercase tracking-wider text-[#81736D]">
                <th className="py-2.5 px-3">Patron ID</th>
                <th className="py-2.5 px-3">Guest Name</th>
                <th className="py-2.5 px-3">Contact</th>
                <th className="py-2.5 px-3">Patron Type &amp; Venue</th>
                <th className="py-2.5 px-3">Activity &amp; Frequency</th>
                <th className="py-2.5 px-3">Total Spend</th>
                <th className="py-2.5 px-3">Last Interaction</th>
                <th className="py-2.5 px-3 text-right">Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8DCD2]/70 text-[#302421]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-xs text-[#81736D]">
                    <RefreshCw className="w-6 h-6 text-[#D8AA67] animate-spin mx-auto mb-2" />
                    <span>Loading unified patron profiles from hotel, restaurant, and café...</span>
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-xs text-[#81736D]">
                    <Users className="w-8 h-8 text-[#D8AA67] mx-auto mb-2 opacity-60" />
                    <div className="font-semibold text-sm text-[#4F0809]">No Patrons Found</div>
                    <div className="text-xs text-[#81736D] mt-0.5">
                      No customer records match your filter. Register a guest or take real orders/reservations.
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => {
                  const isMultiVenue = cust.venue_type === 'all';
                  const isRestaurant = cust.venue_type === 'restaurant';
                  const isCafe = cust.venue_type === 'cafe';

                  return (
                    <tr key={cust.id} className="hover:bg-[#FBF6EF]/50 transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-[#4F0809] font-mono text-[11px]">
                        {cust.id}
                      </td>

                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-[#302421] text-xs">{cust.name}</div>
                        <div className="text-[10px] text-[#81736D] flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#B78A48]" />
                          <span>{cust.city}</span>
                        </div>
                      </td>

                      <td className="py-2.5 px-3">
                        <div className="text-[#302421] font-medium">{cust.phone || 'No phone'}</div>
                        <div className="text-[10px] text-[#81736D] truncate max-w-[180px]">{cust.email}</div>
                      </td>

                      <td className="py-2.5 px-3">
                        <div className="flex flex-col items-start gap-1">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              isMultiVenue
                                ? 'bg-[#4F0809] text-[#E1B46F]'
                                : isCafe
                                ? 'bg-[#D8AA67]/20 text-[#8F6628] border border-[#D8AA67]/40'
                                : isRestaurant
                                ? 'bg-amber-100 text-amber-900 border border-amber-200'
                                : cust.guest_type === 'Royal VIP'
                                ? 'bg-[#4F0809] text-[#E1B46F]'
                                : 'bg-[#F6EAE0] text-[#4F0809]'
                            }`}
                          >
                            {isMultiVenue && <Star className="w-2.5 h-2.5 text-[#E1B46F]" />}
                            {isRestaurant && <UtensilsCrossed className="w-2.5 h-2.5" />}
                            {isCafe && <Coffee className="w-2.5 h-2.5" />}
                            {!isMultiVenue && !isRestaurant && !isCafe && <BedDouble className="w-2.5 h-2.5" />}
                            <span>{cust.guest_type}</span>
                          </span>

                          <span className="text-[9px] text-[#81736D]">
                            {isMultiVenue
                              ? 'Hotel & Dining Patron'
                              : isCafe
                              ? 'Jharokha Café & Lounge'
                              : isRestaurant
                              ? 'Royal Khansama Restaurant'
                              : 'Palace Suite Stays'}
                          </span>
                        </div>
                      </td>

                      <td className="py-2.5 px-3">
                        <div className="font-medium text-[#302421] text-xs">
                          {cust.stays_count > 0 && <span>{cust.stays_count} Stay{cust.stays_count > 1 ? 's' : ''}</span>}
                          {cust.stays_count > 0 && cust.orders_count > 0 && <span className="mx-1 text-[#81736D]">•</span>}
                          {cust.orders_count > 0 && <span>{cust.orders_count} Dining Order{cust.orders_count > 1 ? 's' : ''}</span>}
                          {cust.stays_count === 0 && cust.orders_count === 0 && (
                            <span className="text-[#81736D]">New Patron Profile</span>
                          )}
                        </div>
                        {cust.table_reservations_count > 0 && (
                          <div className="text-[10px] text-[#2E7D32] mt-0.5">
                            {cust.table_reservations_count} Table Booking{cust.table_reservations_count > 1 ? 's' : ''}
                          </div>
                        )}
                      </td>

                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-[#302421] text-xs">
                          ₹{Math.round(cust.total_spend_minor / 100).toLocaleString('en-IN')}
                        </div>
                        {cust.hotel_spend_minor > 0 && cust.dining_spend_minor > 0 && (
                          <div className="text-[9px] text-[#81736D]">
                            Stays: ₹{Math.round(cust.hotel_spend_minor / 100).toLocaleString('en-IN')} | Dining: ₹{Math.round(cust.dining_spend_minor / 100).toLocaleString('en-IN')}
                          </div>
                        )}
                      </td>

                      <td className="py-2.5 px-3 text-[#81736D] text-xs whitespace-nowrap">
                        {cust.last_visit}
                      </td>

                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => {
                            setSelectedCustomer(cust);
                            setActiveProfileTab(cust.dining_orders.length > 0 && cust.hotel_stays.length === 0 ? 'dining' : 'overview');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#FBF6EF] hover:bg-[#E8DCD2] text-[#4F0809] font-semibold text-[11px] transition inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Profile</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Comprehensive Guest Profile Modal ── */}
      {selectedCustomer && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setSelectedCustomer(null)}
        >
          <div
            className="bg-white border border-[#E8DCD2] rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedCustomer(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#FBF6EF] text-[#81736D] hover:text-[#4F0809] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Profile Header */}
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded bg-[#4F0809] text-[#E1B46F] text-[10px] font-bold uppercase tracking-wider">
                {selectedCustomer.guest_type}
              </span>
              <span className="text-xs font-mono text-[#81736D]">{selectedCustomer.id}</span>
            </div>
            <h2
              className="text-2xl font-bold text-[#4F0809]"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              {selectedCustomer.name}
            </h2>
            <p className="text-xs text-[#81736D] mb-4">
              {selectedCustomer.city ? `Patron from ${selectedCustomer.city}` : 'Rajmahal Heritage Grand Patron'} • Last active on {selectedCustomer.last_visit}
            </p>

            {/* Metric KPI cards for this customer */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
              <div className="p-2.5 bg-[#FBF6EF] rounded-xl border border-[#E8DCD2]">
                <div className="text-[9px] text-[#81736D] uppercase font-bold tracking-wider">Total Spend</div>
                <div className="text-base font-bold text-[#2E7D32] mt-0.5">
                  ₹{Math.round(selectedCustomer.total_spend_minor / 100).toLocaleString('en-IN')}
                </div>
              </div>
              <div className="p-2.5 bg-[#FBF6EF] rounded-xl border border-[#E8DCD2]">
                <div className="text-[9px] text-[#81736D] uppercase font-bold tracking-wider">Hotel Stays</div>
                <div className="text-base font-bold text-[#4F0809] mt-0.5">
                  {selectedCustomer.stays_count} Visit{selectedCustomer.stays_count > 1 ? 's' : ''}
                </div>
              </div>
              <div className="p-2.5 bg-[#FBF6EF] rounded-xl border border-[#E8DCD2]">
                <div className="text-[9px] text-[#81736D] uppercase font-bold tracking-wider">Dining Orders</div>
                <div className="text-base font-bold text-[#B78A48] mt-0.5">
                  {selectedCustomer.orders_count} Order{selectedCustomer.orders_count > 1 ? 's' : ''}
                </div>
              </div>
              <div className="p-2.5 bg-[#FBF6EF] rounded-xl border border-[#E8DCD2]">
                <div className="text-[9px] text-[#81736D] uppercase font-bold tracking-wider">Contact</div>
                <div className="text-xs font-semibold text-[#302421] mt-0.5 truncate">{selectedCustomer.phone || 'N/A'}</div>
              </div>
            </div>

            {/* Profile Tabs */}
            <div className="flex items-center gap-1.5 border-b border-[#E8DCD2] pb-2 mb-4">
              <button
                onClick={() => setActiveProfileTab('overview')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activeProfileTab === 'overview'
                    ? 'bg-[#4F0809] text-white shadow-xs'
                    : 'text-[#81736D] hover:text-[#302421] hover:bg-[#FBF6EF]'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveProfileTab('dining')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${
                  activeProfileTab === 'dining'
                    ? 'bg-[#4F0809] text-white shadow-xs'
                    : 'text-[#81736D] hover:text-[#302421] hover:bg-[#FBF6EF]'
                }`}
              >
                <UtensilsCrossed className="w-3 h-3" />
                <span>Restaurant &amp; Café ({selectedCustomer.dining_orders.length})</span>
              </button>
              <button
                onClick={() => setActiveProfileTab('stays')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${
                  activeProfileTab === 'stays'
                    ? 'bg-[#4F0809] text-white shadow-xs'
                    : 'text-[#81736D] hover:text-[#302421] hover:bg-[#FBF6EF]'
                }`}
              >
                <BedDouble className="w-3 h-3" />
                <span>Hotel Stays ({selectedCustomer.hotel_stays.length})</span>
              </button>
              <button
                onClick={() => setActiveProfileTab('tables')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${
                  activeProfileTab === 'tables'
                    ? 'bg-[#4F0809] text-white shadow-xs'
                    : 'text-[#81736D] hover:text-[#302421] hover:bg-[#FBF6EF]'
                }`}
              >
                <span>Table Bookings ({selectedCustomer.table_bookings.length})</span>
              </button>
            </div>

            {/* Tab: Overview */}
            {activeProfileTab === 'overview' && (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-[#FBF6EF] rounded-xl border border-[#E8DCD2] grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-[10px] text-[#81736D] uppercase">Mobile Contact</div>
                    <div className="font-semibold text-[#302421] mt-0.5">{selectedCustomer.phone || 'Not recorded'}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#81736D] uppercase">Email Address</div>
                    <div className="font-semibold text-[#302421] mt-0.5 truncate">{selectedCustomer.email || 'Not recorded'}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#81736D] uppercase">Palace Stays Spend</div>
                    <div className="font-semibold text-[#4F0809] mt-0.5">
                      ₹{Math.round(selectedCustomer.hotel_spend_minor / 100).toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#81736D] uppercase">Dining &amp; Café Spend</div>
                    <div className="font-semibold text-[#2E7D32] mt-0.5">
                      ₹{Math.round(selectedCustomer.dining_spend_minor / 100).toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-white border border-[#E8DCD2] rounded-xl">
                  <div className="font-semibold text-[#4F0809] mb-1.5">Hospitality Preferences &amp; Activity Summary</div>
                  <p className="text-[#81736D] text-[11px] leading-relaxed">
                    {selectedCustomer.venue_type === 'all'
                      ? 'Distinguished royal patron who both stays in palace suites and regularly dines at the hotel restaurants and café lounges.'
                      : selectedCustomer.venue_type === 'restaurant'
                      ? 'Frequent restaurant patron enjoying royal Rajasthani dining, thalis, and tandoor delicacies.'
                      : selectedCustomer.venue_type === 'cafe'
                      ? 'Regular café patron enjoying artisanal teas, hand-brewed coffees, and gourmet pastries.'
                      : 'Palace suite guest with confirmed room reservations and royal hospitality services.'}
                  </p>
                </div>
              </div>
            )}

            {/* Tab: Dining & Café Orders */}
            {activeProfileTab === 'dining' && (
              <div className="space-y-2 text-xs">
                {selectedCustomer.dining_orders.length === 0 ? (
                  <div className="p-8 text-center text-[#81736D] bg-[#FBF6EF]/50 rounded-xl">
                    No restaurant or café orders recorded yet for this guest.
                  </div>
                ) : (
                  selectedCustomer.dining_orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-3 bg-[#FBF6EF] border border-[#E8DCD2] rounded-xl flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#4F0809] font-mono text-xs">{ord.order_number}</span>
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-white border border-[#E8DCD2] text-[#4F0809]">
                            {ord.outlet_name}
                          </span>
                          <span className="text-[10px] uppercase font-semibold text-[#81736D]">
                            {ord.fulfilment_mode.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#302421] mt-1 font-medium">{ord.items_summary}</div>
                        <div className="text-[10px] text-[#81736D] mt-0.5">
                          {new Date(ord.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-bold text-sm text-[#2E7D32]">
                          ₹{(ord.total_minor / 100).toLocaleString('en-IN')}
                        </div>
                        <span className="inline-block px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[9px] font-semibold uppercase mt-1">
                          {ord.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab: Hotel Stays */}
            {activeProfileTab === 'stays' && (
              <div className="space-y-2 text-xs">
                {selectedCustomer.hotel_stays.length === 0 ? (
                  <div className="p-8 text-center text-[#81736D] bg-[#FBF6EF]/50 rounded-xl">
                    No hotel room reservations recorded for this patron.
                  </div>
                ) : (
                  selectedCustomer.hotel_stays.map((stay) => (
                    <div
                      key={stay.id}
                      className="p-3 bg-[#FBF6EF] border border-[#E8DCD2] rounded-xl flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#4F0809] font-mono text-xs">{stay.reference_code}</span>
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-white border border-[#E8DCD2] text-[#4F0809]">
                            {stay.room_type_name}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#302421] mt-1">
                          {stay.check_in} → {stay.check_out} ({stay.party_size} Guests)
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-bold text-sm text-[#4F0809]">
                          ₹{(stay.total_minor / 100).toLocaleString('en-IN')}
                        </div>
                        <span className="inline-block px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[9px] font-semibold uppercase mt-1">
                          {stay.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab: Table Bookings */}
            {activeProfileTab === 'tables' && (
              <div className="space-y-2 text-xs">
                {selectedCustomer.table_bookings.length === 0 ? (
                  <div className="p-8 text-center text-[#81736D] bg-[#FBF6EF]/50 rounded-xl">
                    No dining table reservations recorded for this patron.
                  </div>
                ) : (
                  selectedCustomer.table_bookings.map((tbl) => (
                    <div
                      key={tbl.id}
                      className="p-3 bg-[#FBF6EF] border border-[#E8DCD2] rounded-xl flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="font-bold text-xs text-[#4F0809]">{tbl.outlet_name}</div>
                        <div className="text-[11px] text-[#302421] mt-0.5">
                          {tbl.table_number} • {tbl.date} at {tbl.time} ({tbl.party_size} Guests)
                        </div>
                      </div>
                      <span className="inline-block px-1.5 py-0.5 rounded bg-[#FBF6EF] border border-[#E8DCD2] text-[#4F0809] text-[9px] font-semibold uppercase">
                        {tbl.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Modal Footer */}
            <div className="pt-4 mt-4 border-t border-[#E8DCD2] flex justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-1.5 rounded-lg bg-[#4F0809] hover:bg-[#6B1518] text-white text-xs font-semibold shadow-xs transition cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Customer Modal ── */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="bg-white border border-[#E8DCD2] rounded-2xl max-w-md w-full p-6 shadow-2xl relative cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#FBF6EF] text-[#81736D] hover:text-[#4F0809] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <h2
              className="text-xl font-bold text-[#4F0809] mb-1"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Register Patron Profile
            </h2>
            <p className="text-xs text-[#81736D] mb-4">
              Add a new guest profile to the Rajmahal Heritage patron directory
            </p>

            <form onSubmit={handleCreateCustomer} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-[#4F0809] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Kunwar Vikramaditya Singh"
                  className="w-full px-3 py-2 rounded-xl border border-[#E8DCD2] bg-[#FBF6EF]/50 focus:bg-white focus:outline-none focus:border-[#4F0809]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#4F0809] mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DCD2] bg-[#FBF6EF]/50 focus:bg-white focus:outline-none focus:border-[#4F0809]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#4F0809] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="patron@royalmarwar.com"
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DCD2] bg-[#FBF6EF]/50 focus:bg-white focus:outline-none focus:border-[#4F0809]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#4F0809] mb-1">
                    Patron Classification
                  </label>
                  <select
                    value={formGuestType}
                    onChange={(e) => setFormGuestType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DCD2] bg-[#FBF6EF]/50 focus:bg-white focus:outline-none focus:border-[#4F0809]"
                  >
                    <option value="Royal VIP">Royal VIP</option>
                    <option value="Hotel Guest">Hotel Guest</option>
                    <option value="Restaurant Diner">Restaurant Diner</option>
                    <option value="Café Patron">Café Patron</option>
                    <option value="Heritage Member">Heritage Member</option>
                    <option value="Corporate Patron">Corporate Patron</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#4F0809] mb-1">
                    Origin / Residence City
                  </label>
                  <input
                    type="text"
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    placeholder="e.g. New Delhi, Mumbai, Udaipur"
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DCD2] bg-[#FBF6EF]/50 focus:bg-white focus:outline-none focus:border-[#4F0809]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E8DCD2] text-[#81736D] hover:bg-[#FBF6EF] font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-[#4F0809] hover:bg-[#6B1518] text-white font-semibold shadow-sm transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Register Profile</span>
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
