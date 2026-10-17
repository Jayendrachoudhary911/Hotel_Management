-- Migration 002: Rooms, Room Types, Guests, Reservations, and Status History

-- Room Types Table
CREATE TABLE IF NOT EXISTS room_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    capacity INT NOT NULL DEFAULT 2,
    total_rooms INT NOT NULL DEFAULT 1,
    base_rate_minor INT NOT NULL DEFAULT 350000, -- e.g. 3500.00 in minor units
    amenities TEXT[] NOT NULL DEFAULT '{}',
    photos TEXT[] NOT NULL DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Physical Rooms Table
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

-- Guests Table
CREATE TABLE IF NOT EXISTS guests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Reservations Table
CREATE TABLE IF NOT EXISTS reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE RESTRICT,
    room_type_id UUID NOT NULL REFERENCES room_types(id) ON DELETE RESTRICT,
    room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    party_size INT NOT NULL DEFAULT 1,
    rate_snapshot_minor INT NOT NULL, -- frozen rate per night in minor units
    terms_snapshot TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'requested' CHECK (
        status IN ('requested', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'no_show')
    ),
    reference_code TEXT NOT NULL UNIQUE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT check_reservation_dates CHECK (check_out > check_in)
);

-- Reservation Status History (Audit trail for status changes)
CREATE TABLE IF NOT EXISTS reservation_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reservation_id UUID NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
    old_status TEXT,
    new_status TEXT NOT NULL,
    actor_id UUID,
    reason TEXT,
    changed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_room_types_property_id ON room_types(property_id);
CREATE INDEX IF NOT EXISTS idx_rooms_room_type_id ON rooms(room_type_id);
CREATE INDEX IF NOT EXISTS idx_reservations_property_id ON reservations(property_id);
CREATE INDEX IF NOT EXISTS idx_reservations_room_type_id ON reservations(room_type_id);
CREATE INDEX IF NOT EXISTS idx_reservations_dates ON reservations(check_in, check_out);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_reference_code ON reservations(reference_code);
CREATE INDEX IF NOT EXISTS idx_guests_phone ON guests(phone);
