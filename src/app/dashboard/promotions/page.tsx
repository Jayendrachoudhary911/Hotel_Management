'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Percent,
  Plus,
  Search,
  SlidersHorizontal,
  Calendar,
  Utensils,
  MoreVertical,
  Pencil,
  Trash2,
  X,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Tag,
  Clock,
  Check,
} from 'lucide-react';
import type { Promotion } from '@/lib/services/promotions-service';

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'scheduled' | 'expired'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'percentage' | 'flat' | 'bogo'>('all');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formBadgeText, setFormBadgeText] = useState('20% OFF');
  const [formDiscountType, setFormDiscountType] = useState<'percentage' | 'flat' | 'bogo'>('percentage');
  const [formDiscountValue, setFormDiscountValue] = useState('20');
  const [formStartDate, setFormStartDate] = useState('15 Oct 2026');
  const [formEndDate, setFormEndDate] = useState('31 Oct 2026');
  const [formCategory, setFormCategory] = useState('Main Course');
  const [formStatus, setFormStatus] = useState<'active' | 'scheduled' | 'expired'>('active');
  const [formImageUrl, setFormImageUrl] = useState('/images/food/dal-baati.jpg');
  const [submitting, setSubmitting] = useState(false);

  const showToast = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  const loadPromotions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/promotions');
      if (res.ok) {
        const data = await res.json();
        setPromotions(data.promotions || []);
      }
    } catch {
      showToast('error', 'Failed to load promotions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPromotions();
  }, []);

  // Counts
  const totalCount = promotions.length;
  const activeCount = promotions.filter((p) => p.status === 'active').length;
  const scheduledCount = promotions.filter((p) => p.status === 'scheduled').length;
  const expiredCount = promotions.filter((p) => p.status === 'expired').length;

  const filteredPromotions = useMemo(() => {
    return promotions.filter((promo) => {
      // Tab filter
      if (activeTab !== 'all' && promo.status !== activeTab) return false;
      // Type filter
      if (typeFilter !== 'all' && promo.discount_type !== typeFilter) return false;
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = promo.title.toLowerCase().includes(q);
        const matchesDesc = promo.description.toLowerCase().includes(q);
        const matchesCat = promo.applicable_category.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesCat) return false;
      }
      return true;
    });
  }, [promotions, activeTab, typeFilter, searchQuery]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete promotion "${title}"?`)) return;
    try {
      const res = await fetch(`/api/promotions/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('success', `Promotion "${title}" deleted`);
        loadPromotions();
      }
    } catch {
      showToast('error', 'Failed to delete promotion');
    }
  };

  const handleToggleStatus = async (promo: Promotion) => {
    const nextStatus = promo.status === 'active' ? 'expired' : 'active';
    try {
      const res = await fetch(`/api/promotions/${promo.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        showToast('success', `Promotion is now ${nextStatus}`);
        loadPromotions();
      }
    } catch {
      showToast('error', 'Failed to update status');
    }
  };

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormTitle('');
    setFormDesc('');
    setFormBadgeText('20% OFF');
    setFormDiscountType('percentage');
    setFormDiscountValue('20');
    setFormStartDate('15 Oct 2026');
    setFormEndDate('31 Oct 2026');
    setFormCategory('Main Course');
    setFormStatus('active');
    setFormImageUrl('/images/food/dal-baati.jpg');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (promo: Promotion) => {
    setEditingId(promo.id);
    setFormTitle(promo.title);
    setFormDesc(promo.description);
    setFormBadgeText(promo.badge_text);
    setFormDiscountType(promo.discount_type);
    setFormDiscountValue(promo.discount_value.toString());
    setFormStartDate(promo.start_date);
    setFormEndDate(promo.end_date);
    setFormCategory(promo.applicable_category);
    setFormStatus(promo.status);
    setFormImageUrl(promo.image_url);
    setIsModalOpen(true);
  };

  const handleSavePromotion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDesc.trim()) {
      showToast('error', 'Please provide title and description.');
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        const res = await fetch(`/api/promotions/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: formTitle.trim(),
            description: formDesc.trim(),
            badge_text: formBadgeText.trim(),
            discount_type: formDiscountType,
            discount_value: parseFloat(formDiscountValue) || 10,
            start_date: formStartDate,
            end_date: formEndDate,
            applicable_category: formCategory,
            status: formStatus,
            image_url: formImageUrl,
          }),
        });
        if (res.ok) {
          showToast('success', 'Promotion updated successfully');
          setIsModalOpen(false);
          loadPromotions();
        } else {
          throw new Error();
        }
      } else {
        const res = await fetch('/api/promotions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: formTitle.trim(),
            description: formDesc.trim(),
            badge_text: formBadgeText.trim(),
            discount_type: formDiscountType,
            discount_value: parseFloat(formDiscountValue) || 10,
            start_date: formStartDate,
            end_date: formEndDate,
            applicable_category: formCategory,
            applicable_items_count: 12,
            status: formStatus,
            image_url: formImageUrl,
          }),
        });
        if (res.ok) {
          showToast('success', 'Promotion created successfully');
          setIsModalOpen(false);
          loadPromotions();
        } else {
          throw new Error();
        }
      }
    } catch {
      showToast('error', 'Failed to save promotion');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: Promotion['status']) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] text-[10px] font-bold shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
            Active
          </span>
        );
      case 'scheduled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFFBEB] border border-[#FDE68A] text-[#B45309] text-[10px] font-bold shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
            Scheduled
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-[10px] font-bold shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
            Expired
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 border transition-all animate-bounce ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : 'bg-red-50 border-red-300 text-red-800'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-red-600" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#E8DCD2]">
        <div>
          <h1
            className="text-2xl font-bold text-[#4F0809]"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Promotions
          </h1>
          <p className="text-xs text-[#81736D] mt-0.5">
            Create and manage offers, discounts and special deals for your restaurant &amp; café
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#4F0809] hover:bg-[#680b0c] text-white text-xs font-semibold shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 text-[#D8AA67]" />
          <span>Create Promotion</span>
        </button>
      </div>

      {/* Filter Tabs matching Screenshot */}
      <div className="flex items-center gap-2 flex-wrap pb-1">
        {[
          { id: 'all', label: 'All Promotions', count: totalCount },
          { id: 'active', label: 'Active', count: activeCount },
          { id: 'scheduled', label: 'Scheduled', count: scheduledCount },
          { id: 'expired', label: 'Expired', count: expiredCount },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition cursor-pointer border ${
                isActive
                  ? 'bg-white text-[#4F0809] border-[#4F0809] shadow-2xs'
                  : 'bg-[#FBF6EF]/50 text-[#81736D] border-transparent hover:bg-[#FBF6EF] hover:text-[#302421]'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive
                    ? 'bg-[#4F0809] text-white'
                    : 'bg-[#E8DCD2] text-[#81736D]'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-[#E8DCD2] rounded-2xl p-3 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#81736D]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search promotions..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-[#E8DCD2] text-xs bg-white focus:outline-none focus:border-[#4F0809]"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-lg border border-[#E8DCD2] text-xs bg-white text-[#302421] focus:outline-none cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="percentage">Percentage Discount</option>
            <option value="flat">Flat Amount</option>
            <option value="bogo">BOGO Offers</option>
          </select>

          <button
            onClick={() => {
              setSearchQuery('');
              setTypeFilter('all');
              setActiveTab('all');
            }}
            title="Reset Filters"
            className="p-1.5 rounded-lg border border-[#E8DCD2] text-[#81736D] hover:bg-[#FBF6EF] transition cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Promotions Cards Grid matching Screenshot */}
      {loading ? (
        <div className="p-16 text-center text-xs text-[#81736D] flex flex-col items-center justify-center bg-white rounded-2xl border border-[#E8DCD2]">
          <RefreshCw className="w-6 h-6 animate-spin text-[#4F0809] mb-2" />
          <span>Loading promotions...</span>
        </div>
      ) : filteredPromotions.length === 0 ? (
        <div className="p-16 text-center text-xs text-[#81736D] bg-white rounded-2xl border border-[#E8DCD2]">
          <Percent className="w-8 h-8 text-[#D8AA67] mx-auto mb-2 opacity-60" />
          <p className="font-semibold text-[#4F0809]">No promotions found</p>
          <p className="text-[11px] text-[#81736D] mt-0.5">
            Click &quot;+ Create Promotion&quot; to launch a new festival offer or discount.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredPromotions.map((promo) => (
            <div
              key={promo.id}
              className="bg-white border border-[#E8DCD2] rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between hover:border-[#B78A48] transition group"
            >
              {/* Card Banner Image with Badges */}
              <div className="relative h-36 w-full overflow-hidden bg-stone-100">
                <img
                  src={promo.image_url || '/images/food/dal-baati.jpg'}
                  alt={promo.title}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/images/food/dal-baati.jpg';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                {/* Status Badge (Top-Left) */}
                <div className="absolute top-2.5 left-2.5">
                  {getStatusBadge(promo.status)}
                </div>

                {/* Offer Tag Badge (Bottom-Right) */}
                <div className="absolute bottom-2.5 right-2.5">
                  <span className="px-2.5 py-1 rounded-lg bg-[#4F0809] text-[#D8AA67] border border-[#B78A48] text-xs font-bold shadow-md tracking-wider">
                    {promo.badge_text}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h2
                      className="font-bold text-sm text-[#302421] group-hover:text-[#4F0809] transition-colors leading-tight"
                      style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                    >
                      {promo.title}
                    </h2>

                    {/* Context Menu Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === promo.id ? null : promo.id)}
                        className="p-1 rounded-md text-[#81736D] hover:text-[#4F0809] hover:bg-[#FBF6EF] transition cursor-pointer"
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>

                      {openMenuId === promo.id && (
                        <div className="absolute right-0 top-6 w-36 bg-white border border-[#E8DCD2] rounded-xl shadow-xl py-1 z-30 text-xs">
                          <button
                            onClick={() => {
                              setOpenMenuId(null);
                              handleOpenEditModal(promo);
                            }}
                            className="w-full text-left px-3 py-1.5 text-[#302421] hover:bg-[#FBF6EF] flex items-center gap-1.5"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            <span>Edit Offer</span>
                          </button>
                          <button
                            onClick={() => {
                              setOpenMenuId(null);
                              handleToggleStatus(promo);
                            }}
                            className="w-full text-left px-3 py-1.5 text-[#302421] hover:bg-[#FBF6EF] flex items-center gap-1.5"
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>{promo.status === 'active' ? 'Mark Expired' : 'Mark Active'}</span>
                          </button>
                          <button
                            onClick={() => {
                              setOpenMenuId(null);
                              handleDelete(promo.id, promo.title);
                            }}
                            className="w-full text-left px-3 py-1.5 text-red-600 hover:bg-red-50 flex items-center gap-1.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-[11px] text-[#81736D] mt-1 line-clamp-2">
                    {promo.description}
                  </p>
                </div>

                {/* Details Footer inside card */}
                <div className="pt-2.5 border-t border-[#E8DCD2]/70 space-y-1.5 text-[10px] text-[#81736D]">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-[#B78A48] shrink-0" />
                    <span>
                      {promo.start_date} - {promo.end_date}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Utensils className="w-3 h-3 text-[#B78A48] shrink-0" />
                    <span className="truncate">
                      Applicable: {promo.applicable_category} ({promo.applicable_items_count} items)
                    </span>
                  </div>

                  <div className="pt-1 flex items-center justify-between">
                    <span className="font-semibold text-[#4F0809]">
                      Used: {promo.times_used} times
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDelete(promo.id, promo.title)}
                        className="inline-flex items-center gap-1 text-[10px] font-semibold text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded-lg transition cursor-pointer"
                        title="Delete promotion"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                      <button
                        onClick={() => handleOpenEditModal(promo)}
                        className="text-[10px] font-semibold text-[#B78A48] hover:underline cursor-pointer"
                      >
                        Manage →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Create / Edit Promotion Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E8DCD2] max-w-lg w-full p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E8DCD2] pb-3">
              <h2
                className="text-lg font-bold text-[#4F0809]"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                {editingId ? 'Edit Promotion' : 'Create Promotion'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-[#81736D] hover:text-[#4F0809] hover:bg-[#FBF6EF] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePromotion} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-[#4F0809] mb-1">
                  Offer Title *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Weekend Special, Maharaja Thali Deal"
                  className="w-full px-3 py-2 rounded-xl border border-[#E8DCD2] bg-[#FBF6EF]/40 focus:bg-white focus:outline-none focus:border-[#4F0809]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#4F0809] mb-1">
                  Offer Description *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="e.g. Flat 20% off on all Main Course items during royal weekend hours..."
                  className="w-full px-3 py-2 rounded-xl border border-[#E8DCD2] bg-[#FBF6EF]/40 focus:bg-white focus:outline-none focus:border-[#4F0809]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#4F0809] mb-1">
                    Discount Type
                  </label>
                  <select
                    value={formDiscountType}
                    onChange={(e) => setFormDiscountType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DCD2] bg-[#FBF6EF]/40 focus:bg-white focus:outline-none focus:border-[#4F0809]"
                  >
                    <option value="percentage">Percentage Discount (%)</option>
                    <option value="flat">Flat Amount Off (₹)</option>
                    <option value="bogo">BOGO (Buy 1 Get 1)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#4F0809] mb-1">
                    Offer Badge Text *
                  </label>
                  <input
                    type="text"
                    required
                    value={formBadgeText}
                    onChange={(e) => setFormBadgeText(e.target.value)}
                    placeholder="e.g. 20% OFF, BOGO, ₹100 OFF"
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DCD2] bg-[#FBF6EF]/40 focus:bg-white focus:outline-none focus:border-[#4F0809]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#4F0809] mb-1">
                    Start Date
                  </label>
                  <input
                    type="text"
                    value={formStartDate}
                    onChange={(e) => setFormStartDate(e.target.value)}
                    placeholder="15 Oct 2026"
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DCD2] bg-[#FBF6EF]/40 focus:bg-white focus:outline-none focus:border-[#4F0809]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#4F0809] mb-1">
                    End Date
                  </label>
                  <input
                    type="text"
                    value={formEndDate}
                    onChange={(e) => setFormEndDate(e.target.value)}
                    placeholder="31 Oct 2026"
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DCD2] bg-[#FBF6EF]/40 focus:bg-white focus:outline-none focus:border-[#4F0809]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#4F0809] mb-1">
                    Applicable Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DCD2] bg-[#FBF6EF]/40 focus:bg-white focus:outline-none focus:border-[#4F0809]"
                  >
                    <option value="All Items">All Menu Items</option>
                    <option value="Main Course">Main Course</option>
                    <option value="Starters">Starters &amp; Kebabs</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Breakfast">Breakfast</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#4F0809] mb-1">
                    Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DCD2] bg-[#FBF6EF]/40 focus:bg-white focus:outline-none focus:border-[#4F0809]"
                  >
                    <option value="active">Active</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>
              </div>

              {/* Banner Presets */}
              <div>
                <label className="block text-[11px] font-semibold text-[#4F0809] mb-1">
                  Banner Photo Preset
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: 'Dal Baati', url: '/images/food/dal-baati.jpg' },
                    { label: 'Restaurant', url: '/images/food/restaurant.jpg' },
                    { label: 'Desserts & Café', url: '/images/food/cafe.jpg' },
                    { label: 'Laal Maas', url: '/images/food/laal-maas.jpg' },
                  ].map((preset) => (
                    <div
                      key={preset.url}
                      onClick={() => setFormImageUrl(preset.url)}
                      className={`h-14 rounded-lg overflow-hidden border cursor-pointer relative group ${
                        formImageUrl === preset.url
                          ? 'border-[#4F0809] ring-2 ring-[#4F0809]'
                          : 'border-[#E8DCD2] opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-[9px] text-white font-bold text-center px-1">
                        {preset.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8DCD2]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E8DCD2] text-[#81736D] hover:bg-[#FBF6EF] font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-[#4F0809] hover:bg-[#680b0c] text-white font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Promotion</span>
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
