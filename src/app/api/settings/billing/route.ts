import { NextResponse } from 'next/server';
import { billingService } from '@/lib/services/billing-service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await billingService.getBillingSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    await billingService.updateBillingSettings(body);
    const updated = await billingService.getBillingSettings();
    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
