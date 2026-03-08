import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HowItWorks() {
  const containerRef = useRef(null);
  const pathRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Line draw animation
      if (pathRef.current) {
        const length = pathRef.current.getTotalLength();
        gsap.set(pathRef.current, { strokeDasharray: length, strokeDashoffset: length });
        
        gsap.to(pathRef.current, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top center",
            end: "bottom center",
            scrub: 1,
          }
        });
      }

      // Step card stagger
      gsap.from(".step-card", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.3,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%",
        }
      });
      
    }, containerRef);
    
    return () => ctx.revert();
  }, []);

  const steps = [
    {
      number: "01",
      title: "Register Presence",
      desc: "Set up your business profile, list your services, and make your products discoverable globally."
    },
    {
      number: "02",
      title: "Activate Features",
      desc: "Enable Try-On Mode for your top products so customers can preview before they commit."
    },
    {
      number: "03",
      title: "Connect Frictionless",
      desc: "Users explore via Incognito and engage directly when they're ready, building pure trust."
    }
  ];

  return (
    <section ref={containerRef} className="py-20 md:py-32 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-16 relative">
        <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-24 text-center md:text-left">
          The Process.
        </h2>

        <div className="relative flex flex-col md:flex-row justify-between gap-16 md:gap-8">
          
          {/* Background Connecting Line (Desktop only) */}
          <div className="absolute top-12 left-0 w-full h-full hidden md:block pointer-events-none z-0 px-24">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 100">
              <path 
                ref={pathRef}
                d="M 0 50 Q 250 10 500 50 T 1000 50" 
                fill="none" 
                stroke="var(--primary)" 
                strokeWidth="2" 
                strokeDasharray="8 8"
                className="opacity-30"
              />
            </svg>
          </div>

          {/* Steps */}
          {steps.map((step, idx) => (
            <div key={idx} className="step-card flex-1 relative z-10 flex flex-col items-center md:items-start text-center md:text-left">
              <div className="w-24 h-24 rounded-2xl bg-card border border-primary/20 flex items-center justify-center mb-8 shadow-sm">
                <span className="font-mono text-4xl font-bold text-primary">{step.number}</span>
              </div>
              <h3 className="text-2xl font-heading font-bold text-foreground mb-4">{step.title}</h3>
              <p className="text-secondary text-base max-w-sm">
                {step.desc}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}
