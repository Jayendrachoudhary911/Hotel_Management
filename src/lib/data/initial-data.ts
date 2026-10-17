import type {
  Property,
  Outlet,
  RoomType,
  Room,
  Hall,
  MenuCategory,
  Table,
  QRToken,
  Reservation,
  Order,
  User,
} from '@/lib/types';

export const INITIAL_PROPERTY: Property = {
  id: 'a0000000-0000-0000-0000-000000000001',
  name: 'Aura Grand Luxury Resort & Suites',
  address: '124 Palatial Boulevard, Heritage Enclave, Udaipur, Rajasthan 313001',
  phone: '+91 294 288 9000',
  email: 'concierge@auragrandresort.com',
  currency_code: 'INR',
  timezone: 'Asia/Kolkata',
  operating_hours: {
    mon: { open: '00:00', close: '23:59' },
    tue: { open: '00:00', close: '23:59' },
    wed: { open: '00:00', close: '23:59' },
    thu: { open: '00:00', close: '23:59' },
    fri: { open: '00:00', close: '23:59' },
    sat: { open: '00:00', close: '23:59' },
    sun: { open: '00:00', close: '23:59' },
  },
  booking_policy: 'Standard check-in from 2:00 PM. Check-out until 11:00 AM. Government ID required at check-in.',
  cancellation_terms: 'Full refund if cancelled 48+ hours prior to arrival. 50% charge if cancelled within 24-48 hours.',
  deposit_percent: 20,
  is_active: true,
  created_at: '2026-01-01T00:00:00Z',
};

export const INITIAL_OUTLETS: Outlet[] = [
  {
    id: 'b0000000-0000-0000-0000-000000000001',
    property_id: 'a0000000-0000-0000-0000-000000000001',
    name: 'Saffron & Spice Fine Dining',
    type: 'restaurant',
    operating_hours: { all: { open: '11:00', close: '23:00' } },
    dine_in_enabled: true,
    pickup_enabled: true,
    delivery_enabled: true,
    pickup_lead_minutes: 25,
    delivery_lead_minutes: 45,
    delivery_fee_minor: 5000, // Rs 50.00
    min_delivery_order_minor: 30000, // Rs 300.00
    delivery_estimate: '35-45 mins',
    is_paused: false,
    tax_rate_bps: 500, // 5% GST
    service_charge_bps: 250, // 2.5%
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'b0000000-0000-0000-0000-000000000002',
    property_id: 'a0000000-0000-0000-0000-000000000001',
    name: 'The Velvet Roast Artisan Cafe',
    type: 'cafe',
    operating_hours: { all: { open: '07:30', close: '22:00' } },
    dine_in_enabled: true,
    pickup_enabled: true,
    delivery_enabled: true,
    pickup_lead_minutes: 15,
    delivery_lead_minutes: 30,
    delivery_fee_minor: 4000, // Rs 40.00
    min_delivery_order_minor: 15000, // Rs 150.00
    delivery_estimate: '20-35 mins',
    is_paused: false,
    tax_rate_bps: 500, // 5% GST
    service_charge_bps: 0,
    created_at: '2026-01-01T00:00:00Z',
  },
];

