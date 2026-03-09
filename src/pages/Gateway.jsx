import { Link } from 'react-router-dom';
import { ShoppingBag, Store, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';
import gsap from 'gsap';

export default function Gateway() {
  useEffect(() => {
    gsap.fromTo('.gateway-card', 
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power3.out" }
    );
  }, []);

  return (
    <div className="min-h-screen bg-[#F0FDF4] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="text-center mb-16 z-10 animate-fade-in">
        <h1 className="text-5xl md:text-6xl font-heading font-black tracking-tighter text-[#080808] mb-4">
          akupy<span className="text-primary text-6xl leading-none">.</span>
        </h1>
        <p className="text-xl text-gray-600 font-medium">Choose your experience</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full z-10">
        
        {/* Buyer Card */}
        <Link 
          to="/shop"
          className="gateway-card group relative bg-white rounded-[2.5rem] p-10 md:p-14 border border-black/5 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col items-start justify-between min-h-[400px] hover:-translate-y-2"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative z-10 w-20 h-20 bg-green-100 text-primary rounded-full flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
            <ShoppingBag className="w-10 h-10" />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-heading font-bold text-[#080808] mb-4">I am a Shopper</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Explore infinite local and global stores, try on clothes with your 3D clone, and shop incognito.
            </p>
            <div className="flex items-center gap-2 text-primary font-semibold text-lg group-hover:translate-x-2 transition-transform duration-300">
              Start Shopping <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </Link>

        {/* Seller Card */}
        <Link 
          to="/sell"
          className="gateway-card group relative bg-[#080808] rounded-[2.5rem] p-10 md:p-14 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col items-start justify-between min-h-[400px] hover:-translate-y-2"
        >
          <div className="absolute inset-0 bg-gradient-to-bl from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative z-10 w-20 h-20 bg-white/10 text-white rounded-full flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
            <Store className="w-10 h-10" />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-heading font-bold text-white mb-4">I am a Seller</h2>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Register your business, build your catalog, and reach a massive audience. View your earnings and manage orders.
            </p>
            <div className="flex items-center gap-2 text-white font-semibold text-lg group-hover:translate-x-2 transition-transform duration-300">
              Enter Admin Portal <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </Link>
        
      </div>
    </div>
  );
}
