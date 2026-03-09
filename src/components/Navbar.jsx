import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Search, User, Menu, X, ShoppingCart, Trash2, Plus, Minus, EyeOff, Globe } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useCartStore from '../store/useCartStore';
import useFeatureStore from '../store/useFeatureStore';
import GlobalMapViewer from './GlobalMapViewer';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isGlobeMapOpen, setIsGlobeMapOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuthStore();
  const { cart, removeFromCart, updateQuantity, getTotalItems, getTotalPrice } = useCartStore();
  const { isIncognitoActive, setIncognito, isGlobeShopActive } = useFeatureStore();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (isSubdomain) {
        window.location.href = `${rootUrl}/discover?q=${encodeURIComponent(searchQuery)}`;
      } else {
        navigate(`/discover?q=${encodeURIComponent(searchQuery)}`);
      }
      setIsMenuOpen(false);
    }
  };

  // Subdomain Detection to break out of Shop Subdomains
  const hostname = window.location.hostname;
  let isSubdomain = false;
  if (hostname.includes('localhost') && hostname !== 'localhost') isSubdomain = true;
  else if (hostname.includes('akupy.in')) {
    const parts = hostname.split('.');
    if (parts.length > 2 && parts[0] !== 'www') isSubdomain = true;
  }
  const rootUrl = hostname.includes('localhost') ? 'http://localhost:5173' : 'https://akupy.in';

  // Helper to render <Link> or <a>
  const NavLink = ({ to, className, children, onClick }) => {
    if (isSubdomain) {
      return <a href={`${rootUrl}${to}`} className={className} onClick={onClick}>{children}</a>;
    }
    return <Link to={to} className={className} onClick={onClick}>{children}</Link>;
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 backdrop-blur-md border-b transition-colors duration-500 ${isIncognitoActive ? 'bg-[#080808]/90 border-transparent text-white' : 'bg-white/80 border-black/5 text-[#080808]'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-20">
        
        {/* Logo */}
        <NavLink to="/" className="flex items-center hover:opacity-80 transition-opacity">
          <svg viewBox="0 0 400 120" className="h-10 md:h-12 w-auto">
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
            <text x="100" y="80" fontFamily="sans-serif" fontWeight="900" fontSize="55" fill={isIncognitoActive ? "#FFFFFF" : "#080808"} letterSpacing="-2">
              akupy<tspan fill="#8DE86A">.</tspan>
            </text>
          </svg>
        </NavLink>

        {/* Desktop Search Bar (Mid) */}
        <div className="hidden md:block flex-grow max-w-xl mx-8">
          <form onSubmit={handleSearch} className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder={isIncognitoActive ? "Incognito search active..." : "Search local businesses..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full border focus:border-primary/50 text-sm rounded-full py-2.5 pl-12 pr-12 outline-none transition-all ${isIncognitoActive ? 'bg-white/10 border-transparent text-white placeholder-gray-400 focus:bg-white/20 focus:border-blue-500/50' : 'bg-gray-100/50 border-transparent text-[#080808] focus:bg-white'}`}
            />
            <button 
              type="button" 
              onClick={() => setIsGlobeMapOpen(true)} 
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-gray-200/50 text-gray-400 hover:text-primary transition-colors focus:outline-none group" 
              title="Open Global 3D Map"
            >
               <Globe className={`w-5 h-5 ${isGlobeShopActive ? 'text-primary' : ''}`} />
               <span className="absolute -top-8 right-0 bg-black text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">Global Map</span>
            </button>
          </form>
        </div>

        {/* Desktop Auth / Nav (Right) */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink to="/discover" className={`text-sm font-medium transition-colors ${isIncognitoActive ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-[#080808]'}`}>Discover</NavLink>
          {user ? (
            <div className="flex items-center gap-4">
              {isIncognitoActive ? (
                <button 
                  onClick={() => setIncognito(false)}
                  className="flex items-center gap-2 text-sm font-semibold bg-white/10 px-4 py-2 rounded-full text-blue-400 border border-blue-500/30 hover:bg-red-500/20 hover:text-red-400 transition-colors cursor-pointer group"
                >
                  <EyeOff className="w-4 h-4" />
                  <span className="group-hover:hidden">Anonymous</span>
                  <span className="hidden group-hover:inline">Disable Privacy</span>
                </button>
              ) : (
                <NavLink to="/dashboard" className="flex items-center gap-2 text-sm font-semibold bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-colors text-[#080808]">
                  <User className="w-4 h-4" />
                  {user.role === 'business' ? 'Dashboard' : 'Profile'}
                </NavLink>
              )}
              <button onClick={logout} className="text-sm font-medium text-gray-400 hover:text-red-500 transition-colors">Logout</button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <button 
                onClick={() => {
                  if (isSubdomain) {
                    window.location.href = `${rootUrl}/shop#register-section`;
                    return;
                  }
                  const el = document.querySelector('#register-section');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    navigate('/shop');
                    setTimeout(() => document.querySelector('#register-section')?.scrollIntoView({ behavior: 'smooth' }), 500);
                  }
                }}
                className="text-sm font-medium text-[#080808] hover:text-primary transition-colors"
              >
                Sign In
              </button>
              <button 
                onClick={() => {
                  if (isSubdomain) {
                    window.location.href = `${rootUrl}/shop#register-section`;
                    return;
                  }
                  const el = document.querySelector('#register-section');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    navigate('/shop');
                    setTimeout(() => document.querySelector('#register-section')?.scrollIntoView({ behavior: 'smooth' }), 500);
                  }
                }}
                className="text-sm font-semibold bg-[#080808] text-white px-5 py-2.5 rounded-full hover:bg-black/80 transition-transform active:scale-95"
              >
                Register
              </button>
            </div>
          )}
          
          {/* Cart Icon */}
          <button 
            onClick={() => {
              if (isSubdomain) {
                window.location.href = `${rootUrl}/cart`;
              } else {
                navigate('/cart');
              }
            }}
            className="relative p-2 text-[#080808] hover:text-primary transition-colors cursor-pointer group"
          >
            <ShoppingCart className="w-6 h-6" />
            {getTotalItems() > 0 && (
              <span className="absolute top-0 right-0 bg-primary text-[#080808] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center translate-x-1 -translate-y-1 border-2 border-white">
                {getTotalItems()}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Menu Toggle & Cart */}
        <div className="md:hidden flex items-center gap-4">
          <button 
            onClick={() => {
              if (isSubdomain) {
                window.location.href = `${rootUrl}/cart`;
              } else {
                navigate('/cart');
              }
            }}
            className="relative p-2 text-[#080808] hover:text-primary transition-colors cursor-pointer"
          >
            <ShoppingCart className="w-6 h-6" />
            {getTotalItems() > 0 && (
              <span className="absolute top-0 right-0 bg-primary text-[#080808] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center translate-x-1 -translate-y-1 border-2 border-white">
                {getTotalItems()}
              </span>
            )}
          </button>
          <button 
            className="text-[#080808] p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-black/5 p-6 animate-fade-in flex flex-col gap-6 shadow-xl">
          <form onSubmit={handleSearch} className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search local businesses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100 border border-transparent focus:bg-white focus:border-primary/50 text-[#080808] rounded-full py-3 pl-12 pr-12 outline-none transition-all"
            />
            <button 
              type="button" 
              onClick={() => { setIsGlobeMapOpen(true); setIsMenuOpen(false); }} 
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-200 text-gray-400 hover:text-primary transition-colors focus:outline-none" 
            >
               <Globe className="w-5 h-5" />
            </button>
          </form>

          <NavLink to="/discover" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium text-[#080808]">Discover Stores</NavLink>
          
          <div className="h-px w-full bg-gray-100"></div>

          {user ? (
            <div className="flex flex-col gap-4">
              <NavLink to="/dashboard" onClick={() => setIsMenuOpen(false)} className="text-lg font-semibold text-primary flex items-center gap-2">
                <User /> {user.role === 'business' ? 'Business Dashboard' : 'My Profile'}
              </NavLink>
              <button onClick={() => { logout(); setIsMenuOpen(false); }} className="text-lg font-medium text-gray-500 text-left">Logout</button>
            </div>
          ) : (
             <div className="flex flex-col gap-4">
              <button 
                onClick={() => {
                  setIsMenuOpen(false);
                  if (isSubdomain) {
                    window.location.href = `${rootUrl}/shop#register-section`;
                    return;
                  }
                  const el = document.querySelector('#register-section');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    navigate('/shop');
                    setTimeout(() => document.querySelector('#register-section')?.scrollIntoView({ behavior: 'smooth' }), 500);
                  }
                }}
                className="text-lg font-semibold bg-[#080808] text-white px-6 py-3 rounded-full text-center"
              >
                Login / Register
              </button>
            </div>
          )}
        </div>
      )}

      <GlobalMapViewer 
        isOpen={isGlobeMapOpen} 
        onClose={() => setIsGlobeMapOpen(false)} 
      />
    </nav>
  );
}
