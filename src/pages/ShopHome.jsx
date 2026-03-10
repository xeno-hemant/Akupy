import { useEffect } from 'react';
import HomeFeed from '../components/HomeFeed';
import Footer from '../components/Footer';
import gsap from 'gsap';

export default function ShopHome() {
  useEffect(() => {
    gsap.fromTo('.shop-page',
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: "power2.out" }
    );
  }, []);

  return (
    <div
      className="shop-page min-h-screen page-bottom-padding"
      style={{ background: '#F5F0E8' }}
    >
      {/* Main Product Feed */}
      <HomeFeed />
      <Footer />
    </div>
  );
}
