import { getSupabaseClient } from './supabase-helper';
import { dataRepository } from '@/lib/data/repository';
import type { Order, OrderStatus, OrderLine } from '@/lib/types';

export const ordersService = {
  async getOrders(outletId?: string): Promise<Order[]> {
    const supabase = getSupabaseClient();
    if (supabase) {
      let query = supabase
        .from('orders')
        .select('*, order_lines(*), tables(*), payments(*)')
        .order('created_at', { ascending: false });

      if (outletId) {
        query = query.eq('outlet_id', outletId);
      }

      const { data, error } = await query;
      if (!error && data) return data as Order[];
    }
    return dataRepository.getOrders(outletId);
  },

  async getOrderById(orderId: string): Promise<Order | undefined> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_lines(*), tables(*), payments(*)')
        .or(`id.eq.${orderId},order_number.eq.${orderId}`)
        .maybeSingle();
      if (!error && data) return data as Order;
    }
    return dataRepository.getOrderByNumber(orderId) || dataRepository.getOrders().find((o) => o.id === orderId || o.order_number === orderId);
  },

  async createOrder(data: {
    outlet_id: string;
    table_id: string | null;
    channel: Order['channel'];
    fulfilment_mode: Order['fulfilment_mode'];
    pickup_name: string | null;
    pickup_phone: string | null;
    delivery_name: string | null;
    delivery_phone: string | null;
    delivery_address: string | null;
    delivery_notes: string | null;
    delivery_fee_minor: number;
    subtotal_minor: number;
    tax_minor: number;
    service_charge_minor: number;
    discount_minor: number;
    total_minor: number;
    order_lines: Array<{
      menu_item_id: string;
      item_name_snapshot: string;
      unit_price_snapshot_minor: number;
      quantity: number;
      notes: string | null;
      modifiers_snapshot: any[] | null;
      line_total_minor: number;
    }>;
  }): Promise<Order> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const orderNumber = `ORD-AUR-${Date.now().toString().slice(-6)}`;
      const { data: newOrder, error: orderErr } = await supabase
        .from('orders')
        .insert({
          outlet_id: data.outlet_id,
          table_id: data.table_id,
          order_number: orderNumber,
          channel: data.channel,
          fulfilment_mode: data.fulfilment_mode,
          pickup_name: data.pickup_name,
          pickup_phone: data.pickup_phone,
          delivery_name: data.delivery_name,
          delivery_phone: data.delivery_phone,
          delivery_address: data.delivery_address,
          delivery_notes: data.delivery_notes,
          delivery_fee_minor: data.delivery_fee_minor,
          subtotal_minor: data.subtotal_minor,
          tax_minor: data.tax_minor,
          service_charge_minor: data.service_charge_minor,
          discount_minor: data.discount_minor,
          total_minor: data.total_minor,
          status: 'new',
        })
        .select('*')
        .single();

      if (!orderErr && newOrder) {
        // Insert order lines
        const linesToInsert = data.order_lines.map((l) => ({
          order_id: newOrder.id,
          menu_item_id: l.menu_item_id,
          item_name_snapshot: l.item_name_snapshot,
          unit_price_snapshot_minor: l.unit_price_snapshot_minor,
          quantity: l.quantity,
          notes: l.notes,
          modifiers_snapshot: l.modifiers_snapshot || [],
          line_total_minor: l.line_total_minor,
        }));

        await supabase.from('order_lines').insert(linesToInsert);

        const { data: fullOrder } = await supabase
          .from('orders')
          .select('*, order_lines(*), tables(*)')
          .eq('id', newOrder.id)
          .single();

        if (fullOrder) return fullOrder as Order;
      }
    }

    const localOrderLines: OrderLine[] = data.order_lines.map((l, i) => ({
      id: `line-${Date.now()}-${i}`,
      order_id: '',
      menu_item_id: l.menu_item_id,
      item_name_snapshot: l.item_name_snapshot,
      unit_price_snapshot_minor: l.unit_price_snapshot_minor,
      quantity: l.quantity,
      notes: l.notes,
      modifiers_snapshot: l.modifiers_snapshot,
      line_total_minor: l.line_total_minor,
    }));

    return dataRepository.createOrder({
      ...data,
      order_lines: localOrderLines,
      status: 'new',
      cancel_reason: null,
      created_by: null,
      assigned_delivery_staff: null,
    });
  },

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order | null> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)
        .select('*, order_lines(*), tables(*)')
        .single();
      if (!error && data) return data as Order;
    }
    return dataRepository.updateOrderStatus(orderId, status);
  },
};
