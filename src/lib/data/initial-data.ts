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
  InventoryItem,
  StockMovement,
  Customer,
  StaffMember,
  HousekeepingTask,
  TableReservation,
} from '@/lib/types';

export const INITIAL_PROPERTY: Property = {
  id: 'd0000000-0000-0000-0000-000000000001',
  name: 'Rajmahal Heritage Grand',
  address: 'Palace Road, Near Lake Pichola, Udaipur, Rajasthan 313001',
  phone: '+91 294 288 9000',
  email: 'operations@rajmahalheritage.com',
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
    property_id: 'd0000000-0000-0000-0000-000000000001',
    name: 'Rajmahal Royal Dining',
    type: 'restaurant',
    image_url: '/images/dining/rajasthani-restaurant.png',
    operating_hours: {
      all: { open: '11:00', close: '23:30' },
    },
    dine_in_enabled: true,
    pickup_enabled: true,
    delivery_enabled: true,
    room_service_enabled: true,
    pickup_lead_minutes: 25,
    delivery_lead_minutes: 45,
    delivery_fee_minor: 5000,
    min_delivery_order_minor: 30000,
    delivery_estimate: '35-45 mins',
    is_paused: false,
    is_active: true,
    operating_days: {
      Monday: true,
      Tuesday: true,
      Wednesday: true,
      Thursday: true,
      Friday: true,
      Saturday: true,
      Sunday: true,
    },
    tax_rate_bps: 500,
    service_charge_bps: 250,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'b0000000-0000-0000-0000-000000000002',
    property_id: 'd0000000-0000-0000-0000-000000000001',
    name: 'The Palace Courtyard Café & Lounge',
    type: 'cafe',
    image_url: '/images/dining/cafe-lounge.png',
    operating_hours: {
      all: { open: '07:30', close: '23:00' },
    },
    dine_in_enabled: true,
    pickup_enabled: true,
    delivery_enabled: true,
    room_service_enabled: false,
    pickup_lead_minutes: 15,
    delivery_lead_minutes: 30,
    delivery_fee_minor: 4000,
    min_delivery_order_minor: 15000,
    delivery_estimate: '20-35 mins',
    is_paused: false,
    is_active: true,
    operating_days: {
      Monday: true,
      Tuesday: true,
      Wednesday: true,
      Thursday: true,
      Friday: true,
      Saturday: true,
      Sunday: true,
    },
    tax_rate_bps: 500,
    service_charge_bps: 0,
    created_at: '2026-01-01T00:00:00Z',
  },
];

export const INITIAL_ROOM_TYPES: RoomType[] = [
  {
    id: 'd0000000-0000-0000-0000-000000000001',
    property_id: 'd0000000-0000-0000-0000-000000000001',
    name: 'Heritage Deluxe Room',
    description: 'A perfect blend of traditional Rajasthani decor and modern amenities with handcrafted furnishings and palace vistas.',
    capacity: 2,
    total_rooms: 16,
    base_rate_minor: 650000,
    amenities: ['Complimentary Wi-Fi', 'Air Conditioning (AC)', '24x7 Room Service', 'In-room Dining', 'Valet Parking', 'Plush King Bed', 'Luxury Toiletries'],
    photos: ['/images/rooms/deluxe-garden.jpg'],
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'd0000000-0000-0000-0000-000000000002',
    property_id: 'd0000000-0000-0000-0000-000000000001',
    name: 'Deluxe Palace View Room',
    description: 'Spacious deluxe room featuring authentic stone jharokhas, carved archways and majestic palace courtyard views.',
    capacity: 2,
    total_rooms: 14,
    base_rate_minor: 720000,
    amenities: ['Complimentary Wi-Fi', 'Air Conditioning (AC)', '24x7 Room Service', 'In-room Dining', 'Valet Parking', 'Palace View Balcony', '4K Smart TV'],
    photos: ['/images/rooms/jharokha-room.jpg'],
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'd0000000-0000-0000-0000-000000000003',
    property_id: 'd0000000-0000-0000-0000-000000000001',
    name: 'Deluxe Lake View Room',
    description: 'Sunlit deluxe room offering scenic Lake Pichola vistas, Rajputana royal accents and deep marble bath.',
    capacity: 2,
    total_rooms: 12,
    base_rate_minor: 750000,
    amenities: ['Complimentary Wi-Fi', 'Air Conditioning (AC)', '24x7 Room Service', 'In-room Dining', 'Valet Parking', 'Lake Vista', 'Deep Soaking Tub'],
    photos: ['/images/rooms/lakeview-suite.jpg'],
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'd0000000-0000-0000-0000-000000000004',
    property_id: 'd0000000-0000-0000-0000-000000000001',
    name: 'Deluxe Courtyard Garden Room',
    description: 'Serene deluxe room opening toward lush royal gardens and tranquil fountain soundscapes.',
    capacity: 3,
    total_rooms: 10,
    base_rate_minor: 680000,
    amenities: ['Complimentary Wi-Fi', 'Air Conditioning (AC)', '24x7 Room Service', 'In-room Dining', 'Valet Parking', 'Garden Access', 'Tea & Coffee Maker'],
    photos: ['/images/rooms/royal-courtyard.jpg'],
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
  },
];

// Clean Initial Palace Rooms: 0 rooms initially (rooms can be created in Rooms & Availability)
export const INITIAL_ROOMS: Room[] = [];

