'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  Upload,
  Search,
  Filter,
  Calendar,
  Eye,
  Download,
  MoreVertical,
  Play,
  Image as ImageIcon,
  Film,
  Grid,
  List,
  Trash2,
  X,
  Check,
  Share2,
  Sparkles,
  ChevronDown,
  ArrowRight,
  TrendingUp,
  Tag,
  Clock,
  Heart,
  Maximize2
} from 'lucide-react';

function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

interface MediaItem {
  id: string;
  title: string;
  type: 'image' | 'reel';
  category: string;
  date: string;
  tags: string[];
  imageUrl: string;
  duration?: string;
  views: string | number;
}

const INITIAL_PHOTOS: MediaItem[] = [];

const INITIAL_REELS: MediaItem[] = [];

export default function MediaManagementPage() {
  const [activeTab, setActiveTab] = useState<'events' | 'reels'>('events');
  const [photos, setPhotos] = useState<MediaItem[]>(INITIAL_PHOTOS);
  const [reels, setReels] = useState<MediaItem[]>(INITIAL_REELS);
  const [searchQuery, setSearchQuery] = useState('');
  const [eventFilter, setEventFilter] = useState('All');
  const [mediaTypeFilter, setMediaTypeFilter] = useState('All');
  const [reelViewMode, setReelViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Media Upload Form State
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'image' | 'reel'>('image');
  const [newCategory, setNewCategory] = useState('Wedding');
  const [newTags, setNewTags] = useState('#heritage #rajmahal');
  const [newDuration, setNewDuration] = useState('0:30');
  const [newImageUrl, setNewImageUrl] = useState('/images/events/wedding-mandap.jpg');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDeleteItem = (id: string, type: 'image' | 'reel', e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (confirm('Are you sure you want to remove this media item?')) {
      if (type === 'image') {
        setPhotos((prev) => prev.filter((item) => item.id !== id));
      } else {
        setReels((prev) => prev.filter((item) => item.id !== id));
      }
      if (selectedItem?.id === id) {
        setSelectedItem(null);
      }
      setActiveMenuId(null);
      showToast('Media item deleted successfully');
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      alert('Please enter a media title');
      return;
    }

    const tagList = newTags
      .split(' ')
      .map((t) => t.trim())
      .filter((t) => t.length > 0)
      .map((t) => (t.startsWith('#') ? t : `#${t}`));

    const newItem: MediaItem = {
      id: `media-${Date.now()}`,
      title: newTitle.trim(),
      type: newType,
      category: newCategory,
      date: 'Today, 28 Oct 2026',
      tags: tagList.length > 0 ? tagList : ['#rajmahal', '#heritage'],
      imageUrl: newImageUrl,
      duration: newType === 'reel' ? newDuration : undefined,
      views: newType === 'reel' ? '120' : 45,
    };

    if (newType === 'image') {
      setPhotos((prev) => [newItem, ...prev]);
    } else {
      setReels((prev) => [newItem, ...prev]);
    }

    setIsUploadOpen(false);
    setNewTitle('');
    showToast(`Added "${newItem.title}" to ${newType === 'image' ? 'Event Memories' : 'InstaLook Book'}!`);
  };

  // Filtered lists
  const filteredPhotos = useMemo(() => {
    if (mediaTypeFilter === 'Reels') return [];
    return photos.filter((item) => {
      const matchesSearch =
        searchQuery === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesEvent = eventFilter === 'All' || item.category === eventFilter;
      return matchesSearch && matchesEvent;
    });
  }, [photos, searchQuery, eventFilter, mediaTypeFilter]);

  const filteredReels = useMemo(() => {
    if (mediaTypeFilter === 'Images') return [];
    return reels.filter((item) => {
      const matchesSearch =
        searchQuery === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesEvent = eventFilter === 'All' || item.category === eventFilter;
      return matchesSearch && matchesEvent;
    });
  }, [reels, searchQuery, eventFilter, mediaTypeFilter]);

  return (
    <div className="flex-1 overflow-y-auto bg-[#FBF6EF] p-4 sm:p-6 lg:p-7 min-h-full">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#4F0809] text-white px-4 py-2.5 rounded-lg shadow-xl border border-[#D8AA67]/40 flex items-center gap-2.5 text-sm animate-in fade-in slide-in-from-top-3">
          <Check className="w-4 h-4 text-[#E1B46F]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-bold text-[#4F0809] tracking-tight"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            Media Management
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Manage your event memories and InstaLook Book content (reels &amp; short videos)
          </p>
        </div>

        {/* Upload Button */}
        <button
          onClick={() => setIsUploadOpen(true)}
          className="inline-flex items-center justify-center gap-2 bg-[#4F0809] hover:bg-[#3D0607] text-white px-4 py-2.5 rounded-lg text-sm font-medium shadow-sm transition-all hover:shadow active:scale-95 shrink-0 self-start md:self-auto"
        >
          <span className="text-lg leading-none font-light">+</span>
          <span>Upload Media</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2.5 mb-6">
        <button
          type="button"
          onClick={() => setActiveTab('events')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'events'
              ? 'bg-[#4F0809] text-white shadow-sm'
              : 'bg-white/80 text-stone-700 hover:bg-white hover:text-[#4F0809] border border-stone-200/80'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Event Memories</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('reels')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'reels'
              ? 'bg-[#4F0809] text-white shadow-sm'
              : 'bg-white/80 text-stone-700 hover:bg-white hover:text-[#4F0809] border border-stone-200/80'
          }`}
        >
          <InstagramIcon className="w-4 h-4" />
          <span>InstaLook Book</span>
        </button>
      </div>

      {/* Stats Cards (4 Columns) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 mb-6">
        {/* Card 1: Total Photos */}
        <div className="bg-white rounded-xl p-4 border border-[#EADBCE] shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              Total Photos
            </span>
            <div className="text-2xl font-bold text-stone-900 leading-none">{photos.length}</div>
            <div className="flex items-center gap-1 text-[11px] font-medium text-stone-400 pt-0.5">
              <span>{photos.length} uploaded</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#FAF0E6] flex items-center justify-center text-[#4F0809] shrink-0">
            <ImageIcon className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Total Reels */}
        <div className="bg-white rounded-xl p-4 border border-[#EADBCE] shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              Total Reels
            </span>
            <div className="text-2xl font-bold text-stone-900 leading-none">{reels.length}</div>
            <div className="flex items-center gap-1 text-[11px] font-medium text-stone-400 pt-0.5">
              <span>{reels.length} uploaded</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#FAF0E6] flex items-center justify-center text-[#4F0809] shrink-0">
            <Play className="w-5 h-5 fill-[#4F0809]" />
          </div>
        </div>

        {/* Card 3: This Month Photos */}
        <div className="bg-white rounded-xl p-4 border border-[#EADBCE] shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              This Month (Photos)
            </span>
            <div className="text-2xl font-bold text-stone-900 leading-none">{photos.length}</div>
            <div className="flex items-center gap-1 text-[11px] font-medium text-stone-400 pt-0.5">
              <span>Active this month</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#FAF0E6] flex items-center justify-center text-[#4F0809] shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: This Month Reels */}
        <div className="bg-white rounded-xl p-4 border border-[#EADBCE] shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              This Month (Reels)
            </span>
            <div className="text-2xl font-bold text-stone-900 leading-none">{reels.length}</div>
            <div className="flex items-center gap-1 text-[11px] font-medium text-stone-400 pt-0.5">
              <span>Active this month</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#FAF0E6] flex items-center justify-center text-[#4F0809] shrink-0">
            <Play className="w-5 h-5 fill-[#4F0809]" />
          </div>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white rounded-xl p-3 border border-[#EADBCE] shadow-sm mb-6 flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, tags, or event..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-stone-50/70 hover:bg-stone-50 focus:bg-white border border-stone-200 rounded-lg text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#4F0809] focus:border-[#4F0809] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdown: Events */}
        <div className="relative shrink-0">
          <select
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
            className="appearance-none bg-stone-50/70 hover:bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 pr-8 text-xs sm:text-sm text-stone-700 font-medium focus:outline-none focus:ring-1 focus:ring-[#4F0809] cursor-pointer"
          >
            <option value="All">All Events</option>
            <option value="Wedding">Wedding</option>
            <option value="Buffet">Buffet</option>
            <option value="Ambience">Heritage &amp; Ambience</option>
            <option value="Special">Special Dish</option>
            <option value="Festival">Festivals</option>
            <option value="Private">Private Events</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Dropdown: Media Types */}
        <div className="relative shrink-0">
          <select
            value={mediaTypeFilter}
            onChange={(e) => setMediaTypeFilter(e.target.value)}
            className="appearance-none bg-stone-50/70 hover:bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 pr-8 text-xs sm:text-sm text-stone-700 font-medium focus:outline-none focus:ring-1 focus:ring-[#4F0809] cursor-pointer"
          >
            <option value="All">All Media Types</option>
            <option value="Images">Photos Only</option>
            <option value="Reels">Reels Only</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Date Range Button */}
        <button
          onClick={() => showToast('Date range filter: Oct 2026 active')}
          className="flex items-center gap-2 bg-stone-50/70 hover:bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-stone-700 font-medium shrink-0"
        >
          <Calendar className="w-3.5 h-3.5 text-stone-400" />
          <span>Select Date Range</span>
        </button>
      </div>

      {/* Main Content Layout (Left: Event Memories, Right: InstaLook Book) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column: Event Memories Gallery */}
        <div
          className={`${
            activeTab === 'events' ? 'xl:col-span-8' : 'xl:col-span-12'
          } flex flex-col space-y-4`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-[#FAF0E6] text-[#4F0809]">
                <ImageIcon className="w-4 h-4" />
              </span>
              <div>
                <h2
                  className="text-lg font-bold text-[#4F0809]"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  Event Memories
                </h2>
                <p className="text-[11px] text-stone-500">
                  Photos from special moments, celebrations and events
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setEventFilter('All');
                setSearchQuery('');
                setMediaTypeFilter('All');
              }}
              className="text-xs font-semibold text-[#B78A48] hover:text-[#4F0809] flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Photo Cards Grid */}
          {filteredPhotos.length === 0 ? (
            <div className="bg-white rounded-xl border border-stone-200 p-8 text-center text-stone-500">
              <ImageIcon className="w-10 h-10 text-stone-300 mx-auto mb-2" />
              <p className="font-medium text-sm">No photos found matching your search</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setEventFilter('All');
                  setMediaTypeFilter('All');
                }}
                className="mt-3 text-xs text-[#4F0809] underline font-medium"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 ${
                activeTab === 'events' ? 'lg:grid-cols-4' : 'lg:grid-cols-4 xl:grid-cols-5'
              } gap-3.5`}
            >
              {filteredPhotos.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => setSelectedItem(photo)}
                  className="group bg-white rounded-xl border border-[#EADBCE] overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
                >
                  {/* Image Container with Badges */}
                  <div className="relative w-full aspect-[4/3] bg-stone-100 overflow-hidden">
                    <Image
                      src={photo.imageUrl}
                      alt={photo.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Overlay Tag: Image */}
                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-medium flex items-center gap-1 shadow-sm">
                      <ImageIcon className="w-3 h-3" />
                      <span>Image</span>
                    </div>

                    {/* Top Right: 3-Dot Menu */}
                    <div className="absolute top-2 right-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(activeMenuId === photo.id ? null : photo.id);
                        }}
                        className="w-6 h-6 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
                        title="Options"
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>

                      {/* Dropdown Menu */}
                      {activeMenuId === photo.id && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-0 top-7 w-36 bg-white rounded-lg shadow-xl border border-stone-200 py-1 z-20 text-xs"
                        >
                          <button
                            onClick={() => {
                              setSelectedItem(photo);
                              setActiveMenuId(null);
                            }}
                            className="w-full px-3 py-1.5 text-left text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                          >
                            <Maximize2 className="w-3.5 h-3.5 text-stone-400" />
                            <span>Preview</span>
                          </button>
                          <button
                            onClick={() => {
                              showToast('Download started for ' + photo.title);
                              setActiveMenuId(null);
                            }}
                            className="w-full px-3 py-1.5 text-left text-stone-700 hover:bg-stone-50 flex items-center gap-2"
                          >
                            <Download className="w-3.5 h-3.5 text-stone-400" />
                            <span>Download</span>
                          </button>
                          <div className="border-t border-stone-100 my-0.5" />
                          <button
                            onClick={(e) => handleDeleteItem(photo.id, 'image', e)}
                            className="w-full px-3 py-1.5 text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] text-stone-400 font-medium mb-0.5">
                        {photo.date}
                      </div>
                      <h3 className="font-bold text-xs sm:text-sm text-stone-800 line-clamp-1 leading-snug group-hover:text-[#4F0809] transition-colors">
                        {photo.title}
                      </h3>
                      <div className="text-[10px] text-stone-500 mt-1 line-clamp-1">
                        {photo.tags.join(' ')}
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between text-stone-400 text-[11px]">
                      <div className="flex items-center gap-1 text-stone-500 font-medium">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{photo.views}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            showToast('Downloaded ' + photo.title);
                          }}
                          className="p-1 hover:text-[#4F0809] rounded hover:bg-stone-50 transition-colors"
                          title="Download Image"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteItem(photo.id, 'image', e);
                          }}
                          className="p-1 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: InstaLook Book (Reels) */}
        <div
          className={`${
            activeTab === 'events' ? 'xl:col-span-4' : 'xl:col-span-12'
          } flex flex-col space-y-4`}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-gradient-to-tr from-[#833ab4]/15 via-[#fd1d1d]/15 to-[#fcb045]/15 text-[#4F0809]">
                <InstagramIcon className="w-4 h-4 text-[#833ab4]" />
              </span>
              <div>
                <h2
                  className="text-lg font-bold text-[#4F0809]"
                  style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                >
                  InstaLook Book
                </h2>
                <p className="text-[11px] text-stone-500">
                  Short videos &amp; reels for your Instagram
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Grid / List View Toggle */}
              <div className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200">
                <button
                  type="button"
                  onClick={() => setReelViewMode('grid')}
                  className={`p-1 rounded ${
                    reelViewMode === 'grid'
                      ? 'bg-[#4F0809] text-white shadow-xs'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                  title="Grid View"
                >
                  <Grid className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setReelViewMode('list')}
                  className={`p-1 rounded ${
                    reelViewMode === 'list'
                      ? 'bg-[#4F0809] text-white shadow-xs'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                  title="List View"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() => {
                  setActiveTab('reels');
                  setMediaTypeFilter('Reels');
                }}
                className="text-xs font-semibold text-[#B78A48] hover:text-[#4F0809] flex items-center gap-1 transition-colors"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Reels Content */}
          {filteredReels.length === 0 ? (
            <div className="bg-white rounded-xl border border-stone-200 p-8 text-center text-stone-500">
              <Film className="w-10 h-10 text-stone-300 mx-auto mb-2" />
              <p className="font-medium text-sm">No reels found</p>
            </div>
          ) : reelViewMode === 'grid' ? (
            /* Vertical 3-Column Reels Grid matching Screenshot */
            <div
              className={`grid grid-cols-2 sm:grid-cols-3 ${
                activeTab === 'reels' ? 'lg:grid-cols-4 xl:grid-cols-6' : ''
              } gap-3`}
            >
              {filteredReels.map((reel) => (
                <div
                  key={reel.id}
                  onClick={() => setSelectedItem(reel)}
                  className="group bg-white rounded-xl border border-[#EADBCE] overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
                >
                  {/* Vertical Reel Thumbnail (9:16 or 4:5 aspect) */}
                  <div className="relative w-full aspect-[3/4] bg-stone-900 overflow-hidden">
                    <Image
                      src={reel.imageUrl}
                      alt={reel.title}
                      fill
                      className="object-cover opacity-90 group-hover:scale-105 group-hover:opacity-100 transition-all duration-300"
                    />

                    {/* Dark gradient shadow */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />

                    {/* Badge: Reel */}
                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white px-1.5 py-0.5 rounded text-[9px] font-medium flex items-center gap-1 shadow-sm">
                      <Film className="w-2.5 h-2.5" />
                      <span>Reel</span>
                    </div>

                    {/* Center subtle play icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-9 h-9 rounded-full bg-black/40 group-hover:bg-[#4F0809]/90 text-white flex items-center justify-center backdrop-blur-xs transition-all transform group-hover:scale-110 shadow-lg">
                        <Play className="w-4 h-4 fill-white ml-0.5" />
                      </div>
                    </div>

                    {/* Duration badge bottom-right */}
                    {reel.duration && (
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white px-1.5 py-0.5 rounded text-[9px] font-mono">
                        {reel.duration}
                      </div>
                    )}
                  </div>

                  {/* Reel Info */}
                  <div className="p-2.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-stone-800 line-clamp-1 group-hover:text-[#4F0809] transition-colors">
                        {reel.title}
                      </h4>
                      <div className="text-[10px] text-stone-400 mt-0.5">{reel.date}</div>
                    </div>

                    {/* Views & Actions */}
                    <div className="mt-2 pt-1.5 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                      <div className="flex items-center gap-1 text-stone-600 font-medium">
                        <Eye className="w-3 h-3" />
                        <span>{reel.views}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            showToast('Downloaded ' + reel.title);
                          }}
                          className="p-1 hover:text-[#4F0809] rounded hover:bg-stone-50 transition-colors"
                          title="Download Reel"
                        >
                          <Download className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteItem(reel.id, 'reel', e)}
                          className="p-1 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                          title="Delete Reel"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="bg-white rounded-xl border border-[#EADBCE] divide-y divide-stone-100 overflow-hidden shadow-sm">
              {filteredReels.map((reel) => (
                <div
                  key={reel.id}
                  onClick={() => setSelectedItem(reel)}
                  className="p-3 flex items-center justify-between hover:bg-stone-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-stone-900 shrink-0">
                      <Image
                        src={reel.imageUrl}
                        alt={reel.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <Play className="w-3.5 h-3.5 fill-white text-white" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-stone-800">
                        {reel.title}
                      </h4>
                      <p className="text-[11px] text-stone-400 mt-0.5">
                        {reel.date} • {reel.duration}
                      </p>
                      <p className="text-[10px] text-stone-500 mt-0.5">
                        {reel.tags.join(' ')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-stone-600 flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-stone-400" />
                      {reel.views}
                    </span>
                    <button
                      onClick={(e) => handleDeleteItem(reel.id, 'reel', e)}
                      className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Social Media Promo / CTA Box matching Screenshot */}
          <div className="relative overflow-hidden rounded-xl border border-[#E8D9C8] bg-gradient-to-r from-[#FAF2E8] via-[#FDF8F3] to-[#FFF9F3] p-4 shadow-xs">
            {/* Background Watermark Arch */}
            <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none translate-x-4 translate-y-3">
              <svg className="w-32 h-32 text-[#4F0809]" viewBox="0 0 100 100" fill="currentColor">
                <path d="M50 10 C30 10 15 25 15 45 L15 90 L85 90 L85 45 C85 25 70 10 50 10 Z M50 20 C64 20 75 31 75 45 L75 80 L25 80 L25 45 C25 31 36 20 50 20 Z" />
              </svg>
            </div>

            <div className="relative z-10 space-y-3">
              <div className="flex items-start gap-2.5">
                <span className="p-1.5 rounded-lg bg-[#4F0809]/10 text-[#4F0809] shrink-0 mt-0.5">
                  <InstagramIcon className="w-4 h-4" />
                </span>
                <p className="text-xs text-stone-700 leading-relaxed font-medium">
                  Create stunning reels &amp; photos to keep your social media fresh and engaging!
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setNewType('reel');
                  setIsUploadOpen(true);
                }}
                className="inline-flex items-center justify-center gap-1.5 bg-[#4F0809] hover:bg-[#3D0607] text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                <span>Upload Media</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox / Preview Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-white rounded-2xl overflow-hidden max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/50">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded bg-[#FAF0E6] text-[#4F0809]">
                  {selectedItem.type === 'reel' ? (
                    <Film className="w-4 h-4" />
                  ) : (
                    <ImageIcon className="w-4 h-4" />
                  )}
                </span>
                <div>
                  <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                    {selectedItem.title}
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    {selectedItem.date} • {selectedItem.category}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedItem(null)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Media Display */}
            <div className="relative bg-black flex items-center justify-center min-h-[300px] max-h-[60vh] overflow-hidden">
              <Image
                src={selectedItem.imageUrl}
                alt={selectedItem.title}
                width={1200}
                height={800}
                className="object-contain max-h-[60vh] w-auto mx-auto"
              />
              {selectedItem.type === 'reel' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                  <div className="w-16 h-16 rounded-full bg-[#4F0809]/90 text-white flex items-center justify-center shadow-xl">
                    <Play className="w-7 h-7 fill-white ml-1" />
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Info & Actions */}
            <div className="p-4 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-stone-100">
              <div className="space-y-1">
                <div className="flex flex-wrap gap-1.5">
                  {selectedItem.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded text-[11px] font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-stone-500 flex items-center gap-1.5 pt-1">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{selectedItem.views} total views</span>
                  {selectedItem.duration && <span>• Duration: {selectedItem.duration}</span>}
                </p>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => showToast('Media downloaded successfully')}
                  className="flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => handleDeleteItem(selectedItem.id, selectedItem.type, e)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-semibold transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Media Modal */}
      {isUploadOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsUploadOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Title */}
            <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-gradient-to-r from-[#FAF2E8] to-white">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-[#4F0809] text-white">
                  <Upload className="w-4 h-4" />
                </span>
                <div>
                  <h3
                    className="font-bold text-[#4F0809] text-lg"
                    style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
                  >
                    Upload New Media
                  </h3>
                  <p className="text-xs text-stone-500">
                    Add new memories to photos or InstaLook Book reels
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsUploadOpen(false)}
                className="text-stone-400 hover:text-stone-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleUploadSubmit} className="p-5 space-y-4">
              {/* Media Type Toggle */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Media Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setNewType('image');
                      setNewImageUrl('/images/events/wedding-mandap.jpg');
                    }}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
                      newType === 'image'
                        ? 'bg-[#4F0809] text-white border-[#4F0809] shadow-xs'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Photo (Event Memory)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewType('reel');
                      setNewImageUrl('/images/reels/royal-dining.jpg');
                    }}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
                      newType === 'reel'
                        ? 'bg-[#4F0809] text-white border-[#4F0809] shadow-xs'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <InstagramIcon className="w-4 h-4" />
                    <span>Reel (InstaLook Book)</span>
                  </button>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Wedding Sangeet / Poolside Evening"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs sm:text-sm text-stone-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#4F0809] focus:border-[#4F0809]"
                />
              </div>

              {/* Category & Duration */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Event Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs sm:text-sm text-stone-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#4F0809]"
                  >
                    <option value="Wedding">Wedding</option>
                    <option value="Buffet">Buffet</option>
                    <option value="Ambience">Heritage &amp; Ambience</option>
                    <option value="Special">Special Dish</option>
                    <option value="Festival">Festival</option>
                    <option value="Private">Private Event</option>
                    <option value="Dining">Dining</option>
                  </select>
                </div>

                {newType === 'reel' ? (
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                      Duration
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 0:35"
                      value={newDuration}
                      onChange={(e) => setNewDuration(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs sm:text-sm text-stone-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#4F0809]"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                      Tags
                    </label>
                    <input
                      type="text"
                      placeholder="#wedding #rajmahal"
                      value={newTags}
                      onChange={(e) => setNewTags(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs sm:text-sm text-stone-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#4F0809]"
                    />
                  </div>
                )}
              </div>

              {/* Sample Photo/Reel Image Preset Selector */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  Select Visual Asset
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: 'Mandap', path: '/images/events/wedding-mandap.jpg' },
                    { label: 'Banquet', path: '/images/events/grand-banquet.jpg' },
                    { label: 'Courtyard', path: '/images/events/courtyard-night.jpg' },
                    { label: 'Dining', path: '/images/reels/royal-dining.jpg' },
                    { label: 'Heritage', path: '/images/reels/heritage-rooms.jpg' },
                    { label: 'Udaipur', path: '/images/reels/udaipur-views.jpg' },
                    { label: 'Cuisine', path: '/images/food/restaurant.jpg' },
                    { label: 'Floral', path: '/images/events/floral-decor.jpg' },
                  ].map((preset) => (
                    <button
                      key={preset.path}
                      type="button"
                      onClick={() => setNewImageUrl(preset.path)}
                      className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                        newImageUrl === preset.path
                          ? 'border-[#4F0809] ring-2 ring-[#4F0809]/20'
                          : 'border-stone-200 hover:border-stone-400 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <Image
                        src={preset.path}
                        alt={preset.label}
                        fill
                        className="object-cover"
                      />
                      <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[8px] text-white text-center py-0.5 truncate">
                        {preset.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-stone-600 hover:bg-stone-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-semibold bg-[#4F0809] hover:bg-[#3D0607] text-white shadow-sm transition-colors"
                >
                  Save &amp; Publish Media
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
