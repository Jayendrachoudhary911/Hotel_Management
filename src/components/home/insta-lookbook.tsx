'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Play,
  Heart,
  MessageCircle,
  Share2,
  Volume2,
  VolumeX,
  Upload,
  Sparkles,
  CheckCircle2,
  X,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';

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
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

interface Reel {
  id: string;
  creator: string;
  handle: string;
  avatar: string;
  title: string;
  likes: number;
  comments: number;
  views: string;
  thumbnail: string;
  duration: string;
  spot: string;
  userLiked?: boolean;
}

const INITIAL_REELS: Reel[] = [
  {
    id: 'reel-1',
    creator: 'Priya & Kabir',
    handle: '@priya_wanderlust',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    title: 'Sunset High Tea at the Jharokha Balcony ☕✨ Pure royal magic!',
    likes: 14200,
    comments: 342,
    views: '124K',
    thumbnail: '/images/rooms/jharokha-room.jpg',
    duration: '0:28',
    spot: 'Jharokha Balcony',
  },
  {
    id: 'reel-2',
    creator: 'Chef Ranveer Fan',
    handle: '@the_royal_gourmet',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    title: 'The Royal 56 Bhog Thali at Rajmahal Courtyard 🍛 Pure desi ghee aroma!',
    likes: 28900,
    comments: 890,
    views: '340K',
    thumbnail: '/images/food/dal-baati.jpg',
    duration: '0:42',
    spot: 'Rajputana Khansama Courtyard',
  },
  {
    id: 'reel-3',
    creator: 'Ananya Sharma',
    handle: '@ananya_vibes',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    title: 'Waking up to this Lake Pichola view in the Sheesh Mahal Suite 🪞🏰',
    likes: 42100,
    comments: 1120,
    views: '512K',
    thumbnail: '/images/rooms/sheesh-mahal.jpg',
    duration: '0:35',
    spot: 'Sheesh Mahal Suite',
  },
  {
    id: 'reel-4',
    creator: 'Rohan & Simran',
    handle: '@royal_weddings_india',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    title: 'Grand Baraat Entry at Crystal Ballroom 🎺🥁 Truly straight out of a fairy tale!',
    likes: 31500,
    comments: 674,
    views: '280K',
    thumbnail: '/images/hall/crystal-ballroom.jpg',
    duration: '0:45',
    spot: 'Crystal Ballroom',
  },
];

