'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Star,
  Download,
  Search,
  SlidersHorizontal,
  Eye,
  EyeOff,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  MessageSquare,
  Utensils,
  X,
  Send,
} from 'lucide-react';
import type { CustomerReview } from '@/lib/services/reviews-service';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'published' | 'hidden'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState<'all' | '5' | '4' | '3' | '2' | '1'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'pending' | 'hidden'>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // View / Reply Modal
  const [viewingReview, setViewingReview] = useState<CustomerReview | null>(null);
  const [replyText, setReplyText] = useState('');

  const showToast = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  const loadReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reviews');
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
      }
    } catch {
      showToast('error', 'Failed to load customer reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  // Dynamic counts
  const totalCount = reviews.length;
  const pendingCount = reviews.filter((r) => r.status === 'pending').length;
  const publishedCount = reviews.filter((r) => r.status === 'published').length;
  const hiddenCount = reviews.filter((r) => r.status === 'hidden').length;

  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      // Tab filter
      if (activeTab !== 'all' && r.status !== activeTab) return false;
      // Rating filter
      if (ratingFilter !== 'all' && r.rating !== parseInt(ratingFilter)) return false;
      // Status filter
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      // Source filter
      if (sourceFilter !== 'all') {
        const srcLower = r.customer_source.toLowerCase();
        if (sourceFilter === 'table' && !srcLower.includes('table')) return false;
        if (sourceFilter === 'room' && !srcLower.includes('room')) return false;
        if (sourceFilter === 'online' && !srcLower.includes('online')) return false;
        if (sourceFilter === 'guest' && !srcLower.includes('guest')) return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = r.customer_name.toLowerCase().includes(q);
        const matchesComment = r.comment.toLowerCase().includes(q);
        const matchesItem = r.menu_item_name.toLowerCase().includes(q);
        if (!matchesName && !matchesComment && !matchesItem) return false;
      }
      return true;
    });
  }, [reviews, activeTab, ratingFilter, statusFilter, sourceFilter, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredReviews.length / itemsPerPage));
  const paginatedReviews = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredReviews.slice(start, start + itemsPerPage);
  }, [filteredReviews, currentPage]);

  const handleTogglePublish = async (review: CustomerReview) => {
    const nextStatus = review.status === 'published' ? 'hidden' : 'published';
    try {
      const res = await fetch(`/api/reviews/${review.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        showToast('success', `Review marked as ${nextStatus}`);
        loadReviews();
      }
    } catch {
      showToast('error', 'Failed to update review status');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete review by "${name}"?`)) return;
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('success', `Review deleted`);
        loadReviews();
      }
    } catch {
      showToast('error', 'Failed to delete review');
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Customer Name', 'Source', 'Rating', 'Review', 'Menu Item', 'Date', 'Status'];
    const rows = filteredReviews.map((r) => [
      r.id,
      `"${r.customer_name}"`,
      `"${r.customer_source}"`,
      r.rating,
      `"${r.comment.replace(/"/g, '""')}"`,
      `"${r.menu_item_name}"`,
      `"${r.date_formatted}"`,
      r.status,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `restaurant_reviews_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('success', 'Reviews exported to CSV successfully');
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3.5 h-3.5 ${
              star <= rating ? 'fill-[#F59E0B] text-[#F59E0B]' : 'text-gray-200'
            }`}
          />
        ))}
      </div>
    );
  };

  const getStatusBadge = (status: CustomerReview['status']) => {
    switch (status) {
      case 'published':
        return (
          <span className="px-2.5 py-0.5 rounded-md bg-[#ECFDF5] border border-[#A7F3D0] text-[#065F46] text-[10px] font-semibold">
            Published
          </span>
        );
      case 'pending':
        return (
          <span className="px-2.5 py-0.5 rounded-md bg-[#FFFBEB] border border-[#FDE68A] text-[#B45309] text-[10px] font-semibold">
            Pending
          </span>
        );
      case 'hidden':
        return (
          <span className="px-2.5 py-0.5 rounded-md bg-[#FEF2F2] border border-[#FECACA] text-[#991B1B] text-[10px] font-semibold">
            Hidden
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
            Reviews
          </h1>
          <p className="text-xs text-[#81736D] mt-0.5">
            Manage customer reviews and ratings for your restaurant &amp; café
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-[#E8DCD2] bg-white text-[#4F0809] hover:bg-[#FBF6EF] text-xs font-semibold shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-[#B78A48]" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter Tabs matching Screenshot */}
      <div className="flex items-center gap-2 flex-wrap pb-1">
        {[
          { id: 'all', label: 'All Reviews', count: totalCount },
          { id: 'pending', label: 'Pending', count: pendingCount },
          { id: 'published', label: 'Published', count: publishedCount },
          { id: 'hidden', label: 'Hidden', count: hiddenCount },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setCurrentPage(1);
              }}
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

      {/* Main Reviews Table Card */}
      <div className="bg-white border border-[#E8DCD2] rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between">
        <div>
          {/* Search & Filter Bar */}
          <div className="p-3.5 border-b border-[#E8DCD2] bg-[#FBF6EF]/40 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#81736D]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search reviews..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-[#E8DCD2] text-xs bg-white focus:outline-none focus:border-[#4F0809]"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Rating Filter */}
              <select
                value={ratingFilter}
                onChange={(e) => {
                  setRatingFilter(e.target.value as any);
                  setCurrentPage(1);
                }}
                className="px-2.5 py-1.5 rounded-lg border border-[#E8DCD2] text-xs bg-white text-[#302421] focus:outline-none cursor-pointer"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as any);
                  setCurrentPage(1);
                }}
                className="px-2.5 py-1.5 rounded-lg border border-[#E8DCD2] text-xs bg-white text-[#302421] focus:outline-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="pending">Pending</option>
                <option value="hidden">Hidden</option>
              </select>

              {/* Source Filter */}
              <select
                value={sourceFilter}
                onChange={(e) => {
                  setSourceFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-2.5 py-1.5 rounded-lg border border-[#E8DCD2] text-xs bg-white text-[#302421] focus:outline-none cursor-pointer"
              >
                <option value="all">All Sources</option>
                <option value="table">Table Dine-in</option>
                <option value="room">Room Service</option>
                <option value="online">Online Order</option>
                <option value="guest">Walk-in Guest</option>
              </select>

              <button
                onClick={() => {
                  setSearchQuery('');
                  setRatingFilter('all');
                  setStatusFilter('all');
                  setSourceFilter('all');
                  setActiveTab('all');
                }}
                title="Reset Filters"
                className="p-1.5 rounded-lg border border-[#E8DCD2] text-[#81736D] hover:bg-[#FBF6EF] transition cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-12 text-center text-xs text-[#81736D] flex flex-col items-center justify-center">
                <RefreshCw className="w-6 h-6 animate-spin text-[#4F0809] mb-2" />
                <span>Loading reviews...</span>
              </div>
            ) : filteredReviews.length === 0 ? (
              <div className="p-12 text-center text-xs text-[#81736D]">
                <Star className="w-8 h-8 text-[#D8AA67] mx-auto mb-2 opacity-60" />
                <p className="font-semibold text-[#4F0809]">No reviews found</p>
                <p className="text-[11px] text-[#81736D] mt-0.5">
                  Try adjusting filters or checking back when guests share feedback.
                </p>
              </div>
            ) : (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E8DCD2] bg-[#FBF6EF]/50 text-[10px] font-bold uppercase tracking-wider text-[#81736D]">
                    <th className="py-2.5 px-3 w-8">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === paginatedReviews.length && paginatedReviews.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedIds(paginatedReviews.map((r) => r.id));
                          else setSelectedIds([]);
                        }}
                        className="rounded border-[#E8DCD2] accent-[#4F0809]"
                      />
                    </th>
                    <th className="py-2.5 px-3">Customer</th>
                    <th className="py-2.5 px-3">Rating</th>
                    <th className="py-2.5 px-3 max-w-xs">Review</th>
                    <th className="py-2.5 px-3">Menu Item / Service</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DCD2]/70 text-[#302421]">
                  {paginatedReviews.map((r) => (
                    <tr key={r.id} className="hover:bg-[#FBF6EF]/40 transition-colors">
                      <td className="py-2.5 px-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(r.id)}
                          onChange={() => {
                            setSelectedIds((prev) =>
                              prev.includes(r.id) ? prev.filter((i) => i !== r.id) : [...prev, r.id]
                            );
                          }}
                          className="rounded border-[#E8DCD2] accent-[#4F0809]"
                        />
                      </td>

                      {/* Customer with Avatar */}
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0 shadow-2xs"
                            style={{ backgroundColor: r.customer_avatar_color || '#10B981' }}
                          >
                            {r.customer_name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-xs text-[#302421]">{r.customer_name}</p>
                            <p className="text-[10px] text-[#81736D]">{r.customer_source}</p>
                          </div>
                        </div>
                      </td>

                      {/* Rating Stars */}
                      <td className="py-2.5 px-3 whitespace-nowrap">{renderStars(r.rating)}</td>

                      {/* Review Comment Snippet */}
                      <td className="py-2.5 px-3 max-w-sm">
                        <p
                          onClick={() => setViewingReview(r)}
                          className="text-[11px] text-[#302421] line-clamp-2 hover:text-[#4F0809] cursor-pointer"
                        >
                          &quot;{r.comment}&quot;
                        </p>
                      </td>

                      {/* Menu Item with Thumbnail */}
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          <img
                            src={r.menu_item_image || '/images/food/dal-baati.jpg'}
                            alt={r.menu_item_name}
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = '/images/food/dal-baati.jpg';
                            }}
                            className="w-8 h-8 rounded-lg object-cover border border-[#E8DCD2] shrink-0"
                          />
                          <span className="font-semibold text-xs text-[#302421] truncate max-w-[120px]">
                            {r.menu_item_name}
                          </span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-2.5 px-3 text-[11px] text-[#81736D] whitespace-nowrap">
                        {r.date_formatted}
                      </td>

                      {/* Status */}
                      <td className="py-2.5 px-3">{getStatusBadge(r.status)}</td>

                      {/* Actions */}
                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleTogglePublish(r)}
                            title={r.status === 'published' ? 'Hide Review' : 'Publish Review'}
                            className="p-1.5 rounded-md hover:bg-[#FBF6EF] text-[#81736D] hover:text-[#4F0809] transition cursor-pointer"
                          >
                            {r.status === 'published' ? (
                              <EyeOff className="w-3.5 h-3.5" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(r.id, r.customer_name)}
                            title="Delete Review"
                            className="p-1.5 rounded-md hover:bg-red-50 text-red-500 hover:text-red-700 transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Pagination Footer */}
        <div className="p-3 border-t border-[#E8DCD2] bg-[#FBF6EF]/40 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#81736D] gap-2">
          <div>
            Showing {filteredReviews.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredReviews.length)} of {filteredReviews.length} reviews
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-2 py-1 rounded border border-[#E8DCD2] bg-white text-[#302421] disabled:opacity-40 cursor-pointer"
              >
                &lt;
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-7 h-7 rounded text-xs font-semibold cursor-pointer ${
                    currentPage === i + 1
                      ? 'bg-[#4F0809] text-white font-bold'
                      : 'bg-white border border-[#E8DCD2] text-[#302421] hover:bg-[#FBF6EF]'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-2 py-1 rounded border border-[#E8DCD2] bg-white text-[#302421] disabled:opacity-40 cursor-pointer"
              >
                &gt;
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Review Details Modal ── */}
      {viewingReview && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#E8DCD2] max-w-lg w-full p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E8DCD2] pb-3">
              <h2
                className="text-lg font-bold text-[#4F0809]"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                Customer Review Details
              </h2>
              <button
                onClick={() => setViewingReview(null)}
                className="p-1 rounded-full text-[#81736D] hover:text-[#4F0809] hover:bg-[#FBF6EF] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#FBF6EF]/50 border border-[#E8DCD2]">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-2xs"
                    style={{ backgroundColor: viewingReview.customer_avatar_color }}
                  >
                    {viewingReview.customer_name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-[#302421]">{viewingReview.customer_name}</p>
                    <p className="text-[11px] text-[#81736D]">{viewingReview.customer_source}</p>
                  </div>
                </div>

                <div className="text-right">
                  {renderStars(viewingReview.rating)}
                  <p className="text-[10px] text-[#81736D] mt-1">{viewingReview.date_formatted}</p>
                </div>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-[#81736D] mb-1">Feedback Comment:</p>
                <div className="p-3 rounded-xl border border-[#E8DCD2] bg-white text-[#302421] italic text-xs leading-relaxed">
                  &quot;{viewingReview.comment}&quot;
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-xl border border-[#E8DCD2] bg-[#FBF6EF]/30">
                <img
                  src={viewingReview.menu_item_image || '/images/food/dal-baati.jpg'}
                  alt={viewingReview.menu_item_name}
                  className="w-10 h-10 rounded-lg object-cover border border-[#E8DCD2]"
                />
                <div>
                  <p className="text-[10px] text-[#81736D]">Reviewed Dish / Service:</p>
                  <p className="font-bold text-xs text-[#302421]">{viewingReview.menu_item_name}</p>
                </div>
              </div>

              {/* Status and Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-[#E8DCD2]">
                <div>
                  <span className="text-[11px] text-[#81736D] mr-2">Status:</span>
                  {getStatusBadge(viewingReview.status)}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      handleTogglePublish(viewingReview);
                      setViewingReview(null);
                    }}
                    className="px-3.5 py-1.5 rounded-lg border border-[#E8DCD2] bg-white text-[#4F0809] hover:bg-[#FBF6EF] font-semibold text-xs"
                  >
                    {viewingReview.status === 'published' ? 'Unpublish' : 'Publish Review'}
                  </button>
                  <button
                    onClick={() => {
                      handleDelete(viewingReview.id, viewingReview.customer_name);
                      setViewingReview(null);
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
