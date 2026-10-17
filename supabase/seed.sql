-- Seed Data for Hospitality Platform

-- 1. Property
INSERT INTO properties (
    id, name, address, phone, email, currency_code, timezone, operating_hours,
    booking_policy, cancellation_terms, deposit_percent, is_active
) VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'Aura Grand Luxury Resort & Suites',
    '124 Palatial Boulevard, Heritage Enclave, Udaipur, Rajasthan 313001',
    '+91 294 288 9000',
    'concierge@auragrandresort.com',
    'INR',
    'Asia/Kolkata',
    '{"mon": {"open": "00:00", "close": "23:59"}, "tue": {"open": "00:00", "close": "23:59"}, "wed": {"open": "00:00", "close": "23:59"}, "thu": {"open": "00:00", "close": "23:59"}, "fri": {"open": "00:00", "close": "23:59"}, "sat": {"open": "00:00", "close": "23:59"}, "sun": {"open": "00:00", "close": "23:59"}}'::jsonb,
    'Standard check-in from 2:00 PM. Check-out until 11:00 AM. Early check-in subject to availability.',
    'Full refund if cancelled 48+ hours prior to arrival. 50% charge if cancelled within 24-48 hours.',
    20,
    true
) ON CONFLICT (id) DO NOTHING;

-- 2. Outlets: Restaurant & Cafe
INSERT INTO outlets (
    id, property_id, name, type, operating_hours, dine_in_enabled, pickup_enabled, delivery_enabled,
    pickup_lead_minutes, delivery_lead_minutes, delivery_fee_minor, min_delivery_order_minor, delivery_estimate,
    is_paused, tax_rate_bps, service_charge_bps
) VALUES 
(
    'b0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'Saffron & Spice Fine Dining',
    'restaurant',
    '{"all": {"open": "11:00", "close": "23:00"}}'::jsonb,
    true, true, true, 25, 45, 5000, 30000, '35-45 mins', false, 500, 250
),
(
    'b0000000-0000-0000-0000-000000000002',
    'a0000000-0000-0000-0000-000000000001',
    'The Velvet Roast Artisan Cafe',
    'cafe',
    '{"all": {"open": "07:30", "close": "22:00"}}'::jsonb,
    true, true, true, 15, 30, 4000, 15000, '20-35 mins', false, 500, 0
) ON CONFLICT (id) DO NOTHING;