export const INITIAL_ROOM_TYPES: RoomType[] = [
  {
    id: 'd0000000-0000-0000-0000-000000000001',
    property_id: 'a0000000-0000-0000-0000-000000000001',
    name: 'Haveli Heritage Suite',
    description: 'Immerse in classic Rajputana architecture featuring carved stone jalis, antique teakwood furniture, and a tranquil courtyard view.',
    capacity: 2,
    total_rooms: 6,
    base_rate_minor: 520000, // Rs 5,200.00 / night
    amenities: ['King Four-Poster Bed', 'Hand-carved Stone Jali', 'Courtyard View', 'High-speed WiFi', '4K Smart TV', 'Herbal Welcome Drink', 'Peshwai Tea Set'],
    photos: ['/images/rooms/haveli-suite.jpg'],
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'd0000000-0000-0000-0000-000000000002',
    property_id: 'a0000000-0000-0000-0000-000000000001',
    name: 'Jharokha Regal Chamber',
    description: 'Perched high with an authentic sandstone jharokha (oriel window) looking over the tranquil waters of Lake Pichola.',
    capacity: 2,
    total_rooms: 5,
    base_rate_minor: 750000, // Rs 7,500.00 / night
    amenities: ['Sandstone Jharokha Balcony', 'Lake Pichola Vista', 'Plush King Bed', 'Deep Soaking Marble Tub', 'Complimentary Royal Breakfast', 'Evening Flute Recital'],
    photos: ['/images/rooms/jharokha-room.jpg'],
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'd0000000-0000-0000-0000-000000000003',
    property_id: 'a0000000-0000-0000-0000-000000000001',
    name: 'Meenakari Royal Suite',
    description: 'Adorned with intricate hand-painted Meenakari enamel motifs, gold leaf detailing, and opulent silk-velvet bolsters.',
    capacity: 3,
    total_rooms: 4,
    base_rate_minor: 980000, // Rs 9,800.00 / night
    amenities: ['Hand-painted Meenakari Ceilings', 'Royal Divan & King Bed', 'Italian Marble Bath', 'Personalized Butler', 'Sunset High-Tea', 'Artisanal Bath Amenities'],
    photos: ['/images/rooms/meenakari-room.jpg'],
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'd0000000-0000-0000-0000-000000000004',
    property_id: 'a0000000-0000-0000-0000-000000000001',
    name: 'Thar Desert Heritage Suite',
    description: 'Crafted from warm Jaisalmer golden sandstone with hand-woven camel wool carpets and antique brass filigree lanterns.',
    capacity: 3,
    total_rooms: 4,
    base_rate_minor: 880000, // Rs 8,800.00 / night
    amenities: ['Golden Sandstone Interiors', 'Private Garden Sit-Out', 'Rain Shower & Soaking Tub', 'Complimentary Breakfast', 'Heritage Audio Tour', 'High-speed WiFi'],
    photos: ['/images/rooms/thar-heritage.jpg'],
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'd0000000-0000-0000-0000-000000000005',
    property_id: 'a0000000-0000-0000-0000-000000000001',
    name: 'Royal Courtyard Palace Suite',
    description: 'Surrounding an internal private open-to-sky marble courtyard with fountains, vaulted arches, and a secluded sun lounge.',
    capacity: 4,
    total_rooms: 3,
    base_rate_minor: 1450000, // Rs 14,500.00 / night
    amenities: ['Private Interior Courtyard', 'Double King Bedrooms', 'Private Dining Table', 'Dedicated Khansama (Chef)', 'Vintage Car Transfer', 'Champagne on Arrival'],
    photos: ['/images/rooms/royal-courtyard.jpg'],
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'd0000000-0000-0000-0000-000000000006',
    property_id: 'a0000000-0000-0000-0000-000000000001',
    name: 'Sheesh Mahal Presidential Suite',
    description: 'The pinnacle of Rajput royalty. Inlaid with over 10,000 convex thikri mirrors reflecting candlelight, private heated plunge pool, and panoramic palace terrace.',
    capacity: 4,
    total_rooms: 2,
    base_rate_minor: 2650000, // Rs 26,500.00 / night
    amenities: ['Mirror-Inlaid Sheesh Mahal Salon', 'Private Heated Plunge Pool', 'Rooftop Palace Terrace', '24/7 Royal Butler & Chauffeur', 'Bespoke Degustation Dinner', 'Silver Platter In-Room Dining'],
    photos: ['/images/rooms/sheesh-mahal.jpg'],
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
  },
];

export const INITIAL_ROOMS: Room[] = [
  { id: 'e0000000-0000-0000-0000-000000000101', room_type_id: 'd0000000-0000-0000-0000-000000000001', room_number: 'Haveli 101', housekeeping_state: 'available', notes: null },
  { id: 'e0000000-0000-0000-0000-000000000102', room_type_id: 'd0000000-0000-0000-0000-000000000001', room_number: 'Haveli 102', housekeeping_state: 'available', notes: null },
  { id: 'e0000000-0000-0000-0000-000000000201', room_type_id: 'd0000000-0000-0000-0000-000000000002', room_number: 'Jharokha 201', housekeeping_state: 'available', notes: 'Lake facing balcony inspected' },
  { id: 'e0000000-0000-0000-0000-000000000202', room_type_id: 'd0000000-0000-0000-0000-000000000002', room_number: 'Jharokha 202', housekeeping_state: 'occupied', notes: 'VIP Guest' },
  { id: 'e0000000-0000-0000-0000-000000000301', room_type_id: 'd0000000-0000-0000-0000-000000000003', room_number: 'Meenakari 301', housekeeping_state: 'available', notes: null },
  { id: 'e0000000-0000-0000-0000-000000000401', room_type_id: 'd0000000-0000-0000-0000-000000000004', room_number: 'Thar 401', housekeeping_state: 'available', notes: null },
  { id: 'e0000000-0000-0000-0000-000000000501', room_type_id: 'd0000000-0000-0000-0000-000000000005', room_number: 'Courtyard Suite 1', housekeeping_state: 'available', notes: null },
  { id: 'e0000000-0000-0000-0000-000000000601', room_type_id: 'd0000000-0000-0000-0000-000000000006', room_number: 'Sheesh Mahal 1', housekeeping_state: 'available', notes: 'Rose petals and incense arranged' },
];

