-- ====================================================================
-- RAJMAHAL HERITAGE HOTEL & RESORTS - FULL DATABASE SCHEMA & SEED DATA
-- Version: 1.0.0
-- Compatible with: Supabase / PostgreSQL 15+
-- ====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── 1. PROPERTIES ──
CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    currency_code TEXT NOT NULL DEFAULT 'INR',
    timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    operating_hours JSONB NOT NULL DEFAULT '{"mon": {"open": "00:00", "close": "23:59"}}'::jsonb,
    booking_policy TEXT NOT NULL DEFAULT 'Standard check-in 2:00 PM, check-out 11:00 AM.',
    cancellation_terms TEXT NOT NULL DEFAULT 'Free cancellation up to 48 hours prior to check-in.',
    deposit_percent INT NOT NULL DEFAULT 20,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 2. OUTLETS ──
CREATE TABLE IF NOT EXISTS outlets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('restaurant', 'cafe')),
    operating_hours JSONB NOT NULL DEFAULT '{"mon": {"open": "08:00", "close": "23:00"}}'::jsonb,
    dine_in_enabled BOOLEAN NOT NULL DEFAULT true,
    pickup_enabled BOOLEAN NOT NULL DEFAULT true,
    delivery_enabled BOOLEAN NOT NULL DEFAULT true,
    pickup_lead_minutes INT NOT NULL DEFAULT 20,
    delivery_lead_minutes INT NOT NULL DEFAULT 40,
    delivery_fee_minor INT NOT NULL DEFAULT 4000, -- 40.00 in paise
    min_delivery_order_minor INT NOT NULL DEFAULT 20000, -- 200.00
    delivery_estimate TEXT NOT NULL DEFAULT '30-45 mins',
    is_paused BOOLEAN NOT NULL DEFAULT false,
    tax_rate_bps INT NOT NULL DEFAULT 500, -- 5% GST
    service_charge_bps INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 3. DELIVERY AREAS ──
CREATE TABLE IF NOT EXISTS delivery_areas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    outlet_id UUID NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
    area_name TEXT NOT NULL,
    area_polygon TEXT NOT NULL DEFAULT '',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 4. ROOM TYPES ──
CREATE TABLE IF NOT EXISTS room_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    capacity INT NOT NULL DEFAULT 2,
    total_rooms INT NOT NULL DEFAULT 2,
    base_rate_minor INT NOT NULL DEFAULT 450000, -- 4500.00
    amenities TEXT[] NOT NULL DEFAULT '{}',
    photos TEXT[] NOT NULL DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 5. PHYSICAL ROOMS ──
CREATE TABLE IF NOT EXISTS rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_type_id UUID NOT NULL REFERENCES room_types(id) ON DELETE CASCADE,
    room_number TEXT NOT NULL UNIQUE,
    housekeeping_state TEXT NOT NULL DEFAULT 'available' CHECK (
        housekeeping_state IN ('available', 'occupied', 'dirty', 'cleaning', 'maintenance')
    ),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 6. GUESTS ──
CREATE TABLE IF NOT EXISTS guests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 7. RESERVATIONS ──
CREATE TABLE IF NOT EXISTS reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE RESTRICT,
    room_type_id UUID NOT NULL REFERENCES room_types(id) ON DELETE RESTRICT,
    room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    party_size INT NOT NULL DEFAULT 1,
    rate_snapshot_minor INT NOT NULL DEFAULT 450000,
    terms_snapshot TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'requested' CHECK (
        status IN ('requested', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'no_show')
    ),
    total_amount_minor INT NOT NULL DEFAULT 450000,
    deposit_amount_minor INT NOT NULL DEFAULT 90000,
    balance_due_minor INT NOT NULL DEFAULT 360000,
    reference_code TEXT NOT NULL UNIQUE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT check_reservation_dates CHECK (check_out > check_in)
);

