import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { SlidersHorizontal, ChevronDown, X, Star } from 'lucide-react';
import useFeatureStore from '../store/useFeatureStore';

const SORT_OPTIONS = [
  { label: 'Relevance', value: '' },
  { label: 'Price: Low → High', value: 'price_asc' },
  { label: 'Price: High → Low', value: 'price_desc' },
  { label: 'Newest', value: 'newest' },
  { label: 'Top Rated', value: 'rating' },
];

// === Hidden Hues token shortcuts ===
const HH = {
  ivory: '#F3F0E2',
  cream: '#F0EADD',
  linen: '#E8E0D6',
  silver: '#D9D5D2',
  taupe: '#8E867B',
  dark: '#3d3830',
  muted: '#aba49c',
};

export default function Discover() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const initialCat = searchParams.get('category') || searchParams.get('cat') || '';

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('');
  const [category, setCategory] = useState(initialCat);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [rating, setRating] = useState('');
  const [discount, setDiscount] = useState('');
  const { isIncognitoActive } = useFeatureStore();

  const pageBg = isIncognitoActive ? HH.dark : HH.ivory;
  const pageText = isIncognitoActive ? HH.ivory : HH.dark;

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const isProd = window.location.hostname.includes('akupy.in');
      const rootUrl = isProd ? 'https://akupybackend.onrender.com' : 'http://localhost:5000';
      let url = `${rootUrl}/api/products?page=1&limit=24`;
      if (query) url += `&search=${encodeURIComponent(query)}`;
      if (category && category !== 'All') url += `&category=${encodeURIComponent(category)}`;
      if (sortBy) url += `&sort=${sortBy}`;
      if (minPrice) url += `&minPrice=${minPrice}`;
      if (maxPrice) url += `&maxPrice=${maxPrice}`;
      if (rating) url += `&rating=${rating}`;
      if (discount) url += `&discount=${discount}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
        setTotal(data.total || 0);
      } else throw new Error('API error');
    } catch {
      setProducts([
        { _id: 'p1', name: 'Vintage Acid Wash Oversized Tee', price: 1299, originalPrice: 1999, discountPercent: 35, rating: 4.8, reviewCount: 124, images: ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&q=80'], tags: ['TRENDING'], garmentType: 'top' },
        { _id: 'p2', name: 'Sony WH-1000XM5 Headphones', price: 29990, originalPrice: 34990, discountPercent: 14, rating: 4.9, reviewCount: 890, images: ['https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&q=80'], tags: ['NEW'] },
        { _id: 'p3', name: 'Korean Style High Waist Cargo Pants', price: 1899, rating: 4.6, reviewCount: 45, images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&q=80'], garmentType: 'bottom', isGlobeShop: true },
        { _id: 'p4', name: 'Minimalist Desk Lamp', price: 899, originalPrice: 1500, discountPercent: 40, rating: 4.7, reviewCount: 200, images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80'] },
        { _id: 'p5', name: 'Hand-Rolled Soy Wax Candle Set', price: 699, rating: 4.9, reviewCount: 68, images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80'] },
        { _id: 'p6', name: 'Leather Bifold Wallet', price: 1499, originalPrice: 2200, discountPercent: 32, rating: 4.5, reviewCount: 411, images: ['https://images.unsplash.com/photo-1627123373596-19e13bba1e2d?w=500&q=80'] },
        { _id: 'p7', name: 'Monstera Deliciosa Plant', price: 349, rating: 4.8, reviewCount: 88, images: ['https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=500&q=80'] },
        { _id: 'p8', name: 'Mechanical Keyboard (TKL)', price: 3499, originalPrice: 4999, discountPercent: 30, rating: 4.7, reviewCount: 250, images: ['https://images.unsplash.com/photo-1595044426077-d36d9236d54a?w=500&q=80'] },
      ]);
      setTotal(8);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, [query, category, sortBy, minPrice, maxPrice, rating, discount]);

  const clearFilters = () => {
    setCategory(''); setMinPrice(''); setMaxPrice('');
    setRating(''); setDiscount(''); setIsFilterOpen(false);
  };

  // Input style helper
  const inputCls = `flex-1 px-4 py-3 rounded-xl text-sm font-semibold outline-none border transition-colors`;
  const inputStyle = { background: HH.ivory, borderColor: HH.silver, color: HH.dark };
  const inputFocusStyle = { borderColor: HH.taupe };

  return (
    <div className="min-h-screen pb-24" style={{ background: pageBg, color: pageText, paddingTop: '140px' }}>
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">

        {/* TOP: Title + Sort */}
        <div
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 mb-6"
          style={{ borderBottom: `1px solid ${HH.silver}` }}
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-black" style={{ color: pageText }}>
              {query ? `Results for "${query}"` : category && category !== 'All' ? category : 'All Products'}
            </h1>
            <p className="mt-2 font-medium" style={{ color: HH.taupe }}>{total} products found</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-bold hidden sm:block" style={{ color: HH.taupe }}>Sort:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 rounded-full text-sm font-bold outline-none cursor-pointer border"
                style={{ background: HH.cream, borderColor: HH.silver, color: HH.dark }}
              >
                {SORT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: HH.taupe }} />
            </div>
          </div>
        </div>

        {/* HORIZONTAL FILTER BAR */}
        <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar mb-8 pb-2">
          {/* All Filters button */}
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm border transition-colors"
            style={{ background: HH.cream, borderColor: HH.silver, color: HH.dark }}
            onMouseEnter={e => e.currentTarget.style.borderColor = HH.taupe}
            onMouseLeave={e => e.currentTarget.style.borderColor = HH.silver}
          >
            <SlidersHorizontal className="w-4 h-4" /> All Filters
          </button>

          {['Fashion', 'Electronics', 'Home'].map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat === category ? '' : cat)}
              className="flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold border transition-all"
              style={category === cat
                ? { background: HH.taupe, borderColor: HH.taupe, color: HH.ivory }
                : { background: HH.cream, borderColor: HH.silver, color: HH.taupe }
              }
            >
              {cat}
            </button>
          ))}

          <div className="w-px h-6 flex-shrink-0 mx-2" style={{ background: HH.silver }}></div>

          <button
            onClick={() => setRating(rating === '4' ? '' : '4')}
            className="flex-shrink-0 px-4 py-2.5 rounded-full text-sm font-semibold border transition-all flex items-center gap-1"
            style={rating === '4'
              ? { background: '#f7f0e6', borderColor: '#c4a882', color: '#c4a882' }
              : { background: HH.cream, borderColor: HH.silver, color: HH.taupe }
            }
          >
            4+ <Star className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDiscount(discount === '50' ? '' : '50')}
            className="flex-shrink-0 px-4 py-2.5 rounded-full text-sm font-semibold border transition-all"
            style={discount === '50'
              ? { background: '#f7efed', borderColor: '#b5776e', color: '#b5776e' }
              : { background: HH.cream, borderColor: HH.silver, color: HH.taupe }
            }
          >
            50%+ Off
          </button>
        </div>

        {/* PRODUCT GRID */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] rounded-2xl animate-pulse" style={{ background: HH.linen }}></div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {products.map(product => <ProductCard key={product._id} product={product} />)}
          </div>
        ) : (
          <div
            className="py-20 text-center flex flex-col items-center justify-center border-2 border-dashed rounded-3xl"
            style={{ borderColor: HH.silver }}
          >
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-2" style={{ color: HH.dark }}>No products found</h3>
            <p style={{ color: HH.taupe }} className="max-w-sm">We couldn't find anything matching your taste.</p>
            <button
              onClick={clearFilters}
              className="mt-6 font-bold underline"
              style={{ color: HH.taupe }}
            >
              Clear all filters
            </button>
          </div>
        )}

      </div>

      {/* FILTER DRAWER */}
      {isFilterOpen && (
        <div
          className="fixed inset-0 z-[100] flex justify-end"
          style={{ background: 'rgba(61,56,48,0.5)' }}
          onClick={e => e.target === e.currentTarget && setIsFilterOpen(false)}
        >
          <div
            className="w-full md:w-[400px] h-[90vh] md:h-full mt-auto md:mt-0 rounded-t-3xl md:rounded-tl-3xl md:rounded-tr-none flex flex-col shadow-2xl animate-slide-up md:animate-none"
            style={{ background: HH.cream, borderLeft: `1px solid ${HH.silver}`, color: HH.dark }}
          >
            {/* Drawer Handle (mobile) */}
            <div className="flex justify-center pt-3 pb-1 md:hidden">
              <div className="w-10 h-1 rounded-full" style={{ background: HH.silver }}></div>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between p-6" style={{ borderBottom: `1px solid ${HH.silver}` }}>
              <h2 className="text-xl font-heading font-black" style={{ color: HH.dark }}>Filters</h2>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="p-2 rounded-full transition-colors"
                style={{ background: HH.linen, color: HH.taupe }}
                onMouseEnter={e => e.currentTarget.style.background = HH.silver}
                onMouseLeave={e => e.currentTarget.style.background = HH.linen}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">

              {/* Category */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.1em] mb-4" style={{ color: HH.taupe }}>Category</h3>
                <div className="flex flex-col gap-3">
                  {['All', 'Fashion', 'Electronics', 'Home & Living', 'Beauty'].map(cat => {
                    const isActive = cat === 'All' ? !category : category === cat;
                    return (
                      <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                        <div
                          className="w-5 h-5 rounded flex items-center justify-center transition-colors"
                          style={{
                            background: isActive ? HH.taupe : 'transparent',
                            border: `1.5px solid ${isActive ? HH.taupe : HH.silver}`,
                          }}
                          onClick={() => setCategory(cat === 'All' ? '' : cat)}
                        >
                          {isActive && <div className="w-2 h-2 rounded-sm" style={{ background: HH.ivory }}></div>}
                        </div>
                        <span className="font-semibold" style={{ color: HH.dark }}>{cat}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="h-px" style={{ background: HH.silver }}></div>

              {/* Price Range */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.1em] mb-4" style={{ color: HH.taupe }}>Price Range (₹)</h3>
                <div className="flex items-center gap-4">
                  <input
                    type="number" placeholder="Min" value={minPrice}
                    onChange={e => setMinPrice(e.target.value)}
                    className={inputCls}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = HH.taupe}
                    onBlur={e => e.target.style.borderColor = HH.silver}
                  />
                  <span className="font-bold" style={{ color: HH.taupe }}>–</span>
                  <input
                    type="number" placeholder="Max" value={maxPrice}
                    onChange={e => setMaxPrice(e.target.value)}
                    className={inputCls}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = HH.taupe}
                    onBlur={e => e.target.style.borderColor = HH.silver}
                  />
                </div>
              </div>

              <div className="h-px" style={{ background: HH.silver }}></div>

              {/* Rating */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.1em] mb-4" style={{ color: HH.taupe }}>Rating</h3>
                <div className="flex flex-col gap-3">
                  {[4, 3].map(val => (
                    <label key={val} className="flex items-center gap-3 cursor-pointer">
                      <div
                        className="w-5 h-5 rounded flex items-center justify-center transition-colors"
                        style={{
                          background: rating === String(val) ? HH.taupe : 'transparent',
                          border: `1.5px solid ${rating === String(val) ? HH.taupe : HH.silver}`,
                        }}
                        onClick={() => setRating(rating === String(val) ? '' : String(val))}
                      >
                        {rating === String(val) && <div className="w-2 h-2 rounded-sm" style={{ background: HH.ivory }}></div>}
                      </div>
                      <span className="font-semibold flex items-center gap-1" style={{ color: HH.dark }}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="w-4 h-4" style={{ color: '#c4a882', fill: i < val ? '#c4a882' : 'none' }} />
                        ))}
                        <span className="ml-1 text-sm" style={{ color: HH.taupe }}>& Up</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

            </div>

            {/* Footer Buttons */}
            <div className="p-6 grid grid-cols-2 gap-4" style={{ borderTop: `1px solid ${HH.silver}` }}>
              <button
                onClick={clearFilters}
                className="py-3.5 rounded-xl font-bold border transition-colors"
                style={{ background: 'transparent', borderColor: HH.silver, color: HH.taupe }}
                onMouseEnter={e => e.currentTarget.style.background = HH.linen}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                Reset All
              </button>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="py-3.5 rounded-xl font-bold transition-colors"
                style={{ background: HH.taupe, color: HH.ivory }}
                onMouseEnter={e => e.currentTarget.style.background = '#7a7268'}
                onMouseLeave={e => e.currentTarget.style.background = HH.taupe}
              >
                Apply Filters
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
