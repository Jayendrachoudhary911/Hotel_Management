export interface CustomerReview {
  id: string;
  customer_name: string;
  customer_source: string;
  customer_avatar_color: string;
  rating: number; // 1 - 5
  comment: string;
  menu_item_name: string;
  menu_item_image: string;
  date_formatted: string;
  status: 'published' | 'pending' | 'hidden';
  created_at: string;
}

let initialReviews: CustomerReview[] = [];

export const reviewsService = {
  getReviews: async (): Promise<CustomerReview[]> => {
    return initialReviews;
  },

  createReview: async (data: Omit<CustomerReview, 'id' | 'created_at' | 'date_formatted'>): Promise<CustomerReview> => {
    const d = new Date();
    const formatted = `${d.getDate()} ${d.toLocaleString('en-US', { month: 'short' })} ${d.getFullYear()}, ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    const newRev: CustomerReview = {
      ...data,
      id: `rev-${Date.now()}`,
      date_formatted: formatted,
      created_at: d.toISOString(),
    };
    initialReviews.unshift(newRev);
    return newRev;
  },

  updateReviewStatus: async (id: string, status: CustomerReview['status']): Promise<CustomerReview | null> => {
    const idx = initialReviews.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    initialReviews[idx] = { ...initialReviews[idx], status };
    return initialReviews[idx];
  },

  deleteReview: async (id: string): Promise<boolean> => {
    const initialLen = initialReviews.length;
    initialReviews = initialReviews.filter((r) => r.id !== id);
    return initialReviews.length < initialLen;
  },
};
