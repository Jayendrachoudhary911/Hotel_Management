import { getSupabaseClient } from './supabase-helper';

export interface ReelRecord {
  id: string;
  creator_name: string;
  handle: string;
  title: string;
  likes_count: number;
  comments_count: number;
  views_count: string;
  thumbnail_url: string;
  video_url: string | null;
  duration: string;
  spot_tag: string;
  is_approved: boolean;
  created_at: string;
}

const LOCAL_FALLBACK_REELS: ReelRecord[] = [
  {
    id: 'reel-1',
    creator_name: 'Priya & Kabir',
    handle: '@priya_wanderlust',
    title: 'Sunset High Tea at the Jharokha Balcony ☕✨ Pure royal magic!',
    likes_count: 14200,
    comments_count: 342,
    views_count: '124K',
    thumbnail_url: '/images/rooms/jharokha-room.jpg',
    video_url: null,
    duration: '0:28',
    spot_tag: 'Jharokha Balcony',
    is_approved: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'reel-2',
    creator_name: 'Chef Ranveer Fan',
    handle: '@the_royal_gourmet',
    title: 'The Royal 56 Bhog Thali at Rajmahal Courtyard 🍛 Pure desi ghee aroma!',
    likes_count: 28900,
    comments_count: 890,
    views_count: '340K',
    thumbnail_url: '/images/food/dal-baati.jpg',
    video_url: null,
    duration: '0:42',
    spot_tag: 'Rajputana Khansama Courtyard',
    is_approved: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'reel-3',
    creator_name: 'Ananya Sharma',
    handle: '@ananya_vibes',
    title: 'Waking up to this Lake Pichola view in the Sheesh Mahal Suite 🪞🏰',
    likes_count: 42100,
    comments_count: 1120,
    views_count: '512K',
    thumbnail_url: '/images/rooms/sheesh-mahal.jpg',
    video_url: null,
    duration: '0:35',
    spot_tag: 'Sheesh Mahal Suite',
    is_approved: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'reel-4',
    creator_name: 'Rohan & Simran',
    handle: '@royal_weddings_india',
    title: 'Grand Baraat Entry at Crystal Ballroom 🎺🥁 Truly straight out of a fairy tale!',
    likes_count: 31500,
    comments_count: 674,
    views_count: '280K',
    thumbnail_url: '/images/hall/crystal-ballroom.jpg',
    video_url: null,
    duration: '0:45',
    spot_tag: 'Crystal Ballroom',
    is_approved: true,
    created_at: new Date().toISOString(),
  },
];

let localReels = [...LOCAL_FALLBACK_REELS];

export const reelsService = {
  async getReels(): Promise<ReelRecord[]> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('reels')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });
      if (!error && data) return data as ReelRecord[];
    }
    return localReels;
  },

  async createReel(data: {
    creator_name: string;
    handle: string;
    title: string;
    thumbnail_url?: string;
    video_url?: string;
    spot_tag?: string;
  }): Promise<ReelRecord> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data: newReel, error } = await supabase
        .from('reels')
        .insert({
          creator_name: data.creator_name,
          handle: data.handle.startsWith('@') ? data.handle : `@${data.handle}`,
          title: data.title,
          thumbnail_url: data.thumbnail_url || '/images/hero_haveli.jpg',
          video_url: data.video_url || null,
          spot_tag: data.spot_tag || 'Royal Courtyard',
          is_approved: true,
        })
        .select('*')
        .single();
      if (!error && newReel) return newReel as ReelRecord;
    }

    const created: ReelRecord = {
      id: `reel-${Date.now()}`,
      creator_name: data.creator_name,
      handle: data.handle.startsWith('@') ? data.handle : `@${data.handle}`,
      title: data.title,
      likes_count: 1,
      comments_count: 0,
      views_count: '1.2K',
      thumbnail_url: data.thumbnail_url || '/images/hero_haveli.jpg',
      video_url: data.video_url || null,
      duration: '0:30',
      spot_tag: data.spot_tag || 'Royal Courtyard',
      is_approved: true,
      created_at: new Date().toISOString(),
    };
    localReels = [created, ...localReels];
    return created;
  },

  async likeReel(id: string): Promise<number | null> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data: reel } = await supabase
        .from('reels')
        .select('likes_count')
        .eq('id', id)
        .single();
      if (reel) {
        const nextLikes = reel.likes_count + 1;
        await supabase
          .from('reels')
          .update({ likes_count: nextLikes })
          .eq('id', id);
        return nextLikes;
      }
    }

    const found = localReels.find((r) => r.id === id);
    if (found) {
      found.likes_count += 1;
      return found.likes_count;
    }
    return null;
  },
};
