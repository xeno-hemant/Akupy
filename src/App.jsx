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
import TryOnModal from './components/TryOnModal';
import AiAssistantDrawer from './components/AiAssistantDrawer';
import { ProtectedSellerRoute, ProtectedShopperRoute } from './components/ProtectedRoute';
import CustomCursor from './components/CustomCursor';
import TryOnOnboardingModal from './components/tryon/TryOnOnboardingModal';
import ShopSubdomain from './pages/ShopSubdomain';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import TryOnGalleryPage from './pages/TryOnGalleryPage';
import ProductDetails from './pages/ProductDetails';
import LoginPage from './pages/LoginPage';

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

import useAuthStore from './store/useAuthStore';

function useIsSeller() {
  const location = useLocation();
  return location.pathname.startsWith('/seller');
}

function RootRedirect() {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'seller') return <Navigate to="/seller/dashboard" replace />;
  return <Navigate to="/shop" replace />;
}

function AppInner({ subdomainShopId }) {
  const { user } = useAuthStore();
  const { isIncognitoActive } = useFeatureStore();
  const [toastMessage, setToastMessage] = useState('');
  const isSeller = useIsSeller();
  const location = useLocation();

  const isSellerRoute = location.pathname.startsWith('/seller');
  const isAuthRoute = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register';

  const { setIncognito } = useFeatureStore();

  useEffect(() => {
    const handleToast = (e) => {
      setToastMessage(e.detail.message);
      setTimeout(() => setToastMessage(''), 3000);
    };
    const handleToggleIncognito = () => {
      const newState = !isIncognitoActive;
      setIncognito(newState);
      window.dispatchEvent(new CustomEvent('incognito-toast', {
        detail: { message: newState ? "Incognito Mode Activated" : "Incognito Mode Deactivated" }
      }));
    };

    window.addEventListener('incognito-toast', handleToast);
    window.addEventListener('toggle-incognito', handleToggleIncognito);
    return () => {
      window.removeEventListener('incognito-toast', handleToast);
      window.removeEventListener('toggle-incognito', handleToggleIncognito);
    };
  }, [isIncognitoActive, setIncognito]);

  return (
    <main className="w-full min-h-screen relative transition-colors duration-500"
      style={{ background: isSeller ? '#F8F9FA' : isIncognitoActive ? '#2C2A27' : '#F5F0E8' }}>

      {isIncognitoActive && !isSeller && (
        <div className="fixed inset-0 pointer-events-none z-[9990] opacity-100 transition-opacity duration-1000"
          style={{ boxShadow: 'inset 0 0 150px rgba(44,42,39,0.5)' }}></div>
      )}

      {!isSeller && <TryOnOnboardingModal />}

      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[10000] bg-[#2C2A27]/95 text-white px-6 py-3 rounded-full text-sm font-semibold border border-white/10 shadow-lg animate-fade-in flex items-center gap-3 backdrop-blur-md">
          <span className="text-xl">🔒</span> {toastMessage}
        </div>
      )}

      {!isSellerRoute && !isAuthRoute && <Navbar />}
      {!isSellerRoute && !isAuthRoute && <BottomNav />}
      <TryOnModal />
      <AiAssistantDrawer />

      {subdomainShopId ? (
        <ShopSubdomain shopId={subdomainShopId} />
      ) : (
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/shop" element={<ShopHome />} />
          <Route path="/sell" element={<SellLanding />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/business/:id" element={<BusinessProfile />} />
          <Route path="/dashboard" element={
            <ProtectedShopperRoute>
              <Dashboard />
            </ProtectedShopperRoute>
          } />
          <Route path="/cart" element={<ProtectedShopperRoute><CartPage /></ProtectedShopperRoute>} />
          <Route path="/checkout" element={<ProtectedShopperRoute><CheckoutPage /></ProtectedShopperRoute>} />
          <Route path="/wardrobe" element={<ProtectedShopperRoute><TryOnGalleryPage /></ProtectedShopperRoute>} />
          <Route path="/product/:productId" element={<ProductDetails />} />

          {/* Seller Portal Routes */}
          <Route path="/seller" element={<ProtectedSellerRoute><SellerDashboard /></ProtectedSellerRoute>} />
          <Route path="/seller/dashboard" element={<ProtectedSellerRoute><SellerDashboard /></ProtectedSellerRoute>} />
          <Route path="/seller/orders" element={<ProtectedSellerRoute><SellerOrders /></ProtectedSellerRoute>} />
          <Route path="/seller/products" element={<ProtectedSellerRoute><SellerProducts /></ProtectedSellerRoute>} />
          <Route path="/seller/products/new" element={<ProtectedSellerRoute><SellerAddProduct /></ProtectedSellerRoute>} />
          <Route path="/seller/products/:id/edit" element={<ProtectedSellerRoute><SellerAddProduct /></ProtectedSellerRoute>} />
          <Route path="/seller/inventory" element={<ProtectedSellerRoute><SellerInventory /></ProtectedSellerRoute>} />
          <Route path="/seller/earnings" element={<ProtectedSellerRoute><SellerEarnings /></ProtectedSellerRoute>} />
          <Route path="/seller/payouts" element={<ProtectedSellerRoute><SellerEarnings /></ProtectedSellerRoute>} />
          <Route path="/seller/transactions" element={<ProtectedSellerRoute><SellerEarnings /></ProtectedSellerRoute>} />
          <Route path="/seller/shop" element={<ProtectedSellerRoute><SellerShopProfile /></ProtectedSellerRoute>} />
          <Route path="/seller/coupons" element={<ProtectedSellerRoute><SellerCoupons /></ProtectedSellerRoute>} />
          <Route path="/seller/reviews" element={<ProtectedSellerRoute><SellerReviews /></ProtectedSellerRoute>} />
          <Route path="/seller/notifications" element={<ProtectedSellerRoute><SellerNotifications /></ProtectedSellerRoute>} />
          <Route path="/seller/customers" element={<ProtectedSellerRoute><SellerOrders /></ProtectedSellerRoute>} />
          <Route path="/seller/settings" element={<ProtectedSellerRoute><SellerShopProfile /></ProtectedSellerRoute>} />
          <Route path="/seller/help" element={<ProtectedSellerRoute><SellerNotifications /></ProtectedSellerRoute>} />

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
