-- Migration 011: Insta Lookbook Reels and Royal Memories Gallery

-- 1. Reels Table (Vertical 9:16 Guest & Hotel Reels)
CREATE TABLE IF NOT EXISTS reels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    creator_name TEXT NOT NULL,
    handle TEXT NOT NULL,
    title TEXT NOT NULL,
    likes_count INT NOT NULL DEFAULT 0,
    comments_count INT NOT NULL DEFAULT 0,
    views_count TEXT NOT NULL DEFAULT '1.2K',
    thumbnail_url TEXT NOT NULL,
    video_url TEXT,
    duration TEXT NOT NULL DEFAULT '0:30',
    spot_tag TEXT NOT NULL DEFAULT 'Royal Courtyard',
    is_approved BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Royal Memories Table (Guest Event Chronicles)
CREATE TABLE IF NOT EXISTS royal_memories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    event_name TEXT NOT NULL,
    event_type TEXT NOT NULL CHECK (event_type IN ('wedding', 'sufi', 'banquet', 'festival', 'anniversary')),
    host_name TEXT NOT NULL,
    celebration_date TEXT NOT NULL,
    story TEXT NOT NULL,
    photo_url TEXT NOT NULL,
    likes_count INT NOT NULL DEFAULT 0,
    is_featured BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_reels_is_approved ON reels(is_approved, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_memories_event_type ON royal_memories(event_type, created_at DESC);

-- Enable RLS
ALTER TABLE reels ENABLE ROW LEVEL SECURITY;
ALTER TABLE royal_memories ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Public read of approved reels
CREATE POLICY "Public can view approved reels" ON reels
    FOR SELECT USING (is_approved = true);

-- Public can submit new reels
CREATE POLICY "Public can submit reels" ON reels
    FOR INSERT WITH CHECK (true);

-- Public can like reels
CREATE POLICY "Public can update reel likes" ON reels
    FOR UPDATE USING (is_approved = true);

-- Public read of featured memories
CREATE POLICY "Public can view memories" ON royal_memories
    FOR SELECT USING (is_featured = true);

-- Public can submit new memories
CREATE POLICY "Public can submit memories" ON royal_memories
    FOR INSERT WITH CHECK (true);

-- Public can like memories
CREATE POLICY "Public can update memory likes" ON royal_memories
    FOR UPDATE USING (is_featured = true);
