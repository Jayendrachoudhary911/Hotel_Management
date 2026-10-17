-- Migration 006: Orders, Order Lines, and Payments

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    outlet_id UUID NOT NULL REFERENCES outlets(id) ON DELETE RESTRICT,
    table_id UUID REFERENCES tables(id) ON DELETE SET NULL,
    order_number TEXT NOT NULL UNIQUE,
    channel TEXT NOT NULL CHECK (channel IN ('qr', 'pos', 'web')),
    fulfilment_mode TEXT NOT NULL CHECK (fulfilment_mode IN ('dine_in', 'pickup', 'delivery')),
    pickup_name TEXT,
    pickup_phone TEXT,
    delivery_name TEXT,
    delivery_phone TEXT,
    delivery_address TEXT,
    delivery_notes TEXT,
    delivery_fee_minor INT NOT NULL DEFAULT 0,
    subtotal_minor INT NOT NULL DEFAULT 0,
    tax_minor INT NOT NULL DEFAULT 0,
    service_charge_minor INT NOT NULL DEFAULT 0,
    discount_minor INT NOT NULL DEFAULT 0,
    total_minor INT NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'new' CHECK (
        status IN ('new', 'accepted', 'preparing', 'ready', 'served', 'out_for_delivery', 'delivered', 'collected', 'cancelled')
    ),
    cancel_reason TEXT,
    created_by UUID, -- staff user id if placed via POS
    assigned_delivery_staff UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Order Lines Table (with price & modifier snapshots)
CREATE TABLE IF NOT EXISTS order_lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE RESTRICT,
    item_name_snapshot TEXT NOT NULL,
    unit_price_snapshot_minor INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    notes TEXT,
    modifiers_snapshot JSONB, -- Array of { name: string, price_minor: number }
    line_total_minor INT NOT NULL,
    CONSTRAINT check_quantity_positive CHECK (quantity > 0)
);

-- Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
    tender_type TEXT NOT NULL CHECK (tender_type IN ('cash', 'upi', 'card', 'gateway')),
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (
        payment_status IN ('pending', 'completed', 'failed', 'refunded')
    ),
    amount_minor INT NOT NULL,
    gateway_reference TEXT,
    recorded_by UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_outlet_id ON orders(outlet_id);
CREATE INDEX IF NOT EXISTS idx_orders_table_id ON orders(table_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_order_lines_order_id ON order_lines(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
