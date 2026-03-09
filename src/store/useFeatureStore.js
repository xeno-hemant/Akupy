import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useFeatureStore = create(
  persist(
    (set) => ({
      isGlobeShopActive: false,
      isIncognitoActive: false,
      setGlobeShop: (active) => set({ isGlobeShopActive: active }),
      setIncognito: (active) => set({ isIncognitoActive: active }),
    }),
    {
      name: 'akupy-features',
    }
  )
);

export default useFeatureStore;
