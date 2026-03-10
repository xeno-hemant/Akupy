import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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

export default function HowItWorks() {
  const containerRef = useRef(null);
  const pathRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
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
      gsap.from(".step-card", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.3,
        ease: "power2.out",
        scrollTrigger: { trigger: containerRef.current, start: "top 60%" }
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-16 md:py-28 relative overflow-hidden" style={{ background: '#2e2a25' }}>
      <div className="max-w-7xl mx-auto px-4 md:px-16 relative">
        <h2 className="text-3xl md:text-5xl font-heading font-bold mb-16 md:mb-24 text-center md:text-left" style={{ color: '#F3F0E2' }}>
          The Process.
        </h2>

        <div className="relative flex flex-col md:flex-row justify-between gap-12 md:gap-8">

          {/* Dashed connecting line (desktop) */}
          <div className="absolute top-12 left-0 w-full hidden md:block pointer-events-none z-0 px-24">
            <svg className="w-full h-12" preserveAspectRatio="none" viewBox="0 0 1000 50">
              <path
                ref={pathRef}
                d="M 0 25 Q 250 5 500 25 T 1000 25"
                fill="none"
                stroke="#8E867B"
                strokeWidth="1.5"
                strokeDasharray="8 8"
                className="opacity-25"
              />
            </svg>
          </div>

          {/* Mobile vertical line */}
          <div className="absolute left-12 top-0 bottom-0 w-[1px] hidden"
            style={{ background: 'linear-gradient(to bottom, #8E867B, transparent)' }} />

          {steps.map((step, idx) => (
            <div key={idx} className="step-card flex-1 relative z-10 flex flex-col items-center md:items-start text-center md:text-left">
              <div className="w-20 h-20 rounded-xl flex items-center justify-center mb-6 flex-shrink-0"
                style={{ border: '1.5px solid #8E867B', background: 'transparent' }}>
                <span className="font-mono text-3xl font-bold" style={{ color: '#8E867B' }}>{step.number}</span>
              </div>
              <h3 className="text-xl md:text-2xl font-heading font-bold mb-3" style={{ color: '#F3F0E2' }}>{step.title}</h3>
              <p className="text-sm md:text-base max-w-xs font-body leading-relaxed" style={{ color: '#aba49c' }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
