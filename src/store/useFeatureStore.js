import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useFeatureStore = create(
  persist(
    (set) => ({
      isGlobeShopActive: false,
      isIncognitoActive: false,
      anonId: null,
      setGlobeShop: (active) => set({ isGlobeShopActive: active }),
      setIncognito: (active) => {
        if (active) {
          // Generate pseudo-UUID (not cryptographically strict but fine for session logic)
          const newAnonId = 'anon-' + Math.random().toString(36).substring(2) + Date.now().toString(36);
          set({ isIncognitoActive: true, anonId: newAnonId });
        } else {
          set({ isIncognitoActive: false, anonId: null });
        }
      },
    }),
    {
      name: 'akupy-features',
    }
  )
);

export default useFeatureStore;
