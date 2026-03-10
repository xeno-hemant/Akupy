export default function SocialProof() {
  const categories = [
    "Fashion & Retail",
    "Digital Services",
    "Beauty Salons",
    "Fitness Studios",
    "Local Cafes",
    "Health Clinics",
    "Virtual Try-Ons",
    "Incognito Browsers",
  ];

  const stats = [
    "Global Discovery",
    "100% Privacy-First",
    "Interactive Storefronts",
    "Smart Business Analytics",
    "Seamless Payments",
  ];

  return (
    <div className="w-full py-10 md:py-16 overflow-hidden relative" style={{ background: '#2e2a25', borderTop: '1px solid rgba(61,56,48,0.5)', borderBottom: '1px solid rgba(61,56,48,0.5)' }}>
      {/* Gradient fades */}
      <div className="absolute inset-y-0 left-0 w-24 md:w-48 z-10 pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(to right, #2e2a25, transparent)' }} />
      <div className="absolute inset-y-0 right-0 w-24 md:w-48 z-10 pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(to left, #2e2a25, transparent)' }} />

      <div className="flex flex-col gap-6 md:gap-10 w-full">
        {/* Category ticker */}
        <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_96px,_black_calc(100%-96px),transparent_100%)]">
          <ul className="flex items-center [&_li]:mx-8 animate-scroll whitespace-nowrap">
            {[...categories, ...categories].map((item, idx) => (
              <li key={idx} className="text-xl md:text-2xl font-heading font-medium text-[#8b8ba0]/60">
                {item}
                <span className="ml-8 animate-pulse" style={{ color: '#8E867B' }}>·</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Stats ticker (reverse) */}
        <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_96px,_black_calc(100%-96px),transparent_100%)]">
          <ul className="flex items-center [&_li]:mx-10 animate-scroll whitespace-nowrap" style={{ animationDirection: 'reverse' }}>
            {[...stats, ...stats].map((item, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#8E867B', boxShadow: '0 0 6px rgba(142,134,123,0.6)' }} />
                <span className="text-sm md:text-base font-mono text-white/60 lowercase tracking-wide">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
