export interface ModifierOption {
  id: string;
  name: string;
  price_delta: number;
  color_dot?: string;
}

export interface ModifierGroup {
  id: string;
  name: string;
  description: string;
  type: 'add_on' | 'choice' | 'size';
  image_url?: string;
  price_minor: number;
  is_active: boolean;
  applicable_items_count: number;
  applicable_items?: string[];
  options: ModifierOption[];
  created_at: string;
}

let initialModifiers: ModifierGroup[] = [];

export const modifiersService = {
  getModifiers: async (): Promise<ModifierGroup[]> => {
    return initialModifiers;
  },

  createModifier: async (data: Omit<ModifierGroup, 'id' | 'created_at'>): Promise<ModifierGroup> => {
    const newMod: ModifierGroup = {
      ...data,
      id: `mod-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    initialModifiers.unshift(newMod);
    return newMod;
  },

  updateModifier: async (id: string, updates: Partial<ModifierGroup>): Promise<ModifierGroup | null> => {
    const idx = initialModifiers.findIndex((m) => m.id === id);
    if (idx === -1) return null;
    initialModifiers[idx] = { ...initialModifiers[idx], ...updates };
    return initialModifiers[idx];
  },

  deleteModifier: async (id: string): Promise<boolean> => {
    const initialLen = initialModifiers.length;
    initialModifiers = initialModifiers.filter((m) => m.id !== id);
    return initialModifiers.length < initialLen;
  },
};
