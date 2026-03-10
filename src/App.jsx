import { useEffect, useState } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import useFeatureStore from './store/useFeatureStore';

import Gateway from './pages/Gateway';
import ShopHome from './pages/ShopHome';
import Dashboard from './pages/Dashboard';
import Discover from './pages/Discover';
import BusinessProfile from './pages/BusinessProfile';
import SellLanding from './pages/SellLanding';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import CustomCursor from './components/CustomCursor';
import TryOnOnboardingModal from './components/tryon/TryOnOnboardingModal';
import ShopSubdomain from './pages/ShopSubdomain';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import TryOnGalleryPage from './pages/TryOnGalleryPage';
import ProductDetails from './pages/ProductDetails';

// Seller Portal Pages
import SellerDashboard from './seller/pages/SellerDashboard';
import SellerOrders from './seller/pages/SellerOrders';
import SellerProducts from './seller/pages/SellerProducts';
import SellerAddProduct from './seller/pages/SellerAddProduct';
import SellerInventory from './seller/pages/SellerInventory';
import SellerEarnings from './seller/pages/SellerEarnings';
import SellerShopProfile from './seller/pages/SellerShopProfile';
import SellerCoupons from './seller/pages/SellerCoupons';
import SellerReviews from './seller/pages/SellerReviews';
import SellerNotifications from './seller/pages/SellerNotifications';

gsap.registerPlugin(ScrollTrigger);

function useIsSellerRoute() {
  const location = useLocation();
  return location.pathname.startsWith('/seller');
}

function AppInner({ subdomainShopId }) {
  const { isIncognitoActive } = useFeatureStore();
  const [toastMessage, setToastMessage] = useState('');
  const isSellerRoute = useIsSellerRoute();

  useEffect(() => {
    const handleToast = (e) => {
      setToastMessage(e.detail.message);
      setTimeout(() => setToastMessage(''), 3000);
    };
    window.addEventListener('incognito-toast', handleToast);
    return () => window.removeEventListener('incognito-toast', handleToast);
  }, []);

  return (
    <main className="w-full min-h-screen relative transition-colors duration-500"
      style={{ background: isSellerRoute ? '#F8F9FA' : isIncognitoActive ? '#2C2A27' : '#F5F0E8' }}>

      {isIncognitoActive && !isSellerRoute && (
        <div className="fixed inset-0 pointer-events-none z-[9990] opacity-100 transition-opacity duration-1000"
          style={{ boxShadow: 'inset 0 0 150px rgba(44,42,39,0.5)' }}></div>
      )}

      {!isSellerRoute && <TryOnOnboardingModal />}

      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[10000] bg-[#2C2A27]/95 text-white px-6 py-3 rounded-full text-sm font-semibold border border-white/10 shadow-lg animate-fade-in flex items-center gap-3 backdrop-blur-md">
          <span className="text-xl">🔒</span> {toastMessage}
        </div>
      )}

      {!isSellerRoute && <Navbar />}
      {!isSellerRoute && <BottomNav />}

      {subdomainShopId ? (
        <ShopSubdomain shopId={subdomainShopId} />
      ) : (
        <Routes>
          {/* Shopper Routes */}
          <Route path="/" element={<Gateway />} />
          <Route path="/shop" element={<ShopHome />} />
          <Route path="/sell" element={<SellLanding />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/business/:id" element={<BusinessProfile />} />
          <Route path="/dashboard" element={
            user?.role === 'business' ? <Navigate to="/seller/dashboard" replace /> : <Dashboard />
          } />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/wardrobe" element={<TryOnGalleryPage />} />
          <Route path="/product/:productId" element={<ProductDetails />} />

          {/* Seller Portal Routes */}
          <Route path="/seller" element={<SellerDashboard />} />
          <Route path="/seller/dashboard" element={<SellerDashboard />} />
          <Route path="/seller/orders" element={<SellerOrders />} />
          <Route path="/seller/products" element={<SellerProducts />} />
          <Route path="/seller/products/new" element={<SellerAddProduct />} />
          <Route path="/seller/products/:id/edit" element={<SellerAddProduct />} />
          <Route path="/seller/inventory" element={<SellerInventory />} />
          <Route path="/seller/earnings" element={<SellerEarnings />} />
          <Route path="/seller/payouts" element={<SellerEarnings />} />
          <Route path="/seller/transactions" element={<SellerEarnings />} />
          <Route path="/seller/shop" element={<SellerShopProfile />} />
          <Route path="/seller/coupons" element={<SellerCoupons />} />
          <Route path="/seller/reviews" element={<SellerReviews />} />
          <Route path="/seller/notifications" element={<SellerNotifications />} />
          <Route path="/seller/customers" element={<SellerOrders />} />
          <Route path="/seller/settings" element={<SellerShopProfile />} />
          <Route path="/seller/help" element={<SellerNotifications />} />

          {/* Wildcard shop subdomain — must be last */}
          <Route path="/:shopId" element={<ShopSubdomain />} />
        </Routes>
      )}
    </main>
  );
}

function App() {
  const [subdomainShopId, setSubdomainShopId] = useState(null);

  useEffect(() => {
    const hostname = window.location.hostname;
    let extracted = null;
    if (hostname.includes('localhost') && hostname !== 'localhost') {
      extracted = hostname.split('.')[0];
    } else if (hostname.includes('akupy.in')) {
      const parts = hostname.split('.');
      if (parts.length > 2 && parts[0] !== 'www') extracted = parts[0];
    }
    if (extracted) setSubdomainShopId(extracted);
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    });
    const updateLenis = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);
    return () => { lenis.destroy(); gsap.ticker.remove(updateLenis); };
  }, []);

  return (
    <Router>
      <CustomCursor />
      <AppInner subdomainShopId={subdomainShopId} />
    </Router>
  );
}

export default App;