-- ── 8. HALLS & BANQUETS ──
CREATE TABLE IF NOT EXISTS halls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    capacity INT NOT NULL DEFAULT 250,
    description TEXT NOT NULL DEFAULT '',
    photos TEXT[] NOT NULL DEFAULT '{}',
    packages JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS hall_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hall_id UUID NOT NULL REFERENCES halls(id) ON DELETE CASCADE,
    slot_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status TEXT NOT NULL DEFAULT 'available' CHECK (
        status IN ('available', 'blocked', 'enquired', 'confirmed')
    ),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS event_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hall_id UUID NOT NULL REFERENCES halls(id) ON DELETE CASCADE,
    hall_slot_id UUID REFERENCES hall_slots(id) ON DELETE SET NULL,
    contact_name TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    contact_email TEXT,
    event_type TEXT NOT NULL DEFAULT 'General Event',
    expected_guests INT NOT NULL DEFAULT 50,
    seating_layout TEXT,
    setup_needs TEXT,
    notes TEXT,
    quote_amount_minor INT,
    quote_validity TIMESTAMPTZ,
    deposit_amount_minor INT,
    status TEXT NOT NULL DEFAULT 'new' CHECK (
        status IN ('new', 'contacted', 'quoted', 'accepted', 'declined', 'cancelled')
    ),
    reference_code TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 9. MENUS & DISHES ──
CREATE TABLE IF NOT EXISTS menu_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    outlet_id UUID NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    is_available BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES menu_categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price_minor INT NOT NULL DEFAULT 0,
    image_url TEXT,
    is_available BOOLEAN NOT NULL DEFAULT true,
    dietary_labels TEXT[] NOT NULL DEFAULT '{}',
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS modifiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price_minor INT NOT NULL DEFAULT 0,
    is_available BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 10. TABLES & QR TOKENS ──
CREATE TABLE IF NOT EXISTS tables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    outlet_id UUID NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
    table_number TEXT NOT NULL,
    capacity INT NOT NULL DEFAULT 4,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(outlet_id, table_number)
);

CREATE TABLE IF NOT EXISTS qr_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_id UUID NOT NULL REFERENCES tables(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 11. ORDERS & PAYMENTS ──
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    outlet_id UUID NOT NULL REFERENCES outlets(id) ON DELETE RESTRICT,
    table_id UUID REFERENCES tables(id) ON DELETE SET NULL,
    order_number TEXT NOT NULL UNIQUE,
    channel TEXT NOT NULL CHECK (channel IN ('qr', 'pos', 'web')),
    fulfilment_mode TEXT NOT NULL CHECK (fulfilment_mode IN ('dine_in', 'pickup', 'delivery')),
    pickup_name TEXT,
    pickup_phone TEXT,
    delivery_name TEXT,
    delivery_phone TEXT,
    delivery_address TEXT,
    delivery_notes TEXT,
    delivery_fee_minor INT NOT NULL DEFAULT 0,
    subtotal_minor INT NOT NULL DEFAULT 0,
    tax_minor INT NOT NULL DEFAULT 0,
    service_charge_minor INT NOT NULL DEFAULT 0,
    discount_minor INT NOT NULL DEFAULT 0,
    total_minor INT NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'new' CHECK (
        status IN ('new', 'accepted', 'preparing', 'ready', 'served', 'out_for_delivery', 'delivered', 'collected', 'cancelled')
    ),
    cancel_reason TEXT,
    created_by UUID,
    assigned_delivery_staff UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE RESTRICT,
    item_name_snapshot TEXT NOT NULL,
    unit_price_snapshot_minor INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    notes TEXT,
    modifiers_snapshot JSONB,
    line_total_minor INT NOT NULL,
    CONSTRAINT check_quantity_positive CHECK (quantity > 0)
);

CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
    tender_type TEXT NOT NULL CHECK (tender_type IN ('cash', 'upi', 'card', 'gateway')),
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (
        payment_status IN ('pending', 'completed', 'failed', 'refunded')
    ),
    amount_minor INT NOT NULL,
    gateway_reference TEXT,
    recorded_by UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 12. BILLS & AUDIT TRAIL ──
