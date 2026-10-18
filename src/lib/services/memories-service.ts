import { getSupabaseClient } from './supabase-helper';

export interface MemoryRecord {
  id: string;
  event_name: string;
  event_type: 'wedding' | 'sufi' | 'banquet' | 'festival' | 'anniversary';
  host_name: string;
  celebration_date: string;
  story: string;
  photo_url: string;
  likes_count: number;
  is_featured: boolean;
  created_at: string;
}

const LOCAL_FALLBACK_MEMORIES: MemoryRecord[] = [
  {
    id: 'mem-1',
    event_name: 'The Royal Rajputana Wedding',
    event_type: 'wedding',
    host_name: 'Devendra & Radhika Rathore',
    celebration_date: 'February 2025',
    story:
      'From the royal Shehnai welcome at the Pol gate to the candle-lit pheras by the courtyard fountain, Rajmahal gave us memories that our families will cherish for generations.',
    photo_url: '/images/hall/crystal-ballroom.jpg',
    likes_count: 342,
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'mem-2',
    event_name: 'Sufi & Folk Night Under The Stars',
    event_type: 'sufi',
    host_name: 'Guest: Vikram & Friends',
    celebration_date: 'January 2025',
    story:
      'Mesmerizing Manganiyar musicians, fragrant burning loban, and authentic Ker Sangri served under the star-lit Udaipur sky. Pure heaven on earth.',
    photo_url: '/images/rooms/royal-courtyard.jpg',
    likes_count: 219,
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'mem-3',
    event_name: 'Golden 50th Wedding Anniversary',
    event_type: 'anniversary',
    host_name: 'Col. Jaswant & Savitri Singh',
    celebration_date: 'December 2024',
    story:
      'We celebrated our 50th anniversary in the Sheesh Mahal Suite. The personalized silver thali dinner and warm hospitality made us feel like true maharaja and maharani.',
    photo_url: '/images/rooms/sheesh-mahal.jpg',
    likes_count: 512,
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'mem-4',
    event_name: 'Courtyard Khansama Banquet',
    event_type: 'banquet',
    host_name: 'Singhania Family Reunion',
    celebration_date: 'November 2024',
    story:
      '40 of our relatives gathered from across the world. The slow-cooked Laal Maas and melt-in-mouth churma prepared by master khansamas was the highlight of our entire trip.',
    photo_url: '/images/food/dal-baati.jpg',
    likes_count: 188,
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'mem-5',
    event_name: 'Royal Heritage Diwali Gala',
    event_type: 'festival',
    host_name: 'Rajmahal Annual Celebration',
    celebration_date: 'November 2024',
    story:
      'Over 2,000 earthen diyas lighting up every arch and carved jharokha of the palace. An unforgettable celebration of light, classical sitar, and royal sweets.',
    photo_url: '/images/hero_haveli.jpg',
    likes_count: 420,
    is_featured: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'mem-6',
    event_name: 'Lakeview Jharokha Sunrise Breakfast',
    event_type: 'anniversary',
    host_name: 'Aarav & Meera',
    celebration_date: 'October 2024',
    story:
      'Steaming kulhad chai and piping hot pyaaz kachoris while watching the morning mist rise over Lake Pichola from our private jharokha.',
    photo_url: '/images/rooms/jharokha-room.jpg',
    likes_count: 295,
    is_featured: true,
    created_at: new Date().toISOString(),
  },
];

let localMemories = [...LOCAL_FALLBACK_MEMORIES];

export const memoriesService = {
  async getMemories(eventType?: string): Promise<MemoryRecord[]> {
    const supabase = getSupabaseClient();
    if (supabase) {
      let query = supabase
        .from('royal_memories')
        .select('*')
        .eq('is_featured', true)
        .order('created_at', { ascending: false });

      if (eventType && eventType !== 'all') {
        query = query.eq('event_type', eventType);
      }

      const { data, error } = await query;
      if (!error && data) return data as MemoryRecord[];
    }

    if (eventType && eventType !== 'all') {
      return localMemories.filter((m) => m.event_type === eventType);
    }
    return localMemories;
  },

  async createMemory(data: {
    event_name: string;
    event_type: MemoryRecord['event_type'];
    host_name: string;
    celebration_date: string;
    story: string;
    photo_url?: string;
  }): Promise<MemoryRecord> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data: newMem, error } = await supabase
        .from('royal_memories')
        .insert({
          event_name: data.event_name,
          event_type: data.event_type,
          host_name: data.host_name,
          celebration_date: data.celebration_date || 'Recent Celebration',
          story: data.story,
          photo_url: data.photo_url || '/images/hall/crystal-ballroom.jpg',
          is_featured: true,
        })
        .select('*')
        .single();
      if (!error && newMem) return newMem as MemoryRecord;
    }

    const created: MemoryRecord = {
      id: `mem-${Date.now()}`,
      event_name: data.event_name,
      event_type: data.event_type,
      host_name: data.host_name,
      celebration_date: data.celebration_date || 'Recent Celebration',
      story: data.story,
      photo_url: data.photo_url || '/images/hall/crystal-ballroom.jpg',
      likes_count: 1,
      is_featured: true,
      created_at: new Date().toISOString(),
    };
    localMemories = [created, ...localMemories];
    return created;
  },

  async likeMemory(id: string): Promise<number | null> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data: mem } = await supabase
        .from('royal_memories')
        .select('likes_count')
        .eq('id', id)
        .single();
      if (mem) {
        const nextLikes = mem.likes_count + 1;
        await supabase
          .from('royal_memories')
          .update({ likes_count: nextLikes })
          .eq('id', id);
        return nextLikes;
      }
    }

    const found = localMemories.find((m) => m.id === id);
    if (found) {
      found.likes_count += 1;
      return found.likes_count;
    }
    return null;
  },
};
