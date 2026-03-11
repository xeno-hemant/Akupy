import { create } from 'zustand';
import API from '../config/apiRoutes';

// Check local storage for initial state
const storedUser = JSON.parse(localStorage.getItem('akupy_user') || 'null');
const storedToken = localStorage.getItem('akupy_token') || null;

""
const useAuthStore = create((set) => ({
  user: storedUser,
  token: storedToken,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(API.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to login');

      // If OTP is required (which it now is in our backend), we don't set user yet
      set({ isLoading: false });
      return { success: true, otpRequired: true };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, message: error.message };
    }
  },

  verifyLogin: async (email, otp) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(API.VERIFY_LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Verification failed');

      localStorage.setItem('akupy_user', JSON.stringify(data.user));
      localStorage.setItem('akupy_token', data.token);
      
      set({ user: data.user, token: data.token, isLoading: false });
      return { success: true, user: data.user };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, message: error.message };
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
