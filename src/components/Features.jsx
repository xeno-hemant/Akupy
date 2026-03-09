import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Micro UI - Card 1: Diagnostic Shuffler
function DiagnosticShuffler({ onClick }) {
  const items = ["Shop Globally", "Search Locally", "Discover Anywhere"];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div 
      onClick={onClick}
      className="flex-1 min-h-[300px] bg-card rounded-[2rem] p-8 shadow-xl border border-primary/10 flex flex-col justify-between overflow-hidden relative group cursor-pointer hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
    >
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-heading font-bold text-foreground">Globe Shop</h3>
          <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full border border-primary/20">₹99/mo</span>
        </div>
        <p className="text-sm text-secondary mt-2">Shop globally from any registered store. (Higher delivery & import charges apply)</p>
      </div>

      <div className="mt-8 flex flex-col gap-3 relative h-32" style={{ perspective: '800px' }}>
        {items.map((item, idx) => (
          <div 
            key={idx}
            className={`absolute w-full top-0 left-0 bg-white p-4 rounded-xl border border-foreground/5 shadow-sm transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex items-center justify-between ${
              idx === currentIndex 
                ? 'opacity-100 translate-y-0 rotate-x-0 z-10' 
                : idx < currentIndex
                  ? 'opacity-0 -translate-y-4 -rotate-x-12 z-0'
                  : 'opacity-0 translate-y-4 rotate-x-12 z-0'
            }`}
          >
            <span className="font-medium text-foreground text-sm">{item}</span>
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Micro UI - Card 2: Telemetry Typewriter
function TelemetryTypewriter({ onClick }) {
  const [text, setText] = useState("");
  const fullText = "Privacy enabled. Incognito search active.";
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let index = 0;
    const type = () => {
      if (index <= fullText.length) {
        setText(fullText.slice(0, index));
        index++;
        setTimeout(type, 80);
      } else {
        setIsTyping(false);
        setTimeout(() => {
          setIsTyping(true);
          index = 0;
          setText("");
          type();
        }, 5000); // Loop after 5 seconds
      }
    };
    
    // Initial delay
    const initialDelay = setTimeout(type, 1000);
    return () => clearTimeout(initialDelay);
  }, []);

  return (
    <div 
      onClick={onClick}
      className="flex-1 min-h-[300px] bg-card rounded-[2rem] p-8 shadow-xl border border-primary/10 flex flex-col justify-between cursor-pointer hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
    >
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-heading font-bold text-foreground">Incognito Mode</h3>
          <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full border border-primary/20">₹99/mo</span>
        </div>
        <p className="text-sm text-secondary mt-2">Absolute anonymity. Identity completely hidden, nothing stored in DB.</p>
      </div>

      <div className="mt-8 bg-black/5 rounded-xl p-4 font-mono text-sm leading-relaxed text-foreground/80 h-24">
        <div className="flex items-center gap-2 mb-2 text-xs text-secondary/60">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span>LIVE EVENT</span>
        </div>
        <p>
          {text}
          <span className={`${isTyping ? 'opacity-100' : 'animate-pulse'}`}>|</span>
        </p>
      </div>
    </div>
  );
}

// Micro UI - Card 3: Interactive SVG Graph
function InteractiveTryOnGraph({ onClick }) {
  const pathRef = useRef(null);

  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      gsap.set(pathRef.current, { strokeDasharray: length, strokeDashoffset: length });
      
      ScrollTrigger.create({
        trigger: pathRef.current,
        start: "top 80%",
        onEnter: () => {
          gsap.to(pathRef.current, { strokeDashoffset: 0, duration: 2, ease: "power2.out" });
        }
      });
    }
  }, []);

  return (
    <div 
      onClick={onClick}
      className="flex-1 min-h-[300px] bg-card rounded-[2rem] p-8 shadow-xl border border-primary/10 flex flex-col justify-between col-span-1 md:col-span-2 lg:col-span-1 cursor-pointer hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
    >
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-heading font-bold text-foreground">360° Try-On</h3>
          <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full border border-green-200">Free</span>
        </div>
        <p className="text-sm text-secondary mt-2">Scan or enter details to create your body clone. Try clothes virtually before buying.</p>
      </div>

      <div className="mt-8 relative h-32 w-full flex items-end">
        <svg viewBox="0 0 200 100" className="w-full h-full overflow-visible">
          <path 
            ref={pathRef}
            d="M 0 80 Q 20 60 40 70 T 80 40 T 130 50 T 200 10" 
            fill="none" 
            stroke="var(--primary)" 
            strokeWidth="3" 
            strokeLinecap="round" 
          />
          <circle cx="200" cy="10" r="4" fill="var(--primary)" className="animate-ping origin-center" style={{ transformOrigin: '200px 10px' }} />
        </svg>
        <span className="absolute bottom-2 right-2 font-mono text-xs text-secondary">confidence: 99.9%</span>
      </div>
    </div>
  );
}

export default function Features({ 
  onGlobeShopClick = () => console.log('Globe Shop clicked'),
  onIncognitoClick = () => console.log('Incognito clicked'),
  onTryOnClick = () => console.log('Try On clicked')
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".feature-card", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        },
        y: 40,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "power2.out"
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-20 md:py-32 px-6 md:px-16 max-w-7xl mx-auto">
      <div className="mb-12 md:mb-16">
        <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground feature-card">
          Purpose-Built Tools.
        </h2>
        <p className="text-lg text-secondary mt-4 max-w-xl feature-card">
          Everything designed to connect people with products faster, smarter, and more securely. Click on any feature to activate or learn more.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 feature-card">
        <DiagnosticShuffler onClick={onGlobeShopClick} />
        <TelemetryTypewriter onClick={onIncognitoClick} />
        <InteractiveTryOnGraph onClick={onTryOnClick} />
      </div>
    </section>
  );
}
