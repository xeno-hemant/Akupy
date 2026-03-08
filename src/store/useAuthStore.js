import { create } from 'zustand';

// Check local storage for initial state
const storedUser = JSON.parse(localStorage.getItem('akupy_user') || 'null');

const useAuthStore = create((set) => ({
  user: storedUser,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
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
      localStorage.setItem('akupy_user', JSON.stringify(data));
      set({ user: data, isLoading: false });
      return true;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('akupy_user');
    set({ user: null });
  },

  clearError: () => set({ error: null })
}));

export default useAuthStore;
