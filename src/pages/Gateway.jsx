import { Link } from 'react-router-dom';
import { ShoppingBag, Store, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';
import gsap from 'gsap';
import { AkupyLogo } from '../components/Navbar';

export default function Gateway() {
  useEffect(() => {
    gsap.fromTo('.gateway-card',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.9, stagger: 0.15, ease: "power3.out" }
    );
    gsap.fromTo('.gateway-header',
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
    );
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden"
      style={{ background: '#2C2A27' }}
    >
      {/* Background glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none opacity-[0.07]"
        style={{ background: 'radial-gradient(circle, #22C55E, transparent 70%)', filter: 'blur(80px)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none opacity-[0.07]"
        style={{ background: 'radial-gradient(circle, #F59E0B, transparent 70%)', filter: 'blur(80px)' }} />

      {/* Header */}
      <div className="gateway-header text-center mb-10 z-10">
        <div className="flex justify-center mb-5">
          <AkupyLogo size="lg" dark={true} />
        </div>
        <p className="text-base md:text-lg font-body" style={{ color: '#9CA3AF' }}>
          Choose your experience
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl w-full z-10">

        {/* Shopper Card */}
        <Link
          to="/shop"
          className="gateway-card group relative rounded-3xl p-7 md:p-10 flex flex-col items-start justify-between min-h-[240px] md:min-h-[360px] transition-all duration-500"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(12px)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(34,197,94,0.07)';
            e.currentTarget.style.borderColor = 'rgba(34,197,94,0.3)';
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 20px 60px rgba(34,197,94,0.12)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {/* Icon */}
          <div
            className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110"
            style={{ background: 'rgba(107,114,128,0.15)', border: '1px solid rgba(107,114,128,0.25)' }}
          >
            <ShoppingBag className="w-7 h-7" style={{ color: '#9CA3AF' }} />
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-3 text-white">
              I am a Shopper
            </h2>
            <p className="text-sm md:text-base mb-8 font-body leading-relaxed" style={{ color: '#9CA3AF' }}>
              Explore infinite local and global stores, try on clothes with your 3D clone, and shop incognito.
            </p>
            <div
              className="flex items-center gap-2 font-semibold text-base group-hover:translate-x-2 transition-transform duration-300"
              style={{ color: '#6B7280' }}
            >
              Start Shopping <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </Link>

        {/* Seller Card */}
        <Link
          to="/sell"
          className="gateway-card group relative rounded-3xl p-7 md:p-10 flex flex-col items-start justify-between min-h-[240px] md:min-h-[360px] transition-all duration-500"
          style={{
            background: 'rgba(245,158,11,0.04)',
            border: '1px solid rgba(245,158,11,0.15)',
            backdropFilter: 'blur(12px)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(245,158,11,0.08)';
            e.currentTarget.style.borderColor = 'rgba(245,158,11,0.35)';
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 20px 60px rgba(245,158,11,0.12)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(245,158,11,0.04)';
            e.currentTarget.style.borderColor = 'rgba(245,158,11,0.15)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {/* Icon */}
          <div
            className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110"
            style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)' }}
          >
            <Store className="w-7 h-7" style={{ color: '#F59E0B' }} />
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-3 text-white">
              I am a Seller
            </h2>
            <p className="text-sm md:text-base mb-8 font-body leading-relaxed" style={{ color: '#9CA3AF' }}>
              Register your business, build your catalog, and reach a massive audience. View your earnings and manage orders.
            </p>
            <div
              className="flex items-center gap-2 font-semibold text-base group-hover:translate-x-2 transition-transform duration-300"
              style={{ color: '#F59E0B' }}
            >
              Enter Admin Portal <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
