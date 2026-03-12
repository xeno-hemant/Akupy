import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      addToCart: (product) => {
        set((state) => {
          // Compound ID using base ID + variants to treat different sizes as distinct items
          const variantId = `${product._id || product.id}-${product.selectedColor || ''}-${product.selectedSize || ''}`;
          const existingItemIndex = state.cart.findIndex(item => item.variantId === variantId);

          if (existingItemIndex > -1) {
            const newCart = [...state.cart];
            newCart[existingItemIndex].quantity += (product.quantity || 1);
            return { cart: newCart };
          }

            const rawShopName = (typeof product.shopId === 'object' && (product.shopId?.name || product.shopId?.shopName))
                || product.businessName
                || product.shopName
                || 'Akupy Store';
            
            const shopName = (rawShopName && !rawShopName.toLowerCase().includes('unknown')) 
                ? rawShopName 
                : 'Akupy Store';

            return {
              cart: [...state.cart, {
                ...product,
                variantId,
                shopName,
                quantity: product.quantity || 1
              }]
            };
        });
      },
      removeFromCart: (variantId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.variantId !== variantId),
        }));
      },
      updateQuantity: (variantId, quantity) => {
        set((state) => ({
          cart: state.cart.map((item) =>
            item.variantId === variantId ? { ...item, quantity: Math.max(1, quantity) } : item
          ),
        }));
      },
      appliedCoupon: null,
      discountAmount: 0,
      applyCoupon: (coupon, discount) => {
        set({ appliedCoupon: coupon, discountAmount: discount });
      },
      removeCoupon: () => {
        set({ appliedCoupon: null, discountAmount: 0 });
      },
      clearCart: () => set({ cart: [], appliedCoupon: null, discountAmount: 0 }),
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