-- 3. Delivery Areas
INSERT INTO delivery_areas (id, outlet_id, area_name, is_active) VALUES
('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Heritage Enclave & Lake View Zone', true),
('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'Civil Lines & City Center (within 5km)', true),
('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000002', 'Heritage Enclave & Downtown Zone', true)
ON CONFLICT (id) DO NOTHING;

-- 4. Room Types
INSERT INTO room_types (
    id, property_id, name, description, capacity, total_rooms, base_rate_minor, amenities, photos, is_active
) VALUES 
(
    'd0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'Deluxe Garden Suite',
    'Sunlit contemporary suite overlooking private landscaped gardens, featuring a king bed, Italian marble bathroom, and rain shower.',
    2, 8, 480000,
    ARRAY['King Bed', 'Private Balcony', 'High-speed WiFi', '4K Smart TV', 'Espresso Machine', 'Mini Bar', 'Bathrobe & Slippers'],
    ARRAY['/images/rooms/deluxe-garden.jpg'],
    true
),
(
    'd0000000-0000-0000-0000-000000000002',
    'a0000000-0000-0000-0000-000000000001',
    'Lakeview Royal Suite',
    'Panoramic tranquil lake views with bespoke artisan furnishings, deep soaking tub, private sit-out deck, and butler service on request.',
    3, 6, 850000,
    ARRAY['King Bed + Daybed', 'Panoramic Lake View', 'Deep Soaking Tub', 'Complimentary Breakfast', 'Butler on Demand', 'High-speed WiFi', 'Evening Turndown'],
    ARRAY['/images/rooms/lakeview-suite.jpg'],
    true
),
(
    'd0000000-0000-0000-0000-000000000003',
    'a0000000-0000-0000-0000-000000000001',
    'Presidential Villa with Plunge Pool',
    'The pinnacle of royal luxury. 1,800 sq ft private villa with infinity plunge pool, living salon, dining area, and dedicated concierge.',
    4, 2, 2250000,
    ARRAY['Private Plunge Pool', 'Living & Dining Salon', 'Private Courtyard', 'Full Butler Service', 'Airport Chauffeur Included', 'Luxury Toiletries', 'Wine Chiller'],
    ARRAY['/images/rooms/presidential-villa.jpg'],
    true
) ON CONFLICT (id) DO NOTHING;

-- 5. Physical Rooms
INSERT INTO rooms (id, room_type_id, room_number, housekeeping_state) VALUES
('e0000000-0000-0000-0000-000000000101', 'd0000000-0000-0000-0000-000000000001', '101', 'available'),
('e0000000-0000-0000-0000-000000000102', 'd0000000-0000-0000-0000-000000000001', '102', 'available'),
('e0000000-0000-0000-0000-000000000103', 'd0000000-0000-0000-0000-000000000001', '103', 'dirty'),
('e0000000-0000-0000-0000-000000000201', 'd0000000-0000-0000-0000-000000000002', '201', 'available'),
('e0000000-0000-0000-0000-000000000202', 'd0000000-0000-0000-0000-000000000002', '202', 'occupied'),
('e0000000-0000-0000-0000-000000000901', 'd0000000-0000-0000-0000-000000000003', 'Villa 1', 'available')
ON CONFLICT (id) DO NOTHING;

-- 6. Party Hall
INSERT INTO halls (
    id, property_id, name, capacity, description, photos, packages, is_active
) VALUES (
    'f0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'The Grand Crystal Ballroom & Lawn',
    350,
    'An awe-inspiring pillarless banquet hall with Bohemian crystal chandeliers, integrated acoustic sound systems, and an adjoining manicured starlit lawn.',
    ARRAY['/images/hall/crystal-ballroom.jpg'],
    '[
        {"name": "Silver Social Package", "description": "4-hour venue access, standard stage & ambient lighting, high-tea buffet", "price_guidance_minor": 7500000},
        {"name": "Royal Gala & Wedding Package", "description": "Full day access, bridal greenroom, premium gourmet buffet, stage setup, valet parking", "price_guidance_minor": 18500000},
        {"name": "Corporate Summit Executive", "description": "Audio-visual conferencing screens, podium, tea/coffee station, 3-course executive lunch", "price_guidance_minor": 9500000}
    ]'::jsonb,
    true
) ON CONFLICT (id) DO NOTHING;

