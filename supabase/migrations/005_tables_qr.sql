-- Migration 005: Tables and QR Tokens

-- Tables Table
CREATE TABLE IF NOT EXISTS tables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    outlet_id UUID NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
    table_number TEXT NOT NULL,
    capacity INT NOT NULL DEFAULT 4,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(outlet_id, table_number)
);

-- QR Tokens Table
CREATE TABLE IF NOT EXISTS qr_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_id UUID NOT NULL REFERENCES tables(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE, -- opaque random token (e.g. nanoid or uuid)
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tables_outlet_id ON tables(outlet_id);
CREATE INDEX IF NOT EXISTS idx_qr_tokens_table_id ON qr_tokens(table_id);
CREATE INDEX IF NOT EXISTS idx_qr_tokens_token ON qr_tokens(token);
