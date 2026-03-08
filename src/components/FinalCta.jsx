import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function FinalCta() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".cta-content", {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
        scale: 0.95,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="w-full bg-background px-6 md:px-16 py-32">
      <div className="cta-content max-w-5xl mx-auto bg-primary rounded-[2.5rem] p-12 md:p-24 text-center flex flex-col items-center justify-center">
        <h2 className="text-5xl md:text-7xl font-heading font-medium text-[#080808] mb-6 tracking-tight">
          Ready for Discovery?
        </h2>
        <p className="text-[#080808]/80 text-lg md:text-2xl font-body max-w-2xl mb-12">
          Join the platform where local businesses meet global reach without compromising privacy.
        </p>
        <button className="bg-[#080808] text-white rounded-full px-10 py-5 text-xl font-semibold hover:bg-[#080808]/90 transition-transform hover:scale-105 active:scale-95 duration-200">
          Register Your Business
        </button>
      </div>
    </section>
  );
}
