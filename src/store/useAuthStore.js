import { create } from 'zustand';

// Check local storage for initial state
const storedUser = JSON.parse(localStorage.getItem('akupy_user') || 'null');
const storedToken = localStorage.getItem('akupy_token') || null;

// Dynamic API URL for local network testing
const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL !== 'http://localhost:5000') {
    return import.meta.env.VITE_API_URL;
  }

  if (!import.meta.env.DEV && window.location.hostname.includes('akupy.in')) {
    return 'https://akupybackend.onrender.com';
  }

  return `http://${window.location.hostname}:5000`;
};

const useAuthStore = create((set) => ({
  user: storedUser,
  token: storedToken,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${getApiUrl()}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to login');
      }

      // Save to localStorage
      localStorage.setItem('akupy_user', JSON.stringify(data.user || data));
      localStorage.setItem('akupy_token', data.token);
      
      set({ 
        user: data.user || data, 
        token: data.token,
        isLoading: false 
      });
      return true;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('akupy_user');
    localStorage.removeItem('akupy_token');
    set({ user: null, token: null });
  },

  clearError: () => set({ error: null }),
  
  setAuth: (user, token) => {
    localStorage.setItem('akupy_user', JSON.stringify(user));
    localStorage.setItem('akupy_token', token);
    set({ user, token });
  }
}));

export default useAuthStore;
