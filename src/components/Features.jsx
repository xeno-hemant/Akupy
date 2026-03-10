import { useEffect, useState } from 'react';

// Hidden Hues tokens
const HH = {
  ivory: '#F3F0E2',
  cream: '#F0EADD',
  linen: '#E8E0D6',
  silver: '#D9D5D2',
  taupe: '#8E867B',
  dark: '#3d3830',
  muted: '#aba49c',
  sage: '#7a9e7e',
  terra: '#b5776e',
  amber: '#c4a882',
};

// Globe Shop Card — animated shuffler
function DiagnosticShuffler({ onClick }) {
  const items = ["Shop Globally", "Search Locally", "Discover Anywhere"];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentIndex(prev => (prev + 1) % items.length), 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      onClick={onClick}
      className="h-full min-h-[280px] rounded-[20px] p-6 md:p-8 flex flex-col justify-between overflow-hidden relative group cursor-pointer transition-all duration-300 hover:-translate-y-1"
      style={{
        background: `rgba(142,134,123,0.08)`,
        border: `1.5px solid rgba(142,134,123,0.25)`,
        borderLeft: `3px solid ${HH.taupe}`,
        boxShadow: 'none',
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 32px rgba(142,134,123,0.18)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-heading font-bold" style={{ color: HH.ivory }}>Globe Shop</h3>
          <span className="text-xs font-bold px-3 py-1 rounded-full"
            style={{ background: `rgba(142,134,123,0.18)`, border: `1px solid rgba(142,134,123,0.3)`, color: HH.silver }}>
            ₹99/mo
          </span>
        </div>
        <p className="text-sm mt-2 font-body" style={{ color: HH.muted }}>
          Shop globally from any registered store. (Higher delivery &amp; import charges apply)
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-3 relative h-32" style={{ perspective: '800px' }}>
        {items.map((item, idx) => (
          <div
            key={idx}
            className={`absolute w-full top-0 left-0 p-4 rounded-xl border transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex items-center justify-between ${idx === currentIndex ? 'opacity-100 translate-y-0 z-10' : idx < currentIndex ? 'opacity-0 -translate-y-4 z-0' : 'opacity-0 translate-y-4 z-0'
              }`}
            style={{ background: `rgba(142,134,123,0.09)`, borderColor: `rgba(142,134,123,0.22)` }}
          >
            <span className="font-medium text-sm" style={{ color: HH.ivory }}>{item}</span>
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: HH.taupe, boxShadow: `0 0 8px ${HH.taupe}` }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// Incognito Mode Card — typewriter
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
        setTimeout(() => { setIsTyping(true); index = 0; setText(""); type(); }, 5000);
      }
    };
    const d = setTimeout(type, 1000);
    return () => clearTimeout(d);
  }, []);

  return (
    <div
      onClick={onClick}
      className="h-full min-h-[280px] rounded-[20px] p-6 md:p-8 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:-translate-y-1"
      style={{
        background: `rgba(171,164,156,0.09)`,
        border: `1.5px solid rgba(171,164,156,0.28)`,
        borderLeft: `3px solid ${HH.muted}`,
        boxShadow: 'none',
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 32px rgba(171,164,156,0.14)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-heading font-bold" style={{ color: HH.ivory }}>Incognito Mode</h3>
          <span className="text-xs font-bold px-3 py-1 rounded-full"
            style={{ background: `rgba(171,164,156,0.18)`, border: `1px solid rgba(171,164,156,0.3)`, color: HH.silver }}>
            ₹99/mo
          </span>
        </div>
        <p className="text-sm mt-2 font-body" style={{ color: HH.muted }}>
          Absolute anonymity. Identity completely hidden, nothing stored in DB.
        </p>
      </div>

      <div className="mt-8 rounded-xl p-4 font-mono text-sm leading-relaxed h-24"
        style={{ background: `rgba(171,164,156,0.1)`, border: `1px solid rgba(171,164,156,0.2)` }}>
        <div className="flex items-center gap-2 mb-2 text-xs" style={{ color: HH.muted }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: HH.terra }} />
          <span className="uppercase tracking-widest">LIVE EVENT</span>
        </div>
        <p style={{ color: HH.silver }}>
          {text}
          <span className={`${isTyping ? 'opacity-100' : 'animate-pulse'}`} style={{ color: HH.muted }}>|</span>
        </p>
      </div>
    </div>
  );
}

// 360° Try-On Card — SVG chart
function InteractiveTryOnGraph({ onClick }) {
  return (
    <div
      onClick={onClick}
      className="h-full min-h-[280px] rounded-[20px] p-6 md:p-8 flex flex-col justify-between col-span-1 md:col-span-2 lg:col-span-1 cursor-pointer transition-all duration-300 hover:-translate-y-1"
      style={{
        background: `rgba(196,168,130,0.07)`,
        border: `1.5px solid rgba(196,168,130,0.25)`,
        borderLeft: `3px solid ${HH.amber}`,
        boxShadow: 'none',
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 32px rgba(196,168,130,0.18)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-heading font-bold" style={{ color: HH.ivory }}>360° Try-On</h3>
          <span className="text-xs font-bold px-3 py-1 rounded-full"
            style={{ background: `rgba(196,168,130,0.15)`, color: HH.amber, border: `1px solid rgba(196,168,130,0.3)` }}>
            Free
          </span>
        </div>
        <p className="text-sm mt-2 font-body" style={{ color: HH.muted }}>
          Scan or enter details to create your body clone. Try clothes virtually before buying.
        </p>
      </div>

      <div className="mt-8 relative h-32 w-full flex items-end">
        <svg viewBox="0 0 200 100" className="w-full h-full overflow-visible">
          <path
            d="M 0 80 Q 20 60 40 70 T 80 40 T 130 50 T 200 10"
            fill="none"
            stroke={HH.amber}
            strokeWidth="2.5"
            strokeLinecap="round"
            style={{ strokeDasharray: '600', strokeDashoffset: '0', animation: 'drawLine 2s ease-out forwards' }}
          />
          <circle cx="200" cy="10" r="4" fill={HH.amber} className="animate-pulse" style={{ filter: `drop-shadow(0 0 6px ${HH.amber})` }} />
        </svg>
        <span className="absolute bottom-2 right-2 font-mono text-xs" style={{ color: HH.muted }}>confidence: 99.9%</span>
      </div>
    </div>
  );
}

export default function Features({
  onGlobeShopClick = () => { },
  onIncognitoClick = () => { },
  onTryOnClick = () => { }
}) {
  return (
    <section className="py-16 md:py-28 px-4 md:px-16 max-w-7xl mx-auto" style={{ background: HH.dark }}>
      <div className="mb-10 md:mb-16 text-center md:text-left">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold" style={{ color: HH.ivory }}>
          Purpose-Built Tools.
        </h2>
        <p className="text-lg mt-4 max-w-xl font-body" style={{ color: HH.muted }}>
          Everything designed to connect people with products faster, smarter, and more securely. Click on any feature to activate or learn more.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div style={{ animation: 'fadeInUp 0.6s ease-out 0.1s both' }}>
          <DiagnosticShuffler onClick={onGlobeShopClick} />
        </div>
        <div style={{ animation: 'fadeInUp 0.6s ease-out 0.25s both' }}>
          <TelemetryTypewriter onClick={onIncognitoClick} />
        </div>
        <div style={{ animation: 'fadeInUp 0.6s ease-out 0.4s both' }}>
          <InteractiveTryOnGraph onClick={onTryOnClick} />
        </div>
      </div>
    </section>
  );
}
