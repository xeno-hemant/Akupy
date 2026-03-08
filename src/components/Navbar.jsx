import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Search, User, Menu, X, ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useCartStore from '../store/useCartStore';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuthStore();
  const { cart, removeFromCart, updateQuantity, getTotalItems, getTotalPrice } = useCartStore();
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
          
          {/* Cart Icon */}
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-[#080808] hover:text-primary transition-colors cursor-pointer"
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
            onClick={() => setIsCartOpen(true)}
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

      {/* Cart Drawer */}
      {isCartOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 animate-fade-in"
            onClick={() => setIsCartOpen(false)}
          />
          <div className="fixed top-0 right-0 h-full w-full md:w-[400px] bg-white z-50 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out translate-x-0">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-heading font-bold text-[#080808] flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" /> Your Cart
              </h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 flex flex-col gap-6">
              {cart.length === 0 ? (
                <div className="text-center text-gray-400 mt-20">
                  <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Your cart is empty.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item._id || item.name} className="flex gap-4 border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                    <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Img</div>
                      )}
                    </div>
                    <div className="flex flex-col flex-grow">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h4 className="font-semibold text-[#080808] text-sm line-clamp-2">{item.name}</h4>
                          <span className="text-xs text-gray-500 block">{item.businessName}</span>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item._id || item.name)}
                          className="text-red-400 hover:text-red-500 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between">
                        <span className="font-bold text-primary">${Number(item.price).toFixed(2)}</span>
                        <div className="flex items-center gap-3 bg-gray-50 rounded-full px-2 py-1">
                          <button onClick={() => updateQuantity(item._id || item.name, item.quantity - 1)} className="p-1 hover:text-primary"><Minus className="w-3 h-3" /></button>
                          <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item._id || item.name, item.quantity + 1)} className="p-1 hover:text-primary"><Plus className="w-3 h-3" /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-500 font-medium">Total</span>
                  <span className="text-2xl font-bold text-[#080808]">${getTotalPrice().toFixed(2)}</span>
                </div>
                <button 
                  className="w-full bg-[#080808] text-white py-4 rounded-xl font-semibold hover:bg-black/80 transition-transform active:scale-95 flex justify-center items-center gap-2"
                  onClick={() => alert('Checkout functionality would connect to Stripe/Razorpay here.')}
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </nav>
  );
}
