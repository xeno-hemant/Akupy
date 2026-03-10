import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, ShoppingCart, User, Globe, Shield, Filter, ChevronRight } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useCartStore from '../store/useCartStore';
import useFeatureStore from '../store/useFeatureStore';
import GlobeShopOverlay from './GlobeShopOverlay';

const CATEGORIES = ['All', 'Shops', 'Fashion', 'Electronics', 'Food', 'Services', 'Beauty', 'Furniture'];

export default function Navbar() {
  const [isGlobeMapOpen, setIsGlobeMapOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const { user, logout } = useAuthStore();
  const { getTotalItems } = useCartStore();
  const { isIncognitoActive, setIncognito } = useFeatureStore();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/discover?q=${encodeURIComponent(searchQuery)}&cat=${activeCategory !== 'All' ? activeCategory : ''}`);
    }
  };

  const handleIncognitoToggle = () => {
    const newState = !isIncognitoActive;
    setIncognito(newState);
    window.dispatchEvent(new CustomEvent('incognito-toast', {
      detail: { message: newState ? 'Incognito Mode Active — Identity hidden from sellers' : 'Incognito session ended.' }
    }));
  };

  // Incognito: dark warm brown overlay
  const incogBg = 'bg-[#3d3830] text-[#F3F0E2] border-b border-[#8E867B]/30';
  const normalBg = 'bg-[#F0EADD] text-[#3d3830] border-b border-[#D9D5D2]';

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${isIncognitoActive ? incogBg : normalBg} backdrop-blur-[16px]`}
        style={!isIncognitoActive ? { boxShadow: '0 2px 16px rgba(142,134,123,0.10)' } : { boxShadow: '0 2px 16px rgba(61,56,48,0.3)' }}
      >

        {/* TOP ROW: Logo, Location, Icons */}
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">

          {/* Logo & Location */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex-shrink-0">
              <span className={`text-2xl font-heading font-black tracking-tight ${isIncognitoActive ? 'text-[#F3F0E2]' : 'text-[#3d3830]'}`}>
                akupy<span className="text-[#8E867B]">.</span>
              </span>
            </Link>

            <button className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors group ${isIncognitoActive ? 'hover:bg-[#8E867B]/20' : 'hover:bg-[#E8E0D6]'}`}>
              <MapPin className="w-4 h-4 text-[#8E867B] group-hover:animate-bounce" />
              <span className={`text-sm font-semibold truncate max-w-[120px] ${isIncognitoActive ? 'text-[#D9D5D2]' : 'text-[#8E867B]'}`}>Mumbai, IN</span>
            </button>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-grow max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="relative w-full flex items-center">
              <div className={`absolute left-0 top-0 bottom-0 px-4 flex items-center justify-center rounded-l-full border-r ${isIncognitoActive ? 'bg-[#8E867B]/20 border-[#8E867B]/30' : 'bg-[#E8E0D6] border-[#D9D5D2]'}`}>
                <Search className="w-4 h-4 text-[#8E867B]" />
              </div>
              <input
                type="text"
                placeholder="Search shops, products, services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full h-11 pl-14 pr-24 outline-none text-sm transition-all rounded-full border-2 font-medium ${isIncognitoActive
                  ? 'bg-[#3d3830]/60 border-[#8E867B]/30 text-[#F3F0E2] placeholder-[#8E867B] focus:border-[#8E867B]'
                  : 'bg-[#F3F0E2] border-[#D9D5D2] text-[#3d3830] placeholder-[#aba49c] focus:border-[#8E867B] focus:bg-[#F0EADD]'
                  }`}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button type="button" className={`p-1.5 rounded-full ${isIncognitoActive ? 'hover:bg-[#8E867B]/20 text-[#D9D5D2]' : 'hover:bg-[#E8E0D6] text-[#8E867B]'}`}>
                  <Filter className="w-4 h-4" />
                </button>
                <div className="w-px h-5 bg-[#D9D5D2] mx-1"></div>
                <button type="button" onClick={() => setIsGlobeMapOpen(true)}
                  className={`p-1.5 rounded-full ${isIncognitoActive ? 'hover:bg-[#8E867B]/20 text-[#D9D5D2]' : 'hover:bg-[#E8E0D6] text-[#8E867B]'}`}
                  title="Globe Shop">
                  <Globe className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Icons: Shield, Try-On, Profile, Cart */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">

            <button
              onClick={handleIncognitoToggle}
              title={isIncognitoActive ? 'Disable Incognito' : 'Enable Incognito'}
              className={`p-2 rounded-full transition-all flex items-center justify-center relative ${isIncognitoActive
                  ? 'bg-[#8E867B] text-[#F3F0E2]'
                  : 'text-[#8E867B] hover:bg-[#E8E0D6]'
                }`}
            >
              <Shield className="w-5 h-5" />
              {isIncognitoActive && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#b5776e] rounded-full border-2 border-[#3d3830]"></span>
              )}
            </button>

            <Link to="/wardrobe" className={`hidden lg:flex items-center gap-1.5 text-sm font-semibold hover:opacity-80 transition-opacity whitespace-nowrap px-2 ${isIncognitoActive ? 'text-[#D9D5D2]' : 'text-[#8E867B]'}`}>
              👗 Try-On
            </Link>

            {user ? (
              <Link to="/dashboard" className={`p-2 rounded-full transition-colors hidden sm:block ${isIncognitoActive ? 'text-[#D9D5D2] hover:bg-[#8E867B]/20' : 'text-[#8E867B] hover:bg-[#E8E0D6]'}`}>
                <User className="w-5 h-5" />
              </Link>
            ) : (
              <Link to="/shop" className={`hidden sm:block text-sm font-bold transition-colors px-4 py-2 rounded-full border ${isIncognitoActive ? 'border-[#8E867B] text-[#F3F0E2] hover:bg-[#8E867B]/30' : 'border-[#D9D5D2] text-[#3d3830] hover:bg-[#E8E0D6]'
                }`}>
                Log In
              </Link>
            )}

            <Link to="/cart" className={`relative p-2 rounded-full transition-colors ${isIncognitoActive ? 'text-[#F3F0E2] hover:bg-[#8E867B]/20' : 'text-[#3d3830] hover:bg-[#E8E0D6]'}`}>
              <ShoppingCart className="w-5 h-5" />
              {getTotalItems() > 0 && (
                <span className={`absolute top-0 right-0 w-4 h-4 flex items-center justify-center text-[10px] font-bold rounded-full border-2 ${isIncognitoActive ? 'bg-[#8E867B] text-[#F3F0E2] border-[#3d3830]' : 'bg-[#b5776e] text-white border-[#F0EADD]'
                  }`}>
                  {getTotalItems()}
                </span>
              )}
            </Link>

            <button className={`sm:hidden p-2 rounded-full transition-colors ${isIncognitoActive ? 'text-[#D9D5D2]' : 'text-[#8E867B]'}`}>
              <User className="w-5 h-5" />
            </button>

          </div>
        </div>

        {/* BOTTOM ROW: Mobile Search + Category Chips */}
        <div className={`px-4 pb-3 md:border-t ${isIncognitoActive ? 'border-[#8E867B]/20' : 'border-[#D9D5D2]'}`}>

          {/* Mobile Search */}
          <div className="md:hidden mt-1 mb-3">
            <form onSubmit={handleSearch} className="relative w-full flex items-center">
              <Search className="absolute left-4 w-4 h-4 text-[#8E867B]" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full h-10 pl-10 pr-12 outline-none text-sm rounded-full border font-medium ${isIncognitoActive
                    ? 'bg-[#3d3830]/60 border-[#8E867B]/30 text-[#F3F0E2] placeholder-[#8E867B]'
                    : 'bg-[#F3F0E2] border-[#D9D5D2] text-[#3d3830] placeholder-[#aba49c] focus:border-[#8E867B]'
                  }`}
              />
              <button type="button" onClick={() => setIsGlobeMapOpen(true)} className="absolute right-3 p-1 text-[#8E867B] active:scale-95">
                <Globe className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Category Chips */}
          <div className="max-w-[1400px] mx-auto flex items-center overflow-x-auto hide-scrollbar gap-2 md:gap-3 md:py-2">
            <button className={`sm:hidden flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${isIncognitoActive ? 'bg-[#8E867B]/20 text-[#D9D5D2]' : 'bg-[#E8E0D6] text-[#8E867B]'
              }`}>
              <MapPin className="w-3 h-3" /> Mumbai
            </button>

            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${activeCategory === category
                    ? isIncognitoActive
                      ? 'bg-[#F3F0E2] text-[#3d3830] shadow-sm'
                      : 'bg-[#8E867B] text-[#F3F0E2] shadow-sm'
                    : isIncognitoActive
                      ? 'bg-[#8E867B]/15 text-[#D9D5D2] hover:bg-[#8E867B]/30'
                      : 'bg-[#E8E0D6] text-[#8E867B] hover:bg-[#D9D5D2] hover:text-[#3d3830]'
                  }`}
              >
                {category}
              </button>
            ))}

            <Link to="/discover" className={`flex-shrink-0 flex items-center gap-1 pl-2 text-sm font-bold transition-colors group whitespace-nowrap ${isIncognitoActive ? 'text-[#D9D5D2] hover:text-[#F3F0E2]' : 'text-[#aba49c] hover:text-[#8E867B]'
              }`}>
              More <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

      </nav>

      {/* Spacer */}
      <div className="h-[120px] md:h-[110px]"></div>

      {isGlobeMapOpen && <GlobeShopOverlay onClose={() => setIsGlobeMapOpen(false)} />}
    </>
  );
}
