'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Calendar,
  Sparkles,
  Heart,
  Upload,
  Camera,
  MapPin,
  X,
  Maximize2,
  Tag,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';

interface RoyalMemory {
  id: string;
  eventName: string;
  eventType: 'wedding' | 'sufi' | 'banquet' | 'festival' | 'anniversary';
  hostName: string;
  date: string;
  story: string;
  photoUrl: string;
  likes: number;
  userLiked?: boolean;
}

const INITIAL_MEMORIES: RoyalMemory[] = [
  {
    id: 'mem-1',
    eventName: 'The Royal Rajputana Wedding',
    eventType: 'wedding',
    hostName: 'Devendra & Radhika Rathore',
    date: 'February 2025',
    story:
      'From the royal Shehnai welcome at the Pol gate to the candle-lit pheras by the courtyard fountain, Rajmahal gave us memories that our families will cherish for generations.',
    photoUrl: '/images/hall/crystal-ballroom.jpg',
    likes: 342,
  },
  {
    id: 'mem-2',
    eventName: 'Sufi & Folk Night Under The Stars',
    eventType: 'sufi',
    hostName: 'Guest: Vikram & Friends',
    date: 'January 2025',
    story:
      'Mesmerizing Manganiyar musicians, fragrant burning loban, and authentic Ker Sangri served under the star-lit Udaipur sky. Pure heaven on earth.',
    photoUrl: '/images/rooms/royal-courtyard.jpg',
    likes: 219,
  },
  {
    id: 'mem-3',
    eventName: 'Golden 50th Wedding Anniversary',
    eventType: 'anniversary',
    hostName: 'Col. Jaswant & Savitri Singh',
    date: 'December 2024',
    story:
      'We celebrated our 50th anniversary in the Sheesh Mahal Suite. The personalized silver thali dinner and warm hospitality made us feel like true maharaja and maharani.',
    photoUrl: '/images/rooms/sheesh-mahal.jpg',
    likes: 512,
  },
  {
    id: 'mem-4',
    eventName: 'Courtyard Khansama Banquet',
    eventType: 'banquet',
    hostName: 'Singhania Family Reunion',
    date: 'November 2024',
    story:
      '40 of our relatives gathered from across the world. The slow-cooked Laal Maas and melt-in-mouth churma prepared by master khansamas was the highlight of our entire trip.',
    photoUrl: '/images/food/dal-baati.jpg',
    likes: 188,
  },
  {
    id: 'mem-5',
    eventName: 'Royal Heritage Diwali Gala',
    eventType: 'festival',
    hostName: 'Rajmahal Annual Celebration',
    date: 'November 2024',
    story:
      'Over 2,000 earthen diyas lighting up every arch and carved jharokha of the palace. An unforgettable celebration of light, classical sitar, and royal sweets.',
    photoUrl: '/images/hero_haveli.jpg',
    likes: 420,
  },
  {
    id: 'mem-6',
    eventName: 'Lakeview Jharokha Sunrise Breakfast',
    eventType: 'anniversary',
    hostName: 'Aarav & Meera',
    date: 'October 2024',
    story:
      'Steaming kulhad chai and piping hot pyaaz kachoris while watching the morning mist rise over Lake Pichola from our private jharokha.',
    photoUrl: '/images/rooms/jharokha-room.jpg',
    likes: 295,
  },
];

const EVENT_FILTERS = [
  { id: 'all', label: 'All Celebrations' },
  { id: 'wedding', label: 'Royal Weddings' },
  { id: 'sufi', label: 'Sufi & Folk Nights' },
  { id: 'banquet', label: 'Courtyard Banquets' },
  { id: 'festival', label: 'Heritage Festivals' },
  { id: 'anniversary', label: 'Anniversaries' },
];