export const INITIAL_HALL: Hall = {
  id: 'f0000000-0000-0000-0000-000000000001',
  property_id: 'a0000000-0000-0000-0000-000000000001',
  name: 'The Grand Crystal Ballroom & Starlit Lawn',
  capacity: 350,
  description: 'An awe-inspiring pillarless banquet hall with Bohemian crystal chandeliers, integrated acoustic sound systems, and an adjoining manicured starlit lawn.',
  photos: ['/images/hall/crystal-ballroom.jpg'],
  packages: [
    {
      name: 'Silver Social Package',
      description: '4-hour venue access, standard stage & ambient lighting, high-tea buffet for up to 100 guests.',
      price_guidance_minor: 7500000, // Rs 75,000.00
    },
    {
      name: 'Royal Gala & Wedding Package',
      description: 'Full day access, bridal greenroom, premium gourmet buffet, majestic stage setup, and valet parking.',
      price_guidance_minor: 18500000, // Rs 1,85,000.00
    },
    {
      name: 'Corporate Summit Executive',
      description: 'Audio-visual conferencing screens, podium, tea/coffee station, 3-course executive lunch for delegates.',
      price_guidance_minor: 9500000, // Rs 95,000.00
    },
  ],
};

export const INITIAL_RESTAURANT_CATEGORIES: MenuCategory[] = [
  {
    id: '10000000-0000-0000-0000-000000000001',
    outlet_id: 'b0000000-0000-0000-0000-000000000001',
    name: 'Starters & Kebabs',
    sort_order: 1,
    is_available: true,
    items: [
      {
        id: '11000000-0000-0000-0000-000000000001',
        category_id: '10000000-0000-0000-0000-000000000001',
        name: 'Paneer Tikka Angara',
        description: 'Smoked cottage cheese cubes marinated in Kashmiri chili and aged mustard, fired in clay tandoor.',
        price_minor: 38500, // Rs 385.00
        image_url: '/images/food/restaurant.jpg',
        is_available: true,
        dietary_labels: ['veg', 'gluten-free', 'chef-special'],
        sort_order: 1,
        modifiers: [
          { id: 'm1', menu_item_id: '11000000-0000-0000-0000-000000000001', name: 'Extra Mint Chutney', price_minor: 2500, is_available: true },
          { id: 'm2', menu_item_id: '11000000-0000-0000-0000-000000000001', name: 'Add Melted Cheese Topping', price_minor: 6000, is_available: true },
        ],
      },
      {
        id: '11000000-0000-0000-0000-000000000002',
        category_id: '10000000-0000-0000-0000-000000000001',
        name: 'Truffle Mushroom Galouti',
        description: 'Melt-in-mouth smoked mushroom patties served on saffron sheermal with fresh mint relish.',
        price_minor: 42000, // Rs 420.00
        image_url: '/images/food/restaurant.jpg',
        is_available: true,
        dietary_labels: ['veg'],
        sort_order: 2,
      },
    ],
  },
  {
    id: '10000000-0000-0000-0000-000000000002',
    outlet_id: 'b0000000-0000-0000-0000-000000000001',
    name: 'Royal Mains & Curries',
    sort_order: 2,
    is_available: true,
    items: [
      {
        id: '12000000-0000-0000-0000-000000000001',
        category_id: '10000000-0000-0000-0000-000000000002',
        name: 'Dal Makhani Aura Special',
        description: 'Black lentils slow-cooked for 36 hours over charcoal with churned butter and organic cream.',
        price_minor: 45000, // Rs 450.00
        image_url: '/images/food/restaurant.jpg',
        is_available: true,
        dietary_labels: ['veg', 'bestseller'],
        sort_order: 1,
      },
      {
        id: '12000000-0000-0000-0000-000000000002',
        category_id: '10000000-0000-0000-0000-000000000002',
        name: 'Shahi Dum Paneer Korma',
        description: 'Cottage cheese stuffed with pistachio and mawa, simmered in a velvety cashew and green cardamom gravy.',
        price_minor: 49500, // Rs 495.00
        image_url: '/images/food/restaurant.jpg',
        is_available: true,
        dietary_labels: ['veg'],
        sort_order: 2,
      },
    ],
  },
  {
    id: '10000000-0000-0000-0000-000000000003',
    outlet_id: 'b0000000-0000-0000-0000-000000000001',
    name: 'Breads & Fragrant Rice',
    sort_order: 3,
    is_available: true,
    items: [
      {
        id: '13000000-0000-0000-0000-000000000001',
        category_id: '10000000-0000-0000-0000-000000000003',
        name: 'Awadhi Subz Dum Biryani',
        description: 'Fragrant aged basmati rice layered with seasonal garden vegetables, saffron milk, and sealed with pastry dough.',
        price_minor: 48000, // Rs 480.00
        image_url: '/images/food/restaurant.jpg',
        is_available: true,
        dietary_labels: ['veg', 'bestseller'],
        sort_order: 1,
      },
      {
        id: '13000000-0000-0000-0000-000000000002',
        category_id: '10000000-0000-0000-0000-000000000003',
        name: 'Garlic Butter Naan',
        description: 'Hand-stretched tandoori naan brushed with fresh roasted garlic and churned salted butter.',
        price_minor: 12000, // Rs 120.00
        image_url: '/images/food/restaurant.jpg',
        is_available: true,
        dietary_labels: ['veg'],
        sort_order: 2,
      },
    ],
  },
];

