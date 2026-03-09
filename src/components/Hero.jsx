import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import GlobeCanvas from './GlobeCanvas';

export default function Hero() {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    // Initial Load Sequence GSAP
    const ctx = gsap.context(() => {
      // Body opacity handled globally, just element reveals here
      const tl = gsap.timeline();
      
      tl.from(".hero-text", {
        y: 50,
        opacity: 0,
        stagger: 0.12,
        duration: 1,
        ease: "power3.out",
        delay: 0.2 // Wait for global wipe
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
    <section ref={containerRef} className="relative w-full min-h-[60vh] md:min-h-[calc(100vh-80px)] bg-background flex flex-col md:grid md:grid-cols-2 lg:grid-cols-[1.2fr,1fr] px-4 md:px-6 lg:px-16 overflow-hidden pt-4 md:pt-0 pb-10 md:pb-0">
      <GlobeCanvas />

      {/* Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-20 max-w-4xl pt-8 md:pt-0">
        <svg viewBox="0 0 400 120" className="hero-text h-12 md:h-24 w-auto mb-4 md:mb-6 -ml-2">
          <line x1="10" y1="50" x2="40" y2="50" stroke="#8DE86A" strokeWidth="6" strokeLinecap="round" />
          <line x1="0" y1="65" x2="35" y2="65" stroke="#8DE86A" strokeWidth="6" strokeLinecap="round" />
          <line x1="20" y1="80" x2="40" y2="80" stroke="#8DE86A" strokeWidth="6" strokeLinecap="round" />
          <path d="M 35 45 L 85 45 L 75 80 L 45 80 Z" fill="#8DE86A" />
          <circle cx="50" cy="90" r="7" fill="#1EB854" />
          <circle cx="70" cy="90" r="7" fill="#1EB854" />
          <text x="100" y="80" fontFamily="sans-serif" fontWeight="900" fontSize="55" fill="#080808" letterSpacing="-2">
            akupy<tspan fill="#8DE86A">.</tspan>
          </text>
        </svg>
        <h2 className="hero-text text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-heading font-medium text-foreground/90 leading-[1.1] tracking-tight mb-4 md:mb-6">
          Global Discovery, <span className="text-primary italic font-light">Locally.</span>
        </h2>
        
        {/* Global Search Bar */}
        <div className="hero-element max-w-xl w-full mb-6 md:mb-8">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                navigate(`/discover?q=${encodeURIComponent(searchQuery)}`);
              } else {
                navigate('/discover');
              }
            }}
            className="flex items-center bg-white/80 backdrop-blur-md border border-black/10 rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow duration-300 group focus-within:border-primary/50 focus-within:bg-white"
          >
            <div className="pl-4 pr-2 text-gray-400 group-focus-within:text-primary transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
            <input 
              type="text" 
              placeholder="Search shops or services..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow min-w-0 bg-transparent outline-none px-2 py-3 text-[#080808] font-medium placeholder:text-gray-400"
            />
            <button 
              type="submit" 
              className="bg-primary text-[#080808] rounded-full px-5 md:px-6 py-2 md:py-3 font-semibold hover:bg-primary/90 transition-transform active:scale-95 duration-200"
            >
              Search
            </button>
          </form>
        </div>

        <p className="hero-text text-base md:text-xl text-secondary max-w-lg mb-4 md:mb-8 font-body font-medium text-balance">
          The smart discovery platform where businesses flourish and customers explore freely with incognito mode and virtual try-ons.
        </p>
      </div>
    </section>
  );
}