-- 7. Menu Categories
INSERT INTO menu_categories (id, outlet_id, name, sort_order, is_available) VALUES
('10000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'Starters & Kebabs', 1, true),
('10000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'Royal Mains & Curries', 2, true),
('10000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'Breads & Fragrant Rice', 3, true),
('10000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000001', 'Decadent Desserts', 4, true),
('20000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 'Specialty Coffee & Brews', 1, true),
('20000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 'Artisan Bakery & Toasts', 2, true)
ON CONFLICT (id) DO NOTHING;

-- 8. Menu Items
INSERT INTO menu_items (id, category_id, name, description, price_minor, image_url, is_available, dietary_labels, sort_order) VALUES
-- Restaurant Starters
('11000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Paneer Tikka Angara', 'Smoked cottage cheese cubes marinated in Kashmiri chili and aged mustard, fired in clay tandoor.', 38500, '/images/food/paneer-tikka.jpg', true, ARRAY['veg', 'gluten-free', 'chef-special'], 1),
('11000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Truffle Mushroom Galouti', 'Melt-in-mouth smoked mushroom patties served on saffron sheermal with mint chutney.', 42000, '/images/food/galouti.jpg', true, ARRAY['veg'], 2),
-- Restaurant Mains
('12000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'Dal Makhani Aura', 'Black lentils slow-cooked for 36 hours over charcoal with churned butter and San Marzano tomatoes.', 45000, '/images/food/dal-makhani.jpg', true, ARRAY['veg', 'bestseller'], 1),
('12000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'Shahi Dum Paneer Korma', 'Cottage cheese stuffed with pistachio and mawa, simmered in a velvety white cashew & cardamom gravy.', 49500, '/images/food/paneer-korma.jpg', true, ARRAY['veg'], 2),
-- Restaurant Rice & Breads
('13000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', 'Awadhi Subz Dum Biryani', 'Fragrant basmati rice layered with seasonal vegetables, rose water, saffron, and cooked under pastry seal.', 48000, '/images/food/biryani.jpg', true, ARRAY['veg', 'bestseller'], 1),
('13000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000003', 'Garlic Butter Naan', 'Hand-stretched leavened bread brushed with clarified butter and roasted garlic.', 12000, '/images/food/naan.jpg', true, ARRAY['veg'], 2),
-- Cafe Coffee & Brews
('21000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'Spanish Iced Latte', 'Double shot of single-origin Chikmagalur espresso with condensed milk and chilled whole milk.', 26000, '/images/food/iced-latte.jpg', true, ARRAY['veg', 'bestseller'], 1),
('21000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', 'Velvet Cappuccino', 'Single-estate espresso, steamed silky microfoam, dusted with Valrhona cocoa.', 22000, '/images/food/cappuccino.jpg', true, ARRAY['veg'], 2),
-- Cafe Bakery
('22000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', 'Almond Croissant', 'Flaky butter croissant filled with almond frangipane and topped with toasted almond flakes.', 24000, '/images/food/croissant.jpg', true, ARRAY['veg'], 1),
('22000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', 'Avocado Sourdough Tartine', 'Crushed Hass avocado on toasted country sourdough, pickled radish, dukkah, cold-pressed olive oil.', 36000, '/images/food/avocado-toast.jpg', true, ARRAY['veg', 'healthy'], 2)
ON CONFLICT (id) DO NOTHING;

-- 9. Tables & QR Tokens
INSERT INTO tables (id, outlet_id, table_number, capacity, is_active) VALUES
('30000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'T-01', 4, true),
('30000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'T-02', 4, true),
('30000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'T-03', 6, true),
('30000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000002', 'Cafe-1', 2, true),
('30000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000002', 'Cafe-2', 4, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO qr_tokens (id, table_id, token, is_active) VALUES
('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'rest-table-01-token', true),
('40000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002', 'rest-table-02-token', true),
('40000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000003', 'rest-table-03-token', true),
('40000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000004', 'cafe-table-01-token', true),
('40000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000005', 'cafe-table-02-token', true)
ON CONFLICT (id) DO NOTHING;

-- 10. Staff Users
INSERT INTO users (id, name, email, phone, property_id, role, is_active) VALUES
('50000000-0000-0000-0000-000000000001', 'Devansh Sharma (Admin)', 'admin@auragrandresort.com', '+91 98765 43210', 'a0000000-0000-0000-0000-000000000001', 'admin', true),
('50000000-0000-0000-0000-000000000002', 'Pooja Verma (Manager)', 'manager@auragrandresort.com', '+91 98765 43211', 'a0000000-0000-0000-0000-000000000001', 'manager', true),
('50000000-0000-0000-0000-000000000003', 'Rahul Mehta (Front Desk)', 'frontdesk@auragrandresort.com', '+91 98765 43212', 'a0000000-0000-0000-0000-000000000001', 'front_desk', true),
('50000000-0000-0000-0000-000000000004', 'Chef Vikram Singhania', 'kitchen@auragrandresort.com', '+91 98765 43213', 'a0000000-0000-0000-0000-000000000001', 'kitchen', true),
('50000000-0000-0000-0000-000000000005', 'Amit Kumar (Cashier)', 'cashier@auragrandresort.com', '+91 98765 43214', 'a0000000-0000-0000-0000-000000000001', 'cashier', true)
ON CONFLICT (id) DO NOTHING;