CREATE TABLE IF NOT EXISTS bills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
    bill_number TEXT NOT NULL UNIQUE,
    outlet_id UUID NOT NULL REFERENCES outlets(id) ON DELETE RESTRICT,
    business_name TEXT NOT NULL,
    subtotal_minor INT NOT NULL,
    tax_minor INT NOT NULL DEFAULT 0,
    service_charge_minor INT NOT NULL DEFAULT 0,
    discount_minor INT NOT NULL DEFAULT 0,
    total_minor INT NOT NULL,
    payment_method TEXT NOT NULL,
    is_void BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_name TEXT NOT NULL DEFAULT 'Staff',
    actor_role TEXT NOT NULL DEFAULT 'Staff',
    action_type TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    details TEXT,
    ip_address TEXT DEFAULT '127.0.0.1',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 13. INSTA REELS & ROYAL MEMORIES ──
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

-- ── 14. USERS & ROLES ──
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id UUID UNIQUE,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (
        role IN ('admin', 'manager', 'front_desk', 'cashier', 'kitchen', 'housekeeping', 'delivery')
    ),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 15. ENABLE RLS ──
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE outlets ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE halls ENABLE ROW LEVEL SECURITY;
ALTER TABLE hall_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE reels ENABLE ROW LEVEL SECURITY;
ALTER TABLE royal_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- ── 16. PUBLIC POLICIES ──
DROP POLICY IF EXISTS "Public read properties" ON properties;
CREATE POLICY "Public read properties" ON properties FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read outlets" ON outlets;
CREATE POLICY "Public read outlets" ON outlets FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read room_types" ON room_types;
CREATE POLICY "Public read room_types" ON room_types FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read rooms" ON rooms;
CREATE POLICY "Public read rooms" ON rooms FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read menu_categories" ON menu_categories;
CREATE POLICY "Public read menu_categories" ON menu_categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read menu_items" ON menu_items;
CREATE POLICY "Public read menu_items" ON menu_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read halls" ON halls;
CREATE POLICY "Public read halls" ON halls FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read tables" ON tables;
CREATE POLICY "Public read tables" ON tables FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read qr_tokens" ON qr_tokens;
CREATE POLICY "Public read qr_tokens" ON qr_tokens FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read approved reels" ON reels;
CREATE POLICY "Public read approved reels" ON reels FOR SELECT USING (is_approved = true);

DROP POLICY IF EXISTS "Public insert reels" ON reels;
CREATE POLICY "Public insert reels" ON reels FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public update reel likes" ON reels;
CREATE POLICY "Public update reel likes" ON reels FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public read featured memories" ON royal_memories;
CREATE POLICY "Public read featured memories" ON royal_memories FOR SELECT USING (is_featured = true);

DROP POLICY IF EXISTS "Public insert memories" ON royal_memories;
CREATE POLICY "Public insert memories" ON royal_memories FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public update memory likes" ON royal_memories;
CREATE POLICY "Public update memory likes" ON royal_memories FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public insert event leads" ON event_leads;
CREATE POLICY "Public insert event leads" ON event_leads FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public insert reservations" ON reservations;
CREATE POLICY "Public insert reservations" ON reservations FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public insert orders" ON orders;
CREATE POLICY "Public insert orders" ON orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public insert order_lines" ON order_lines;
CREATE POLICY "Public insert order_lines" ON order_lines FOR INSERT WITH CHECK (true);

-- Allow full access for backend service role
DROP POLICY IF EXISTS "Service role full properties" ON properties;
CREATE POLICY "Service role full properties" ON properties USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full outlets" ON outlets;
CREATE POLICY "Service role full outlets" ON outlets USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full room_types" ON room_types;
CREATE POLICY "Service role full room_types" ON room_types USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full rooms" ON rooms;
CREATE POLICY "Service role full rooms" ON rooms USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full reservations" ON reservations;
CREATE POLICY "Service role full reservations" ON reservations USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full orders" ON orders;
CREATE POLICY "Service role full orders" ON orders USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full order_lines" ON order_lines;
CREATE POLICY "Service role full order_lines" ON order_lines USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full menu_items" ON menu_items;
CREATE POLICY "Service role full menu_items" ON menu_items USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full event_leads" ON event_leads;
CREATE POLICY "Service role full event_leads" ON event_leads USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full audit_events" ON audit_events;
CREATE POLICY "Service role full audit_events" ON audit_events USING (true) WITH CHECK (true);
-- ====================================================================
-- RAJMAHAL HERITAGE HOTEL & RESORTS - PRODUCTION SEED DATA
-- Run this in Supabase SQL editor after running full_schema.sql
-- ====================================================================

