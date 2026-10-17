-- Migration 001: Properties, Outlets, and Delivery Areas
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Properties Table
CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    currency_code TEXT NOT NULL DEFAULT 'INR',
    timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    operating_hours JSONB NOT NULL DEFAULT '{"mon": {"open": "07:00", "close": "23:00"}}'::jsonb,
    booking_policy TEXT NOT NULL DEFAULT 'Standard check-in 2:00 PM, check-out 11:00 AM.',
    cancellation_terms TEXT NOT NULL DEFAULT 'Free cancellation up to 48 hours prior to check-in.',
    deposit_percent INT NOT NULL DEFAULT 20,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Outlets Table (Restaurant, Cafe)
CREATE TABLE IF NOT EXISTS outlets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('restaurant', 'cafe')),
    operating_hours JSONB NOT NULL DEFAULT '{"mon": {"open": "08:00", "close": "22:30"}}'::jsonb,
    dine_in_enabled BOOLEAN NOT NULL DEFAULT true,
    pickup_enabled BOOLEAN NOT NULL DEFAULT true,
    delivery_enabled BOOLEAN NOT NULL DEFAULT true,
    pickup_lead_minutes INT NOT NULL DEFAULT 20,
    delivery_lead_minutes INT NOT NULL DEFAULT 40,
    delivery_fee_minor INT NOT NULL DEFAULT 4000, -- 40.00 in minor units (e.g. INR paise)
    min_delivery_order_minor INT NOT NULL DEFAULT 20000, -- 200.00
    delivery_estimate TEXT NOT NULL DEFAULT '30-45 mins',
    is_paused BOOLEAN NOT NULL DEFAULT false,
    tax_rate_bps INT NOT NULL DEFAULT 500, -- 500 basis points = 5% GST
    service_charge_bps INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Delivery Areas Table
CREATE TABLE IF NOT EXISTS delivery_areas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    outlet_id UUID NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
    area_name TEXT NOT NULL,
    area_polygon TEXT NOT NULL DEFAULT '',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_outlets_property_id ON outlets(property_id);
CREATE INDEX IF NOT EXISTS idx_delivery_areas_outlet_id ON delivery_areas(outlet_id);