export const INITIAL_CAFE_CATEGORIES: MenuCategory[] = [
  {
    id: '20000000-0000-0000-0000-000000000001',
    outlet_id: 'b0000000-0000-0000-0000-000000000002',
    name: 'Specialty Coffee & Brews',
    sort_order: 1,
    is_available: true,
    items: [
      {
        id: '21000000-0000-0000-0000-000000000001',
        category_id: '20000000-0000-0000-0000-000000000001',
        name: 'Spanish Iced Latte',
        description: 'Double shot of single-origin Chikmagalur espresso with condensed milk and chilled whole milk.',
        price_minor: 26000, // Rs 260.00
        image_url: '/images/food/cafe.jpg',
        is_available: true,
        dietary_labels: ['veg', 'bestseller'],
        sort_order: 1,
        modifiers: [
          { id: 'c1', menu_item_id: '21000000-0000-0000-0000-000000000001', name: 'Oat Milk Sub', price_minor: 4500, is_available: true },
          { id: 'c2', menu_item_id: '21000000-0000-0000-0000-000000000001', name: 'Extra Shot Espresso', price_minor: 6000, is_available: true },
        ],
      },
      {
        id: '21000000-0000-0000-0000-000000000002',
        category_id: '20000000-0000-0000-0000-000000000001',
        name: 'Velvet Cappuccino',
        description: 'Single-estate espresso, steamed silky microfoam, dusted with organic Valrhona cocoa.',
        price_minor: 22000, // Rs 220.00
        image_url: '/images/food/cafe.jpg',
        is_available: true,
        dietary_labels: ['veg'],
        sort_order: 2,
      },
    ],
  },
  {
    id: '20000000-0000-0000-0000-000000000002',
    outlet_id: 'b0000000-0000-0000-0000-000000000002',
    name: 'Artisan Bakery & Toasts',
    sort_order: 2,
    is_available: true,
    items: [
      {
        id: '22000000-0000-0000-0000-000000000001',
        category_id: '20000000-0000-0000-0000-000000000002',
        name: 'Almond Frangipane Croissant',
        description: 'Flaky butter croissant filled with house-made almond frangipane and topped with toasted almond flakes.',
        price_minor: 24000, // Rs 240.00
        image_url: '/images/food/cafe.jpg',
        is_available: true,
        dietary_labels: ['veg', 'bestseller'],
        sort_order: 1,
      },
      {
        id: '22000000-0000-0000-0000-000000000002',
        category_id: '20000000-0000-0000-0000-000000000002',
        name: 'Avocado Sourdough Tartine',
        description: 'Crushed Hass avocado on toasted country sourdough, pickled radish, dukkah spice, cold-pressed olive oil.',
        price_minor: 36000, // Rs 360.00
        image_url: '/images/food/cafe.jpg',
        is_available: true,
        dietary_labels: ['veg', 'healthy'],
        sort_order: 2,
      },
    ],
  },
];

