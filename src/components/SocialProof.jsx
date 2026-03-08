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
    <div className="w-full py-20 overflow-hidden bg-background border-y border-foreground/5 relative">
      {/* Gradient Fades */}
      <div 
        className="absolute inset-y-0 left-0 w-32 md:w-64 z-10 pointer-events-none" 
        style={{ backgroundImage: 'linear-gradient(to right, var(--background), transparent)' }} 
      />
      <div 
        className="absolute inset-y-0 right-0 w-32 md:w-64 z-10 pointer-events-none" 
        style={{ backgroundImage: 'linear-gradient(to left, var(--background), transparent)' }} 
      />

      <div className="flex flex-col gap-12 w-full max-w-[2000px] mx-auto">
        <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
          <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 animate-scroll whitespace-nowrap">
            {categories.map((item, idx) => (
              <li key={idx} className="text-xl md:text-3xl font-heading font-medium text-secondary/60">
                {item}
              </li>
            ))}
            {categories.map((item, idx) => (
              <li key={`dup-${idx}`} className="text-xl md:text-3xl font-heading font-medium text-secondary/60">
                {item}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
          <ul className="flex items-center justify-center md:justify-start [&_li]:mx-12 animate-scroll whitespace-nowrap" style={{ animationDirection: 'reverse' }}>
             {stats.map((item, idx) => (
              <li key={idx} className="flex items-center gap-4">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm md:text-lg font-mono text-foreground/80 lowercase">
                  {item}
                </span>
              </li>
            ))}
            {stats.map((item, idx) => (
              <li key={`dup-${idx}`} className="flex items-center gap-4">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm md:text-lg font-mono text-foreground/80 lowercase">
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
