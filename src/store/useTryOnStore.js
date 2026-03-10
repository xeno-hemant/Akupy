import { create } from 'zustand';

const useTryOnStore = create((set, get) => ({
    // Core Data
    bodyProfile: null, // { height, weight, gender, chest, waist, hips, skinTone, bodyShape... }
    wardrobe: [],
    activeTryOnProduct: null, // The product currently loaded onto the avatar

    // UI State
    isTryOnModalOpen: false, // For checking out the onboarding/avatar view
    isOnboardingOptionsOpen: false, // The A/B split screen
    isManualFormOpen: false, // Option A form
    isScannerOpen: false, // Option B camera view

    // Initialization & Data Loading
    setBodyProfile: (profile) => set({ bodyProfile: profile }),
    setWardrobe: (items) => set({ wardrobe: items }),

    // Actions
    openTryOnForProduct: (product) => {
        // Check if we need onboarding
        const { bodyProfile } = get();
        if (!bodyProfile) {
            set({ isOnboardingOptionsOpen: true, activeTryOnProduct: product });
        } else {
            set({ isTryOnModalOpen: true, activeTryOnProduct: product });
        }
    },

    closeAllModals: () => set({
        isTryOnModalOpen: false,
        isOnboardingOptionsOpen: false,
        isManualFormOpen: false,
        isScannerOpen: false,
        activeTryOnProduct: null
    }),

    // Modals Nav
    openManualForm: () => set({ isManualFormOpen: true, isOnboardingOptionsOpen: false }),
    openScanner: () => set({ isScannerOpen: true, isOnboardingOptionsOpen: false }),

    // Save via API
    saveManualProfile: async (formData, token) => {
        try {
            const isProd = window.location.hostname.includes('akupy.in');
            const rootUrl = isProd ? 'https://akupybackend.onrender.com' : `http://${window.location.hostname}:5000`;
            const apiUrl = import.meta.env.VITE_API_URL || rootUrl;

            const res = await fetch(`${apiUrl}/api/tryon/profile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                const data = await res.json();
                set({
                    bodyProfile: data,
                    isManualFormOpen: false,
                    isScannerOpen: false,
                    isTryOnModalOpen: true // Proceed to actually seeing the avatar
                });
                return { success: true };
            }
            return { success: false, error: 'Failed to save profile' };
        } catch (err) {
            console.error(err);
            return { success: false, error: err.message };
        }
    },

    fetchProfile: async (token) => {
        try {
            const isProd = window.location.hostname.includes('akupy.in');
            const rootUrl = isProd ? 'https://akupybackend.onrender.com' : `http://${window.location.hostname}:5000`;
            const apiUrl = import.meta.env.VITE_API_URL || rootUrl;

            const res = await fetch(`${apiUrl}/api/tryon/profile`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                set({ bodyProfile: data });
            }
        } catch (err) {
            console.log('No try on profile found or error fetching.');
        }
    }

}));

export default useTryOnStore;
