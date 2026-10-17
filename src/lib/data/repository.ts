import {
  INITIAL_PROPERTY,
  INITIAL_OUTLETS,
  INITIAL_ROOM_TYPES,
  INITIAL_ROOMS,
  INITIAL_HALL,
  INITIAL_RESTAURANT_CATEGORIES,
  INITIAL_CAFE_CATEGORIES,
  INITIAL_TABLES,
  INITIAL_QR_TOKENS,
  INITIAL_ORDERS,
  INITIAL_RESERVATIONS,
  INITIAL_USERS,
} from './initial-data';
import type {
  Property,
  Outlet,
  RoomType,
  Room,
  Hall,
  MenuCategory,
  Table,
  QRToken,
  Order,
  Reservation,
  EventLead,
  User,
  AvailabilityResult,
} from '@/lib/types';

// In-memory state for development / resilient fallback
let propertyState = { ...INITIAL_PROPERTY };
let outletsState = [...INITIAL_OUTLETS];
let roomTypesState = [...INITIAL_ROOM_TYPES];
let roomsState = [...INITIAL_ROOMS];
let hallState = { ...INITIAL_HALL };
let eventLeadsState: EventLead[] = [];
let menuCategoriesState = [...INITIAL_RESTAURANT_CATEGORIES, ...INITIAL_CAFE_CATEGORIES];
let tablesState = [...INITIAL_TABLES];
let qrTokensState = [...INITIAL_QR_TOKENS];
let ordersState = [...INITIAL_ORDERS];
let reservationsState = [...INITIAL_RESERVATIONS];
let usersState = [...INITIAL_USERS];

