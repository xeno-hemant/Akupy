import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const protocols = [
  {
    num: "01",
    title: "Global Explore",
    desc: "Discover businesses half a world away as easily as the coffee shop next door.",
    visual: () => (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-32 h-32 border border-primary animate-[spin_10s_linear_infinite] rounded-full relative">
          <div className="absolute top-0 left-1/2 w-4 h-4 bg-primary rounded-full -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>
    )
  },
  {
    num: "02",
    title: "Privacy First",
    desc: "Incognito search means your preferences are yours. Browse anonymously, decide freely.",
    visual: () => (
      <div className="w-full h-full flex items-center justify-center relative overflow-hidden bg-foreground/5 rounded-2xl">
         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-background/40 to-background opacity-50 z-10"></div>
         <div className="absolute top-0 left-0 w-full h-[2px] bg-primary opacity-50 shadow-[0_0_10px_var(--primary)] animate-[scan_3s_ease-in-out_infinite]" />
         <style>{`
          @keyframes scan {
            0%, 100% { top: 0%; opacity: 0; }
            10%, 90% { opacity: 0.8; }
            50% { top: 100%; }
          }
         `}</style>
         <span className="font-mono text-xs text-secondary/50 font-medium z-0 tracking-widest uppercase">Encrypted</span>
      </div>
    )
  },
  {
    num: "03",
    title: "Immersive Previews",
    desc: "Try-On Mode transforms how you buy. See it in your space before taking the next step.",
    visual: () => (
      <div className="w-full h-full flex items-center justify-center relative">
         <svg viewBox="0 0 100 50" className="w-[80%] overflow-visible">
            <path 
              d="M 0 25 L 20 25 L 25 10 L 35 40 L 45 5 L 55 45 L 60 25 L 100 25" 
              fill="none" 
              stroke="var(--primary)" 
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <animate attributeName="stroke-dasharray" values="0,200;200,0" dur="2s" repeatCount="indefinite" />
            </path>
         </svg>
      </div>
    )
  }
];

export default function PhilosophyStack() {
  const containerRef = useRef(null);

  useEffect(() => {
    const cards = gsap.utils.toArray(".protocol-card");
    if (cards.length === 0) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: `+=${cards.length * 100}%`,
        pin: true,
        scrub: true,
        animation: gsap.timeline()
          .to(cards[0], { scale: 0.92, filter: "blur(8px)", opacity: 0.4, ease: "none", duration: 1 })
          .to(cards[1], { scale: 0.92, filter: "blur(8px)", opacity: 0.4, ease: "none", duration: 1 }, "+=0.5")
      });
    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="h-screen bg-background relative overflow-hidden">
      {protocols.map((card, idx) => {
        const isFirst = idx === 0;
        return (
          <div 
            key={idx} 
            className="protocol-card absolute top-0 left-0 w-full h-full flex flex-col md:flex-row items-center p-8 md:p-24 origin-top"
            style={{ 
              zIndex: protocols.length - idx,
              backgroundColor: 'var(--background)'
            }}
          >
            <div className="flex-1 max-w-xl text-left">
              <span className="font-mono text-primary mb-6 block text-sm">PROTOCOL_{card.num}</span>
              <h2 className="text-5xl md:text-7xl font-heading font-medium tracking-tight mb-8 text-foreground">{card.title}</h2>
              <p className="text-xl md:text-2xl text-secondary font-body font-light text-balance leading-relaxed">
                {card.desc}
              </p>
            </div>
            <div className="flex-1 w-full h-1/2 md:h-full flex items-center justify-center p-8">
                {card.visual()}
            </div>
          </div>
        );
      })}
    </section>
  );
}