export const INITIAL_TABLES: Table[] = [
  { id: '30000000-0000-0000-0000-000000000001', outlet_id: 'b0000000-0000-0000-0000-000000000001', table_number: 'Table 1', capacity: 4, is_active: true },
  { id: '30000000-0000-0000-0000-000000000002', outlet_id: 'b0000000-0000-0000-0000-000000000001', table_number: 'Table 2', capacity: 4, is_active: true },
  { id: '30000000-0000-0000-0000-000000000003', outlet_id: 'b0000000-0000-0000-0000-000000000001', table_number: 'Table 3', capacity: 6, is_active: true },
  { id: '30000000-0000-0000-0000-000000000004', outlet_id: 'b0000000-0000-0000-0000-000000000002', table_number: 'Cafe T1', capacity: 2, is_active: true },
  { id: '30000000-0000-0000-0000-000000000005', outlet_id: 'b0000000-0000-0000-0000-000000000002', table_number: 'Cafe T2', capacity: 4, is_active: true },
];

export const INITIAL_QR_TOKENS: QRToken[] = [
  { id: '40000000-0000-0000-0000-000000000001', table_id: '30000000-0000-0000-0000-000000000001', token: 'table-01-token', is_active: true, created_at: '2026-01-01T00:00:00Z', table: INITIAL_TABLES[0] },
  { id: '40000000-0000-0000-0000-000000000002', table_id: '30000000-0000-0000-0000-000000000002', token: 'table-02-token', is_active: true, created_at: '2026-01-01T00:00:00Z', table: INITIAL_TABLES[1] },
  { id: '40000000-0000-0000-0000-000000000003', table_id: '30000000-0000-0000-0000-000000000003', token: 'table-03-token', is_active: true, created_at: '2026-01-01T00:00:00Z', table: INITIAL_TABLES[2] },
  { id: '40000000-0000-0000-0000-000000000004', table_id: '30000000-0000-0000-0000-000000000004', token: 'cafe-01-token', is_active: true, created_at: '2026-01-01T00:00:00Z', table: INITIAL_TABLES[3] },
  { id: '40000000-0000-0000-0000-000000000005', table_id: '30000000-0000-0000-0000-000000000005', token: 'cafe-02-token', is_active: true, created_at: '2026-01-01T00:00:00Z', table: INITIAL_TABLES[4] },
];

