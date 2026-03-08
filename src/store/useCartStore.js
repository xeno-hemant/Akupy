import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      addToCart: (product, business) => {
        set((state) => {
          // Use product._id or a fallback to handle items that might not have a formal ID yet (e.g., demo items without _id)
          const productId = product._id || product.name;
          const existingItem = state.cart.find((item) => (item._id || item.name) === productId);
          
          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                (item._id || item.name) === productId ? { ...item, quantity: item.quantity + 1 } : item
              ),
            };
          }
          return { cart: [...state.cart, { ...product, businessId: business._id, businessName: business.name, quantity: 1, _id: productId }] };
        });
      },
      removeFromCart: (productId) => {
        set((state) => ({
          cart: state.cart.filter((item) => (item._id || item.name) !== productId),
        }));
      },
      updateQuantity: (productId, quantity) => {
        set((state) => ({
          cart: state.cart.map((item) =>
            (item._id || item.name) === productId ? { ...item, quantity: Math.max(1, quantity) } : item
          ),
        }));
      },
      clearCart: () => set({ cart: [] }),
      getTotalPrice: () => {
        const { cart } = get();
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      getTotalItems: () => {
        const { cart } = get();
        return cart.reduce((total, item) => total + item.quantity, 0);
      }
    }),
    {
      name: 'akupy-cart-storage',
    }
  )
);

export default useCartStore;
