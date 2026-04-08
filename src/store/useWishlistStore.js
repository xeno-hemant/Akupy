import { create } from 'zustand';
import API from '../config/apiRoutes';

const useWishlistStore = create((set, get) => ({
  ids: new Set(),         // Set of product ID strings
  items: [],              // Full product objects (for wishlist page)
  loading: false,

  // Fetch wishlist from server (call on login)
  fetchWishlist: async (token) => {
    if (!token) return;
    try {
      set({ loading: true });
      const res = await fetch(API.WISHLIST, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        const ids = new Set(data.items.map(i => i.productId?._id?.toString() || i.productId?.toString()));
        set({ ids, items: data.items, loading: false });
      } else {
        set({ loading: false });
      }
    } catch {
      set({ loading: false });
    }
  },

  // Toggle a product in/out of wishlist
  toggleItem: async (productId, token) => {
    if (!token) return false;
    
    const prev = new Set(get().ids);
    const isWishlisted = prev.has(productId.toString());
    
    // Optimistic update
    const next = new Set(prev);
    if (isWishlisted) next.delete(productId.toString());
    else next.add(productId.toString());
    set({ ids: next });

    try {
      const res = await fetch(API.WISHLIST_TOGGLE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId })
      });
      const data = await res.json();
      if (!data.success) {
        // Revert on failure
        set({ ids: prev });
        return isWishlisted;
      }
      return data.wishlisted;
    } catch {
      // Revert on error
      set({ ids: prev });
      return isWishlisted;
    }
  },

  // Check if a product is wishlisted
  isWishlisted: (productId) => get().ids.has(productId?.toString()),

  // Clear on logout
  clear: () => set({ ids: new Set(), items: [] }),
}));

export default useWishlistStore;
