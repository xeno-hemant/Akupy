import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, SlidersHorizontal, ChevronDown } from 'lucide-react';
import ProductCard from './ProductCard';
import useCartStore from '../store/useCartStore';
import useFeatureStore from '../store/useFeatureStore';
import API from '../config/apiRoutes';
import api from '../utils/apiHelper';

// Promo Banner Component
function PromoBanner() {
  return (
    <div
      className="relative rounded-2xl overflow-hidden mb-6 flex items-center justify-between"
      style={{
        background: 'linear-gradient(135deg, #F5F0E8 0%, #EDE6D8 100%)',
        border: '1px solid #E5E7EB',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        minHeight: 140,
      }}
    >
      {/* Left content */}
      <div className="p-6 md:p-8 flex-1">
        <span className="inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3"
          style={{ background: '#DCFCE7', color: '#16A34A' }}>
          🔥 Limited Offer
        </span>
        <h2 className="text-xl md:text-2xl font-heading font-black mb-3" style={{ color: '#1A1A1A' }}>
          Grab Upto <span style={{ color: '#22C55E' }}>50% Off</span><br />
          On Selected Headphones
        </h2>
        <Link
          to="/discover?category=Electronics"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white transition-all hover:shadow-lg active:scale-95"
          style={{ background: '#22C55E' }}
          onMouseEnter={e => e.currentTarget.style.background = '#16A34A'}
          onMouseLeave={e => e.currentTarget.style.background = '#22C55E'}
        >
          Buy Now →
        </Link>
      </div>

      {/* Right: product image */}
      <div className="hidden sm:flex items-center justify-end pr-6 w-48 md:w-56 flex-shrink-0">
        <img
          src="https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=300&q=80"
          alt="Headphones Offer"
          className="w-36 md:w-44 object-contain animate-float drop-shadow-xl"
          style={{ maxHeight: 160 }}
        />
      </div>

      {/* Background decoration */}
      <div
        className="absolute -right-10 -top-10 w-48 h-48 rounded-full opacity-10 pointer-events-none"
        style={{ background: '#22C55E' }}
      />
    </div>
  );
}

// Filter chips
function FilterChips({ sortBy, setSortBy }) {
  const FILTERS = [
    { label: 'Category ▾', value: '' },
    { label: 'Price ▾', value: 'price_asc' },
    { label: 'Review ▾', value: 'rating' },
    { label: 'Color ▾', value: '' },
    { label: 'Material ▾', value: '' },
    { label: 'Offer ▾', value: '' },
    { label: '⚙ All Filters', value: 'filters' },
  ];

  return (
    <div className="w-full overflow-hidden">
      <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1 mb-5">
        {FILTERS.map((f) => (
          <button
            key={f.label}
            onClick={() => f.value && f.value !== 'filters' && setSortBy(f.value)}
            className="flex-shrink-0 px-3 py-1.5 text-xs font-semibold rounded-full border transition-all whitespace-nowrap"
            style={
              sortBy === f.value && f.value
                ? { background: '#22C55E', color: '#fff', borderColor: '#22C55E' }
                : { background: 'transparent', color: '#1A1A1A', borderColor: '#D1D5DB' }
            }
            onMouseEnter={e => {
              if (!(sortBy === f.value && f.value)) {
                e.currentTarget.style.borderColor = '#22C55E';
                e.currentTarget.style.color = '#22C55E';
              }
            }}
            onMouseLeave={e => {
              if (!(sortBy === f.value && f.value)) {
                e.currentTarget.style.borderColor = '#D1D5DB';
                e.currentTarget.style.color = '#1A1A1A';
              }
            }}
          >
            {f.label}
          </button>
        ))}
        <div className="ml-auto flex-shrink-0 flex items-center gap-1">
          <span className="text-xs font-semibold" style={{ color: '#6B7280' }}>Sort by</span>
          <ChevronDown className="w-3 h-3" style={{ color: '#6B7280' }} />
        </div>
      </div>
    </div>
  );
}

