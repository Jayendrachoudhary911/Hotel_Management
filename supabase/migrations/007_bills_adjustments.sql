-- Migration 007: Bills and Adjustments (Financial Integrity)

-- Bills Table (Sequential immutable bill records)
CREATE TABLE IF NOT EXISTS bills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
    bill_number TEXT NOT NULL UNIQUE,
    outlet_id UUID NOT NULL REFERENCES outlets(id) ON DELETE RESTRICT,
    business_name TEXT NOT NULL,
    subtotal_minor INT NOT NULL,
    tax_minor INT NOT NULL DEFAULT 0,
    service_charge_minor INT NOT NULL DEFAULT 0,
    discount_minor INT NOT NULL DEFAULT 0,
    total_minor INT NOT NULL,
    payment_method TEXT NOT NULL,
    is_void BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Adjustments Table (Voids, Refunds, Discounts - NEVER delete bills/orders)
CREATE TABLE IF NOT EXISTS adjustments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bill_id UUID NOT NULL REFERENCES bills(id) ON DELETE RESTRICT,
    type TEXT NOT NULL CHECK (type IN ('void', 'refund', 'discount')),
    amount_minor INT NOT NULL,
    reason TEXT NOT NULL,
    actor_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bills_order_id ON bills(order_id);
CREATE INDEX IF NOT EXISTS idx_bills_outlet_id ON bills(outlet_id);
CREATE INDEX IF NOT EXISTS idx_bills_bill_number ON bills(bill_number);
CREATE INDEX IF NOT EXISTS idx_adjustments_bill_id ON adjustments(bill_id);
