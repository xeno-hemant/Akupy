import { create } from 'zustand';

const STORAGE_KEY = 'akupy_city';
const INDIAN_CITIES = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai',
    'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat',
    'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane',
    'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna',
    'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik',
    'Faridabad', 'Meerut', 'Rajkot', 'Kalyan-Dombivli',
    'Vasai-Virar', 'Varanasi', 'Srinagar', 'Amritsar', 'Navi Mumbai',
    'Prayagraj', 'Howrah', 'Ranchi', 'Coimbatore', 'Guwahati',
    'Chandigarh', 'Jodhpur', 'Noida', 'Gurugram', 'Kochi'
];

export { INDIAN_CITIES };

const useLocationStore = create((set, get) => ({
    city: localStorage.getItem(STORAGE_KEY) || '',
    state: '',
    lat: null,
    lng: null,
    loading: false,
    error: null,        // null | 'denied' | 'error'
    detected: false,

    setCity: (city) => {
        localStorage.setItem(STORAGE_KEY, city);
        set({ city, detected: true, error: null });
    },

    clear: () => {
        localStorage.removeItem(STORAGE_KEY);
        set({ city: '', state: '', lat: null, lng: null, detected: false, error: null });
    },

    detect: async () => {
        // Already have a city from localStorage — skip re-detect
        if (get().city) { set({ detected: true }); return; }

        if (!navigator.geolocation) {
            set({ error: 'denied' });
            return;
        }

        set({ loading: true, error: null });

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;
                set({ lat: latitude, lng: longitude });

                try {
                    // Reverse geocode using Nominatim (free, no API key)
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
                        { headers: { 'Accept-Language': 'en' } }
                    );
                    const data = await res.json();
                    const addr = data.address || {};
                    // Nominatim field priority: city → town → village → county
                    const city = addr.city || addr.town || addr.village || addr.county || addr.state_district || '';
                    const state = addr.state || '';

                    if (city) {
                        localStorage.setItem(STORAGE_KEY, city);
                        set({ city, state, loading: false, detected: true });
                    } else {
                        set({ loading: false, error: 'denied' });
                    }
                } catch {
                    set({ loading: false, error: 'error' });
                }
            },
            (_err) => {
                // User denied or timeout
                set({ loading: false, error: 'denied', detected: false });
            },
            { timeout: 8000, maximumAge: 300000 }
        );
    },
}));

export default useLocationStore;
