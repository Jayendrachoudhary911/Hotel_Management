-- Migration 008: Users and Role Management

-- Users Table (Staff Profiles linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id UUID UNIQUE, -- linked to auth.users in Supabase
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

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_property_id ON users(property_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
