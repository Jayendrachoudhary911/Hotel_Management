import { NextResponse } from 'next/server';
import { ordersService } from '@/lib/services/orders-service';
import { reservationsService } from '@/lib/services/reservations-service';

export async function GET() {
  try {
    const [orders, reservations] = await Promise.all([
      ordersService.getOrders(),
      reservationsService.getReservations(),
    ]);

    // Financial KPIs
    const totalFoodTurnover = orders.reduce((sum, o) => sum + (o.total_minor || 0), 0);
    const totalRoomTurnover = reservations.reduce((sum, r) => sum + (r.rate_snapshot_minor || 0), 0);
    const totalGrossTurnover = totalFoodTurnover + totalRoomTurnover;

    // Tender Settlement Distribution
    const cashTotal = orders.filter((o) => o.channel === 'pos').reduce((sum, o) => sum + o.total_minor, 0);
    const upiTotal = orders.filter((o) => o.channel === 'qr' || o.fulfilment_mode === 'delivery').reduce((sum, o) => sum + o.total_minor, 0);
    const cardTotal = Math.max(0, totalGrossTurnover - cashTotal - upiTotal);

    // Channel breakdown
    const qrCount = orders.filter((o) => o.fulfilment_mode === 'dine_in').length;
    const pickupCount = orders.filter((o) => o.fulfilment_mode === 'pickup').length;
    const deliveryCount = orders.filter((o) => o.fulfilment_mode === 'delivery').length;
    const posCount = orders.filter((o) => o.channel === 'pos').length;

    return NextResponse.json({
      success: true,
      kpis: {
        totalGrossTurnoverMinor: totalGrossTurnover,
        foodTurnoverMinor: totalFoodTurnover,
        roomTurnoverMinor: totalRoomTurnover,
        totalOrdersCount: orders.length,
        totalReservationsCount: reservations.length,
        adrMinor: reservations.length > 0 ? Math.round(totalRoomTurnover / reservations.length) : 0,
        settlement: {
          upiMinor: upiTotal,
          cashMinor: cashTotal,
          cardMinor: cardTotal,
        },
        channelBreakdown: {
          qr: qrCount,
          pickup: pickupCount,
          delivery: deliveryCount,
          pos: posCount,
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
