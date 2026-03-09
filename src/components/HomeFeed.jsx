import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useCartStore from '../store/useCartStore';
import useFeatureStore from '../store/useFeatureStore';
import { ShoppingBag, Globe2 } from 'lucide-react';

export default function HomeFeed() {
  const [feedItems, setFeedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCartStore();
  const { isGlobeShopActive, isIncognitoActive } = useFeatureStore();

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/businesses`);
        if (res.ok) {
          const businesses = await res.json();
          // Extract all products into a flat array
          const allProducts = [];
          
          if (Array.isArray(businesses)) {
            businesses.forEach(biz => {
              if (biz.products && biz.products.length > 0) {
              biz.products.forEach(product => {
                allProducts.push({
                  ...product,
                  businessId: biz._id,
                  businessName: biz.category + " Shop" // or biz.name if preferred, let's use biz.name
                });
              });
            }
          });
          
          // Fix the businessName override
          const formattedProducts = allProducts.map(p => ({
            ...p,
            businessName: businesses.find(b => b._id === p.businessId)?.name || 'Local Shop'
          }));

          // Optional: Shuffle the array for a dynamic feed
          const shuffled = formattedProducts.sort(() => 0.5 - Math.random());
          setFeedItems(shuffled);
          }
        }
      } catch (err) {
        console.error("Failed to load global feed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, []);

  if (loading) {
    return (
      <section className="py-20 md:py-32 px-6 md:px-16 max-w-7xl mx-auto text-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full" />
          <div className="h-6 bg-gray-200 rounded w-48" />
        </div>
      </section>
    );
  }

  if (feedItems.length === 0) return null;

  return (
    <section className="py-20 md:py-32 px-6 md:px-16 max-w-7xl mx-auto border-t border-black/5">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-[#080808] flex items-center gap-3">
            <ShoppingBag className="w-10 h-10 text-primary" />
            Discover {isGlobeShopActive ? "Global" : "Daily"}
          </h2>
          <p className="text-lg text-gray-500 mt-4 max-w-xl">
            {isGlobeShopActive 
              ? "Globe Shop is active. Exploring products from international sellers worldwide."
              : "A curated feed of the best products and services from local businesses on Akupy."}
          </p>
        </div>
        <Link to="/discover" className="text-primary font-semibold hover:text-[#080808] transition-colors">
          View all stores &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {feedItems.slice(0, 8).map((product, index) => {
          const isGlobalItem = isGlobeShopActive && (index % 3 === 0 || index % 5 === 0);
          const displayPrice = isGlobalItem ? (product.price * 0.9).toFixed(2) : Number(product.price).toFixed(2);
          const currency = isGlobalItem ? '€' : '$';

          return (
          <div key={index} className="bg-white border border-gray-100 rounded-3xl overflow-hidden group hover:border-primary/30 hover:shadow-xl transition-all duration-300 shadow-sm relative flex flex-col">
            <Link to={`/business/${product.businessId}`} className="block aspect-square bg-gray-50 overflow-hidden relative">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className={`w-full h-full object-cover transition-all duration-700 ${isIncognitoActive ? 'blur-md scale-110' : 'group-hover:scale-105'}`} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
              )}
              {isGlobalItem && (
                <div className="absolute top-4 left-4 bg-primary/90 text-[#080808] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm z-10 flex items-center gap-1 backdrop-blur-sm">
                  <Globe2 className="w-3 h-3" /> Imported
                </div>
              )}
              {!product.inStock && (
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-red-500 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm z-10">
                  Out of Stock
                </div>
              )}
            </Link>
            <div className="p-6 flex flex-col flex-grow">
              <Link to={`/business/${product.businessId}`} className="text-xs font-bold tracking-wider text-gray-400 uppercase mb-2 hover:text-primary transition-colors flex items-center gap-2">
                {isIncognitoActive ? (
                  <span className="bg-black text-white px-2 py-0.5 rounded-sm">Anonymous Seller</span>
                ) : (
                  <span>{product.businessName} {isGlobalItem && "(International)"}</span>
                )}
              </Link>
              <h3 className="text-lg font-bold text-[#080808] mb-2 line-clamp-1">{product.name}</h3>
              <p className="text-gray-500 text-sm mb-6 line-clamp-2 min-h-[2.5rem]">
                {isIncognitoActive ? "Product description is hidden in incognito mode to prevent seller identification." : product.description}
              </p>
              
              <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                <span className="text-xl font-bold text-[#080808]">{currency}{displayPrice}</span>
                <button 
                  disabled={!product.inStock}
                  onClick={(e) => {
                    e.preventDefault(); 
                    addToCart(product, { _id: product.businessId, name: product.businessName });
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors disabled:opacity-50 disabled:bg-gray-100 disabled:text-gray-400 active:scale-95 ${isGlobalItem ? 'bg-[#080808] text-primary hover:bg-black/80' : 'bg-primary/10 text-primary hover:bg-primary hover:text-[#080808]'}`}
                >
                  {product.inStock ? 'Add to Cart' : 'Unavailable'}
                </button>
              </div>
            </div>
          </div>
        )})}
      </div>
    </section>
  );
}
