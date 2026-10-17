import Link from 'next/link';
import { dataRepository } from '@/lib/data/repository';
import { formatMoney } from '@/lib/utils/money';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BedDouble,
  Users,
  ChefHat,
  Receipt,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export default function DashboardOverviewPage() {
  const reservations = dataRepository.getReservations();
  const orders = dataRepository.getOrders();
  const rooms = dataRepository.getRooms();
  const leads = dataRepository.getEventLeads();

  // Metrics
  const activeReservations = reservations.filter((r) =>
    ['confirmed', 'checked_in'].includes(r.status)
  );
  const occupiedRooms = rooms.filter((r) => r.housekeeping_state === 'occupied').length;
  const dirtyRooms = rooms.filter((r) => r.housekeeping_state === 'dirty').length;
  const activeKitchenOrders = orders.filter((o) =>
    ['new', 'accepted', 'preparing'].includes(o.status)
  );
  const totalSalesMinor = orders.reduce((sum, o) => sum + o.total_minor, 0);

  return (
    <div className="space-y-8">
      {/* Top Welcome & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-[#670E10] text-white text-[11px] font-bold border border-[#B08D57]/40">
              General Operations
            </span>
            <span className="text-xs text-[#B08D57] font-semibold">Live System Status</span>
          </div>
          <h1 className="font-heritage text-2xl sm:text-3xl font-bold text-[#FAF8F3]">
            Palace Operations & Live Metrics
          </h1>
          <p className="text-xs text-[#9A8E7F] mt-1">
            Real-time status across rooms, dining outlets, and event banquets
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link href="/dashboard/pos">
            <Button size="sm" variant="primary">
              <Receipt className="w-4 h-4 mr-1.5" /> Launch POS Terminal
            </Button>
          </Link>
          <Link href="/dashboard/kitchen">
            <Button size="sm" variant="secondary">
              <ChefHat className="w-4 h-4 mr-1.5" /> Kitchen KDS &rarr;
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-[#241F1A] border border-[#3D352C] shadow-sm">
          <div className="flex items-center justify-between text-[#B08D57] text-xs mb-3">
            <span className="font-bold uppercase tracking-wider">Active Bookings</span>
            <BedDouble className="w-4 h-4 text-[#B08D57]" />
          </div>
          <div className="font-heritage text-3xl font-bold text-[#FAF8F3] mb-1">{activeReservations.length}</div>
          <div className="text-xs text-[#9A8E7F] flex items-center">
            <span className="text-[#2D6A4F] font-bold mr-1">{occupiedRooms} Rooms</span>{' '}
            Currently Occupied
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#241F1A] border border-[#3D352C] shadow-sm">
          <div className="flex items-center justify-between text-[#B08D57] text-xs mb-3">
            <span className="font-bold uppercase tracking-wider">Kitchen Queue</span>
            <ChefHat className="w-4 h-4 text-[#B08D57]" />
          </div>
          <div className="font-heritage text-3xl font-bold text-[#FAF8F3] mb-1">{activeKitchenOrders.length}</div>
          <div className="text-xs text-[#9A8E7F]">
            {orders.length} total orders recorded today
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#241F1A] border border-[#3D352C] shadow-sm">
          <div className="flex items-center justify-between text-[#B08D57] text-xs mb-3">
            <span className="font-bold uppercase tracking-wider">Housekeeping Alerts</span>
            <AlertCircle className="w-4 h-4 text-[#9B2226]" />
          </div>
          <div className="font-heritage text-3xl font-bold text-[#FAF8F3] mb-1">{dirtyRooms}</div>
          <div className="text-xs text-[#9A8E7F]">
            Rooms awaiting cleaning turnover
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#241F1A] border border-[#3D352C] shadow-sm">
          <div className="flex items-center justify-between text-[#B08D57] text-xs mb-3">
            <span className="font-bold uppercase tracking-wider">Day F&amp;B Turnover</span>
            <TrendingUp className="w-4 h-4 text-[#2D6A4F]" />
          </div>
          <div className="font-heritage text-3xl font-bold text-[#C9A96E] mb-1">
            {formatMoney(totalSalesMinor)}
          </div>
          <div className="text-xs text-[#9A8E7F]">Reconciled integer accounting</div>
        </div>
      </div>

      {/* Two Column Section: Live Reservations & Live Kitchen Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Reservations */}
        <div className="p-6 rounded-2xl bg-[#241F1A] border border-[#3D352C] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#3D352C]">
            <h2 className="font-heritage text-lg font-bold text-[#FAF8F3]">Guest Arrivals & Stays</h2>
            <Link
              href="/dashboard/reservations"
              className="text-xs font-bold text-[#B08D57] hover:text-[#C9A96E]"
            >
              View All &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {reservations.slice(0, 4).map((res) => (
              <div
                key={res.id}
                className="p-3.5 rounded-xl bg-[#2A2420] border border-[#3D352C] flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-sm text-[#FAF8F3]">
                      {res.guest?.name || 'Guest'}
                    </span>
                    <Badge
                      size="sm"
                      variant={
                        res.status === 'checked_in'
                          ? 'emerald'
                          : res.status === 'confirmed'
                          ? 'gold'
                          : 'slate'
                      }
                    >
                      {res.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <span className="text-xs text-[#9A8E7F] block mt-0.5">
                    {res.room_type?.name} &bull; Check-in: {res.check_in}
                  </span>
                </div>

                <div className="text-right">
                  <span className="font-mono text-xs font-bold text-[#C9A96E] block">
                    {formatMoney(res.rate_snapshot_minor)}
                  </span>
                  <span className="text-[10px] text-[#9A8E7F] font-mono">
                    {res.reference_code}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Kitchen & Orders */}
        <div className="p-6 rounded-2xl bg-[#241F1A] border border-[#3D352C] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#3D352C]">
            <h2 className="font-heritage text-lg font-bold text-[#FAF8F3]">Active Food Orders</h2>
            <Link
              href="/dashboard/kitchen"
              className="text-xs font-bold text-[#B08D57] hover:text-[#C9A96E]"
            >
              Open Kitchen KDS &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {orders.slice(0, 4).map((order) => (
              <div
                key={order.id}
                className="p-3.5 rounded-xl bg-[#2A2420] border border-[#3D352C] flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-[#FAF8F3]">
                      #{order.order_number}
                    </span>
                    <Badge
                      size="sm"
                      variant={
                        order.status === 'preparing'
                          ? 'amber'
                          : order.status === 'ready'
                          ? 'emerald'
                          : 'slate'
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                  <span className="text-xs text-[#9A8E7F] block mt-0.5">
                    {order.fulfilment_mode.replace('_', ' ')} &bull;{' '}
                    {order.order_lines?.length || 0} Items
                  </span>
                </div>

                <div className="text-right">
                  <span className="font-heritage text-xs font-bold text-[#C9A96E]">
                    {formatMoney(order.total_minor)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
