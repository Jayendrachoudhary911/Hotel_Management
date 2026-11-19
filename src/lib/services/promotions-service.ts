export interface Promotion {
  id: string;
  title: string;
  description: string;
  badge_text: string;
  status: 'active' | 'scheduled' | 'expired';
  discount_type: 'percentage' | 'flat' | 'bogo';
  discount_value: number;
  start_date: string;
  end_date: string;
  applicable_category: string;
  applicable_items_count: number;
  times_used: number;
  image_url: string;
  created_at: string;
}

let initialPromotions: Promotion[] = [];

export const promotionsService = {
  getPromotions: async (): Promise<Promotion[]> => {
    return initialPromotions;
  },

  createPromotion: async (data: Omit<Promotion, 'id' | 'created_at' | 'times_used'>): Promise<Promotion> => {
    const newPromo: Promotion = {
      ...data,
      id: `promo-${Date.now()}`,
      times_used: 0,
      created_at: new Date().toISOString(),
    };
    initialPromotions.unshift(newPromo);
    return newPromo;
  },

  updatePromotion: async (id: string, updates: Partial<Promotion>): Promise<Promotion | null> => {
    const idx = initialPromotions.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    initialPromotions[idx] = { ...initialPromotions[idx], ...updates };
    return initialPromotions[idx];
  },

  deletePromotion: async (id: string): Promise<boolean> => {
    const initialLen = initialPromotions.length;
    initialPromotions = initialPromotions.filter((p) => p.id !== id);
    return initialPromotions.length < initialLen;
  },
};
