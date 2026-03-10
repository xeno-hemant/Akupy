import { useRef } from 'react';
import { Globe, ShieldCheck, View } from 'lucide-react';

// Hidden Hues palette mapped to accents
const HH = {
  taupe: '#8E867B', // Replaces green
  amber: '#c4a882', // Replaces yellow
  dark: '#3d3830', // New dark background
  muted: '#aba49c', // Replaces purple/blue accents
  terra: '#b5776e', // Additional accent
};

const protocols = [
  {
    num: "01",
    title: "Global Explore",
    desc: "Discover businesses half a world away as easily as the coffee shop next door.",
    accent: HH.taupe,
    tagBg: 'rgba(142,134,123,0.12)',
    tagBorder: 'rgba(142,134,123,0.3)',
    tagColor: HH.taupe,
    glow: 'rgba(142,134,123,0.08)',
    Icon: Globe
  },
  {
    num: "02",
    title: "Privacy First",
    desc: "Incognito search means your preferences are yours. Browse anonymously, decide freely.",
    accent: HH.muted,
    tagBg: 'rgba(171,164,156,0.12)',
    tagBorder: 'rgba(171,164,156,0.3)',
    tagColor: HH.muted,
    glow: 'rgba(171,164,156,0.08)',
    Icon: ShieldCheck
  },
  {
    num: "03",
    title: "Immersive Previews",
    desc: "Try-On Mode transforms how you buy. See it in your space before taking the next step.",
    accent: HH.amber,
    tagBg: 'rgba(196,168,130,0.12)',
    tagBorder: 'rgba(196,168,130,0.3)',
    tagColor: HH.amber,
    glow: 'rgba(196,168,130,0.08)',
    Icon: View
  }
];

export default function PhilosophyStack() {
  return (
    <section style={{ background: HH.dark }} className="relative pb-16 md:pb-28">
      <div className="max-w-7xl mx-auto px-4 md:px-12 pt-16 md:pt-28 mb-8 md:mb-12">
        <h2 className="text-3xl md:text-5xl font-heading font-black tracking-tighter text-[#F3F0E2]">Our Protocols.</h2>
        <p className="text-lg text-[#aba49c] font-body mt-4 max-w-xl">The foundational pillars that guarantee a seamless, private, and boundless shopping experience.</p>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-12 pb-8 md:pb-20">
        {protocols.map((card, idx) => (
          <div
            key={idx}
            className="sticky w-full origin-top mb-10 md:mb-20 last:mb-0"
            style={{
              top: `calc(15vh + ${idx * 30}px)`,
              zIndex: idx,
              height: '70vh',
              minHeight: '480px'
            }}
          >
            <div
              className="w-full flex flex-col md:flex-row overflow-hidden transition-all duration-500"
              style={{
                background: '#2e2a25',
                border: '1px solid rgba(142,134,123,0.2)',
                borderRadius: '2rem',
                boxShadow: `0 -10px 40px ${card.glow}`
              }}
            >
              {/* Text */}
              <div className="flex-1 p-6 md:p-16 flex flex-col justify-center order-2 md:order-1">
                <span
                  className="font-mono text-xs uppercase tracking-[0.12em] mb-4 md:mb-6 block w-max px-4 py-2 rounded-full font-bold"
                  style={{ background: card.tagBg, border: `1px solid ${card.tagBorder}`, color: card.tagColor }}
                >
                  Protocol_{card.num}
                </span>
                <h2 className="text-3xl md:text-5xl font-heading font-bold tracking-tight mb-4 md:mb-6 text-[#F3F0E2]">{card.title}</h2>
                <p className="text-base md:text-lg text-[#aba49c] font-body leading-relaxed max-w-md">
                  {card.desc}
                </p>
              </div>

              {/* Visual */}
              <div
                className="w-full md:flex-1 h-44 md:h-full flex items-center justify-center p-8 md:p-16 relative overflow-hidden order-1 md:order-2"
                style={{ borderLeft: 'none', borderBottom: '1px solid rgba(142,134,123,0.1)' }}
              >
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 70% 50%, ${card.accent}15, transparent 70%)` }}
                />
                <div
                  className="w-36 h-36 md:w-56 md:h-56 rounded-full flex items-center justify-center relative animate-float"
                  style={{
                    background: `${card.accent}15`,
                    border: `1.5px solid ${card.accent}30`
                  }}
                >
                  <card.Icon className="w-16 h-16 md:w-24 md:h-24 stroke-[1px]" style={{ color: card.accent, filter: `drop-shadow(0 0 16px ${card.accent}60)` }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
