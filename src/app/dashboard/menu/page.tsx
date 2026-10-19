'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { formatMoney } from '@/lib/utils/money';
import { INITIAL_OUTLETS } from '@/lib/data/initial-data';
import type { MenuCategory, MenuItem } from '@/lib/types';
import {
  Utensils,
  CheckCircle2,
  XCircle,
  Power,
  Plus,
  Search,
  Edit2,
  Sparkles,
  Tag,
  DollarSign,
  Image as ImageIcon,
} from 'lucide-react';

export default function MenuManagementDashboardPage() {
  const [selectedOutletId, setSelectedOutletId] = useState(INITIAL_OUTLETS[0].id);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Form state for adding dish
  const [newDishName, setNewDishName] = useState('');
  const [newDishDesc, setNewDishDesc] = useState('');
  const [newDishPrice, setNewDishPrice] = useState('');
  const [newDishCategoryId, setNewDishCategoryId] = useState('');
  const [selectedDietary, setSelectedDietary] = useState<string[]>(['Vegetarian']);
  const [newDishImage, setNewDishImage] = useState('/images/dining_ambiance.jpg');

  // Edit form state
  const [editPrice, setEditPrice] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const refreshMenu = async (outletId = selectedOutletId) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/menu?outletId=${outletId}`);
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error('Failed to load menu from API:', err);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    refreshMenu(selectedOutletId);
  }, [selectedOutletId]);

  const handleToggle = async (itemId: string) => {
    // Optimistic UI update
    setCategories((prev) =>
      prev.map((c) => ({
        ...c,
        items: c.items?.map((it) =>
          it.id === itemId ? { ...it, is_available: !it.is_available } : it
        ),
      }))
    );

    try {
      await fetch(`/api/menu/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toggleAvailability: true }),
      });
    } catch (err) {
      console.error('Failed to toggle availability in Supabase:', err);
      refreshMenu();
    }
  };

  const handleOutletChange = (outletId: string) => {
    setSelectedOutletId(outletId);
  };

  const handleOpenAddModal = () => {
    if (categories.length > 0) {
      setNewDishCategoryId(categories[0].id);
    }
    setNewDishName('');
    setNewDishDesc('');
    setNewDishPrice('');
    setSelectedDietary(['Vegetarian']);
    setNewDishImage('/images/dining_ambiance.jpg');
    setIsAddModalOpen(true);
  };

  const handleCreateDish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDishName || !newDishPrice || !newDishCategoryId) return;

    const priceMinor = Math.round(parseFloat(newDishPrice) * 100);
    try {
      const res = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category_id: newDishCategoryId,
          name: newDishName,
          description: newDishDesc,
          price_minor: priceMinor,
          dietary_labels: selectedDietary,
          image_url: newDishImage,
        }),
      });

      if (res.ok) {
        setIsAddModalOpen(false);
        refreshMenu();
      }
    } catch (err) {
      console.error('Failed to create dish in Supabase:', err);
    }
  };

  const handleOpenEdit = (item: MenuItem) => {
    setEditingItem(item);
    setEditPrice((item.price_minor / 100).toString());
    setEditDesc(item.description || '');
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      const res = await fetch(`/api/menu/${editingItem.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          price_minor: Math.round(parseFloat(editPrice) * 100),
          description: editDesc,
        }),
      });

      if (res.ok) {
        setEditingItem(null);
        refreshMenu();
      }
    } catch (err) {
      console.error('Failed to update dish in Supabase:', err);
    }
  };

  const toggleDietaryTag = (tag: string) => {
    if (selectedDietary.includes(tag)) {
      setSelectedDietary(selectedDietary.filter((t) => t !== tag));
    } else {
      setSelectedDietary([...selectedDietary, tag]);
    }
  };

  // Filtered categories
  const filteredCategories = categories.map((cat) => ({
    ...cat,
    items: cat.items?.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.dietary_labels.some((d) => d.toLowerCase().includes(searchQuery.toLowerCase()))
    ),
  })).filter((cat) => (cat.items?.length || 0) > 0 || searchQuery === '');

  const availableCategoriesForOutlet = categories;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#3D352C]">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#670E10] text-white text-[11px] font-bold border border-[#B08D57]/40">
              Food &amp; Beverage Control
            </span>
            <span className="text-xs text-[#B08D57] font-semibold">Live Availability (86-List) &amp; Catalog</span>
          </div>
          <h1 className="font-heritage text-2xl sm:text-3xl font-bold text-[#FAF8F3]">
            Menu Management &amp; Catalog
          </h1>
          <p className="text-xs text-[#9A8E7F] mt-1">
            Instant 86-toggle updates guest QR ordering, dine-in POS, and room service menus in real-time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Outlet Selector */}
          <div className="flex bg-[#2A2420] p-1 rounded-xl border border-[#3D352C]">
            {INITIAL_OUTLETS.map((outlet) => (
              <button
                key={outlet.id}
                onClick={() => handleOutletChange(outlet.id)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedOutletId === outlet.id
                    ? 'bg-[#670E10] text-white shadow'
                    : 'text-[#D4CBBB] hover:text-white'
                }`}
              >
                {outlet.name}
              </button>
            ))}
          </div>

          {/* Add Dish Button */}
          <Button
            onClick={handleOpenAddModal}
            className="bg-[#C9A96E] hover:bg-[#B08D57] text-[#241F1A] font-bold text-xs px-4 py-2 rounded-xl flex items-center space-x-1.5 shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Dish</span>
          </Button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#241F1A] p-4 rounded-xl border border-[#3D352C]">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#9A8E7F]" />
          <input
            type="text"
            placeholder="Search dishes by name, spice, dietary tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-[#1C1814] text-[#FAF8F3] placeholder-[#9A8E7F] rounded-lg border border-[#3D352C] focus:outline-none focus:border-[#B08D57]"
          />
        </div>

        <div className="flex items-center space-x-4 text-xs text-[#9A8E7F]">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span>Available</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span>86 / Sold Out</span>
          </div>
        </div>
      </div>

      {/* Menu Categories Grid */}
      <div className="space-y-8">
        {filteredCategories.map((cat) => (
          <div key={cat.id} className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#3D352C] pb-2">
              <h2 className="font-heritage text-base font-bold uppercase tracking-wider text-[#C9A96E]">
                {cat.name} ({cat.items?.length || 0})
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cat.items?.map((item) => (
                <div
                  key={item.id}
                  className={`p-5 rounded-2xl flex flex-col justify-between border-2 transition-all shadow-xs ${
                    item.is_available
                      ? 'border-[#3D352C] bg-[#241F1A]'
                      : 'border-[#9B2226]/50 bg-[#341618]/60 opacity-85'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h3 className="font-bold text-[#FAF8F3] text-sm flex items-center gap-1.5">
                        {item.name}
                      </h3>
                      <span className="font-mono text-xs font-bold text-[#C9A96E] whitespace-nowrap bg-[#1C1814] px-2 py-0.5 rounded border border-[#3D352C]">
                        {formatMoney(item.price_minor)}
                      </span>
                    </div>

                    <p className="text-xs text-[#9A8E7F] line-clamp-2 mb-3">
                      {item.description || 'Traditional royal khansama recipe crafted fresh.'}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.dietary_labels.map((d, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2 py-0.5 rounded bg-[#1C1814] text-[#D4CBBB] border border-[#3D352C]"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#3D352C] flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      {item.is_available ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span className="text-xs text-emerald-400 font-semibold">Live in Menu</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-rose-400" />
                          <span className="text-xs text-rose-400 font-semibold">86 / Sold Out</span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs px-2 py-1 text-[#C9A96E] hover:bg-[#3D352C]"
                        onClick={() => handleOpenEdit(item)}
                      >
                        <Edit2 className="w-3 h-3 mr-1" />
                        Edit
                      </Button>

                      <Button
                        size="sm"
                        variant={item.is_available ? 'outline' : 'primary'}
                        className={`text-xs px-2.5 py-1 ${
                          item.is_available ? 'border-[#9B2226] text-[#FAF8F3] hover:bg-[#9B2226]' : ''
                        }`}
                        onClick={() => handleToggle(item.id)}
                      >
                        <Power className="w-3 h-3 mr-1" />
                        {item.is_available ? '86 Dish' : 'Restore'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── MODAL: ADD NEW DISH ── */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Dish to Menu"
      >
        <form onSubmit={handleCreateDish} className="space-y-4 text-left">
          <p className="text-xs text-[#9A8E7F]">
            Configure dish details, category, pricing, and dietary classifications.
          </p>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#D4CBBB]">Dish Name *</label>
            <Input
              required
              placeholder="e.g. Ker Sangri Royal Masala"
              value={newDishName}
              onChange={(e) => setNewDishName(e.target.value)}
              className="bg-[#1C1814] border-[#3D352C] text-[#FAF8F3]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#D4CBBB]">Category *</label>
              <select
                required
                value={newDishCategoryId}
                onChange={(e) => setNewDishCategoryId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#1C1814] text-[#FAF8F3] rounded-lg border border-[#3D352C] focus:outline-none focus:border-[#B08D57]"
              >
                {availableCategoriesForOutlet.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#D4CBBB]">Price in INR (₹) *</label>
              <Input
                required
                type="number"
                min="1"
                step="1"
                placeholder="e.g. 520"
                value={newDishPrice}
                onChange={(e) => setNewDishPrice(e.target.value)}
                className="bg-[#1C1814] border-[#3D352C] text-[#FAF8F3]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#D4CBBB]">Dish Description</label>
            <textarea
              rows={2}
              placeholder="Traditional dessert beans stir-fried in pure desi ghee with whole Rajasthani red chillies and dried amchur."
              value={newDishDesc}
              onChange={(e) => setNewDishDesc(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#1C1814] text-[#FAF8F3] rounded-lg border border-[#3D352C] focus:outline-none focus:border-[#B08D57]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#D4CBBB]">Dietary &amp; Specialty Badges</label>
            <div className="flex flex-wrap gap-2">
              {['Vegetarian', 'Non-Vegetarian', 'Jain', 'Vegan', "Chef's Special", 'Gluten-Free'].map((tag) => {
                const isSelected = selectedDietary.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleDietaryTag(tag)}
                    className={`px-3 py-1 rounded-md text-xs font-semibold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#670E10] text-white border-[#B08D57]'
                        : 'bg-[#1C1814] text-[#9A8E7F] border-[#3D352C] hover:text-[#FAF8F3]'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
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
              Add to Live Menu
            </Button>
          </div>
        </form>
      </Modal>

      {/* ── MODAL: EDIT DISH ── */}
      <Modal
        isOpen={Boolean(editingItem)}
        onClose={() => setEditingItem(null)}
        title={editingItem ? `Edit: ${editingItem.name}` : 'Edit Dish'}
      >
        {editingItem && (
          <form onSubmit={handleSaveEdit} className="space-y-4 text-left">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#D4CBBB]">Price in INR (₹) *</label>
              <Input
                required
                type="number"
                min="1"
                step="1"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                className="bg-[#1C1814] border-[#3D352C] text-[#FAF8F3]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#D4CBBB]">Description</label>
              <textarea
                rows={3}
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#1C1814] text-[#FAF8F3] rounded-lg border border-[#3D352C] focus:outline-none focus:border-[#B08D57]"
              />
            </div>

            <div className="pt-4 border-t border-[#3D352C] flex items-center justify-end space-x-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setEditingItem(null)}
                className="text-xs text-[#9A8E7F]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#670E10] hover:bg-[#821215] text-white text-xs font-bold px-4 py-2"
              >
                Save Changes
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
