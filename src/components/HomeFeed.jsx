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
        const isProd = !import.meta.env.DEV && window.location.hostname.includes('akupy.in');
        const rootUrl = isProd ? 'https://akupybackend.onrender.com' : `http://${window.location.hostname}:5000`;
        const apiUrl = import.meta.env.VITE_API_URL || rootUrl;

        const res = await fetch(`${apiUrl}/api/businesses`);
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
          <div className="w-12 h-12 rounded-full" style={{ background: '#E8E0D6' }} />
          <div className="h-6 rounded w-48" style={{ background: '#E8E0D6' }} />
        </div>
      </section>
    );
  }

  if (feedItems.length === 0) return null;

  return (
    <section className="py-16 md:py-28 px-4 md:px-16 max-w-7xl mx-auto" style={{ borderTop: '1px solid rgba(61,56,48,0.12)' }}>
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl md:text-5xl font-heading font-bold flex items-center gap-3" style={{ color: '#3d3830' }}>
            <ShoppingBag className="w-8 h-8" style={{ color: '#8E867B' }} />
            Discover {isGlobeShopActive ? "Global" : "Daily"}
          </h2>
          <p className="text-base md:text-lg mt-3 max-w-xl font-body" style={{ color: '#aba49c' }}>
            {isGlobeShopActive
              ? "Globe Shop is active. Exploring products from international sellers worldwide."
              : "A curated feed of the best products and services from local businesses on Akupy."}
          </p>
        </div>
        <Link to="/discover" className="font-semibold transition-colors whitespace-nowrap text-sm" style={{ color: '#8E867B' }}>
          View all stores &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {feedItems.slice(0, 8).map((product, index) => {
          const isGlobalItem = isGlobeShopActive && (index % 3 === 0 || index % 5 === 0);
          const displayPrice = isGlobalItem ? (product.price * 0.9).toFixed(2) : Number(product.price).toFixed(2);
          const currency = isGlobalItem ? '€' : '$';

          return (
            <div key={index} className="rounded-2xl overflow-hidden group transition-all duration-300 relative flex flex-col hover:-translate-y-1"
              style={{ background: '#F0EADD', border: '1px solid #D9D5D2' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#8E867B'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#D9D5D2'}>
              <Link to={`/business/${product.businessId}`} className="block aspect-square overflow-hidden relative" style={{ background: '#E8E0D6' }}>
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className={`w-full h-full object-cover transition-all duration-700 ${isIncognitoActive ? 'blur-md scale-110' : 'group-hover:scale-105'}`} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm" style={{ color: '#8E867B' }}>No Image</div>
                )}
                {isGlobalItem && (
                  <div className="absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider z-10 flex items-center gap-1"
                    style={{ background: '#8E867B', color: '#F3F0E2' }}>
                    <Globe2 className="w-3 h-3" /> Imported
                  </div>
                )}
                {!product.inStock && (
                  <div className="absolute top-3 right-3 backdrop-blur-sm text-red-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider z-10"
                    style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}>
                    Out of Stock
                  </div>
                )}
              </Link>
              <div className="p-5 flex flex-col flex-grow">
                <Link to={`/business/${product.businessId}`} className="text-xs font-mono tracking-wider uppercase mb-2 transition-colors flex items-center gap-2" style={{ color: '#8E867B' }}>
                  {isIncognitoActive ? (
                    <span className="rounded px-2 py-0.5 font-bold" style={{ background: 'rgba(171,164,156,0.2)', color: '#D9D5D2' }}>Anonymous Seller</span>
                  ) : (
                    <span className="transition-colors" style={{ color: '#8E867B' }}>{product.businessName} {isGlobalItem && "(International)"}</span>
                  )}
                </Link>
                <h3 className="text-base font-heading font-bold mb-1.5 line-clamp-1" style={{ color: '#3d3830' }}>{product.name}</h3>
                <p className="text-sm mb-5 line-clamp-2 min-h-[2.5rem] font-body" style={{ color: '#8E867B' }}>
                  {isIncognitoActive ? "Product description hidden in incognito mode." : product.description}
                </p>

                <div className="flex items-center justify-between pt-4 mt-auto" style={{ borderTop: '1px solid #E8E0D6' }}>
                  <span className="text-lg font-bold text-white">{currency}{displayPrice}</span>
                  <button
                    disabled={!product.inStock}
                    onClick={(e) => {
                      e.preventDefault();
                      addToCart(product, { _id: product.businessId, name: product.businessName });
                    }}
                    className="px-4 py-2 rounded-full text-sm font-semibold transition-all active:scale-95 disabled:opacity-40"
                    style={product.inStock ? { background: 'rgba(142,134,123,0.12)', color: '#8E867B', border: '1px solid rgba(142,134,123,0.25)' } : { background: 'rgba(240,234,221,0.4)', color: '#aba49c' }}
                    onMouseEnter={e => { if (product.inStock) { e.currentTarget.style.background = '#8E867B'; e.currentTarget.style.color = '#F3F0E2'; } }}
                    onMouseLeave={e => { if (product.inStock) { e.currentTarget.style.background = 'rgba(142,134,123,0.12)'; e.currentTarget.style.color = '#8E867B'; } }}
                  >
                    {product.inStock ? 'Add to Cart' : 'Unavailable'}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  );
}
