import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/services/supabase-helper';

export interface AuditRecord {
  id: string;
  actor_name: string;
  actor_role: string;
  action_type: 'PRICE_CHANGE' | 'VOID_ORDER' | 'REFUND_ISSUED' | 'DISCOUNT_APPLIED' | 'ROLE_PROMOTED';
  entity_type: string;
  entity_id: string;
  details: string;
  ip_address: string;
  created_at: string;
}

const LOCAL_AUDIT_LOGS: AuditRecord[] = [
  {
    id: 'aud-1',
    actor_name: 'Bhawani Singh',
    actor_role: 'Duty Manager',
    action_type: 'PRICE_CHANGE',
    entity_type: 'MenuItem',
    entity_id: 'item-laal-maas',
    details: 'Base rate updated from ₹580 to ₹620 for Royal Khansama Dining.',
    ip_address: '192.168.1.104',
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'aud-2',
    actor_name: 'Vikramaditya Rathore',
    actor_role: 'Administrator',
    action_type: 'DISCOUNT_APPLIED',
    entity_type: 'Order',
    entity_id: 'ord-8472',
    details: '15% Royal Privilege VIP discount applied on Table #4 bill.',
    ip_address: '192.168.1.101',
    created_at: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'aud-3',
    actor_name: 'Kavita Joshi',
    actor_role: 'Cashier / POS',
    action_type: 'VOID_ORDER',
    entity_type: 'OrderLine',
    entity_id: 'line-394',
    details: 'Voided extra Butter Naan entered by server error prior to KDS bump.',
    ip_address: '192.168.1.112',
    created_at: new Date(Date.now() - 14400000).toISOString(),
  },
];

let localAudits = [...LOCAL_AUDIT_LOGS];

export async function GET() {
  try {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('audit_events')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return NextResponse.json({ success: true, events: data });
    }
    return NextResponse.json({ success: true, events: localAudits });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { actor_name, actor_role, action_type, entity_type, entity_id, details } = body;

    const newEvent: AuditRecord = {
      id: `aud-${Date.now()}`,
      actor_name: actor_name || 'Staff User',
      actor_role: actor_role || 'Staff',
      action_type: action_type || 'DISCOUNT_APPLIED',
      entity_type: entity_type || 'General',
      entity_id: entity_id || 'sys',
      details: details || 'Administrative adjustment',
      ip_address: '127.0.0.1',
      created_at: new Date().toISOString(),
    };

    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.from('audit_events').insert({
        actor_name: newEvent.actor_name,
        actor_role: newEvent.actor_role,
        action_type: newEvent.action_type,
        entity_type: newEvent.entity_type,
        entity_id: newEvent.entity_id,
        details: newEvent.details,
        ip_address: newEvent.ip_address,
      });
    }

    localAudits = [newEvent, ...localAudits];
    return NextResponse.json({ success: true, event: newEvent }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
