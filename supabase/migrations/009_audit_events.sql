-- Migration 009: Audit Events (Compliance & Tracking)

CREATE TABLE IF NOT EXISTS audit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action TEXT NOT NULL, -- e.g., 'price_change', 'status_override', 'void_bill', 'refund_issued', 'role_changed'
    entity_type TEXT NOT NULL, -- e.g., 'order', 'reservation', 'bill', 'menu_item', 'user'
    entity_id UUID NOT NULL,
    old_values JSONB,
    new_values JSONB,
    reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_events_entity ON audit_events(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_actor ON audit_events(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_created_at ON audit_events(created_at);
