import { z } from 'zod';
import {
  RESERVATION_STATUSES,
  HOUSEKEEPING_STATES,
  HALL_ENQUIRY_STATUSES,
  ORDER_STATUSES,
  FULFILMENT_MODES,
  ORDER_CHANNELS,
  OUTLET_TYPES,
  TENDER_TYPES,
  PAYMENT_STATUSES,
  USER_ROLES,
} from './constants';

// ── Shared Validators ──
export const phoneSchema = z.string().min(10, 'Phone number must be at least 10 digits').max(15);
export const emailSchema = z.string().email('Invalid email address');
export const nameSchema = z.string().min(1, 'Name is required').max(200);
export const positiveIntSchema = z.number().int().positive();
export const nonNegativeIntSchema = z.number().int().nonnegative();

// ── Guest Contact ──
export const guestContactSchema = z.object({
  name: nameSchema,
  phone: phoneSchema,
  email: emailSchema.optional().or(z.literal('')),
});

// ── Room Booking ──
export const roomBookingSchema = z.object({
  checkIn: z.string().min(1, 'Check-in date is required'),
  checkOut: z.string().min(1, 'Check-out date is required'),
  guestCount: z.number().int().min(1, 'At least 1 guest required'),
  roomTypeId: z.string().uuid('Invalid room type'),
  guestName: nameSchema,
  guestPhone: phoneSchema,
  guestEmail: emailSchema.optional().or(z.literal('')),
  notes: z.string().max(500).optional(),
  termsAccepted: z.literal(true, {
    message: 'You must accept the terms and conditions',
  }),
}).refine(
  (data) => new Date(data.checkOut) > new Date(data.checkIn),
  { message: 'Check-out must be after check-in', path: ['checkOut'] }
);

export type RoomBookingInput = z.infer<typeof roomBookingSchema>;

// ── Availability Search ──
export const availabilitySearchSchema = z.object({
  checkIn: z.string().min(1, 'Check-in date is required'),
  checkOut: z.string().min(1, 'Check-out date is required'),
  guests: z.number().int().min(1).max(20),
}).refine(
  (data) => new Date(data.checkOut) > new Date(data.checkIn),
  { message: 'Check-out must be after check-in', path: ['checkOut'] }
);

// ── Hall Enquiry ──
export const hallEnquirySchema = z.object({
  hallId: z.string().uuid(),
  preferredDate: z.string().min(1, 'Date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  eventType: z.string().min(1, 'Event type is required'),
  expectedGuests: z.number().int().min(1, 'At least 1 guest required'),
  contactName: nameSchema,
  contactPhone: phoneSchema,
  contactEmail: emailSchema.optional().or(z.literal('')),
  setupNeeds: z.string().max(500).optional(),
  notes: z.string().max(1000).optional(),
});

export type HallEnquiryInput = z.infer<typeof hallEnquirySchema>;

// ── Menu Item ──
export const menuItemSchema = z.object({
  categoryId: z.string().uuid(),
  name: z.string().min(1, 'Item name is required').max(200),
  description: z.string().max(500).optional(),
  priceMinor: positiveIntSchema,
  imageUrl: z.string().url().optional().or(z.literal('')),
  isAvailable: z.boolean().default(true),
  dietaryLabels: z.array(z.string()).optional(),
  sortOrder: nonNegativeIntSchema.optional(),
});

export type MenuItemInput = z.infer<typeof menuItemSchema>;

// ── Order (QR / Web) ──
export const orderItemSchema = z.object({
  menuItemId: z.string().uuid(),
  quantity: z.number().int().min(1).max(99),
  notes: z.string().max(300).optional(),
  modifiers: z.array(z.object({
    modifierId: z.string().uuid(),
    name: z.string(),
    priceMinor: nonNegativeIntSchema,
  })).optional(),
});

export const dineInOrderSchema = z.object({
  outletId: z.string().uuid(),
  qrToken: z.string().min(1),
  items: z.array(orderItemSchema).min(1, 'At least one item is required'),
});

export const pickupOrderSchema = z.object({
  outletId: z.string().uuid(),
  pickupName: nameSchema,
  pickupPhone: phoneSchema,
  items: z.array(orderItemSchema).min(1, 'At least one item is required'),
});

export const deliveryOrderSchema = z.object({
  outletId: z.string().uuid(),
  deliveryName: nameSchema,
  deliveryPhone: phoneSchema,
  deliveryAddress: z.string().min(5, 'Full address is required').max(500),
  deliveryNotes: z.string().max(300).optional(),
  items: z.array(orderItemSchema).min(1, 'At least one item is required'),
});

export type DineInOrderInput = z.infer<typeof dineInOrderSchema>;
export type PickupOrderInput = z.infer<typeof pickupOrderSchema>;
export type DeliveryOrderInput = z.infer<typeof deliveryOrderSchema>;

// ── POS Order ──
export const posOrderSchema = z.object({
  outletId: z.string().uuid(),
  fulfilmentMode: z.enum(['dine_in', 'pickup', 'delivery']),
  tableId: z.string().uuid().optional(),
  pickupName: z.string().optional(),
  pickupPhone: z.string().optional(),
  deliveryName: z.string().optional(),
  deliveryPhone: z.string().optional(),
  deliveryAddress: z.string().optional(),
  deliveryNotes: z.string().optional(),
  items: z.array(orderItemSchema).min(1),
  tenderType: z.enum(['cash', 'upi', 'card', 'gateway']),
  discountMinor: nonNegativeIntSchema.optional(),
  discountReason: z.string().optional(),
});

export type PosOrderInput = z.infer<typeof posOrderSchema>;

// ── Payment Recording ──
export const paymentSchema = z.object({
  orderId: z.string().uuid(),
  tenderType: z.enum(['cash', 'upi', 'card', 'gateway']),
  amountMinor: positiveIntSchema,
  gatewayReference: z.string().optional(),
});

// ── User Management ──
export const userSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema.optional(),
  role: z.enum(['admin', 'manager', 'front_desk', 'cashier', 'kitchen', 'housekeeping', 'delivery']),
});

export type UserInput = z.infer<typeof userSchema>;

// ── Login ──
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginInput = z.infer<typeof loginSchema>;
