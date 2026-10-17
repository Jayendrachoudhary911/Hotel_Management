-- Migration 003: Party Hall, Time Slots, and Event Leads

-- Halls Table
CREATE TABLE IF NOT EXISTS halls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    capacity INT NOT NULL DEFAULT 150,
    description TEXT NOT NULL DEFAULT '',
    photos TEXT[] NOT NULL DEFAULT '{}',
    packages JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Hall Time Slots Table
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

-- Event Leads / Enquiries Table
CREATE TABLE IF NOT EXISTS event_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hall_id UUID NOT NULL REFERENCES halls(id) ON DELETE CASCADE,
    hall_slot_id UUID REFERENCES hall_slots(id) ON DELETE SET NULL,
    contact_name TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    contact_email TEXT,
    event_type TEXT NOT NULL DEFAULT 'General Event',
    expected_guests INT NOT NULL DEFAULT 50,
    setup_needs TEXT,
    notes TEXT,
    quote_amount_minor INT, -- Quoted total price in minor units
    quote_validity TIMESTAMPTZ,
    deposit_amount_minor INT,
    status TEXT NOT NULL DEFAULT 'new' CHECK (
        status IN ('new', 'contacted', 'quoted', 'accepted', 'declined', 'cancelled')
    ),
    reference_code TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_halls_property_id ON halls(property_id);
CREATE INDEX IF NOT EXISTS idx_hall_slots_hall_date ON hall_slots(hall_id, slot_date);
CREATE INDEX IF NOT EXISTS idx_event_leads_hall_id ON event_leads(hall_id);
CREATE INDEX IF NOT EXISTS idx_event_leads_status ON event_leads(status);
CREATE INDEX IF NOT EXISTS idx_event_leads_reference_code ON event_leads(reference_code);
