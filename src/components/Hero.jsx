import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import GlobeCanvas from './GlobeCanvas';

export default function Hero() {
  const containerRef = useRef(null);
  
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
    <section 
      ref={containerRef} 
      className="relative w-full h-[100dvh] flex items-end pb-20 pl-6 md:pl-16 overflow-hidden bg-background"
    >
      <GlobeCanvas />

      {/* Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative z-20 max-w-4xl">
        <h1 className="hero-text text-[clamp(2.5rem,6vw,6rem)] font-heading font-bold text-foreground leading-[1.1] tracking-tight mb-2">
          Akupy
        </h1>
        <h2 className="hero-text text-[clamp(2rem,5vw,5rem)] font-heading font-medium text-foreground/90 leading-[1.1] tracking-tight mb-6">
          Global Discovery, <span className="text-primary italic font-light">Locally.</span>
        </h2>
        <p className="hero-text text-lg md:text-xl text-secondary max-w-lg mb-8 font-body font-medium text-balance">
          The smart discovery platform where businesses flourish and customers explore freely with incognito mode and virtual try-ons.
        </p>
        
        <div className="hero-text">
          <button className="primary-btn relative overflow-hidden bg-primary text-black font-semibold rounded-full px-8 py-4 text-lg hover:bg-primary/90 transition-colors">
            Register Your Business
          </button>
        </div>
      </div>
    </section>
  );
}