export const INITIAL_HALL: Hall = {
  id: 'f0000000-0000-0000-0000-000000000001',
  property_id: 'd0000000-0000-0000-0000-000000000001',
  name: 'The Grand Party & Celebration Hall',
  capacity: 50,
  description: 'An exclusive royal celebration venue with 25-50 guests capacity, crafted for birthday & anniversary parties, romantic private dates, corporate events, and social functions with 100% customizable décor.',
  photos: ['/images/hall/crystal-ballroom.jpg'],
  packages: [
    {
      name: 'Birthday & Anniversary Celebration Package',
      description: 'Capacity 25-50 guests, custom theme décor, cake ceremony setup, ambient lighting, gourmet Rajasthani feast & sound system.',
      price_guidance_minor: 4500000,
    },
    {
      name: 'Romantic Private Date & Candlelight Dining',
      description: 'Exclusive hall reservation for a couple or intimate date, rose petals, candlelit table, private server & 5-course chef menu.',
      price_guidance_minor: 2500000,
    },
    {
      name: 'Corporate Event & Social Gathering Package',
      description: 'High-speed Wi-Fi, audio-visual presentation setup, cluster/theatre seating (25-50 people), hi-tea & banqueting.',
      price_guidance_minor: 5500000,
    },
  ],
};

export const INITIAL_RESTAURANT_CATEGORIES: MenuCategory[] = [
  {
    id: 'cat-1',
    outlet_id: INITIAL_OUTLETS[0].id,
    name: 'Royal Starters & Tandoor',
    sort_order: 1,
    is_available: true,
    items: [
      {
        id: 'item-101',
        category_id: 'cat-1',
        name: 'Paneer Tikka Angara',
        description: 'Charcoal-grilled cottage cheese marinated in degi mirch and mustard oil.',
        price_minor: 38500,
        dietary_labels: ['Vegetarian', 'Gluten-Free'],
        image_url: '/images/dining_ambiance.jpg',
        is_available: true,
        sort_order: 1,
      },
      {
        id: 'item-102',
        category_id: 'cat-1',
        name: 'Dahi Ke Kebab',
        description: 'Crispy spiced hung curd patties with roasted cardamom.',
        price_minor: 34500,
        dietary_labels: ['Vegetarian'],
        image_url: '/images/dining_ambiance.jpg',
        is_available: true,
        sort_order: 2,
      },
    ],
  },
  {
    id: 'cat-2',
    outlet_id: INITIAL_OUTLETS[0].id,
    name: 'Mewari Royal Mains',
    sort_order: 2,
    is_available: true,
    items: [
      {
        id: 'item-201',
        category_id: 'cat-2',
        name: 'Dal Baati Churma Thali',
        description: 'Authentic 5-lentil dal with ghee-dipped baked baatis and artisanal churma.',
        price_minor: 58000,
        dietary_labels: ['Vegetarian', 'Chef Signature'],
        image_url: '/images/dining_ambiance.jpg',
        is_available: true,
        sort_order: 1,
      },
      {
        id: 'item-202',
        category_id: 'cat-2',
        name: 'Paneer Butter Masala',
        description: 'Rich tomato, butter and cashew gravy with fresh cottage cheese.',
        price_minor: 42000,
        dietary_labels: ['Vegetarian'],
        image_url: '/images/dining_ambiance.jpg',
        is_available: true,
        sort_order: 2,
      },
    ],
  },
];

export const INITIAL_CAFE_CATEGORIES: MenuCategory[] = [
  {
    id: 'cat-cafe-1',
    outlet_id: INITIAL_OUTLETS[1].id,
    name: 'Artisanal Brews & Teas',
    sort_order: 1,
    is_available: true,
    items: [
      {
        id: 'item-301',
        category_id: 'cat-cafe-1',
        name: 'Kesariya Masala Chai',
        description: 'Slow-brewed Assam tea with saffron strands, crushed cardamom, and whole spices.',
        price_minor: 18000,
        dietary_labels: ['Vegetarian'],
        image_url: '/images/cafe_treats.jpg',
        is_available: true,
        sort_order: 1,
      },
      {
        id: 'item-302',
        category_id: 'cat-cafe-1',
        name: 'Spanish Iced Latte',
        description: 'Double espresso pulled over condensed milk and chilled cream.',
        price_minor: 26000,
        dietary_labels: ['Vegetarian'],
        image_url: '/images/cafe_treats.jpg',
        is_available: true,
        sort_order: 2,
      },
    ],
  },
];

export const INITIAL_TABLES: Table[] = [];
export const INITIAL_QR_TOKENS: QRToken[] = [];

// Clean Operational State - Mock Data Removed
export const INITIAL_ORDERS: Order[] = [];
export const INITIAL_RESERVATIONS: Reservation[] = [];
export const INITIAL_TABLE_RESERVATIONS: TableReservation[] = [];
export const INITIAL_INVENTORY: InventoryItem[] = [];
export const INITIAL_CUSTOMERS: Customer[] = [];
export const INITIAL_STAFF: StaffMember[] = [];
export const INITIAL_HOUSEKEEPING_TASKS: HousekeepingTask[] = [];

export const INITIAL_USERS: User[] = [
  {
    id: 'u0000000-0000-0000-0000-000000000001',
    auth_id: 'admin-auth-id',
    name: 'Palace Administrator',
    email: 'admin@rajmahalheritage.com',
    phone: '+91 294 288 9001',
    property_id: INITIAL_PROPERTY.id,
    role: 'owner',
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
  },
];
