import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Search, User, Menu, X } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/discover?q=${encodeURIComponent(searchQuery)}`);
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-black/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-20">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-heading font-black tracking-tighter text-[#080808]">
          akupy<span className="text-primary text-3xl leading-none">.</span>
        </Link>

        {/* Desktop Search Bar (Mid) */}
        <div className="hidden md:block flex-grow max-w-xl mx-8">
          <form onSubmit={handleSearch} className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search local businesses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100/50 border border-transparent focus:bg-white focus:border-primary/50 text-[#080808] text-sm rounded-full py-2.5 pl-12 pr-4 outline-none transition-all"
            />
          </form>
        </div>

        {/* Desktop Auth / Nav (Right) */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/discover" className="text-sm font-medium text-gray-600 hover:text-[#080808] transition-colors">Discover</Link>
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="flex items-center gap-2 text-sm font-semibold bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-colors text-[#080808]">
                <User w-4 h-4 />
                {user.role === 'business' ? 'Dashboard' : 'Profile'}
              </Link>
              <button onClick={logout} className="text-sm font-medium text-gray-400 hover:text-red-500 transition-colors">Logout</button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <button 
                onClick={() => {
                  const el = document.querySelector('#register-section');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    navigate('/');
                    setTimeout(() => document.querySelector('#register-section')?.scrollIntoView({ behavior: 'smooth' }), 500);
                  }
                }}
                className="text-sm font-medium text-[#080808] hover:text-primary transition-colors"
              >
                Sign In
              </button>
              <button 
                onClick={() => {
                  const el = document.querySelector('#register-section');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    navigate('/');
                    setTimeout(() => document.querySelector('#register-section')?.scrollIntoView({ behavior: 'smooth' }), 500);
                  }
                }}
                className="text-sm font-semibold bg-[#080808] text-white px-5 py-2.5 rounded-full hover:bg-black/80 transition-transform active:scale-95"
              >
                Register
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-[#080808] p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>

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
              className="w-full bg-gray-100 border border-transparent focus:bg-white focus:border-primary/50 text-[#080808] rounded-full py-3 pl-12 pr-4 outline-none transition-all"
            />
          </form>

          <Link to="/discover" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium text-[#080808]">Discover Stores</Link>
          
          <div className="h-px w-full bg-gray-100"></div>

          {user ? (
            <div className="flex flex-col gap-4">
              <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="text-lg font-semibold text-primary flex items-center gap-2">
                <User /> {user.role === 'business' ? 'Business Dashboard' : 'My Profile'}
              </Link>
              <button onClick={() => { logout(); setIsMenuOpen(false); }} className="text-lg font-medium text-gray-500 text-left">Logout</button>
            </div>
          ) : (
             <div className="flex flex-col gap-4">
              <button 
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate('/');
                  setTimeout(() => document.querySelector('#register-section')?.scrollIntoView({ behavior: 'smooth' }), 500);
                }}
                className="text-lg font-semibold bg-[#080808] text-white px-6 py-3 rounded-full text-center"
              >
                Login / Register
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