export const INITIAL_USERS: User[] = [
  { id: '50000000-0000-0000-0000-000000000001', auth_id: 'auth-1', name: 'Devansh Sharma (Admin)', email: 'admin@auragrandresort.com', phone: '+91 98765 43210', property_id: 'a0000000-0000-0000-0000-000000000001', role: 'admin', is_active: true, created_at: '2026-01-01T00:00:00Z' },
  { id: '50000000-0000-0000-0000-000000000002', auth_id: 'auth-2', name: 'Pooja Verma (Manager)', email: 'manager@auragrandresort.com', phone: '+91 98765 43211', property_id: 'a0000000-0000-0000-0000-000000000001', role: 'manager', is_active: true, created_at: '2026-01-01T00:00:00Z' },
  { id: '50000000-0000-0000-0000-000000000003', auth_id: 'auth-3', name: 'Rahul Mehta (Front Desk)', email: 'frontdesk@auragrandresort.com', phone: '+91 98765 43212', property_id: 'a0000000-0000-0000-0000-000000000001', role: 'front_desk', is_active: true, created_at: '2026-01-01T00:00:00Z' },
  { id: '50000000-0000-0000-0000-000000000004', auth_id: 'auth-4', name: 'Chef Vikram Singhania', email: 'kitchen@auragrandresort.com', phone: '+91 98765 43213', property_id: 'a0000000-0000-0000-0000-000000000001', role: 'kitchen', is_active: true, created_at: '2026-01-01T00:00:00Z' },
  { id: '50000000-0000-0000-0000-000000000005', auth_id: 'auth-5', name: 'Amit Kumar (Cashier)', email: 'cashier@auragrandresort.com', phone: '+91 98765 43214', property_id: 'a0000000-0000-0000-0000-000000000001', role: 'cashier', is_active: true, created_at: '2026-01-01T00:00:00Z' },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    outlet_id: 'b0000000-0000-0000-0000-000000000001',
    table_id: '30000000-0000-0000-0000-000000000001',
    order_number: 'ORD-20261017-001',
    channel: 'qr',
    fulfilment_mode: 'dine_in',
    pickup_name: null,
    pickup_phone: null,
    delivery_name: null,
    delivery_phone: null,
    delivery_address: null,
    delivery_notes: null,
    delivery_fee_minor: 0,
    subtotal_minor: 83500,
    tax_minor: 4175,
    service_charge_minor: 2087,
    discount_minor: 0,
    total_minor: 89762,
    status: 'preparing',
    cancel_reason: null,
    created_by: null,
    assigned_delivery_staff: null,
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    order_lines: [
      {
        id: 'ol-1',
        order_id: 'ord-101',
        menu_item_id: '11000000-0000-0000-0000-000000000001',
        item_name_snapshot: 'Paneer Tikka Angara',
        unit_price_snapshot_minor: 38500,
        quantity: 1,
        notes: 'Extra crispy',
        modifiers_snapshot: null,
        line_total_minor: 38500,
      },
      {
        id: 'ol-2',
        order_id: 'ord-101',
        menu_item_id: '12000000-0000-0000-0000-000000000001',
        item_name_snapshot: 'Dal Makhani Aura Special',
        unit_price_snapshot_minor: 45000,
        quantity: 1,
        notes: null,
        modifiers_snapshot: null,
        line_total_minor: 45000,
      },
    ],
  },
  {
    id: 'ord-102',
    outlet_id: 'b0000000-0000-0000-0000-000000000002',
    table_id: null,
    order_number: 'ORD-20261017-002',
    channel: 'web',
    fulfilment_mode: 'pickup',
    pickup_name: 'Ananya Sharma',
    pickup_phone: '+91 98200 12345',
    delivery_name: null,
    delivery_phone: null,
    delivery_address: null,
    delivery_notes: null,
    delivery_fee_minor: 0,
    subtotal_minor: 50000,
    tax_minor: 2500,
    service_charge_minor: 0,
    discount_minor: 0,
    total_minor: 52500,
    status: 'ready',
    cancel_reason: null,
    created_by: null,
    assigned_delivery_staff: null,
    created_at: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    order_lines: [
      {
        id: 'ol-3',
        order_id: 'ord-102',
        menu_item_id: '21000000-0000-0000-0000-000000000001',
        item_name_snapshot: 'Spanish Iced Latte',
        unit_price_snapshot_minor: 26000,
        quantity: 1,
        notes: null,
        modifiers_snapshot: null,
        line_total_minor: 26000,
      },
      {
        id: 'ol-4',
        order_id: 'ord-102',
        menu_item_id: '22000000-0000-0000-0000-000000000001',
        item_name_snapshot: 'Almond Frangipane Croissant',
        unit_price_snapshot_minor: 24000,
        quantity: 1,
        notes: null,
        modifiers_snapshot: null,
        line_total_minor: 24000,
      },
    ],
  },
];

export const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 'res-101',
    property_id: 'a0000000-0000-0000-0000-000000000001',
    guest_id: 'g-1',
    room_type_id: 'd0000000-0000-0000-0000-000000000001',
    room_id: 'e0000000-0000-0000-0000-000000000101',
    check_in: '2026-10-17',
    check_out: '2026-10-20',
    party_size: 2,
    rate_snapshot_minor: 480000,
    terms_snapshot: 'Standard cancellation terms applied.',
    status: 'checked_in',
    reference_code: 'RES-AUR-2026-8841',
    notes: 'Honeymoon couple, flower setup arranged',
    created_at: '2026-10-10T14:30:00Z',
    guest: { id: 'g-1', name: 'Rohan & Simran Kapoor', phone: '+91 98111 22334', email: 'rohan.k@example.com', created_at: '2026-10-10T14:30:00Z' },
    room_type: INITIAL_ROOM_TYPES[0],
    room: INITIAL_ROOMS[0],
  },
  {
    id: 'res-102',
    property_id: 'a0000000-0000-0000-0000-000000000001',
    guest_id: 'g-2',
    room_type_id: 'd0000000-0000-0000-0000-000000000002',
    room_id: 'e0000000-0000-0000-0000-000000000201',
    check_in: '2026-10-18',
    check_out: '2026-10-21',
    party_size: 3,
    rate_snapshot_minor: 850000,
    terms_snapshot: 'Standard cancellation terms applied.',
    status: 'confirmed',
    reference_code: 'RES-AUR-2026-9124',
    notes: 'Late arrival expected at 8:00 PM',
    created_at: '2026-10-12T09:15:00Z',
    guest: { id: 'g-2', name: 'Vikramaditya Roy', phone: '+91 97233 44556', email: 'vikram.roy@example.com', created_at: '2026-10-12T09:15:00Z' },
    room_type: INITIAL_ROOM_TYPES[1],
    room: INITIAL_ROOMS[3],
  },
];