export const dataRepository = {
  // Property
  getProperty(): Property {
    return propertyState;
  },
  updateProperty(patch: Partial<Property>): Property {
    propertyState = { ...propertyState, ...patch };
    return propertyState;
  },

  // Outlets
  getOutlets(): Outlet[] {
    return outletsState;
  },
  getOutletById(id: string): Outlet | undefined {
    return outletsState.find((o) => o.id === id);
  },
  getOutletByType(type: 'restaurant' | 'cafe'): Outlet | undefined {
    return outletsState.find((o) => o.type === type);
  },

  // Room Types & Rooms
  getRoomTypes(): RoomType[] {
    return roomTypesState.filter((rt) => rt.is_active);
  },
  getRoomTypeById(id: string): RoomType | undefined {
    return roomTypesState.find((rt) => rt.id === id);
  },
  getRooms(): Room[] {
    return roomsState.map((r) => ({
      ...r,
      room_type: roomTypesState.find((rt) => rt.id === r.room_type_id),
    }));
  },
  updateRoomHousekeeping(roomId: string, state: Room['housekeeping_state']): Room | null {
    const idx = roomsState.findIndex((r) => r.id === roomId);
    if (idx === -1) return null;
    roomsState[idx] = { ...roomsState[idx], housekeeping_state: state };
    return roomsState[idx];
  },

  // Room Availability Search
  searchAvailability(checkIn: string, checkOut: string, guests: number): AvailabilityResult[] {
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const nights = Math.max(1, Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));

    return roomTypesState
      .filter((rt) => rt.is_active && rt.capacity >= guests)
      .map((rt) => {
        // Find overlapping reservations
        const overlapping = reservationsState.filter(
          (res) =>
            res.room_type_id === rt.id &&
            !['cancelled', 'no_show', 'checked_out'].includes(res.status) &&
            new Date(res.check_in) < endDate &&
            new Date(res.check_out) > startDate
        );

        const availableCount = Math.max(0, rt.total_rooms - overlapping.length);
        return {
          roomType: rt,
          availableCount,
          nightCount: nights,
          totalPrice: rt.base_rate_minor * nights,
        };
      })
      .filter((res) => res.availableCount > 0);
  },

  // Reservations
  getReservations(): Reservation[] {
    return reservationsState;
  },
  getReservationByReference(reference: string): Reservation | undefined {
    return reservationsState.find((r) => r.reference_code.toUpperCase() === reference.toUpperCase());
  },
  createReservation(data: {
    roomTypeId: string;
    checkIn: string;
    checkOut: string;
    partySize: number;
    guestName: string;
    guestPhone: string;
    guestEmail?: string;
    notes?: string;
  }): Reservation {
    const roomType = roomTypesState.find((rt) => rt.id === data.roomTypeId);
    if (!roomType) throw new Error('Room type not found');

    const startDate = new Date(data.checkIn);
    const endDate = new Date(data.checkOut);
    const nights = Math.max(1, Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
    const reference = `RES-AUR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newRes: Reservation = {
      id: `res-${Date.now()}`,
      property_id: propertyState.id,
      guest_id: `g-${Date.now()}`,
      room_type_id: roomType.id,
      room_id: null,
      check_in: data.checkIn,
      check_out: data.checkOut,
      party_size: data.partySize,
      rate_snapshot_minor: roomType.base_rate_minor * nights,
      terms_snapshot: propertyState.cancellation_terms,
      status: 'confirmed',
      reference_code: reference,
      notes: data.notes || null,
      created_at: new Date().toISOString(),
      guest: {
        id: `g-${Date.now()}`,
        name: data.guestName,
        phone: data.guestPhone,
        email: data.guestEmail || null,
        created_at: new Date().toISOString(),
      },
      room_type: roomType,
    };

    reservationsState.unshift(newRes);
    return newRes;
  },
  updateReservationStatus(id: string, status: Reservation['status'], roomId?: string): Reservation | null {
    const idx = reservationsState.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    reservationsState[idx] = {
      ...reservationsState[idx],
      status,
      room_id: roomId ?? reservationsState[idx].room_id,
    };
    return reservationsState[idx];
  },

  // Hall & Event Leads
  getHall(): Hall {
    return hallState;
  },
  getEventLeads(): EventLead[] {
    return eventLeadsState;
  },
  createEventLead(data: {
    contactName: string;
    contactPhone: string;
    contactEmail?: string;
    eventType: string;
    expectedGuests: number;
    seatingLayout?: string;
    setupNeeds?: string;
    notes?: string;
  }): EventLead {
    const reference = `EVT-AUR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newLead: EventLead = {
      id: `evt-${Date.now()}`,
      hall_id: hallState.id,
      hall_slot_id: 'slot-1',
      contact_name: data.contactName,
      contact_phone: data.contactPhone,
      contact_email: data.contactEmail || null,
      event_type: data.eventType,
      expected_guests: data.expectedGuests,
      seating_layout: data.seatingLayout || null,
      setup_needs: data.setupNeeds || null,
      notes: data.notes || null,
      quote_amount_minor: null,
      quote_validity: null,
      deposit_amount_minor: null,
      status: 'new',
      reference_code: reference,
      created_at: new Date().toISOString(),
      hall: hallState,
    };
    eventLeadsState.unshift(newLead);
    return newLead;
  },

  // Menus
  getMenuCategories(outletId?: string): MenuCategory[] {
    if (!outletId) return menuCategoriesState;
    return menuCategoriesState.filter((c) => c.outlet_id === outletId);
  },
  getMenuItemById(itemId: string) {
    for (const cat of menuCategoriesState) {
      const found = cat.items?.find((i) => i.id === itemId);
      if (found) return found;
    }
    return null;
  },
  toggleItemAvailability(itemId: string): boolean {
    for (const cat of menuCategoriesState) {
      const item = cat.items?.find((i) => i.id === itemId);
      if (item) {
        item.is_available = !item.is_available;
        return item.is_available;
      }
    }
    return false;
  },

  // QR & Tables
  resolveQRToken(token: string): { table: Table; outlet: Outlet } | null {
    const qr = qrTokensState.find((q) => q.token === token && q.is_active);
    if (!qr) return null;
    const table = tablesState.find((t) => t.id === qr.table_id);
    if (!table) return null;
    const outlet = outletsState.find((o) => o.id === table.outlet_id);
    if (!outlet) return null;
    return { table, outlet };
  },
  getTables(outletId?: string): Table[] {
    if (!outletId) return tablesState;
    return tablesState.filter((t) => t.outlet_id === outletId);
  },
  getQRTokens(): QRToken[] {
    return qrTokensState;
  },

  // Orders
  getOrders(outletId?: string): Order[] {
    if (!outletId) return ordersState;
    return ordersState.filter((o) => o.outlet_id === outletId);
  },
  getOrderByNumber(orderNumber: string): Order | undefined {
    return ordersState.find((o) => o.order_number.toUpperCase() === orderNumber.toUpperCase());
  },
  createOrder(order: Omit<Order, 'id' | 'order_number' | 'created_at'>): Order {
    const orderNumber = `ORD-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-${Math.floor(100 + Math.random() * 900)}`;
    const newOrder: Order = {
      ...order,
      id: `ord-${Date.now()}`,
      order_number: orderNumber,
      created_at: new Date().toISOString(),
    };
    ordersState.unshift(newOrder);
    return newOrder;
  },
  updateOrderStatus(orderId: string, status: Order['status'], reason?: string): Order | null {
    const idx = ordersState.findIndex((o) => o.id === orderId);
    if (idx === -1) return null;
    ordersState[idx] = {
      ...ordersState[idx],
      status,
      cancel_reason: reason || ordersState[idx].cancel_reason,
    };
    return ordersState[idx];
  },

  // Staff Users
  getUsers(): User[] {
    return usersState;
  },
};