DO $$
DECLARE
    prop_id UUID := 'd0000000-0000-0000-0000-000000000001';
    rest_id UUID := 'e0000000-0000-0000-0000-000000000001';
    cafe_id UUID := 'e0000000-0000-0000-0000-000000000002';
    hall_id UUID := 'f0000000-0000-0000-0000-000000000001';

    -- Room Types
    rt_lakeview UUID := 'c0000000-0000-0000-0000-000000000001';
    rt_haveli UUID := 'c0000000-0000-0000-0000-000000000002';
    rt_jharokha UUID := 'c0000000-0000-0000-0000-000000000003';
    rt_meenakari UUID := 'c0000000-0000-0000-0000-000000000004';
    rt_courtyard UUID := 'c0000000-0000-0000-0000-000000000005';
    rt_sheesh UUID := 'c0000000-0000-0000-0000-000000000006';

    -- Categories
    cat_starters UUID := gen_random_uuid();
    cat_thalis UUID := gen_random_uuid();
    cat_mains UUID := gen_random_uuid();
    cat_desserts UUID := gen_random_uuid();
    cat_beverages UUID := gen_random_uuid();
BEGIN
    -- 1. Property
    INSERT INTO properties (id, name, address, phone, email, currency_code, timezone, deposit_percent, is_active)
    VALUES (
        prop_id,
        'Rajmahal Heritage Hotel & Resorts',
        'Pichola Ring Road, Near City Palace, Udaipur, Rajasthan 313001',
        '+91 294 242 8890',
        'concierge@rajmahalheritage.com',
        'INR',
        'Asia/Kolkata',
        20,
        true
    ) ON CONFLICT (id) DO NOTHING;

    -- 2. Outlets
    INSERT INTO outlets (id, property_id, name, type, tax_rate_bps, delivery_fee_minor, min_delivery_order_minor)
    VALUES
    (rest_id, prop_id, 'Royal Khansama Restaurant', 'restaurant', 500, 4000, 20000),
    (cafe_id, prop_id, 'Jharokha Café & Lounge', 'cafe', 500, 3000, 15000)
    ON CONFLICT (id) DO NOTHING;

    -- 3. Room Types
    INSERT INTO room_types (id, property_id, name, description, capacity, total_rooms, base_rate_minor, photos, amenities)
    VALUES
    (rt_lakeview, prop_id, 'Lakeview Palace Suite', 'Panoramic views over Lake Pichola with carved jharokha balcony and marble bathtub.', 2, 2, 750000, ARRAY['/images/rooms/lakeview-suite.jpg'], ARRAY['Lake View', 'Private Jharokha', 'Butler Service', 'King Bed']),
    (rt_haveli, prop_id, 'Haveli Royal Suite', 'Authentic frescoed ceilings with antique four-poster teak bed and brass fittings.', 2, 2, 580000, ARRAY['/images/rooms/haveli-suite.jpg'], ARRAY['Palace Courtyard View', 'Four Poster Bed', 'Rain Shower', 'Complimentary High Tea']),
    (rt_jharokha, prop_id, 'Heritage Jharokha Room', 'Intricately stone-carved seating alcove overlooking sun-drenched gardens.', 2, 2, 420000, ARRAY['/images/rooms/jharokha-room.jpg'], ARRAY['Garden View', 'Carved Alcove', 'Teak Wardrobe', 'High Speed WiFi']),
    (rt_meenakari, prop_id, 'Meenakari Art Chamber', 'Hand-enameled meenakari artwork on walls with pure silk upholstery.', 2, 2, 480000, ARRAY['/images/rooms/meenakari-room.jpg'], ARRAY['Hand-painted Walls', 'Pillow Menu', 'Espresso Bar', 'Turndown Amenity']),
    (rt_courtyard, prop_id, 'Royal Courtyard Suite', 'Direct ground access to central fountain courtyard with fragrant jasmine arbor.', 4, 1, 650000, ARRAY['/images/rooms/royal-courtyard.jpg'], ARRAY['Courtyard Access', 'Private Verandah', 'Family Living Room', 'Plunge Pool Access']),
    (rt_sheesh, prop_id, 'Sheesh Mahal Luxury Suite', 'Reflective hand-cut Belgian convex mirror mosaics reminiscent of royal royal chambers.', 2, 1, 950000, ARRAY['/images/rooms/sheesh-mahal.jpg'], ARRAY['Mirror Mosaic Art', 'Private Jacuzzi', 'Royal Khansama Breakfast', 'Chauffeur Airport Transfer'])
    ON CONFLICT (id) DO NOTHING;

    -- 4. Physical Rooms
    INSERT INTO rooms (room_type_id, room_number, housekeeping_state, notes)
    VALUES
    (rt_lakeview, '101', 'available', 'Lake Pichola sunrise facing'),
    (rt_lakeview, '102', 'occupied', 'Guest checking out tomorrow 11 AM'),
    (rt_haveli, '103', 'available', 'Fresh floral garland setup completed'),
    (rt_jharokha, '104', 'cleaning', 'Daily linen turnover underway'),
    (rt_meenakari, '105', 'dirty', 'Checked out at 1:30 PM, needs deep clean'),
    (rt_sheesh, '201', 'available', 'Royal VIP suite prepared')
    ON CONFLICT (room_number) DO NOTHING;

    -- 5. Party Hall
    INSERT INTO halls (id, property_id, name, capacity, description, photos, packages)
    VALUES (
        hall_id,
        prop_id,
        'Crystal Ballroom & Royal Terrace',
        250,
        'Grand imperial hall under Czech crystal chandeliers with sound acoustics and central stage.',
        ARRAY['/images/hall/crystal-ballroom.jpg'],
        '[{"name": "Royal Shahi Wedding", "price_guidance_minor": 35000000}, {"name": "Corporate Sufi Gala", "price_guidance_minor": 15000000}]'::jsonb
    ) ON CONFLICT (id) DO NOTHING;

    -- 6. Menu Categories
    INSERT INTO menu_categories (id, outlet_id, name, sort_order, is_available)
    VALUES
    (cat_starters, rest_id, 'Royal Starters & Kebabs', 1, true),
    (cat_thalis, rest_id, 'Maharaja Thali Feasts', 2, true),
    (cat_mains, rest_id, 'Heritage Khansama Curries', 3, true),
    (cat_desserts, rest_id, 'Shahi Mithai & Halwas', 4, true),
    (cat_beverages, cafe_id, 'Artisan Coffees & Royal Coolers', 5, true)
    ON CONFLICT (id) DO NOTHING;

    -- 7. Menu Items
    INSERT INTO menu_items (category_id, name, description, price_minor, dietary_labels, is_available, image_url)
    VALUES
    (cat_starters, 'Dhungar Paneer Tikka', 'Clay-oven smoked cottage cheese infused with cloves and royal yellow mustard.', 38000, ARRAY['Vegetarian', 'Gluten-Free'], true, '/images/dining_ambiance.jpg'),
    (cat_starters, 'Rajputana Maas ke Sooley', 'Tender lamb escalopes smoked on open charcoal with kachri and Mathania chillies.', 54000, ARRAY['Non-Vegetarian', 'Chef''s Special'], true, '/images/dining_ambiance.jpg'),
    (cat_thalis, 'Royal Rajputana 56 Bhog Thali', 'Complete imperial banquet: Dal Baati Churma, Ker Sangri, Gatte, Laal Maas, Missi Roti, and Ghevar.', 125000, ARRAY['Specialty'], true, '/images/food/dal-baati.jpg'),
    (cat_mains, 'Traditional Dal Baati Churma', 'Panchmel dal cooked over slow wood embers served with ghee-soaked baatis and rose churma.', 45000, ARRAY['Vegetarian'], true, '/images/food/dal-baati.jpg'),
    (cat_mains, 'Heritage Laal Maas', 'Slow braised young mutton prepared with hand-pounded fiery Mathania red chillies and pure desi ghee.', 62000, ARRAY['Non-Vegetarian', 'Chef''s Special'], true, '/images/dining_ambiance.jpg'),
    (cat_mains, 'Jodhpuri Gatte ki Sabzi', 'Poached gram flour dumplings tempered in a rich spiced curd gravy with whole coriander.', 42000, ARRAY['Vegetarian', 'Jain'], true, '/images/dining_ambiance.jpg'),
    (cat_mains, 'Marwadi Ker Sangri', 'Wild desert beans and berries sauteed in unrefined mustard oil with dried mango powder.', 52000, ARRAY['Vegetarian', 'Vegan'], true, '/images/dining_ambiance.jpg'),
    (cat_desserts, 'Malai Ghevar with Saffron Rabdi', 'Disc of crispy honeycomb pastry drenched in green cardamom syrup and crowned with thick clotted rabdi.', 28000, ARRAY['Vegetarian'], true, '/images/dining_ambiance.jpg'),
    (cat_beverages, 'Royal Kesariya Thandai', 'Hand-ground almonds, pistachio, fennel, rose petals, and whole saffron with chilled milk.', 22000, ARRAY['Vegetarian'], true, '/images/dining_ambiance.jpg')
    ON CONFLICT DO NOTHING;

    -- 8. Reels
    INSERT INTO reels (property_id, creator_name, handle, title, likes_count, comments_count, views_count, thumbnail_url, spot_tag, is_approved)
    VALUES
    (prop_id, 'Priya & Kabir', '@priya_wanderlust', 'Sunset High Tea at the Jharokha Balcony ☕✨ Pure royal magic!', 14200, 342, '124K', '/images/rooms/jharokha-room.jpg', 'Jharokha Balcony', true),
    (prop_id, 'Chef Ranveer Fan', '@the_royal_gourmet', 'The Royal 56 Bhog Thali at Rajmahal Courtyard 🍛 Pure desi ghee aroma!', 28900, 890, '340K', '/images/food/dal-baati.jpg', 'Rajputana Khansama Courtyard', true),
    (prop_id, 'Ananya Sharma', '@ananya_vibes', 'Waking up to this Lake Pichola view in the Sheesh Mahal Suite 🪞🏰', 42100, 1120, '512K', '/images/rooms/sheesh-mahal.jpg', 'Sheesh Mahal Suite', true),
    (prop_id, 'Rohan & Simran', '@royal_weddings_india', 'Grand Baraat Entry at Crystal Ballroom 🎺🥁 Truly straight out of a fairy tale!', 31500, 674, '280K', '/images/hall/crystal-ballroom.jpg', 'Crystal Ballroom', true)
    ON CONFLICT DO NOTHING;

    -- 9. Royal Memories
    INSERT INTO royal_memories (property_id, event_name, event_type, host_name, celebration_date, story, photo_url, likes_count, is_featured)
    VALUES
    (prop_id, 'The Royal Rajputana Wedding', 'wedding', 'Devendra & Radhika Rathore', 'February 2025', 'From the royal Shehnai welcome at the Pol gate to the candle-lit pheras by the courtyard fountain, Rajmahal gave us memories that our families will cherish for generations.', '/images/hall/crystal-ballroom.jpg', 342, true),
    (prop_id, 'Sufi & Folk Night Under The Stars', 'sufi', 'Guest: Vikram & Friends', 'January 2025', 'Mesmerizing Manganiyar musicians, fragrant burning loban, and authentic Ker Sangri served under the star-lit Udaipur sky. Pure heaven on earth.', '/images/rooms/royal-courtyard.jpg', 219, true),
    (prop_id, 'Golden 50th Wedding Anniversary', 'anniversary', 'Col. Jaswant & Savitri Singh', 'December 2024', 'We celebrated our 50th anniversary in the Sheesh Mahal Suite. The personalized silver thali dinner and warm hospitality made us feel like true maharaja and maharani.', '/images/rooms/sheesh-mahal.jpg', 512, true),
    (prop_id, 'Courtyard Khansama Banquet', 'banquet', 'Singhania Family Reunion', 'November 2024', '40 of our relatives gathered from across the world. The slow-cooked Laal Maas and melt-in-mouth churma prepared by master khansamas was the highlight of our entire trip.', '/images/food/dal-baati.jpg', 188, true)
    ON CONFLICT DO NOTHING;
END $$;
