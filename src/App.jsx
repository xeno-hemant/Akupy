import { useEffect, useState } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Gateway from './pages/Gateway';
import ShopHome from './pages/ShopHome';
import Dashboard from './pages/Dashboard';
import Discover from './pages/Discover';
import BusinessProfile from './pages/BusinessProfile';
import SellLanding from './pages/SellLanding';
import Navbar from './components/Navbar';
import CustomCursor from './components/CustomCursor';
import ShopSubdomain from './pages/ShopSubdomain';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [subdomainShopId, setSubdomainShopId] = useState(null);

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
      <main className="w-full bg-background min-h-screen relative pt-20">
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
          </Routes>
        )}
      </main>
    </Router>
  );
}

export default App;
