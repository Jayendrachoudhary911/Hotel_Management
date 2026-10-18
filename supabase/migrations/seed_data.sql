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
    (cat_starters, 'Rajputana Maas ke Sooley', 'Tender lamb escalopes smoked on open charcoal with kachri and Mathania chillies.', 54000, ARRAY['Non-Vegetarian', "Chef's Special"], true, '/images/dining_ambiance.jpg'),
    (cat_thalis, 'Royal Rajputana 56 Bhog Thali', 'Complete imperial banquet: Dal Baati Churma, Ker Sangri, Gatte, Laal Maas, Missi Roti, and Ghevar.', 125000, ARRAY['Specialty'], true, '/images/food/dal-baati.jpg'),
    (cat_mains, 'Traditional Dal Baati Churma', 'Panchmel dal cooked over slow wood embers served with ghee-soaked baatis and rose churma.', 45000, ARRAY['Vegetarian'], true, '/images/food/dal-baati.jpg'),
    (cat_mains, 'Heritage Laal Maas', 'Slow braised young mutton prepared with hand-pounded fiery Mathania red chillies and pure desi ghee.', 62000, ARRAY['Non-Vegetarian', "Chef's Special"], true, '/images/dining_ambiance.jpg'),
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
