import { getSupabaseClient } from './supabase-helper';
import { dataRepository } from '@/lib/data/repository';
import type { MenuCategory, MenuItem } from '@/lib/types';

export const menuService = {
  async getMenuCategories(outletId?: string): Promise<MenuCategory[]> {
    const supabase = getSupabaseClient();
    if (supabase) {
      let query = supabase
        .from('menu_categories')
        .select('*, menu_items(*, modifiers(*))')
        .order('sort_order', { ascending: true });

      if (outletId) {
        query = query.eq('outlet_id', outletId);
      }

      const { data, error } = await query;
      if (!error && data) {
        return data.map((c: any) => ({
          id: c.id,
          outlet_id: c.outlet_id,
          name: c.name,
          sort_order: c.sort_order,
          is_available: c.is_available,
          items: (c.menu_items || []).map((item: any) => ({
            id: item.id,
            category_id: item.category_id,
            name: item.name,
            description: item.description,
            price_minor: item.price_minor,
            image_url: item.image_url,
            is_available: item.is_available,
            dietary_labels: item.dietary_labels || [],
            sort_order: item.sort_order,
            modifiers: item.modifiers || [],
          })),
        }));
      }
    }
    return dataRepository.getMenuCategories(outletId);
  },

  async addMenuItem(itemData: {
    category_id: string;
    name: string;
    description: string;
    price_minor: number;
    dietary_labels: string[];
    image_url?: string;
  }): Promise<MenuItem> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('menu_items')
        .insert({
          category_id: itemData.category_id,
          name: itemData.name,
          description: itemData.description,
          price_minor: itemData.price_minor,
          dietary_labels: itemData.dietary_labels,
          image_url: itemData.image_url || '/images/dining_ambiance.jpg',
          is_available: true,
          sort_order: 99,
        })
        .select('*')
        .single();
      if (!error && data) return data as MenuItem;
    }
    return dataRepository.addMenuItem(itemData);
  },

  async updateMenuItem(
    itemId: string,
    updates: Partial<Pick<MenuItem, 'name' | 'description' | 'price_minor' | 'dietary_labels' | 'is_available'>>
  ): Promise<MenuItem | null> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase
        .from('menu_items')
        .update(updates)
        .eq('id', itemId)
        .select('*')
        .single();
      if (!error && data) return data as MenuItem;
    }
    return dataRepository.updateMenuItem(itemId, updates);
  },

  async toggleItemAvailability(itemId: string): Promise<boolean> {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data: item } = await supabase
        .from('menu_items')
        .select('is_available')
        .eq('id', itemId)
        .single();

      if (item) {
        const nextState = !item.is_available;
        await supabase
          .from('menu_items')
          .update({ is_available: nextState })
          .eq('id', itemId);
        return nextState;
      }
    }
    return dataRepository.toggleItemAvailability(itemId);
  },
};
