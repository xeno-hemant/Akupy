import { Link } from 'react-router-dom';
import { ShoppingBag, Store } from 'lucide-react';
import { useEffect } from 'react';
import gsap from 'gsap';
import { AkupyLogo } from '../components/Navbar';

export default function Gateway() {
  useEffect(() => {
    gsap.fromTo('.gateway-card',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" }
    );
  }, []);

  return (
    <div className="min-h-screen flex flex-col pt-8" style={{ background: '#1A1A1A' }}>
      {/* Logo Top Left */}
      <div className="px-8 mb-12">
        <Link to="/">
          <AkupyLogo size="lg" dark={true} />
        </Link>
      </div>

      {/* Main Content Centered */}
      <div className="flex-grow flex flex-col items-center justify-center px-4 pb-20">
        <h1 className="text-xl md:text-2xl font-heading mb-12" style={{ color: '#9CA3AF', letterSpacing: '0.05em' }}>
          Choose your experience
        </h1>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8 max-w-4xl w-full">
          {/* Shopper Card */}
          <Link
            to="/shop"
            className="gateway-card group relative rounded-2xl p-10 flex flex-col items-center text-center transition-all duration-300"
            style={{
              background: '#242424',
              border: '1px solid rgba(255,255,255,0.05)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#22C55E';
              e.currentTarget.style.transform = 'translateY(-5px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-8 bg-[#2C2C2C] border border-white/5 group-hover:bg-[#22C55E]/10 transition-colors">
              <ShoppingBag className="w-10 h-10 text-[#22C55E]" />
            </div>
            <h2 className="text-2xl font-heading font-bold text-white">I am a Shopper</h2>
          </Link>

          {/* Seller Card */}
          <Link
            to="/sell"
            className="gateway-card group relative rounded-2xl p-10 flex flex-col items-center text-center transition-all duration-300"
            style={{
              background: '#242424',
              border: '1px solid rgba(255,255,255,0.05)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#F59E0B';
              e.currentTarget.style.transform = 'translateY(-5px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-8 bg-[#2C2C2C] border border-white/5 group-hover:bg-[#F59E0B]/10 transition-colors">
              <Store className="w-10 h-10 text-[#F59E0B]" />
            </div>
            <h2 className="text-2xl font-heading font-bold text-white">I am a Seller</h2>
          </Link>
        </div>
      </div>
    </div>
  );
}