export function RoyalMemories() {
  const [memories, setMemories] = useState<RoyalMemory[]>(INITIAL_MEMORIES);
  const [activeFilter, setActiveFilter] = useState('all');
  const [zoomMemory, setZoomMemory] = useState<RoyalMemory | null>(null);

  // Add memory modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventType, setEventType] = useState<RoyalMemory['eventType']>('wedding');
  const [eventDate, setEventDate] = useState('');
  const [story, setStory] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState('/images/hall/crystal-ballroom.jpg');

  const filteredMemories = memories.filter((m) => {
    if (activeFilter === 'all') return true;
    return m.eventType === activeFilter;
  });

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMemories((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const wasLiked = m.userLiked;
          return {
            ...m,
            userLiked: !wasLiked,
            likes: wasLiked ? m.likes - 1 : m.likes + 1,
          };
        }
        return m;
      })
    );
  };

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !eventName || !story) return;

    const newMemory: RoyalMemory = {
      id: `mem-${Date.now()}`,
      eventName,
      eventType,
      hostName: guestName,
      date: eventDate || 'Recent Celebration',
      story,
      photoUrl: selectedPhoto,
      likes: 1,
      userLiked: true,
    };

    setMemories([newMemory, ...memories]);
    setIsAddModalOpen(false);
    setGuestName('');
    setEventName('');
    setStory('');
    setEventDate('');
  };

  return (
    <section className="py-20 bg-[#F5F1E8] relative overflow-hidden border-t border-[#D4CBBB]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="text-left max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#670E10]/10 border border-[#B08D57]/40 mb-3">
              <Camera className="w-3.5 h-3.5 text-[#670E10]" />
              <span className="text-xs font-bold text-[#670E10] tracking-wider uppercase">
                #RajmahalMemories
              </span>
            </div>
            <h2 className="font-heritage text-3xl sm:text-4xl lg:text-5xl font-bold text-[#670E10] leading-tight">
              Royal Memories &amp; Events
            </h2>
            <p className="text-sm sm:text-base text-[#6E6356] font-light mt-2">
              A celebration chronicle curated by our guests — real weddings, milestone birthdays, and unforgettable courtyard evenings.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#C59B63] hover:bg-[#B88E55] text-[#4A0A0C] px-5 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 shadow-md hover:shadow-lg transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>Share Your Memory</span>
            </Button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {EVENT_FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeFilter === f.id
                  ? 'bg-[#670E10] text-[#FAF8F3] shadow-md border border-[#B08D57]'
                  : 'bg-white text-[#6E6356] border border-[#D4CBBB] hover:border-[#B08D57]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Memories Photo Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMemories.map((mem) => (
            <div
              key={mem.id}
              onClick={() => setZoomMemory(mem)}
              className="bg-white rounded-2xl overflow-hidden border border-[#D4CBBB]/70 shadow-sm hover:shadow-xl hover:border-[#B08D57] transition-all duration-300 flex flex-col group cursor-pointer"
            >
              {/* Photo View with Hover Zoom */}
              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src={mem.photoUrl}
                  alt={mem.eventName}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                {/* Event Name Tag */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-[#670E10]/90 backdrop-blur-md text-[11px] font-bold text-[#FAF8F3] border border-[#B08D57]/40 shadow">
                    {mem.eventName}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Memory Story Content */}
              <div className="p-5 flex-1 flex flex-col justify-between text-left">
                <div>
                  <div className="flex items-center justify-between text-xs text-[#7A6F62] mb-2">
                    <span className="font-semibold text-[#670E10] flex items-center">
                      <span className="w-2 h-2 rounded-full bg-[#B08D57] mr-1.5"></span>
                      {mem.hostName}
                    </span>
                    <span className="flex items-center font-mono text-[11px] text-[#8F7245]">
                      <Calendar className="w-3.5 h-3.5 mr-1" />
                      {mem.date}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#554C41] font-light leading-relaxed italic line-clamp-3 mb-4">
                    &ldquo;{mem.story}&rdquo;
                  </p>
                </div>

                {/* Card Footer: Likes & Details */}
                <div className="pt-3 border-t border-[#F2ECE1] flex items-center justify-between">
                  <span className="text-[11px] text-[#8F7245] uppercase tracking-wider font-semibold">
                    Rajmahal Chronicle
                  </span>

                  <button
                    onClick={(e) => handleLike(mem.id, e)}
                    className="flex items-center space-x-1.5 text-xs text-[#6E6356] hover:text-rose-500 transition-colors"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        mem.userLiked ? 'text-rose-500 fill-rose-500' : 'text-[#8F7245]'
                      }`}
                    />
                    <span className="font-mono text-xs font-semibold">{mem.likes}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MODAL: MEMORY LIGHTBOX ZOOM ── */}
      {zoomMemory && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setZoomMemory(null)}
        >
          <div
            className="relative w-full max-w-3xl rounded-3xl overflow-hidden bg-[#FAF8F3] border border-[#B08D57]/40 shadow-2xl flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left/Top: High-res Photo */}
            <div className="relative h-72 md:h-auto md:w-3/5 bg-black">
              <Image
                src={zoomMemory.photoUrl}
                alt={zoomMemory.eventName}
                fill
                className="object-cover"
              />
            </div>

            {/* Right/Bottom: Story & Event Details */}
            <div className="p-6 md:w-2/5 flex flex-col justify-between text-left">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-full bg-[#670E10] text-[#FAF8F3] text-[11px] font-bold">
                    {zoomMemory.eventName}
                  </span>
                  <button
                    onClick={() => setZoomMemory(null)}
                    className="w-8 h-8 rounded-full bg-[#EBE5D6] flex items-center justify-center text-[#241F1A] hover:bg-[#D4CBBB]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="font-heritage text-xl font-bold text-[#670E10] mb-1">
                  {zoomMemory.hostName}
                </h3>
                <span className="text-xs text-[#8F7245] font-mono block mb-4">
                  Celebrated: {zoomMemory.date}
                </span>

                <p className="text-xs sm:text-sm text-[#554C41] font-light leading-relaxed italic mb-6">
                  &ldquo;{zoomMemory.story}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-[#D4CBBB]/60 flex items-center justify-between">
                <span className="text-xs text-[#6E6356] font-medium">Rajmahal Archives</span>
                <button
                  onClick={(e) => handleLike(zoomMemory.id, e)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#FAF8F3] border border-[#B08D57]/40 hover:bg-[#670E10]/10 text-xs font-semibold"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      zoomMemory.userLiked ? 'text-rose-500 fill-rose-500' : 'text-[#8F7245]'
                    }`}
                  />
                  <span>{zoomMemory.likes} Likes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: ADD YOUR MEMORY ── */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Share Your Royal Memory & Event"
      >
        <form onSubmit={handleAddMemory} className="space-y-4 text-left">
          <p className="text-xs text-[#9A8E7F]">
            Submit a photograph and brief story from your wedding, anniversary, or stay at Rajmahal.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#D4CBBB]">Your / Host Name *</label>
              <Input
                required
                placeholder="e.g. Vikram & Radhika Rathore"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="bg-[#1C1814] border-[#3D352C] text-[#FAF8F3]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#D4CBBB]">Event Name *</label>
              <Input
                required
                placeholder="e.g. Royal Wedding Sangeet Night"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="bg-[#1C1814] border-[#3D352C] text-[#FAF8F3]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#D4CBBB]">Event Category *</label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value as RoyalMemory['eventType'])}
                className="w-full px-3 py-2 text-xs bg-[#1C1814] text-[#FAF8F3] rounded-lg border border-[#3D352C] focus:outline-none focus:border-[#B08D57]"
              >
                <option value="wedding">Royal Wedding</option>
                <option value="sufi">Sufi &amp; Folk Night</option>
                <option value="banquet">Courtyard Banquet</option>
                <option value="festival">Heritage Festival</option>
                <option value="anniversary">Anniversary Celebration</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#D4CBBB]">Date / Year of Celebration</label>
              <Input
                placeholder="e.g. February 2025"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="bg-[#1C1814] border-[#3D352C] text-[#FAF8F3]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#D4CBBB]">Select Memory Photo Scene</label>
            <select
              value={selectedPhoto}
              onChange={(e) => setSelectedPhoto(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#1C1814] text-[#FAF8F3] rounded-lg border border-[#3D352C] focus:outline-none focus:border-[#B08D57]"
            >
              <option value="/images/hall/crystal-ballroom.jpg">Crystal Ballroom Gala</option>
              <option value="/images/rooms/royal-courtyard.jpg">Royal Courtyard by Evening</option>
              <option value="/images/rooms/sheesh-mahal.jpg">Sheesh Mahal Chamber</option>
              <option value="/images/hero_haveli.jpg">Grand Haveli Pol Entrance</option>
              <option value="/images/food/dal-baati.jpg">Traditional Royal Feast</option>
              <option value="/images/rooms/jharokha-room.jpg">Jharokha Balcony View</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#D4CBBB]">Your Royal Story &amp; Experience *</label>
            <textarea
              required
              rows={3}
              placeholder="Tell us what made this event so unforgettable at Rajmahal..."
              value={story}
              onChange={(e) => setStory(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#1C1814] text-[#FAF8F3] rounded-lg border border-[#3D352C] focus:outline-none focus:border-[#B08D57]"
            />
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
              Add to Royal Memories
            </Button>
          </div>
        </form>
      </Modal>
    </section>
  );
}
