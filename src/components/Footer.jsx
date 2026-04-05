import { Instagram, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="w-full px-5 md:px-16 pt-16 pb-10 mt-0 relative overflow-hidden"
      style={{
        background: '#D9D5D2',
        borderTop: '1px solid #c8c2bc',
      }}
    >
      <div
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 pb-12"
        style={{ borderBottom: '1px solid #c8c2bc' }}
      >

        {/* Brand */}
        <div className="md:col-span-4 flex flex-col items-start">
          <Link to="/" className="inline-block mb-4 hover:opacity-80 transition-opacity">
            <span className="text-3xl font-heading font-black tracking-tight text-[#3d3830]">
              akupy<span className="text-[#8E867B]">.</span>
            </span>
          </Link>
          <p className="text-[#8E867B] font-body text-sm max-w-xs mb-6 leading-relaxed">
            The smart discovery platform bridging the physical and digital marketplace.
          </p>
          <div
            className="flex items-center gap-3 rounded-full px-4 py-2"
            style={{ background: '#F0EADD', border: '1px solid #c8c2bc' }}
          >
            <span
              className="w-2 h-2 rounded-full bg-[#7a9e7e] animate-pulse"
              style={{ boxShadow: '0 0 8px rgba(122,158,126,0.6)' }}
            />
            <span className="font-mono text-xs uppercase tracking-widest text-[#7a9e7e]">System Operational</span>
          </div>
        </div>

        {/* Explore links */}
        <div className="md:col-span-3 md:col-start-7 flex flex-col gap-3">
          <span className="font-mono text-xs text-[#aba49c] uppercase tracking-[0.1em] mb-1">Explore</span>
          <Link to="/discover" className="text-[#8E867B] hover:text-[#3d3830] transition-colors text-sm font-body font-medium">Find Shops</Link>
          <Link to="/wardrobe" className="text-[#8E867B] hover:text-[#3d3830] transition-colors text-sm font-body font-medium">Try-On Gallery</Link>
          <Link to="/shop" className="text-[#8E867B] hover:text-[#3d3830] transition-colors text-sm font-body font-medium">Global Map</Link>
        </div>

        {/* Creator links */}
        <div className="md:col-span-3 flex flex-col gap-3">
          <span className="font-mono text-xs text-[#aba49c] uppercase tracking-[0.1em] mb-1">Creator</span>
          <a
            href="https://www.instagram.com/xeno._hemant?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
            target="_blank" rel="noopener noreferrer"
            className="text-[#8E867B] hover:text-[#3d3830] transition-colors text-sm flex items-center gap-2 font-body font-medium"
          >
            <Instagram className="w-4 h-4" /> Instagram
          </a>
          <a
            href="mailto:xeno.hemant@gmail.com"
            className="text-[#8E867B] hover:text-[#3d3830] transition-colors text-sm flex items-center gap-2 font-body font-medium"
          >
            <Mail className="w-4 h-4" /> Email
          </a>
        </div>

        {/* Legal & Support */}
        <div className="md:col-span-2 flex flex-col gap-3">
          <span className="font-mono text-xs text-[#aba49c] uppercase tracking-[0.1em] mb-1">Legal</span>
          <Link to="/privacy-policy" className="text-[#8E867B] hover:text-[#3d3830] transition-colors text-sm font-body font-medium">Privacy Policy</Link>
          <Link to="/terms" className="text-[#8E867B] hover:text-[#3d3830] transition-colors text-sm font-body font-medium">Terms & Conditions</Link>
          <Link to="/support" className="text-[#8E867B] hover:text-[#3d3830] transition-colors text-sm font-body font-medium">Support</Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-7 flex flex-col md:flex-row justify-between items-center text-sm text-[#aba49c] font-mono gap-3 text-center md:text-left">
        <span>© {currentYear} akupy. Founder and CEO Hemant Gurjar.</span>
        <span className="flex items-center gap-2">
          Created with ♥ by <span style={{ color: '#8E867B' }} className="font-bold tracking-wider">Hemant Gurjar</span>
        </span>
      </div>
    </footer>
  );
}
