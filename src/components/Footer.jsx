import { Instagram, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#080808] text-white rounded-t-[3.5rem] px-6 md:px-16 pt-24 pb-12 mt-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 border-b border-white/10 pb-16">
        
        {/* Brand */}
        <div className="md:col-span-4 flex flex-col items-start">
          <Link to="/" className="inline-block mb-4 hover:opacity-80 transition-opacity">
            {/* Custom SVG Logo matching the user's provided design */}
            <svg viewBox="0 0 400 120" className="h-10 md:h-12 w-auto grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
              {/* Speed Lines */}
              <line x1="10" y1="50" x2="40" y2="50" stroke="#8DE86A" strokeWidth="6" strokeLinecap="round" />
              <line x1="0" y1="65" x2="35" y2="65" stroke="#8DE86A" strokeWidth="6" strokeLinecap="round" />
              <line x1="20" y1="80" x2="40" y2="80" stroke="#8DE86A" strokeWidth="6" strokeLinecap="round" />
              
              {/* Shopping Cart Body */}
              <path d="M 35 45 L 85 45 L 75 80 L 45 80 Z" fill="#8DE86A" />
              
              {/* Cart Wheels */}
              <circle cx="50" cy="90" r="7" fill="#1EB854" />
              <circle cx="70" cy="90" r="7" fill="#1EB854" />
              
              {/* akupy Text with Green Dot */}
            <text x="100" y="80" fontFamily="sans-serif" fontWeight="900" fontSize="55" fill="#FFFFFF" letterSpacing="-2">
              akupy<tspan fill="#8DE86A">.</tspan>
            </text>
          </svg>
          </Link>
          <p className="text-white/60 font-body text-sm max-w-xs mb-8">
            The smart discovery platform bridging the physical and digital marketplace.
          </p>
          <div className="flex items-center gap-3 bg-white/5 rounded-full px-4 py-2 border border-white/10">
             <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_var(--primary)]" />
             <span className="font-mono text-xs uppercase tracking-widest text-white/80">System Operational</span>
          </div>
        </div>

        {/* Links Center */}
        <div className="md:col-span-3 md:col-start-7 flex flex-col gap-4">
          <span className="font-mono text-xs text-secondary/50 uppercase tracking-widest mb-2">Explore</span>
          <a href="#" className="text-white/80 hover:text-primary transition-colors text-sm">Find Shops</a>
          <a href="#" className="text-white/80 hover:text-primary transition-colors text-sm">Try-On Gallery</a>
          <a href="#" className="text-white/80 hover:text-primary transition-colors text-sm">Global Map</a>
        </div>

        {/* Legal Right */}
        <div className="md:col-span-3 flex flex-col gap-4">
           <span className="font-mono text-xs text-secondary/50 uppercase tracking-widest mb-2">Creator</span>
           <a href="https://www.instagram.com/xeno._hemant?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-primary transition-colors text-sm flex items-center gap-2">
             <Instagram className="w-4 h-4" /> Instagram
           </a>
           <a href="mailto:xeno.hemant@gmail.com" className="text-white/80 hover:text-primary transition-colors text-sm flex items-center gap-2">
             <Mail className="w-4 h-4" /> Email
           </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-white/60 font-mono gap-4 text-center md:text-left">
        <span>© {currentYear} akupy. Founder and CEO Hemant Gurjar.</span>
        <span className="flex items-center gap-2">
          Created with ♥ by <span className="text-primary font-bold tracking-wider">Hemant Gurjar</span>
        </span>
      </div>
    </footer>
  );
}
