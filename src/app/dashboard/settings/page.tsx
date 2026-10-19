'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Building,
  Utensils,
  QrCode,
  Truck,
  Receipt,
  Users,
  Save,
  Plus,
  Printer,
  CheckCircle2,
  X,
  Phone,
  Mail,
  MapPin,
  Clock,
  Shield,
  Trash2,
  Percent,
} from 'lucide-react';
import { INITIAL_PROPERTY, INITIAL_OUTLETS } from '@/lib/data/initial-data';
import { formatMoney } from '@/lib/utils/money';
import type { Property, Outlet, Table, User, UserRole } from '@/lib/types';

export default function DashboardSettingsPage() {
  const [activeTab, setActiveTab] = useState<'property' | 'outlets' | 'tables' | 'delivery' | 'taxes' | 'staff'>('property');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // 1. Property State
  const [property, setProperty] = useState<Property>(INITIAL_PROPERTY);

  // 2. Outlets State
  const [outlets, setOutlets] = useState<Outlet[]>(INITIAL_OUTLETS);

  // 3. Tables State
  const [tables, setTables] = useState<Table[]>([]);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data.success) {
          if (data.property) setProperty(data.property);
          if (data.outlets?.length) setOutlets(data.outlets);
          if (data.tables?.length) setTables(data.tables);
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      }
    }
    loadSettings();
  }, []);
  const [selectedTableForQr, setSelectedTableForQr] = useState<Table | null>(null);
  const [newTableNum, setNewTableNum] = useState('');
  const [newTableCap, setNewTableCap] = useState(4);
  const [newTableOutlet, setNewTableOutlet] = useState('b1');

  // 4. Delivery Zones State
  const [deliveryZones, setDeliveryZones] = useState([
    { id: 'dz1', name: 'Old City & Lake Pichola Ghats', feeMinor: 4000, minOrderMinor: 25000, eta: '25-35 mins', active: true },
    { id: 'dz2', name: 'Fatehsagar & Saheliyon Ki Bari', feeMinor: 5000, minOrderMinor: 30000, eta: '35-45 mins', active: true },
    { id: 'dz3', name: 'Sukhadia Circle & Chetak Area', feeMinor: 6000, minOrderMinor: 40000, eta: '40-50 mins', active: true },
  ]);
  const [newZoneName, setNewZoneName] = useState('');
  const [newZoneFee, setNewZoneFee] = useState(50);
  const [newZoneMin, setNewZoneMin] = useState(300);
  const [newZoneEta, setNewZoneEta] = useState('30-40 mins');

  // 5. Taxes & Billing
  const [gstin, setGstin] = useState('08AAACH1234F1Z5');
  const [foodGstBps, setFoodGstBps] = useState(500); // 5%
  const [roomGstBps, setRoomGstBps] = useState(1200); // 12%
  const [serviceChargeBps, setServiceChargeBps] = useState(250); // 2.5%
  const [invoicePrefix, setInvoicePrefix] = useState('INV-202610-');
  const [receiptFooter, setReceiptFooter] = useState('Padharo Mhare Desh — Thank you for gracing Rajmahal Heritage Hotel.');

  // 6. Staff Directory State
  const [staffList, setStaffList] = useState<User[]>(() => [
    { id: 'u1', auth_id: 'a1', name: 'Maharaja Vikram Singh', email: 'owner@rajmahalhotel.com', phone: '+91 98290 11223', property_id: 'p1', role: 'admin', is_active: true, created_at: '2026-01-01' },
    { id: 'u2', auth_id: 'a2', name: 'Ranveer Rathore', email: 'manager@rajmahalhotel.com', phone: '+91 98290 33445', property_id: 'p1', role: 'manager', is_active: true, created_at: '2026-01-01' },
    { id: 'u3', auth_id: 'a3', name: 'Divya Shekhawat', email: 'frontdesk@rajmahalhotel.com', phone: '+91 98290 55667', property_id: 'p1', role: 'front_desk', is_active: true, created_at: '2026-01-01' },
    { id: 'u4', auth_id: 'a4', name: 'Khansama Bhawani Singh', email: 'chef@rajmahalhotel.com', phone: '+91 98290 77889', property_id: 'p1', role: 'kitchen', is_active: true, created_at: '2026-01-01' },
    { id: 'u5', auth_id: 'a5', name: 'Kishan Lal', email: 'cashier@rajmahalhotel.com', phone: '+91 98290 99001', property_id: 'p1', role: 'cashier', is_active: true, created_at: '2026-01-01' },
    { id: 'u6', auth_id: 'a6', name: 'Gopal Soni', email: 'housekeeping@rajmahalhotel.com', phone: '+91 98290 22334', property_id: 'p1', role: 'housekeeping', is_active: true, created_at: '2026-01-01' },
  ]);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffPhone, setNewStaffPhone] = useState('');
  const [newStaffRole, setNewStaffRole] = useState<UserRole>('front_desk');

  const triggerSaveNotification = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const handleAddTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTableNum) return;
    const newT: Table = {
      id: `tbl-${Date.now()}`,
      outlet_id: newTableOutlet,
      table_number: newTableNum,
      capacity: newTableCap,
      is_active: true,
    };
    setTables((prev) => [...prev, newT]);
    setNewTableNum('');
    triggerSaveNotification(`Table ${newT.table_number} added successfully.`);
  };

  const handleAddDeliveryZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newZoneName) return;
    const newZ = {
      id: `dz-${Date.now()}`,
      name: newZoneName,
      feeMinor: Math.round(newZoneFee * 100),
      minOrderMinor: Math.round(newZoneMin * 100),
      eta: newZoneEta,
      active: true,
    };
    setDeliveryZones((prev) => [...prev, newZ]);
    setNewZoneName('');
    triggerSaveNotification(`Delivery zone "${newZ.name}" added.`);
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName || !newStaffEmail) return;
    const newMember: User = {
      id: `user-${Date.now()}`,
      auth_id: `auth-${Date.now()}`,
      name: newStaffName,
      email: newStaffEmail,
      phone: newStaffPhone || null,
      property_id: property.id,
      role: newStaffRole,
      is_active: true,
      created_at: new Date().toISOString(),
    };
    setStaffList((prev) => [...prev, newMember]);
    setNewStaffName('');
    setNewStaffEmail('');
    setNewStaffPhone('');
    setShowAddStaffModal(false);
    triggerSaveNotification(`Staff member ${newMember.name} onboarded.`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#B08D57]">
            Administrative Control Center
          </span>
          <h1 className="font-heritage text-2xl sm:text-3xl font-bold text-[#FAF8F3] mt-0.5">
            Property & Platform Settings
          </h1>
          <p className="text-xs sm:text-sm text-[#A89E92]">
            Configure operational hours, QR codes, delivery coverage, tax regulations, and staff roles.
          </p>
        </div>

        {saveSuccessMsg && (
          <div className="px-4 py-2 rounded-lg bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fade-in-up">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}
      </div>

      {/* ── NAVIGATION TABS ── */}
      <div className="flex flex-wrap gap-2 border-b border-[#3D352C] pb-3">
        {[
          { id: 'property', label: 'Property & Policies', icon: Building },
          { id: 'outlets', label: 'Outlets & Hours', icon: Utensils },
          { id: 'tables', label: 'Tables & QR Codes', icon: QrCode },
          { id: 'delivery', label: 'Delivery Zones & Fees', icon: Truck },
          { id: 'taxes', label: 'Taxes & Billing', icon: Receipt },
          { id: 'staff', label: 'Staff & Roles', icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#670E10] text-white border border-[#B08D57]/60 shadow-xs'
                  : 'text-[#A89E92] hover:text-white hover:bg-[#2A2420]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#C9A96E]' : 'text-[#8F7245]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── TAB 1: PROPERTY & POLICIES ── */}
      {activeTab === 'property' && (
        <div className="bg-[#241F1A] border border-[#3D352C] rounded-2xl p-6 space-y-6">
          <div className="border-b border-[#3D352C] pb-4">
            <h3 className="font-heritage text-lg font-bold text-[#FAF8F3]">
              Property Identity & Booking Policies
            </h3>
            <p className="text-xs text-[#A89E92]">
              Configurable hotel profile details displayed across the public portal and guest confirmation dispatch.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#E5C388] mb-1">Hotel Brand Name</label>
              <input
                type="text"
                value={property.name}
                onChange={(e) => setProperty({ ...property, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#1C1814] border border-[#3D352C] text-xs text-[#FAF8F3] focus:outline-none focus:border-[#B08D57]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#E5C388] mb-1">Concierge Hotline</label>
              <input
                type="text"
                value={property.phone}
                onChange={(e) => setProperty({ ...property, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#1C1814] border border-[#3D352C] text-xs text-[#FAF8F3] focus:outline-none focus:border-[#B08D57]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#E5C388] mb-1">Official Email</label>
              <input
                type="email"
                value={property.email}
                onChange={(e) => setProperty({ ...property, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#1C1814] border border-[#3D352C] text-xs text-[#FAF8F3] focus:outline-none focus:border-[#B08D57]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#E5C388] mb-1">Physical Address</label>
              <input
                type="text"
                value={property.address}
                onChange={(e) => setProperty({ ...property, address: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#1C1814] border border-[#3D352C] text-xs text-[#FAF8F3] focus:outline-none focus:border-[#B08D57]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#E5C388] mb-1">Standard Check-In Time</label>
              <input
                type="text"
                defaultValue="14:00 (2:00 PM)"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#1C1814] border border-[#3D352C] text-xs text-[#FAF8F3] focus:outline-none focus:border-[#B08D57]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#E5C388] mb-1">Standard Check-Out Time</label>
              <input
                type="text"
                defaultValue="11:00 (11:00 AM)"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#1C1814] border border-[#3D352C] text-xs text-[#FAF8F3] focus:outline-none focus:border-[#B08D57]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#E5C388] mb-1">Cancellation & Refund Terms</label>
            <textarea
              rows={3}
              value={property.cancellation_terms}
              onChange={(e) => setProperty({ ...property, cancellation_terms: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#1C1814] border border-[#3D352C] text-xs text-[#FAF8F3] focus:outline-none focus:border-[#B08D57]"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={async () => {
                try {
                  await fetch('/api/settings', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ property }),
                  });
                  triggerSaveNotification('Property profile & policies saved to database.');
                } catch (err) {
                  triggerSaveNotification('Error saving property changes.');
                }
              }}
              className="px-6 py-2.5 rounded-lg bg-[#670E10] hover:bg-[#821215] text-[#FAF8F3] text-xs font-semibold border border-[#B08D57]/60 flex items-center gap-2 shadow transition-all cursor-pointer"
            >
              <Save className="w-4 h-4 text-[#C9A96E]" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      )}

      {/* ── TAB 2: OUTLETS & OPERATING HOURS ── */}
      {activeTab === 'outlets' && (
        <div className="space-y-4">
          {outlets.map((outlet, idx) => (
            <div key={outlet.id} className="bg-[#241F1A] border border-[#3D352C] rounded-2xl p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#3D352C] pb-3">
                <div>
                  <h3 className="font-heritage text-lg font-bold text-[#FAF8F3]">
                    {outlet.name}
                  </h3>
                  <span className="text-xs text-[#B08D57] capitalize">
                    {outlet.type} Outlet • Operating daily
                  </span>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-600/40">
                  Outlet Active
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3.5 rounded-xl bg-[#1C1814] border border-[#3D352C]">
                  <span className="text-[11px] font-semibold text-[#A89E92] block mb-2">Service Channels</span>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-xs text-[#FAF8F3] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={outlet.dine_in_enabled}
                        onChange={(e) => {
                          const updated = [...outlets];
                          updated[idx].dine_in_enabled = e.target.checked;
                          setOutlets(updated);
                        }}
                        className="rounded accent-[#670E10]"
                      />
                      <span>Dine-In QR Orders</span>
                    </label>
                    <label className="flex items-center space-x-2 text-xs text-[#FAF8F3] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={outlet.pickup_enabled}
                        onChange={(e) => {
                          const updated = [...outlets];
                          updated[idx].pickup_enabled = e.target.checked;
                          setOutlets(updated);
                        }}
                        className="rounded accent-[#670E10]"
                      />
                      <span>Takeaway Pickup</span>
                    </label>
                    <label className="flex items-center space-x-2 text-xs text-[#FAF8F3] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={outlet.delivery_enabled}
                        onChange={(e) => {
                          const updated = [...outlets];
                          updated[idx].delivery_enabled = e.target.checked;
                          setOutlets(updated);
                        }}
                        className="rounded accent-[#670E10]"
                      />
                      <span>Doorstep Delivery</span>
                    </label>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#1C1814] border border-[#3D352C] space-y-2">
                  <span className="text-[11px] font-semibold text-[#A89E92] block">Operating Hours</span>
                  <div>
                    <span className="text-[10px] text-[#A89E92] block">Opening Time</span>
                    <input
                      type="time"
                      defaultValue={outlet.type === 'restaurant' ? '12:30' : '07:00'}
                      className="w-full px-2.5 py-1.5 rounded bg-[#2A2420] border border-[#3D352C] text-xs text-[#FAF8F3]"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#A89E92] block">Closing Time</span>
                    <input
                      type="time"
                      defaultValue={outlet.type === 'restaurant' ? '23:00' : '23:30'}
                      className="w-full px-2.5 py-1.5 rounded bg-[#2A2420] border border-[#3D352C] text-xs text-[#FAF8F3]"
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#1C1814] border border-[#3D352C] space-y-2">
                  <span className="text-[11px] font-semibold text-[#A89E92] block">Lead Times</span>
                  <div>
                    <span className="text-[10px] text-[#A89E92] block">Kitchen Prep (Mins)</span>
                    <input
                      type="number"
                      defaultValue={outlet.pickup_lead_minutes}
                      className="w-full px-2.5 py-1.5 rounded bg-[#2A2420] border border-[#3D352C] text-xs text-[#FAF8F3]"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#A89E92] block">Delivery Transit (Mins)</span>
                    <input
                      type="number"
                      defaultValue={outlet.delivery_lead_minutes}
                      className="w-full px-2.5 py-1.5 rounded bg-[#2A2420] border border-[#3D352C] text-xs text-[#FAF8F3]"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-end">
            <button
              onClick={() => triggerSaveNotification('Outlet parameters updated.')}
              className="px-6 py-2.5 rounded-lg bg-[#670E10] hover:bg-[#821215] text-[#FAF8F3] text-xs font-semibold border border-[#B08D57]/60 flex items-center gap-2 shadow transition-all cursor-pointer"
            >
              <Save className="w-4 h-4 text-[#C9A96E]" />
              <span>Save Outlet Settings</span>
            </button>
          </div>
        </div>
      )}

      {/* ── TAB 3: TABLES & PRINTABLE QR CODES ── */}
      {activeTab === 'tables' && (
        <div className="space-y-6">
          {/* Add Table Form */}
          <form onSubmit={handleAddTable} className="bg-[#241F1A] border border-[#3D352C] rounded-2xl p-5">
            <h3 className="font-heritage text-base font-bold text-[#FAF8F3] mb-3">Add New Dining Table</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
              <div>
                <label className="block text-[11px] text-[#A89E92] font-semibold mb-1">Table Name/Number</label>
                <input
                  type="text"
                  required
                  value={newTableNum}
                  onChange={(e) => setNewTableNum(e.target.value)}
                  placeholder="e.g. Table 5 (Terrace)"
                  className="w-full px-3 py-2 rounded-lg bg-[#1C1814] border border-[#3D352C] text-xs text-[#FAF8F3] focus:outline-none focus:border-[#B08D57]"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[#A89E92] font-semibold mb-1">Seating Capacity</label>
                <input
                  type="number"
                  min="1"
                  max="16"
                  value={newTableCap}
                  onChange={(e) => setNewTableCap(parseInt(e.target.value, 10))}
                  className="w-full px-3 py-2 rounded-lg bg-[#1C1814] border border-[#3D352C] text-xs text-[#FAF8F3] focus:outline-none focus:border-[#B08D57]"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[#A89E92] font-semibold mb-1">Assigned Outlet</label>
                <select
                  value={newTableOutlet}
                  onChange={(e) => setNewTableOutlet(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#1C1814] border border-[#3D352C] text-xs text-[#FAF8F3] focus:outline-none focus:border-[#B08D57]"
                >
                  <option value="b1">Saffron & Spice Restaurant</option>
                  <option value="b2">The Velvet Roast Café</option>
                </select>
              </div>
              <button
                type="submit"
                className="py-2 px-4 rounded-lg bg-[#670E10] hover:bg-[#821215] text-[#FAF8F3] text-xs font-semibold flex items-center justify-center gap-1.5 shadow transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#C9A96E]" />
                <span>Add Table</span>
              </button>
            </div>
          </form>

          {/* Tables Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {tables.map((tbl) => (
              <div
                key={tbl.id}
                className="bg-[#241F1A] border border-[#3D352C] rounded-xl p-4 flex flex-col justify-between hover:border-[#B08D57]/60 transition-all shadow-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-heritage text-base font-bold text-[#FAF8F3]">{tbl.table_number}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-600/40">Active</span>
                  </div>
                  <p className="text-xs text-[#A89E92]">Capacity: {tbl.capacity} Guests</p>
                  <p className="text-[11px] text-[#B08D57]">
                    {tbl.outlet_id === 'b1' ? 'Restaurant' : 'Artisan Café'}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#3D352C] mt-3 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedTableForQr(tbl)}
                    className="px-3 py-1.5 rounded-lg bg-[#1C1814] hover:bg-[#3D352C] text-[#C9A96E] text-xs font-semibold border border-[#3D352C] flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Print QR Card</span>
                  </button>
                  <span className="text-[10px] text-[#6E6356] font-mono">/qr/{tbl.id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── PRINTABLE QR TENT CARD MODAL ── */}
      {selectedTableForQr && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedTableForQr(null)}
        >
          <div
            className="w-full max-w-sm bg-white text-[#241F1A] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl text-center relative border-2 border-[#B08D57]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedTableForQr(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Printable Tent Card Design */}
            <div className="space-y-4 pt-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#670E10] text-[#FAF8F3] flex items-center justify-center font-heritage font-bold text-xl border-2 border-[#B08D57]">
                R
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-[0.25em] text-[#8F7245] uppercase block">
                  Rajmahal Heritage Hotel
                </span>
                <h3 className="font-heritage text-2xl font-bold text-[#670E10] mt-1">
                  {selectedTableForQr.table_number}
                </h3>
                <p className="text-xs text-gray-500">Scan for Royal Menu & Instant Order</p>
              </div>

              {/* Realistic QR Pattern Mockup */}
              <div className="w-48 h-48 mx-auto bg-white p-3 rounded-xl border-2 border-dashed border-[#B08D57]/70 flex items-center justify-center shadow-inner">
                <svg viewBox="0 0 120 120" className="w-full h-full text-[#241F1A]">
                  {/* Outer corner finders */}
                  <rect x="5" y="5" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="6" />
                  <rect x="13" y="13" width="14" height="14" fill="#670E10" />
                  <rect x="85" y="5" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="6" />
                  <rect x="93" y="13" width="14" height="14" fill="#670E10" />
                  <rect x="5" y="85" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="6" />
                  <rect x="13" y="93" width="14" height="14" fill="#670E10" />
                  {/* Decorative QR data matrix dots */}
                  <rect x="45" y="10" width="8" height="8" fill="currentColor" />
                  <rect x="65" y="10" width="8" height="8" fill="currentColor" />
                  <rect x="45" y="25" width="15" height="6" fill="currentColor" />
                  <rect x="50" y="45" width="20" height="20" rx="3" fill="#B08D57" />
                  <rect x="25" y="50" width="12" height="12" fill="currentColor" />
                  <rect x="80" y="50" width="10" height="10" fill="currentColor" />
                  <rect x="45" y="75" width="8" height="12" fill="currentColor" />
                  <rect x="60" y="85" width="14" height="8" fill="currentColor" />
                  <rect x="85" y="85" width="20" height="8" fill="currentColor" />
                  <rect x="80" y="100" width="8" height="15" fill="currentColor" />
                </svg>
              </div>

              <div className="text-[11px] text-gray-600 bg-[#FAF8F3] py-2 px-3 rounded-lg border border-[#E5DFD5]">
                Direct to kitchen dispatch • No app download needed
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="w-full py-2.5 rounded-lg bg-[#670E10] hover:bg-[#821215] text-[#FAF8F3] text-xs font-semibold flex items-center justify-center gap-2 shadow transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#C9A96E]" />
              <span>Print Table Card (A4 / Tent Card)</span>
            </button>
          </div>
        </div>
      )}

      {/* ── TAB 4: DELIVERY ZONES & CHARGES ── */}
      {activeTab === 'delivery' && (
        <div className="space-y-6">
          <form onSubmit={handleAddDeliveryZone} className="bg-[#241F1A] border border-[#3D352C] rounded-2xl p-5">
            <h3 className="font-heritage text-base font-bold text-[#FAF8F3] mb-3">Add Delivery Coverage Area</h3>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
              <div className="sm:col-span-2">
                <label className="block text-[11px] text-[#A89E92] font-semibold mb-1">Zone / Neighborhood Name</label>
                <input
                  type="text"
                  required
                  value={newZoneName}
                  onChange={(e) => setNewZoneName(e.target.value)}
                  placeholder="e.g. Hiran Magri Sector 3-5"
                  className="w-full px-3 py-2 rounded-lg bg-[#1C1814] border border-[#3D352C] text-xs text-[#FAF8F3] focus:outline-none focus:border-[#B08D57]"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[#A89E92] font-semibold mb-1">Delivery Fee (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={newZoneFee}
                  onChange={(e) => setNewZoneFee(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-[#1C1814] border border-[#3D352C] text-xs text-[#FAF8F3] focus:outline-none focus:border-[#B08D57]"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[#A89E92] font-semibold mb-1">Min. Order (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={newZoneMin}
                  onChange={(e) => setNewZoneMin(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-[#1C1814] border border-[#3D352C] text-xs text-[#FAF8F3] focus:outline-none focus:border-[#B08D57]"
                />
              </div>
              <button
                type="submit"
                className="py-2 px-4 rounded-lg bg-[#670E10] hover:bg-[#821215] text-[#FAF8F3] text-xs font-semibold flex items-center justify-center gap-1.5 shadow transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#C9A96E]" />
                <span>Add Zone</span>
              </button>
            </div>
          </form>

          {/* Zones Table */}
          <div className="bg-[#241F1A] border border-[#3D352C] rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#1C1814] text-[#A89E92] border-b border-[#3D352C] uppercase text-[10px]">
                  <th className="py-3 px-4">Coverage Zone</th>
                  <th className="py-3 px-4">Delivery Fee</th>
                  <th className="py-3 px-4">Minimum Order</th>
                  <th className="py-3 px-4">Transit Estimate</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3D352C]">
                {deliveryZones.map((zone) => (
                  <tr key={zone.id} className="hover:bg-[#2A2420]">
                    <td className="py-3 px-4 font-semibold text-[#FAF8F3]">{zone.name}</td>
                    <td className="py-3 px-4 text-[#E5C388] font-mono">{formatMoney(zone.feeMinor)}</td>
                    <td className="py-3 px-4 text-[#FAF8F3] font-mono">{formatMoney(zone.minOrderMinor)}</td>
                    <td className="py-3 px-4 text-[#A89E92]">{zone.eta}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-600/40">Active</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setDeliveryZones((prev) => prev.filter((z) => z.id !== zone.id));
                          triggerSaveNotification(`Removed zone ${zone.name}`);
                        }}
                        className="p-1 rounded text-red-400 hover:bg-red-950/50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 5: TAXES & INVOICE BILLING ── */}
      {activeTab === 'taxes' && (
        <div className="bg-[#241F1A] border border-[#3D352C] rounded-2xl p-6 space-y-6">
          <div className="border-b border-[#3D352C] pb-4">
            <h3 className="font-heritage text-lg font-bold text-[#FAF8F3]">
              Tax Compliance & Invoice Sequential Settings
            </h3>
            <p className="text-xs text-[#A89E92]">
              Configured tax rates are computed via minor-unit integer arithmetic to prevent rounding discrepancies.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#E5C388] mb-1">Business GSTIN</label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#1C1814] border border-[#3D352C] text-xs text-[#FAF8F3] focus:outline-none focus:border-[#B08D57] font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#E5C388] mb-1">Food GST Rate (%)</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={foodGstBps / 100}
                  onChange={(e) => setFoodGstBps(Math.round(parseFloat(e.target.value) * 100))}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#1C1814] border border-[#3D352C] text-xs text-[#FAF8F3] focus:outline-none focus:border-[#B08D57]"
                />
                <Percent className="w-3.5 h-3.5 text-[#A89E92] absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#E5C388] mb-1">Room Accommodation GST (%)</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={roomGstBps / 100}
                  onChange={(e) => setRoomGstBps(Math.round(parseFloat(e.target.value) * 100))}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#1C1814] border border-[#3D352C] text-xs text-[#FAF8F3] focus:outline-none focus:border-[#B08D57]"
                />
                <Percent className="w-3.5 h-3.5 text-[#A89E92] absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#E5C388] mb-1">Service Charge (%)</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={serviceChargeBps / 100}
                  onChange={(e) => setServiceChargeBps(Math.round(parseFloat(e.target.value) * 100))}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#1C1814] border border-[#3D352C] text-xs text-[#FAF8F3] focus:outline-none focus:border-[#B08D57]"
                />
                <Percent className="w-3.5 h-3.5 text-[#A89E92] absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#E5C388] mb-1">Bill Number Prefix</label>
              <input
                type="text"
                value={invoicePrefix}
                onChange={(e) => setInvoicePrefix(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#1C1814] border border-[#3D352C] text-xs text-[#FAF8F3] focus:outline-none focus:border-[#B08D57] font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#E5C388] mb-1">Next Bill Sequential Number</label>
              <input
                type="text"
                disabled
                defaultValue="0042 (Auto-increment)"
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#1C1814] border border-[#3D352C] text-xs text-[#6E6356] font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#E5C388] mb-1">Printed Bill Greeting / Footer Note</label>
            <input
              type="text"
              value={receiptFooter}
              onChange={(e) => setReceiptFooter(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#1C1814] border border-[#3D352C] text-xs text-[#FAF8F3] focus:outline-none focus:border-[#B08D57]"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => triggerSaveNotification('Tax rates and invoice parameters saved.')}
              className="px-6 py-2.5 rounded-lg bg-[#670E10] hover:bg-[#821215] text-[#FAF8F3] text-xs font-semibold border border-[#B08D57]/60 flex items-center gap-2 shadow transition-all cursor-pointer"
            >
              <Save className="w-4 h-4 text-[#C9A96E]" />
              <span>Save Tax Configuration</span>
            </button>
          </div>
        </div>
      )}

      {/* ── TAB 6: STAFF & USER ROLES ── */}
      {activeTab === 'staff' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="font-heritage text-lg font-bold text-[#FAF8F3]">Staff Accounts & Role-Based Access</h3>
              <p className="text-xs text-[#A89E92]">
                Individual accounts with strict role-gated access (Admin, Front Desk, Cashier, Kitchen Chef, Housekeeping).
              </p>
            </div>
            <button
              onClick={() => setShowAddStaffModal(true)}
              className="px-4 py-2 rounded-lg bg-[#670E10] hover:bg-[#821215] text-[#FAF8F3] text-xs font-semibold border border-[#B08D57]/50 flex items-center gap-1.5 shadow transition-all cursor-pointer self-start"
            >
              <Plus className="w-4 h-4 text-[#C9A96E]" />
              <span>Onboard Staff Member</span>
            </button>
          </div>

          {/* Staff Table */}
          <div className="bg-[#241F1A] border border-[#3D352C] rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#1C1814] text-[#A89E92] border-b border-[#3D352C] uppercase text-[10px]">
                  <th className="py-3 px-4">Staff Member</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Assigned Role</th>
                  <th className="py-3 px-4">Account Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3D352C]">
                {staffList.map((member) => (
                  <tr key={member.id} className="hover:bg-[#2A2420]">
                    <td className="py-3.5 px-4 font-semibold text-[#FAF8F3] flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#670E10] border border-[#B08D57]/40 flex items-center justify-center text-[10px] font-bold text-[#FAF8F3]">
                        {member.name.charAt(0)}
                      </div>
                      <span>{member.name}</span>
                    </td>
                    <td className="py-3.5 px-4 text-[#A89E92]">{member.email}</td>
                    <td className="py-3.5 px-4 text-[#A89E92]">{member.phone || '—'}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#3D352C] text-[#E5C388] border border-[#B08D57]/30">
                        {member.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-600/40">
                        Active
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          if (member.role === 'admin') {
                            alert('Primary administrator account cannot be deactivated.');
                            return;
                          }
                          setStaffList((prev) => prev.filter((s) => s.id !== member.id));
                          triggerSaveNotification(`Deactivated ${member.name}`);
                        }}
                        className="text-xs text-red-400 hover:underline"
                      >
                        Deactivate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── ADD STAFF MODAL ── */}
      {showAddStaffModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowAddStaffModal(false)}
        >
          <div
            className="w-full max-w-md bg-[#241F1A] border border-[#3D352C] rounded-2xl p-6 space-y-5 text-[#FAF8F3] shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#3D352C] pb-3">
              <h3 className="font-heritage text-lg font-bold text-[#FAF8F3]">Onboard New Staff Member</h3>
              <button onClick={() => setShowAddStaffModal(false)} className="text-[#A89E92] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#E5C388] mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  placeholder="e.g. Yashwardhan Rathore"
                  className="w-full px-3.5 py-2 rounded-lg bg-[#1C1814] border border-[#3D352C] text-xs text-[#FAF8F3] focus:outline-none focus:border-[#B08D57]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#E5C388] mb-1">Work Email *</label>
                <input
                  type="email"
                  required
                  value={newStaffEmail}
                  onChange={(e) => setNewStaffEmail(e.target.value)}
                  placeholder="staff@rajmahalhotel.com"
                  className="w-full px-3.5 py-2 rounded-lg bg-[#1C1814] border border-[#3D352C] text-xs text-[#FAF8F3] focus:outline-none focus:border-[#B08D57]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#E5C388] mb-1">Mobile Contact</label>
                <input
                  type="tel"
                  value={newStaffPhone}
                  onChange={(e) => setNewStaffPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2 rounded-lg bg-[#1C1814] border border-[#3D352C] text-xs text-[#FAF8F3] focus:outline-none focus:border-[#B08D57]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#E5C388] mb-1">Role & Permissions</label>
                <select
                  value={newStaffRole}
                  onChange={(e) => setNewStaffRole(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-lg bg-[#1C1814] border border-[#3D352C] text-xs text-[#FAF8F3] focus:outline-none focus:border-[#B08D57]"
                >
                  <option value="manager">Duty Manager (Full Operations)</option>
                  <option value="front_desk">Front Desk (Chambers, Check-in/out)</option>
                  <option value="cashier">Cashier (POS & Billing)</option>
                  <option value="kitchen">Kitchen Chef (KDS Only)</option>
                  <option value="housekeeping">Housekeeping (Room Turnover)</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="px-4 py-2 rounded-lg bg-[#1C1814] text-[#A89E92] text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#670E10] hover:bg-[#821215] text-[#FAF8F3] text-xs font-semibold border border-[#B08D57]/60 shadow"
                >
                  Create Staff Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
