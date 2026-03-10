import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import GlobeCanvas from './GlobeCanvas';

const badges = [
  { icon: '🔒', label: 'Incognito Mode', color: 'border-taupe/30', style: { background: 'rgba(171,164,156,0.12)', color: '#D9D5D2', border: '1px solid rgba(171,164,156,0.3)' } },
  { icon: '🌍', label: 'Globe Shop', color: '', style: { background: 'rgba(142,134,123,0.12)', color: '#D9D5D2', border: '1px solid rgba(142,134,123,0.3)' } },
  { icon: '👗', label: '360° Try-On', color: '', style: { background: 'rgba(196,168,130,0.12)', color: '#c4a882', border: '1px solid rgba(196,168,130,0.3)' } },
];

export default function Hero() {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.from(".hero-text", {
        y: 50,
        opacity: 0,
        stagger: 0.12,
        duration: 1,
        ease: "power3.out",
        delay: 0.2
      });
      tl.to("#globe-canvas", {
        opacity: 1,
        duration: 1.5,
        ease: "power2.out",
      }, "-=0.5");
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[100svh] flex flex-col items-center justify-center overflow-hidden pt-20"
      style={{ background: 'linear-gradient(135deg, #3d3830 0%, #2e2a25 50%, #3d3830 100%)' }}
    >
      <GlobeCanvas />

      {/* Aurora background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full opacity-[0.07]"
          style={{ background: 'radial-gradient(circle, #8E867B, transparent 70%)', filter: 'blur(80px)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, #b5776e, transparent 70%)', filter: 'blur(80px)' }} />
      </div>

      {/* Gradient overlay for text */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#3d3830] via-[#3d3830]/50 to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-20 w-full max-w-4xl mx-auto px-5 md:px-8 flex flex-col items-center text-center">
        {/* Logo */}
        <svg viewBox="0 0 400 120" className="hero-text h-12 md:h-16 w-auto mb-6 -ml-2">
          <line x1="10" y1="50" x2="40" y2="50" stroke="#55c567" strokeWidth="8" strokeLinecap="round" />
          <line x1="0" y1="65" x2="35" y2="65" stroke="#55c567" strokeWidth="8" strokeLinecap="round" />
          <line x1="20" y1="80" x2="40" y2="80" stroke="#55c567" strokeWidth="8" strokeLinecap="round" />
          <path d="M 35 40 L 95 40 L 85 80 L 45 80 Z" fill="#55c567" />
          <circle cx="50" cy="98" r="9" fill="#00a859" />
          <circle cx="75" cy="98" r="9" fill="#00a859" />
          <text x="115" y="85" fontFamily="sans-serif" fontWeight="900" fontSize="72" fill="#F3F0E2" letterSpacing="-2">
            akupy<tspan fill="#55c567">.</tspan>
          </text>
        </svg>

        {/* Headline */}
        <h1 className="hero-text font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-4 md:mb-5">
          Global Discovery,{' '}
          <span
            className="italic font-light"
            style={{ color: '#c4a882', textShadow: '0 0 30px rgba(196,168,130,0.4), 0 0 60px rgba(196,168,130,0.15)' }}
          >
            Locally.
          </span>
        </h1>

        {/* Subtext */}
        <p className="hero-text text-base md:text-lg text-[#8b8ba0] max-w-xl mb-8 font-body leading-relaxed">
          The smart discovery platform where businesses flourish and customers explore freely with incognito mode and virtual try-ons.
        </p>

        {/* Feature badges */}
        <div className="hero-text flex flex-wrap justify-center gap-2 md:gap-3 mb-8">
          {badges.map((b, i) => (
            <span key={i} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium" style={b.style}>
              <span>{b.icon}</span>
              {b.label}
            </span>
          ))}
        </div>

        {/* Search bar */}
        <div className="hero-text w-full max-w-2xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              navigate(searchQuery.trim() ? `/discover?q=${encodeURIComponent(searchQuery)}` : '/discover');
            }}
            className="flex items-center border rounded-full p-1.5 transition-all duration-300 shadow-[0_0_40px_rgba(0,0,0,0.4)]"
            style={{ background: 'rgba(240,234,221,0.06)', border: '1px solid rgba(240,234,221,0.12)' }}
          >
            <div className="pl-4 pr-2" style={{ color: '#8E867B' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            </div>
            <input
              type="text"
              placeholder="Search shops or services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow min-w-0 bg-transparent outline-none px-2 py-3 font-medium text-sm md:text-base"
              style={{ color: '#F3F0E2' }}
            />
            <button
              type="submit"
              className="rounded-full px-5 md:px-7 py-2.5 md:py-3 font-semibold text-sm md:text-base transition-all active:scale-95 whitespace-nowrap"
              style={{ background: '#3d3830', color: '#F3F0E2' }}
              onMouseEnter={e => e.currentTarget.style.background = '#8E867B'}
              onMouseLeave={e => e.currentTarget.style.background = '#3d3830'}
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Bottom fade into next section */}
      <div className="absolute bottom-0 left-0 w-full h-24 pointer-events-none z-20"
        style={{ background: 'linear-gradient(to top, #3d3830, transparent)' }} />
    </section>
  );
}
