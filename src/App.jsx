import { useEffect, useState } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import useFeatureStore from './store/useFeatureStore';

import Gateway from './pages/Gateway';
import ShopHome from './pages/ShopHome';
import Dashboard from './pages/Dashboard';
import Discover from './pages/Discover';
import BusinessProfile from './pages/BusinessProfile';
import SellLanding from './pages/SellLanding';
import Navbar from './components/Navbar';
import CustomCursor from './components/CustomCursor';
import TryOnOnboardingModal from './components/tryon/TryOnOnboardingModal';
import ShopSubdomain from './pages/ShopSubdomain';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import TryOnGalleryPage from './pages/TryOnGalleryPage';
import ProductDetails from './pages/ProductDetails';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [subdomainShopId, setSubdomainShopId] = useState(null);
  const { isIncognitoActive } = useFeatureStore();
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const handleToast = (e) => {
      setToastMessage(e.detail.message);
      setTimeout(() => setToastMessage(''), 3000);
    };
    window.addEventListener('incognito-toast', handleToast);
    return () => window.removeEventListener('incognito-toast', handleToast);
  }, []);

  // Subdomain Detection Logic
  useEffect(() => {
    const hostname = window.location.hostname;
    let extracted = null;

    // Check local dev e.g. zudio.localhost
    if (hostname.includes('localhost') && hostname !== 'localhost') {
      extracted = hostname.split('.')[0];
    }
    // Check production e.g. zudio.akupy.in
    else if (hostname.includes('akupy.in')) {
      const parts = hostname.split('.');
      if (parts.length > 2 && parts[0] !== 'www') {
        extracted = parts[0];
      }
    }

    if (extracted) {
      setSubdomainShopId(extracted);
    }
  }, []);

  // Custom Cursor Logic is now handled by the CustomCursor component

  // Lenis Smooth Scroll Logic
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    });

    const updateLenis = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0); // Optional: prevents GSAP from correcting lag to sync with Lenis

    return () => {
      lenis.destroy();
      gsap.ticker.remove(updateLenis);
    };
  }, []);

  return (
    <Router>
      <CustomCursor />
      <main className="w-full min-h-screen relative transition-colors duration-500" style={{ background: isIncognitoActive ? '#2e2a25' : '#F3F0E2' }}>

        {/* Global Incognito Vignette */}
        {isIncognitoActive && (
          <div className="fixed inset-0 pointer-events-none z-[9990] opacity-100 transition-opacity duration-1000"
            style={{ boxShadow: 'inset 0 0 150px rgba(61,56,48,0.4)' }}></div>
        )}

        <TryOnOnboardingModal />

        {/* Global Toast */}
        {toastMessage && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[10000] bg-violet-900/95 text-violet-100 px-6 py-3 rounded-full text-sm font-semibold border border-violet-500/30 shadow-[0_0_30px_rgba(124,92,252,0.3)] animate-fade-in flex items-center gap-3 backdrop-blur-md">
            <span className="text-xl">🔒</span> {toastMessage}
          </div>
        )}

        <Navbar />
        {subdomainShopId ? (
          <ShopSubdomain shopId={subdomainShopId} />
        ) : (
          <Routes>
            <Route path="/" element={<Gateway />} />
            <Route path="/shop" element={<ShopHome />} />
            <Route path="/sell" element={<SellLanding />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/business/:id" element={<BusinessProfile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/wardrobe" element={<TryOnGalleryPage />} />
            <Route path="/product/:productId" element={<ProductDetails />} />
            <Route path="/:shopId" element={<ShopSubdomain />} />
          </Routes>
        )}
      </main>
    </Router>
  );
}

export default App;