// SkeletonCard
function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden animate-pulse" style={{ background: '#FFFFFF', border: '1px solid #F3F4F6' }}>
      <div className="aspect-square" style={{ background: '#EDE6D8' }} />
      <div className="p-3 space-y-2">
        <div className="h-2.5 rounded-full w-1/3" style={{ background: '#EDE6D8' }} />
        <div className="h-3 rounded-full w-4/5" style={{ background: '#EDE6D8' }} />
        <div className="h-3 rounded-full w-3/5" style={{ background: '#EDE6D8' }} />
        <div className="h-4 rounded-full w-1/2 mt-2" style={{ background: '#EDE6D8' }} />
      </div>
    </div>
  );
}

export default function HomeFeed() {
  const [feedItems, setFeedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('');
  const { isGlobeShopActive, isIncognitoActive } = useFeatureStore();

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        // Try new API first
        const res = await api.get(`${API.PRODUCTS}?limit=24&sort=${sortBy}`);
        let products = res.data.products || [];

        // If no products from v1, or we want to augment with Business catalog
        // Assuming SHops or Businesses are mapped to API.SHOPS
        const res2 = await api.get(API.SHOPS);
        const businesses = res2.data;
        if (Array.isArray(businesses)) {
          businesses.forEach(biz => {
            if (biz.products?.length > 0) {
              biz.products.forEach((product, idx) => {
                const pId = product._id || product.id || `cat-${biz._id}-${idx}`;
                if (!products.some(p => (p._id || p.id) === pId)) {
                  products.push({
                    ...product,
                    _id: pId,
                    businessId: biz._id,
                    businessName: biz.name || biz.category + ' Shop',
                    shopId: { name: biz.name || biz.category + ' Shop' }
                  });
                }
              });
            }
          });
        }
        
        setFeedItems(products.length > 0 ? products : []);
        if (products.length > 0) return;
      } catch (err) {
        console.error("Failed to load feed", err);
        // Demo data
        setFeedItems([
          { _id: 'p1', name: 'Sony WH-1000XM5 Headphones', price: 29990, originalPrice: 34990, discountPercent: 14, rating: 4.9, reviewCount: 890, images: ['https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&q=80'], shopId: { name: 'TechZone Electronics' }, tags: ['NEW'] },
          { _id: 'p2', name: 'Vintage Acid Wash Oversized Tee', price: 1299, originalPrice: 1999, discountPercent: 35, rating: 4.8, reviewCount: 124, images: ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&q=80'], shopId: { name: 'UrbanThreads' }, tags: ['TRENDING'], garmentType: 'top' },
          { _id: 'p3', name: 'Korean Style High Waist Cargo Pants', price: 1899, rating: 4.6, reviewCount: 45, images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&q=80'], shopId: { name: 'Kpop Fashion' }, garmentType: 'bottom' },
          { _id: 'p4', name: 'Minimalist LED Desk Lamp', price: 899, originalPrice: 1500, discountPercent: 40, rating: 4.7, reviewCount: 200, images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80'], shopId: { name: 'HomeLit' } },
          { _id: 'p5', name: 'Soy Wax Candle Set (Pack of 3)', price: 699, rating: 4.9, reviewCount: 68, images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80'], shopId: { name: 'AromaBliss' } },
          { _id: 'p6', name: 'Premium Leather Bifold Wallet', price: 1499, originalPrice: 2200, discountPercent: 32, rating: 4.5, reviewCount: 411, images: ['https://images.unsplash.com/photo-1627123373596-19e13bba1e2d?w=500&q=80'], shopId: { name: 'LeatherCraft Co.' } },
          { _id: 'p7', name: 'Monstera Deliciosa Indoor Plant', price: 349, rating: 4.8, reviewCount: 88, images: ['https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=500&q=80'], shopId: { name: 'GreenThumb Nursery' } },
          { _id: 'p8', name: 'TKL Mechanical Keyboard', price: 3499, originalPrice: 4999, discountPercent: 30, rating: 4.7, reviewCount: 250, images: ['https://images.unsplash.com/photo-1595044426077-d36d9236d54a?w=500&q=80'], shopId: { name: 'KeyMasters' } },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, [sortBy]);

  return (
    <section className="px-4 md:px-6 pb-24 xl:pb-6 max-w-[1400px] mx-auto">
      <PromoBanner />
      <FilterChips sortBy={sortBy} setSortBy={setSortBy} />

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-heading font-black" style={{ color: '#1A1A1A' }}>
          Products For You!
        </h2>
        <Link to="/discover" className="text-sm font-semibold" style={{ color: '#22C55E' }}>
          View All →
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
          {feedItems.slice(0, 24).map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
