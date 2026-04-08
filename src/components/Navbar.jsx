import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, User, Globe, Shield, MapPin, ChevronDown } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useCartStore from '../store/useCartStore';
import useFeatureStore from '../store/useFeatureStore';
import useLocationStore, { INDIAN_CITIES } from '../store/useLocationStore';
import GlobeShopOverlay from './GlobeShopOverlay';

const CATEGORIES = ['Fashion', 'Electronics', 'Food', 'Services', 'Beauty', 'Home', 'Mobiles'];

// ─── City Pill & Selector ────────────────────────────────────────────────────
function CityPill({ city, locLoading, locError, showCityPicker, setShowCityPicker, setCity, detect, citySearch, setCitySearch, cityPickerRef }) {
  const filteredCities = INDIAN_CITIES.filter(c =>
    c.toLowerCase().includes((citySearch || '').toLowerCase())
  );

  return (
    <div className="relative" ref={cityPickerRef}>
      <button
        onClick={() => setShowCityPicker(p => !p)}
        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full transition-all"
        style={{ background: city ? '#DCFCE7' : '#F3F4F6', color: city ? '#16A34A' : '#6B7280' }}
      >
        {locLoading ? (
          <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin inline-block" />
        ) : (
          <MapPin className="w-3 h-3 flex-shrink-0" />
        )}
        <span>{locLoading ? 'Detecting...' : city ? `Showing near ${city}` : 'Set your city'}</span>
        <ChevronDown className="w-3 h-3 opacity-60" />
      </button>

      {/* Dropdown */}
      {showCityPicker && (
        <div
          className="absolute top-full left-0 mt-1 z-[200] w-64 rounded-2xl shadow-xl border overflow-hidden"
          style={{ background: '#FFFFFF', borderColor: '#E5E7EB' }}
        >
          {locError === 'denied' && (
            <p className="text-[11px] font-semibold text-amber-600 px-3 pt-3 pb-0">
              📍 Location access denied. Pick a city below:
            </p>
          )}
          {locError !== 'denied' && !city && (
            <button
              onClick={() => { detect(); setShowCityPicker(false); }}
              className="w-full flex items-center gap-2 text-[12px] font-bold px-4 py-3 border-b border-gray-100 hover:bg-green-50 transition-colors text-green-700"
            >
              <MapPin className="w-3.5 h-3.5" /> Use my location
            </button>
          )}
          <div className="px-3 py-2 border-b border-gray-50">
            <input
              type="text"
              placeholder="Search cities..."
              value={citySearch}
              onChange={e => setCitySearch(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 outline-none focus:border-green-400"
              autoFocus
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filteredCities.map(c => (
              <button
                key={c}
                onClick={() => { setCity(c); setShowCityPicker(false); setCitySearch(''); }}
                className="w-full text-left text-[13px] font-medium px-4 py-2.5 hover:bg-green-50 hover:text-green-700 transition-colors"
                style={{ color: city === c ? '#16A34A' : '#1A1A1A', fontWeight: city === c ? 700 : 500 }}
              >
                {city === c ? '✓ ' : ''}{c}
              </button>
            ))}
          </div>
          {city && (
            <button
              onClick={() => { setCity(''); setShowCityPicker(false); }}
              className="w-full text-[12px] font-semibold text-gray-400 hover:text-red-500 px-4 py-2.5 border-t border-gray-50 transition-colors text-center"
            >
              × Clear city filter
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// AkupyLogo SVG
export function AkupyLogo({ size = 'md', dark = false }) {
  const textColor = dark ? '#FFFFFF' : '#1A1A1A';
  const h = size === 'sm' ? 'h-6' : size === 'lg' ? 'h-12' : 'h-8';

  return (
    <svg viewBox="0 0 380 100" className={`${h} w-auto`} style={{ display: 'block' }}>
      {/* Speed lines */}
      <line x1="2" y1="38" x2="36" y2="38" stroke="#22C55E" strokeWidth="7" strokeLinecap="round" />
      <line x1="0" y1="52" x2="30" y2="52" stroke="#22C55E" strokeWidth="7" strokeLinecap="round" />
      <line x1="8" y1="66" x2="36" y2="66" stroke="#22C55E" strokeWidth="7" strokeLinecap="round" />
      {/* Cart body */}
      <path d="M 32 32 L 86 32 L 78 68 L 40 68 Z" fill="#22C55E" />
      {/* Wheels */}
      <circle cx="47" cy="80" r="8" fill="#16A34A" />
      <circle cx="71" cy="80" r="8" fill="#16A34A" />
      {/* Text */}
      <text x="100" y="72" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="900" fontSize="62" fill={textColor} letterSpacing="-2">
        akupy<tspan fill="#22C55E">.</tspan>
      </text>
    </svg>
  );
}


export default function Navbar() {
  const [isGlobeMapOpen, setIsGlobeMapOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [catVisible, setCatVisible] = useState(true);
  const lastScrollY = useRef(0);


  const { user, logout } = useAuthStore();
  const { getTotalItems } = useCartStore();
  const { isIncognitoActive, setIncognito } = useFeatureStore();
  const { city, error: locError, loading: locLoading, setCity, detect } = useLocationStore();
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const cityPickerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close city picker on outside click
  useEffect(() => {
    const handler = (e) => {
      if (cityPickerRef.current && !cityPickerRef.current.contains(e.target)) {
        setShowCityPicker(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Scroll direction detection for category row
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY < 20) {
        setCatVisible(true);
      } else if (currentY > lastScrollY.current) {
        // Scrolling DOWN — hide categories
        setCatVisible(false);
      } else {
        // Scrolling UP — show categories
        setCatVisible(true);
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/discover?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat === activeCategory ? '' : cat);
    navigate(`/discover?category=${encodeURIComponent(cat)}`);
  };

  const handleIncognitoToggle = () => {
    const newState = !isIncognitoActive;
    setIncognito(newState);
    window.dispatchEvent(new CustomEvent('incognito-toast', {
      detail: { message: newState ? 'Incognito Mode Active — Identity hidden from sellers' : 'Incognito session ended.' }
    }));
  };

  const isMinimal = location.pathname === '/login';
  const getLogoLink = () => {
    if (location.pathname === '/login') return '/login';
    if (location.pathname.startsWith('/seller')) return '/seller/dashboard';
    return '/shop';
  };

  const navBg = isIncognitoActive ? '#2C2A27' : '#F5F0E8';
  const navBorder = isIncognitoActive ? 'rgba(255,255,255,0.06)' : '#E5E7EB';
  const textColor = isIncognitoActive ? '#F5F0E8' : '#1A1A1A';
  const mutedColor = isIncognitoActive ? '#9CA3AF' : '#6B7280';

  return (
    <>
      <nav
        className="fixed top-0 left-0 w-full z-50 transition-colors duration-300"
        style={{
          background: navBg,
          borderBottom: `1px solid ${navBorder}`,
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
        }}
      >
        {/* TOP ROW */}
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 h-[60px] flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to={getLogoLink()} className="flex-shrink-0">
            <AkupyLogo size="sm" dark={isIncognitoActive} />
          </Link>

          {/* Desktop Search Bar + City Pill */}
          {!isMinimal && (
            <div className="hidden md:flex flex-col flex-grow max-w-2xl mx-8 gap-1">
              <form onSubmit={handleSearch} className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#6B7280' }} />
                <input
                  type="text"
                  placeholder="Search products, shops..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 pl-11 pr-12 rounded-full text-sm font-medium outline-none border-2 transition-all"
                  style={{
                    background: isIncognitoActive ? 'rgba(255,255,255,0.06)' : '#FFFFFF',
                    borderColor: isIncognitoActive ? 'rgba(255,255,255,0.12)' : '#E5E7EB',
                    color: textColor,
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#22C55E'}
                  onBlur={(e) => e.target.style.borderColor = isIncognitoActive ? 'rgba(255,255,255,0.12)' : '#E5E7EB'}
                />
                <button
                  type="button"
                  onClick={() => setIsGlobeMapOpen(true)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-colors"
                  style={{ color: '#22C55E' }}
                  title="Globe Shop"
                >
                  <Globe className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* Desktop Right Icons */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            <button
              onClick={handleIncognitoToggle}
              title={isIncognitoActive ? 'Disable Incognito' : 'Enable Incognito'}
              className="p-2 rounded-full transition-all relative"
              style={{
                background: isIncognitoActive ? '#22C55E' : 'transparent',
                color: isIncognitoActive ? '#fff' : '#6B7280'
              }}
            >
              <Shield className="w-5 h-5" />
              {isIncognitoActive && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-white"></span>
              )}
            </button>

            {user ? (
              <Link
                to={user?.role === 'seller' ? '/seller/dashboard' : '/dashboard'}
                className="flex items-center gap-2 p-1 rounded-full transition-colors group"
                style={{ color: '#6B7280' }}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center font-bold text-sm text-white flex-shrink-0 transition-all group-hover:ring-2 group-hover:ring-[#22C55E] group-hover:ring-offset-1"
                  style={{ background: user.avatarUrl ? 'transparent' : '#22C55E' }}>
                  {user.avatarUrl
                    ? <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                    : (user.fullName?.[0] || user.email?.[0] || 'U').toUpperCase()
                  }
                </div>
                <span className="hidden lg:inline text-sm font-bold group-hover:text-[#22C55E]">Dashboard</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="text-sm font-bold px-4 py-2 rounded-full border-2 transition-all flex items-center gap-2"
                style={{ borderColor: '#22C55E', color: '#22C55E' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#22C55E'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#22C55E'; }}
              >
                Log In
              </Link>
            )}

            <Link to="/cart" className="relative p-2 rounded-full transition-colors" style={{ color: '#1A1A1A' }}>
              <ShoppingCart className="w-5 h-5" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 flex items-center justify-center text-[10px] font-bold rounded-full bg-[#22C55E] text-white border-2 border-white">
                  {getTotalItems()}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile: Cart + Profile only */}
          <div className="md:hidden flex items-center gap-2">
            <Link to="/cart" className="relative p-2 rounded-full" style={{ color: '#1A1A1A' }}>
              <ShoppingCart className="w-5 h-5" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center text-[9px] font-bold rounded-full bg-[#22C55E] text-white">
                  {getTotalItems()}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* MOBILE SEARCH ROW */}
        {!isMinimal && (
          <div className="md:hidden px-4 pb-2">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#6B7280' }} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-11 pr-12 rounded-full text-sm font-medium outline-none border-2 transition-all shadow-sm"
                style={{
                  background: isIncognitoActive ? 'rgba(255,255,255,0.06)' : '#FFFFFF',
                  borderColor: '#E5E7EB',
                  color: textColor,
                }}
                onFocus={(e) => e.target.style.borderColor = '#22C55E'}
                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
              />
              <button
                type="button"
                onClick={() => setIsGlobeMapOpen(true)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
                style={{ color: '#22C55E' }}
              >
                <Globe className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* CATEGORY CHIPS — slides up on scroll down, down on scroll up */}
        {!isMinimal && (
          <div
            className="px-4 pb-2.5 overflow-x-auto hide-scrollbar"
            style={{
              borderTop: `1px solid ${navBorder}`,
              transition: 'max-height 0.3s ease, opacity 0.3s ease, transform 0.3s ease',
              maxHeight: catVisible ? '56px' : '0px',
              opacity: catVisible ? 1 : 0,
              transform: catVisible ? 'translateY(0)' : 'translateY(-100%)',
              overflow: catVisible ? 'visible' : 'hidden',
              pointerEvents: catVisible ? 'auto' : 'none',
            }}
          >
            <div className="flex items-center gap-2 pt-2 max-w-[1400px] mx-auto">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className="flex-shrink-0 chip-pill transition-all"
                  style={
                    activeCategory === cat
                      ? { background: '#22C55E', color: '#fff' }
                      : {
                        background: isIncognitoActive ? 'rgba(255,255,255,0.08)' : '#EDE6D8',
                        color: isIncognitoActive ? '#D1D5DB' : '#6B7280'
                      }
                  }
                  onMouseEnter={e => {
                    if (activeCategory !== cat) {
                      e.currentTarget.style.background = '#DCFCE7';
                      e.currentTarget.style.color = '#22C55E';
                    }
                  }}
                  onMouseLeave={e => {
                    if (activeCategory !== cat) {
                      e.currentTarget.style.background = isIncognitoActive ? 'rgba(255,255,255,0.08)' : '#EDE6D8';
                      e.currentTarget.style.color = isIncognitoActive ? '#D1D5DB' : '#6B7280';
                    }
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Spacer: adjusts smoothly since category row transitions */}
      <div
        style={{
          height: isMinimal ? '60px' : undefined,
          transition: 'height 0.3s ease',
        }}
        className={isMinimal ? '' : 'h-[160px] md:h-[112px]'}
      />

      {isGlobeMapOpen && <GlobeShopOverlay onClose={() => setIsGlobeMapOpen(false)} />}
    </>
  );
}