export function InstaLookbook() {
  const [reels, setReels] = useState<Reel[]>(INITIAL_REELS);
  const [activeReel, setActiveReel] = useState<Reel | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);
  const [isSubmittingReel, setIsSubmittingReel] = useState(false);

  // Fetch live reels from Supabase API
  React.useEffect(() => {
    async function loadLiveReels() {
      try {
        const res = await fetch('/api/reels');
        if (res.ok) {
          const data = await res.json();
          if (data.reels && data.reels.length > 0) {
            const mapped = data.reels.map((r: any) => ({
              id: r.id,
              creator: r.creator_name || 'Guest Creator',
              handle: r.handle || '@rajmahal_guest',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
              title: r.title,
              likes: r.likes_count ?? 1200,
              comments: r.comments_count ?? 45,
              views: r.views_count || '1.2K',
              thumbnail: r.thumbnail_url || '/images/hero_haveli.jpg',
              duration: r.duration || '0:30',
              spot: r.spot_tag || 'Royal Courtyard',
              userLiked: false,
            }));
            setReels(mapped);
          }
        }
      } catch (err) {
        console.error('Failed to fetch live reels:', err);
      }
    }
    loadLiveReels();
  }, []);

  // Upload modal state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [creatorName, setCreatorName] = useState('');
  const [handle, setHandle] = useState('');
  const [title, setTitle] = useState('');
  const [spot, setSpot] = useState('Courtyard & Garden');
  const [reelUrl, setReelUrl] = useState('');
  const [selectedThumb, setSelectedThumb] = useState('/images/hero_haveli.jpg');

  const handleLikeReel = async (reelId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    // Optimistic UI update
    setReels((prev) =>
      prev.map((r) => {
        if (r.id === reelId) {
          const wasLiked = r.userLiked;
          return {
            ...r,
            userLiked: !wasLiked,
            likes: wasLiked ? r.likes - 1 : r.likes + 1,
          };
        }
        return r;
      })
    );

    if (activeReel && activeReel.id === reelId) {
      setActiveReel((prev) =>
        prev
          ? {
              ...prev,
              userLiked: !prev.userLiked,
              likes: prev.userLiked ? prev.likes - 1 : prev.likes + 1,
            }
          : null
      );
    }

    // Call live Supabase like endpoint
    try {
      await fetch(`/api/reels/${reelId}/like`, { method: 'POST' });
    } catch (err) {
      console.error('Error syncing reel like to database:', err);
    }
  };

  const handleShare = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard?.writeText(window.location.href);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  const handleSubmitReel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle || !title) return;

    setIsSubmittingReel(true);
    const sanitizedHandle = handle.startsWith('@') ? handle : `@${handle}`;
    const creator = creatorName || sanitizedHandle.replace('@', '');

    try {
      const res = await fetch('/api/reels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creator_name: creator,
          handle: sanitizedHandle,
          title,
          spot_tag: spot,
          thumbnail_url: selectedThumb,
          video_url: reelUrl || null,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const created = data.reel;
        const newReel: Reel = {
          id: created.id,
          creator: created.creator_name,
          handle: created.handle,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          title: created.title,
          likes: created.likes_count || 1,
          comments: 0,
          views: created.views_count || '1.2K',
          thumbnail: created.thumbnail_url || selectedThumb,
          duration: created.duration || '0:30',
          spot: created.spot_tag || spot,
          userLiked: true,
        };
        setReels([newReel, ...reels]);
      } else {
        // Fallback optimistic insertion
        const newReel: Reel = {
          id: `reel-${Date.now()}`,
          creator,
          handle: sanitizedHandle,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          title,
          likes: 1,
          comments: 0,
          views: '1.2K',
          thumbnail: selectedThumb,
          duration: '0:30',
          spot,
          userLiked: true,
        };
        setReels([newReel, ...reels]);
      }

      setIsUploadOpen(false);
      setCreatorName('');
      setHandle('');
      setTitle('');
      setReelUrl('');
    } catch (err) {
      console.error('Failed to submit reel:', err);
    } finally {
      setIsSubmittingReel(false);
    }
  };

  return (
    <section className="py-20 bg-[#FAF8F3] relative overflow-hidden border-t border-[#D4CBBB]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="text-left max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#670E10]/10 border border-[#B08D57]/40 mb-3">
              <InstagramIcon className="w-3.5 h-3.5 text-[#670E10]" />
              <span className="text-xs font-bold text-[#670E10] tracking-wider uppercase">
                #RajmahalMoments
              </span>
            </div>
            <h2 className="font-heritage text-3xl sm:text-4xl lg:text-5xl font-bold text-[#670E10] leading-tight">
              Insta Lookbook &amp; Reels
            </h2>
            <p className="text-sm sm:text-base text-[#6E6356] font-light mt-2">
              Immerse yourself in authentic guest reels captured across our sunlit jharokhas, courtyards, and royal banquets.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              onClick={() => setIsUploadOpen(true)}
              className="bg-[#670E10] hover:bg-[#821215] text-[#FAF8F3] px-5 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 shadow-md hover:shadow-lg transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Your Reel</span>
            </Button>
          </div>
        </div>

        {/* 9:16 Vertical Reels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reels.map((reel) => (
            <div
              key={reel.id}
              onClick={() => {
                setActiveReel(reel);
                setIsPlaying(true);
              }}
              className="group relative aspect-[9/16] rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 border border-[#D4CBBB] hover:border-[#B08D57] bg-black"
            >
              {/* Thumbnail Image */}
              <Image
                src={reel.thumbnail}
                alt={reel.title}
                fill
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-90"
              />

              {/* Gradient Vignette for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 pointer-events-none" />

              {/* Top Bar: Spot & Views */}
              <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
                <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-semibold text-[#FAF8F3] border border-white/10">
                  {reel.spot}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-mono text-[#E5C388] font-bold">
                  {reel.views} views
                </span>
              </div>

              {/* Center Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <div className="w-14 h-14 rounded-full bg-white/25 backdrop-blur-md flex items-center justify-center border border-white/50 group-hover:scale-110 group-hover:bg-[#670E10]/90 transition-all shadow-lg">
                  <Play className="w-6 h-6 text-white fill-white ml-1" />
                </div>
              </div>

              {/* Bottom Meta & Creator Info */}
              <div className="absolute bottom-0 left-0 right-0 p-4 z-10 flex flex-col justify-end text-left">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#670E10] to-[#B08D57] flex items-center justify-center text-[10px] font-bold text-white border border-[#B08D57] shadow-sm shrink-0">
                    {reel.creator.charAt(0)}
                  </div>
                  <span className="text-xs font-bold text-[#FAF8F3] truncate drop-shadow">
                    {reel.handle}
                  </span>
                </div>

                <p className="text-xs text-white/95 line-clamp-2 font-light leading-snug mb-3 drop-shadow">
                  {reel.title}
                </p>

                {/* Interactive Action Bar */}
                <div className="flex items-center justify-between pt-2 border-t border-white/20 text-white/90 text-xs">
                  <button
                    onClick={(e) => handleLikeReel(reel.id, e)}
                    className="flex items-center space-x-1 hover:text-rose-400 transition-colors"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        reel.userLiked ? 'text-rose-500 fill-rose-500' : 'text-white'
                      }`}
                    />
                    <span className="font-mono text-[11px] font-medium">
                      {(reel.likes / 1000).toFixed(1)}k
                    </span>
                  </button>

                  <div className="flex items-center space-x-1">
                    <MessageCircle className="w-4 h-4 text-white" />
                    <span className="font-mono text-[11px] font-medium">{reel.comments}</span>
                  </div>

                  <button
                    onClick={handleShare}
                    className="hover:text-[#B08D57] transition-colors"
                  >
                    <Share2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MODAL: INTERACTIVE REEL VIEWER ── */}
      {activeReel && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setActiveReel(null)}
        >
          <div
            className="relative w-full max-w-sm sm:max-w-md aspect-[9/16] max-h-[85vh] rounded-3xl overflow-hidden bg-black shadow-2xl border border-white/10 flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background Simulated Video */}
            <div className="absolute inset-0 z-0">
              <Image
                src={activeReel.thumbnail}
                alt={activeReel.title}
                fill
                className="object-cover scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/60" />
            </div>

            {/* Top Navigation & Controls */}
            <div className="relative z-20 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-white">
                  {activeReel.spot}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setActiveReel(null)}
                  className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Simulated Animated Progress Bar */}
            <div className="relative z-20 px-4 -mt-3">
              <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
                <div className="h-full bg-[#B08D57] rounded-full animate-[pulse_2s_ease-in-out_infinite] w-3/4" />
              </div>
            </div>

            {/* Center Pause/Play Indicator */}
            <div
              className="relative z-10 flex-1 flex items-center justify-center cursor-pointer"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {!isPlaying && (
                <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                  <Play className="w-8 h-8 fill-white ml-1" />
                </div>
              )}
            </div>

            {/* Right Action Rail (Instagram Style) */}
            <div className="absolute right-3 bottom-24 z-20 flex flex-col items-center space-y-4">
              <button
                onClick={() => handleLikeReel(activeReel.id)}
                className="flex flex-col items-center group cursor-pointer"
              >
                <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
                  <Heart
                    className={`w-6 h-6 ${
                      activeReel.userLiked ? 'text-rose-500 fill-rose-500' : 'text-white'
                    }`}
                  />
                </div>
                <span className="text-[11px] font-bold text-white mt-1 drop-shadow font-mono">
                  {activeReel.likes}
                </span>
              </button>

              <div className="flex flex-col items-center">
                <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/20">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <span className="text-[11px] font-bold text-white mt-1 drop-shadow font-mono">
                  {activeReel.comments}
                </span>
              </div>

              <button
                onClick={handleShare}
                className="flex flex-col items-center group cursor-pointer"
              >
                <div className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
                  <Share2 className="w-6 h-6 text-white" />
                </div>
                <span className="text-[11px] font-bold text-white mt-1 drop-shadow">Share</span>
              </button>
            </div>

            {/* Bottom Content & Meta */}
            <div className="relative z-20 p-5 pr-16 text-left">
              <div className="flex items-center space-x-2.5 mb-2.5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#670E10] to-[#B08D57] flex items-center justify-center text-xs font-bold text-white border-2 border-[#B08D57] shadow-md shrink-0">
                  {activeReel.creator.charAt(0)}
                </div>
                <div>
                  <span className="text-sm font-bold text-white block drop-shadow">
                    {activeReel.creator}
                  </span>
                  <span className="text-xs text-[#E5C388] font-mono block">
                    {activeReel.handle}
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-white/95 font-light leading-relaxed drop-shadow mb-3">
                {activeReel.title}
              </p>

              <div className="flex items-center space-x-2 text-[11px] text-white/70">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Original audio • Rajmahal Sufi Strings</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: UPLOAD YOUR REEL ── */}
      <Modal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        title="Upload & Feature Your Reel"
      >
        <form onSubmit={handleSubmitReel} className="space-y-4 text-left">
          <p className="text-xs text-[#9A8E7F]">
            Share your favorite royal moments filmed during your stay at Rajmahal Heritage Hotel.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#D4CBBB]">Your Name</label>
              <Input
                placeholder="e.g. Priya Sharma"
                value={creatorName}
                onChange={(e) => setCreatorName(e.target.value)}
                className="bg-[#1C1814] border-[#3D352C] text-[#FAF8F3]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#D4CBBB]">Instagram Handle *</label>
              <Input
                required
                placeholder="@your_instagram"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="bg-[#1C1814] border-[#3D352C] text-[#FAF8F3]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#D4CBBB]">Reel Caption / Title *</label>
            <Input
              required
              placeholder="e.g. Sunset High Tea at the Jharokha Balcony ☕✨"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-[#1C1814] border-[#3D352C] text-[#FAF8F3]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#D4CBBB]">Palace Spot Tag</label>
              <select
                value={spot}
                onChange={(e) => setSpot(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#1C1814] text-[#FAF8F3] rounded-lg border border-[#3D352C] focus:outline-none focus:border-[#B08D57]"
              >
                <option value="Jharokha Balcony">Jharokha Balcony</option>
                <option value="Sheesh Mahal Suite">Sheesh Mahal Suite</option>
                <option value="Royal Courtyard">Royal Courtyard</option>
                <option value="Crystal Ballroom">Crystal Ballroom</option>
                <option value="Haveli Poolside">Haveli Poolside</option>
                <option value="Pichola Terrace Lounge">Pichola Terrace Lounge</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#D4CBBB]">Cover Photo / Scene</label>
              <select
                value={selectedThumb}
                onChange={(e) => setSelectedThumb(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#1C1814] text-[#FAF8F3] rounded-lg border border-[#3D352C] focus:outline-none focus:border-[#B08D57]"
              >
                <option value="/images/rooms/jharokha-room.jpg">Jharokha Suite</option>
                <option value="/images/rooms/sheesh-mahal.jpg">Sheesh Mahal</option>
                <option value="/images/rooms/lakeview-suite.jpg">Lakeview Courtyard</option>
                <option value="/images/food/dal-baati.jpg">Traditional Dining</option>
                <option value="/images/hall/crystal-ballroom.jpg">Crystal Ballroom</option>
                <option value="/images/hero_haveli.jpg">Grand Haveli Entrance</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#D4CBBB]">Reel Video Link or File</label>
            <Input
              placeholder="Paste Instagram Reel URL (e.g. https://www.instagram.com/reel/...)"
              value={reelUrl}
              onChange={(e) => setReelUrl(e.target.value)}
              className="bg-[#1C1814] border-[#3D352C] text-[#FAF8F3]"
            />
          </div>

          <div className="pt-4 border-t border-[#3D352C] flex items-center justify-end space-x-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsUploadOpen(false)}
              className="text-xs text-[#9A8E7F]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#670E10] hover:bg-[#821215] text-white text-xs font-bold px-4 py-2"
            >
              Publish to Lookbook
            </Button>
          </div>
        </form>
      </Modal>

      {/* Share Toast */}
      {copiedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#241F1A] text-[#FAF8F3] px-4 py-3 rounded-xl border border-[#B08D57] shadow-2xl flex items-center space-x-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold">Reel link copied to clipboard!</span>
        </div>
      )}
    </section>
  );
}
