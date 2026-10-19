import { NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/services/supabase-helper';
import { dataRepository } from '@/lib/data/repository';

export async function GET() {
  try {
    const supabase = getSupabaseClient();
    if (supabase) {
      const [propRes, outRes, tblRes] = await Promise.all([
        supabase.from('properties').select('*').limit(1).maybeSingle(),
        supabase.from('outlets').select('*'),
        supabase.from('tables').select('*'),
      ]);

      const property = propRes.data || dataRepository.getProperty();
      const outlets = outRes.data?.length ? outRes.data : dataRepository.getOutlets();
      const tables = tblRes.data?.length ? tblRes.data : [];

      return NextResponse.json({
        success: true,
        property,
        outlets,
        tables,
      });
    }

    return NextResponse.json({
      success: true,
      property: dataRepository.getProperty(),
      outlets: dataRepository.getOutlets(),
      tables: [],
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { property, outlet } = body;
    const supabase = getSupabaseClient();

    if (property) {
      if (supabase) {
        // Update in Supabase
        const { error } = await supabase
          .from('properties')
          .update({
            name: property.name,
            address: property.address,
            phone: property.phone,
            email: property.email,
            booking_policy: property.booking_policy,
            cancellation_terms: property.cancellation_terms,
            deposit_percent: property.deposit_percent,
            timezone: property.timezone,
            updated_at: new Date().toISOString(),
          })
          .eq('id', property.id);

        if (error) {
          // If ID didn't match, update first property record
          await supabase
            .from('properties')
            .update({
              name: property.name,
              address: property.address,
              phone: property.phone,
              email: property.email,
              booking_policy: property.booking_policy,
              cancellation_terms: property.cancellation_terms,
              deposit_percent: property.deposit_percent,
              timezone: property.timezone,
              updated_at: new Date().toISOString(),
            })
            .neq('id', '00000000-0000-0000-0000-000000000000');
        }
      }
      dataRepository.updateProperty(property);
    }

    if (outlet && outlet.id) {
      if (supabase) {
        await supabase
          .from('outlets')
          .update({
            name: outlet.name,
            is_paused: outlet.is_paused,
            dine_in_enabled: outlet.dine_in_enabled,
            pickup_enabled: outlet.pickup_enabled,
            delivery_enabled: outlet.delivery_enabled,
            delivery_fee_minor: outlet.delivery_fee_minor,
            min_delivery_order_minor: outlet.min_delivery_order_minor,
            pickup_lead_minutes: outlet.pickup_lead_minutes,
            delivery_lead_minutes: outlet.delivery_lead_minutes,
            tax_rate_bps: outlet.tax_rate_bps,
            service_charge_bps: outlet.service_charge_bps,
            updated_at: new Date().toISOString(),
          })
          .eq('id', outlet.id);
      }
      dataRepository.updateOutlet(outlet.id, outlet);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
