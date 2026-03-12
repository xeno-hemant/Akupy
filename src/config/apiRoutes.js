const BASE = import.meta.env.VITE_API_URL 
  || (import.meta.env.DEV ? 'http://localhost:5000' : 'https://akupybackend-1.onrender.com');

export const API = {
  // Auth
  LOGIN: `${BASE}/api/v1/auth/login`,
  VERIFY_LOGIN: `${BASE}/api/v1/auth/verify-login`,
  REGISTER: `${BASE}/api/v1/auth/register`,
  VERIFY_REGISTER: `${BASE}/api/v1/auth/verify-register`,
  ME: `${BASE}/api/v1/auth/me`,
  UPDATE_PROFILE: `${BASE}/api/v1/auth/update-profile`,
  SEND_OTP: `${BASE}/api/v1/auth/send-otp`,
  VERIFY_OTP: `${BASE}/api/v1/auth/verify-otp`,
  FORGOT_PASSWORD: `${BASE}/api/v1/auth/forgot-password`,
  RESET_PASSWORD: `${BASE}/api/v1/auth/reset-password`,
  
  // Profile / Measurements
  MEASUREMENTS: `${BASE}/api/v1/profile/measurements`,
  INCOGNITO_TOGGLE: `${BASE}/api/v1/profile/toggle-incognito`,
  
  // Seller
  SELLER_SHOP: `${BASE}/api/v1/seller/shop`,
  SELLER_DASHBOARD: `${BASE}/api/v1/seller/dashboard`,
  SELLER_PRODUCTS: `${BASE}/api/v1/seller/products`,
  SELLER_ORDERS: `${BASE}/api/v1/seller/orders`,
  SELLER_INVENTORY: `${BASE}/api/v1/seller/inventory`,
  SELLER_COUPONS: `${BASE}/api/v1/seller/coupons`,
  SELLER_REVIEWS: `${BASE}/api/v1/seller/reviews`,
  SELLER_EARNINGS: `${BASE}/api/v1/seller/earnings`,
  SELLER_CUSTOMERS: `${BASE}/api/v1/seller/customers`,
  SELLER_NOTIFICATIONS: `${BASE}/api/v1/seller/notifications`,
  
  // Shopper
  PRODUCTS: `${BASE}/api/v1/products`,
  SEARCH: `${BASE}/api/v1/search`,
  CART: `${BASE}/api/v1/cart`,
  WISHLIST: `${BASE}/api/v1/wishlist`,
  ORDERS: `${BASE}/api/v1/orders`,
  ADDRESSES: `${BASE}/api/v1/addresses`,
  REVIEWS: `${BASE}/api/v1/reviews`,
  SHOPS: `${BASE}/api/v1/shops`,
  CATEGORIES: `${BASE}/api/v1/categories`,
  NOTIFICATIONS: `${BASE}/api/v1/notifications`,
  AI_CHAT: `${BASE}/api/v1/ai/chat`,
  UPLOAD: `${BASE}/api/v1/upload`,

  // Specific / Legacy Routes
  GLOBAL_SHOPS: `${BASE}/api/businesses/global`,
  ORDERS_INCOGNITO: `${BASE}/api/orders/incognito`,
  TRYON_PROFILE: `${BASE}/api/tryon/profile`,
  BUSINESSES: `${BASE}/api/businesses`, 
  BUSINESS_BY_SHOP_ID: (shopId) => `${BASE}/api/businesses/shop/${shopId}`,
  BUSINESS_BY_ID: (id) => `${BASE}/api/businesses/${id}`,
  BUSINESS_REVIEWS: (id) => `${BASE}/api/businesses/${id}/reviews`,
  VALIDATE_COUPON: `${BASE}/api/v1/coupons/validate`,
};

export default API;
