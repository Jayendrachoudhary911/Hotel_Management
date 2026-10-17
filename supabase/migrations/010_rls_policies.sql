-- Migration 010: Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE outlets ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservation_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE halls ENABLE ROW LEVEL SECURITY;
ALTER TABLE hall_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE modifiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE adjustments ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;

-- 1. Public Read Policies (for landing page, menus, room views, qr scans)
CREATE POLICY "Public can view active properties" ON properties
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view outlets" ON outlets
    FOR SELECT USING (true);

CREATE POLICY "Public can view active delivery areas" ON delivery_areas
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active room types" ON room_types
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active halls" ON halls
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view hall slots" ON hall_slots
    FOR SELECT USING (true);

CREATE POLICY "Public can view active menu categories" ON menu_categories
    FOR SELECT USING (is_available = true);

CREATE POLICY "Public can view active menu items" ON menu_items
    FOR SELECT USING (is_available = true);

CREATE POLICY "Public can view active modifiers" ON modifiers
    FOR SELECT USING (is_available = true);

CREATE POLICY "Public can validate QR tokens" ON qr_tokens
    FOR SELECT USING (is_active = true);

-- 2. Public / Guest Submission Policies
CREATE POLICY "Guests can create event leads" ON event_leads
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Guests can view their own event leads by reference" ON event_leads
    FOR SELECT USING (true);

CREATE POLICY "Guests can create reservations" ON reservations
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Guests can view their own reservation by reference" ON reservations
    FOR SELECT USING (true);

CREATE POLICY "Guests can create orders" ON orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Guests can view order status by order number" ON orders
    FOR SELECT USING (true);

CREATE POLICY "Guests can insert order lines for their order" ON order_lines
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Guests can view order lines for visible orders" ON order_lines
    FOR SELECT USING (true);

-- 3. Staff & Authenticated Access
-- Helper function to get current user role
CREATE OR REPLACE FUNCTION get_auth_user_role()
RETURNS TEXT AS $$
    SELECT role FROM users WHERE auth_id = auth.uid() AND is_active = true LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Staff full access policies for authenticated users
CREATE POLICY "Staff can view and manage all tables if authenticated" ON tables
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Staff can manage properties" ON properties
    FOR ALL TO authenticated USING (get_auth_user_role() IN ('admin', 'manager'));

CREATE POLICY "Staff can manage outlets" ON outlets
    FOR ALL TO authenticated USING (get_auth_user_role() IN ('admin', 'manager'));

CREATE POLICY "Staff can manage room types and rooms" ON room_types
    FOR ALL TO authenticated USING (get_auth_user_role() IN ('admin', 'manager', 'front_desk'));

CREATE POLICY "Staff can manage physical rooms" ON rooms
    FOR ALL TO authenticated USING (get_auth_user_role() IN ('admin', 'manager', 'front_desk', 'housekeeping'));

CREATE POLICY "Staff can manage reservations" ON reservations
    FOR ALL TO authenticated USING (get_auth_user_role() IN ('admin', 'manager', 'front_desk'));

CREATE POLICY "Staff can view and manage orders" ON orders
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Staff can view and manage bills" ON bills
    FOR ALL TO authenticated USING (get_auth_user_role() IN ('admin', 'manager', 'cashier'));

CREATE POLICY "Staff can view and insert adjustments" ON adjustments
    FOR ALL TO authenticated USING (get_auth_user_role() IN ('admin', 'manager'));

CREATE POLICY "Staff can view audit events" ON audit_events
    FOR SELECT TO authenticated USING (get_auth_user_role() IN ('admin', 'manager'));

CREATE POLICY "Staff can insert audit events" ON audit_events
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Staff can view user profiles" ON users
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admin can manage user profiles" ON users
    FOR ALL TO authenticated USING (get_auth_user_role() = 'admin');
