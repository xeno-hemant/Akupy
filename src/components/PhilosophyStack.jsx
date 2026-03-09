import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

import { Globe, ShieldCheck, View } from 'lucide-react';

const protocols = [
  {
    num: "01",
    title: "Global Explore",
    desc: "Discover businesses half a world away as easily as the coffee shop next door.",
    visual: () => (
      <div className="w-full h-full flex flex-col items-center justify-center relative bg-gray-50/50 rounded-full border border-gray-100 overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <Globe className="w-32 h-32 text-gray-300 group-hover:text-primary transition-colors duration-700 stroke-[1px]" />
        <div className="absolute top-1/2 left-1/2 w-full h-[1px] bg-primary/20 -translate-x-1/2 -translate-y-1/2 rotate-45 group-hover:rotate-90 transition-transform duration-[2000ms] ease-out"></div>
      </div>
    )
  },
  {
    num: "02",
    title: "Privacy First",
    desc: "Incognito search means your preferences are yours. Browse anonymously, decide freely.",
    visual: () => (
      <div className="w-full h-full flex items-center justify-center relative bg-[#080808] rounded-full border border-black/10 overflow-hidden group shadow-2xl">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
         <ShieldCheck className="w-32 h-32 text-gray-600 group-hover:text-white transition-colors duration-700 stroke-[1px] relative z-10" />
         <div className="absolute top-0 left-0 w-full h-[2px] bg-primary opacity-0 group-hover:opacity-50 shadow-[0_0_15px_var(--primary)] animate-[scan_3s_ease-in-out_infinite]" />
         <style>{`
          @keyframes scan {
            0%, 100% { top: 0%; opacity: 0; }
            10%, 90% { opacity: 0.8; }
            50% { top: 100%; }
          }
         `}</style>
      </div>
    )
  },
  {
    num: "03",
    title: "Immersive Previews",
    desc: "Try-On Mode transforms how you buy. See it in your space before taking the next step.",
    visual: () => (
      <div className="w-full h-full flex flex-col items-center justify-center relative bg-white rounded-full shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden group">
         <div className="absolute inset-0 border-[20px] border-gray-50 rounded-full scale-110 group-hover:scale-100 transition-transform duration-1000 ease-out"></div>
         <View className="w-32 h-32 text-gray-200 group-hover:text-[#080808] transition-colors duration-700 stroke-[1px] relative z-10" />
      </div>
    )
  }
];

export default function PhilosophyStack() {
  return (
    <section className="bg-[#F0FDF4] relative pb-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-32 mb-12">
        <h2 className="text-4xl md:text-5xl font-heading font-black tracking-tighter text-[#080808]">Our Protocols.</h2>
        <p className="text-xl text-gray-600 font-medium mt-4 max-w-xl">The foundational pillars that guarantee a seamless, private, and boundless shopping experience.</p>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 pb-24">
        {protocols.map((card, idx) => {
          return (
            <div 
              key={idx} 
              className="sticky w-full origin-top mb-12 md:mb-24 last:mb-0"
              style={{ 
                top: `calc(15vh + ${idx * 30}px)`,
                zIndex: idx,
                height: '70vh',
                minHeight: '500px'
              }}
            >
              <div className="w-full h-full flex flex-col md:flex-row items-center bg-white rounded-[3rem] shadow-[0_-15px_40px_rgba(0,0,0,0.08)] border border-black/10 overflow-hidden transition-all duration-500">
                
                <div className="flex-1 p-10 md:p-20 flex flex-col justify-center bg-white">
                  <span className="font-mono text-primary font-bold tracking-widest uppercase mb-6 block text-sm bg-green-50 w-max px-4 py-2 rounded-full border border-green-100">Protocol_{card.num}</span>
                  <h2 className="text-4xl md:text-6xl font-heading font-bold tracking-tight mb-6 text-[#080808]">{card.title}</h2>
                  <p className="text-xl text-gray-600 font-body leading-relaxed max-w-md">
                    {card.desc}
                  </p>
                </div>

                <div className="flex-1 w-full h-1/2 md:h-full flex items-center justify-center bg-gray-50 p-8 md:p-16 border-l border-black/5 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent pointer-events-none" />
                  <div className="w-full max-w-xs md:max-w-sm aspect-square relative z-10 transition-transform duration-700 group-hover:scale-105">
                    {card.visual()}
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
