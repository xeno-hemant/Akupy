import { create } from 'zustand';

const useFeatureStore = create((set) => ({
  isGlobeShopActive: false,
  isIncognitoActive: false,
  setGlobeShop: (active) => set({ isGlobeShopActive: active }),
  setIncognito: (active) => set({ isIncognitoActive: active }),
}));

export default useFeatureStore;
