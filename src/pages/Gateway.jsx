import { Link } from 'react-router-dom';
import { ShoppingBag, Store, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';
import gsap from 'gsap';

export default function Gateway() {
  useEffect(() => {
    gsap.fromTo('.gateway-card',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power3.out" }
    );
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8 md:p-6 relative overflow-hidden pt-24 md:pt-0"
      style={{ background: '#2e2a25' }}
    >
      {/* Background glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none opacity-[0.05]"
        style={{ background: 'radial-gradient(circle, #8E867B, transparent 70%)', filter: 'blur(80px)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none opacity-[0.05]"
        style={{ background: 'radial-gradient(circle, #c4a882, transparent 70%)', filter: 'blur(80px)' }} />

      {/* Logo + tagline */}
      <div className="text-center mb-8 md:mb-14 z-10 mt-10 md:mt-0">
        <div className="flex justify-center mb-4 -ml-2">
          <svg viewBox="0 0 400 120" className="h-14 md:h-20 w-auto">
            <line x1="10" y1="50" x2="40" y2="50" stroke="#8E867B" strokeWidth="6" strokeLinecap="round" />
            <line x1="0" y1="65" x2="35" y2="65" stroke="#8E867B" strokeWidth="6" strokeLinecap="round" />
            <line x1="20" y1="80" x2="40" y2="80" stroke="#8E867B" strokeWidth="6" strokeLinecap="round" />
            <path d="M 35 45 L 85 45 L 75 80 L 45 80 Z" fill="#8E867B" />
            <circle cx="50" cy="90" r="7" fill="#7a7268" />
            <circle cx="70" cy="90" r="7" fill="#7a7268" />
            <text x="100" y="80" fontFamily="sans-serif" fontWeight="900" fontSize="55" fill="#F3F0E2" letterSpacing="-2">
              akupy<tspan fill="#8E867B">.</tspan>
            </text>
          </svg>
        </div>
        <p className="text-base md:text-lg font-body" style={{ color: '#aba49c' }}>Choose your experience</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full z-10">

        {/* Shopper Card */}
        <Link
          to="/shop"
          className="gateway-card group relative rounded-3xl p-7 md:p-12 flex flex-col items-start justify-between min-h-[240px] md:min-h-[380px] transition-all duration-500 hover:-translate-y-2"
          style={{
            background: 'rgba(142,134,123,0.06)',
            border: '1px solid rgba(142,134,123,0.15)',
            backdropFilter: 'blur(12px)',
          }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = '0 20px 60px rgba(142,134,123,0.15), 0 0 0 1px rgba(142,134,123,0.3)'}
          onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
        >
          <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{ background: 'radial-gradient(circle at 30% 30%, rgba(142,134,123,0.08), transparent 70%)' }} />

          <div className="relative z-10 w-14 h-14 md:w-18 md:h-18 rounded-full flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110"
            style={{ background: 'rgba(142,134,123,0.15)', border: '1px solid rgba(142,134,123,0.3)' }}>
            <ShoppingBag className="w-7 h-7" style={{ color: '#8E867B' }} />
          </div>

          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-3" style={{ color: '#F3F0E2' }}>I am a Shopper</h2>
            <p className="text-sm md:text-base mb-6 font-body leading-relaxed" style={{ color: '#aba49c' }}>
              Explore infinite local and global stores, try on clothes with your 3D clone, and shop incognito.
            </p>
            <div className="flex items-center gap-2 font-semibold text-base group-hover:translate-x-2 transition-transform duration-300"
              style={{ color: '#8E867B' }}>
              Start Shopping <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </Link>

        {/* Seller Card */}
        <Link
          to="/sell"
          className="gateway-card group relative rounded-3xl p-7 md:p-12 flex flex-col items-start justify-between min-h-[240px] md:min-h-[380px] transition-all duration-500 hover:-translate-y-2"
          style={{
            background: 'rgba(196,168,130,0.06)',
            border: '1px solid rgba(196,168,130,0.2)',
            backdropFilter: 'blur(12px)',
          }}
          onMouseEnter={e => e.currentTarget.style.boxShadow = '0 20px 60px rgba(196,168,130,0.15), 0 0 0 1px rgba(196,168,130,0.3)'}
          onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
        >
          <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{ background: 'radial-gradient(circle at 70% 30%, rgba(196,168,130,0.1), transparent 70%)' }} />

          <div className="relative z-10 w-14 h-14 md:w-18 md:h-18 rounded-full flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110"
            style={{ background: 'rgba(196,168,130,0.15)', border: '1px solid rgba(196,168,130,0.35)' }}>
            <Store className="w-7 h-7" style={{ color: '#c4a882' }} />
          </div>

          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-3" style={{ color: '#F3F0E2' }}>I am a Seller</h2>
            <p className="text-sm md:text-base mb-6 font-body leading-relaxed" style={{ color: '#aba49c' }}>
              Register your business, build your catalog, and reach a massive audience. View your earnings and manage orders.
            </p>
            <div className="flex items-center gap-2 font-semibold text-base group-hover:translate-x-2 transition-transform duration-300"
              style={{ color: '#c4a882' }}>
              Enter Admin Portal <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </Link>

      </div>
    </div>
  );
}
