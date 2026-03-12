import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, ChevronDown, X, Star, Search } from 'lucide-react';
import API from '../config/apiRoutes';
import api from '../utils/apiHelper';
import ProductCard from '../components/ProductCard';

const SORT_OPTIONS = [
  { label: 'Relevance', value: '' },
  { label: 'Price: Low → High', value: 'price_asc' },
  { label: 'Price: High → Low', value: 'price_desc' },
  { label: 'Newest', value: 'newest' },
  { label: 'Top Rated', value: 'rating' },
];

const CATEGORY_SIDEBAR = [
  { id: 'for-you', label: 'For You', emoji: '✨', color: '#A855F7' },
  { id: 'fashion', label: 'Fashion', emoji: '👗', color: '#EC4899' },
  { id: 'appliances', label: 'Appliances', emoji: '🏠', color: '#6366F1' },
  { id: 'mobiles', label: 'Mobiles', emoji: '📱', color: '#3B82F6' },
  { id: 'electronics', label: 'Electronics', emoji: '🎧', color: '#22C55E' },
  { id: 'gadgets', label: 'Gadgets', emoji: '⌚', color: '#F59E0B' },
  { id: 'home', label: 'Home', emoji: '🛋️', color: '#14B8A6' },
  { id: 'beauty', label: 'Beauty', emoji: '💄', color: '#F472B6' },
  { id: 'toys', label: 'Toys & Baby', emoji: '🧸', color: '#F97316' },
];

// Skeleton loader
function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden animate-pulse" style={{ background: '#FFFFFF', border: '1px solid #F3F4F6' }}>
      <div className="aspect-square" style={{ background: '#EDE6D8' }} />
      <div className="p-3 space-y-2">
        <div className="h-2.5 rounded-full w-1/3" style={{ background: '#EDE6D8' }} />
        <div className="h-3 rounded-full w-4/5" style={{ background: '#EDE6D8' }} />
        <div className="h-4 rounded-full w-1/2 mt-2" style={{ background: '#EDE6D8' }} />
      </div>
    </div>
  );
}

export default function Discover() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || searchParams.get('search') || '';
  const initialCat = searchParams.get('category') || searchParams.get('cat') || '';

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('');
  const [category, setCategory] = useState(initialCat);
  const [activeSection, setActiveSection] = useState(initialCat || 'for-you');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [rating, setRating] = useState('');
  const [discount, setDiscount] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = `${API.PRODUCTS}?page=1&limit=24`;
      if (query) url += `&search=${encodeURIComponent(query)}`;
      if (category && category !== 'for-you') url += `&category=${encodeURIComponent(category)}`;
      if (sortBy) url += `&sort=${sortBy}`;
      if (minPrice) url += `&minPrice=${minPrice}`;
      if (maxPrice) url += `&maxPrice=${maxPrice}`;
      if (rating) url += `&rating=${rating}`;
      if (discount) url += `&discount=${discount}`;

      const data = await api.get(url);
      if (data) {
        setProducts(data.products || []);
        setTotal(data.total || 0);
      } else throw new Error('API error');
    } catch {
      // Demo data
      setProducts([
        { _id: 'p1', name: 'Vintage Acid Wash Oversized Tee', price: 1299, originalPrice: 1999, discountPercent: 35, rating: 4.8, reviewCount: 124, images: ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&q=80'], shopId: { name: 'UrbanThreads' }, tags: ['TRENDING'], garmentType: 'top' },
        { _id: 'p2', name: 'Sony WH-1000XM5 Headphones', price: 29990, originalPrice: 34990, discountPercent: 14, rating: 4.9, reviewCount: 890, images: ['https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&q=80'], shopId: { name: 'TechZone' }, tags: ['NEW'] },
        { _id: 'p3', name: 'Korean High Waist Cargo Pants', price: 1899, rating: 4.6, reviewCount: 45, images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&q=80'], shopId: { name: 'Kpop Fashion' }, garmentType: 'bottom' },
        { _id: 'p4', name: 'LED Minimalist Desk Lamp', price: 899, originalPrice: 1500, discountPercent: 40, rating: 4.7, reviewCount: 200, images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80'], shopId: { name: 'HomeLit' } },
        { _id: 'p5', name: 'Soy Wax Candle Set', price: 699, rating: 4.9, reviewCount: 68, images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80'], shopId: { name: 'AromaBliss' } },
        { _id: 'p6', name: 'Leather Bifold Wallet', price: 1499, originalPrice: 2200, discountPercent: 32, rating: 4.5, reviewCount: 411, images: ['https://images.unsplash.com/photo-1627123373596-19e13bba1e2d?w=500&q=80'], shopId: { name: 'LeatherCraft Co.' } },
        { _id: 'p7', name: 'Monstera Deliciosa Plant', price: 349, rating: 4.8, reviewCount: 88, images: ['https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=500&q=80'], shopId: { name: 'GreenThumb' } },
        { _id: 'p8', name: 'TKL Mechanical Keyboard', price: 3499, originalPrice: 4999, discountPercent: 30, rating: 4.7, reviewCount: 250, images: ['https://images.unsplash.com/photo-1595044426077-d36d9236d54a?w=500&q=80'], shopId: { name: 'KeyMasters' } },
      ]);
      setTotal(8);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, [query, category, sortBy, minPrice, maxPrice, rating, discount]);

  const clearFilters = () => { setCategory(''); setMinPrice(''); setMaxPrice(''); setRating(''); setDiscount(''); setIsFilterOpen(false); };

  const activeFiltersCount = [category, minPrice, maxPrice, rating, discount].filter(Boolean).length;

  return (
    <div className="min-h-screen page-bottom-padding" style={{ background: '#F5F0E8' }}>
      <div className="flex max-w-[1400px] mx-auto">

        {/* LEFT SIDEBAR */}
        <aside
          className="w-[72px] sm:w-[90px] md:w-[110px] xl:w-[130px] flex-shrink-0 sticky top-[112px] h-[calc(100vh-112px)] overflow-y-auto hide-scrollbar py-4"
          style={{ background: '#FFFFFF', borderRight: '1px solid #F3F4F6' }}
        >
          {CATEGORY_SIDEBAR.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveSection(cat.id);
                setCategory(cat.id === 'for-you' ? '' : cat.label);
              }}
              className="w-full flex flex-col items-center gap-1.5 py-3 px-1 transition-all"
              style={{
                background: activeSection === cat.id ? '#F0FDF4' : 'transparent',
                borderLeft: activeSection === cat.id ? `3px solid #22C55E` : '3px solid transparent',
              }}
            >
              <span className="text-xl">{cat.emoji}</span>
              <span
                className="text-[9px] sm:text-[10px] font-semibold text-center leading-tight"
                style={{ color: activeSection === cat.id ? '#22C55E' : '#6B7280' }}
              >
                {cat.label}
              </span>
            </button>
          ))}
        </aside>

        {/* RIGHT CONTENT */}
        <div className="flex-1 min-w-0 px-3 md:px-5 py-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h1 className="text-xl md:text-2xl font-heading font-black" style={{ color: '#1A1A1A' }}>
                {query ? `Results for "${query}"` : category ? category : 'For You'}
              </h1>
              {!loading && (
                <p className="text-xs font-medium mt-0.5" style={{ color: '#6B7280' }}>
                  {total} products found
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Filter Button */}
              <button
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold border transition-all relative"
                style={{ background: '#FFFFFF', borderColor: '#E5E7EB', color: '#1A1A1A' }}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center text-[9px] font-bold rounded-full bg-[#22C55E] text-white">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 rounded-full text-xs font-bold outline-none cursor-pointer border"
                  style={{ background: '#FFFFFF', borderColor: '#E5E7EB', color: '#1A1A1A' }}
                >
                  {SORT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none" style={{ color: '#6B7280' }} />
              </div>
            </div>
          </div>

          {/* Filter Quick Chips */}
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar mb-4 pb-1">
            {['Fashion', 'Electronics', 'Home', 'Beauty', 'Mobiles'].map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat === category ? '' : cat)}
                className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
                style={category === cat
                  ? { background: '#22C55E', borderColor: '#22C55E', color: '#fff' }
                  : { background: '#FFFFFF', borderColor: '#E5E7EB', color: '#6B7280' }
                }
              >
                {cat}
              </button>
            ))}
            <button
              onClick={() => setRating(rating === '4' ? '' : '4')}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border flex items-center gap-1 transition-all"
              style={rating === '4'
                ? { background: '#FEF3C7', borderColor: '#F59E0B', color: '#F59E0B' }
                : { background: '#FFFFFF', borderColor: '#E5E7EB', color: '#6B7280' }
              }
            >
              4+ <Star className="w-3 h-3" />
            </button>
            <button
              onClick={() => setDiscount(discount === '50' ? '' : '50')}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
              style={discount === '50'
                ? { background: '#FEF2F2', borderColor: '#EF4444', color: '#EF4444' }
                : { background: '#FFFFFF', borderColor: '#E5E7EB', color: '#6B7280' }
              }
            >
              50%+ Off
            </button>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
              {products.map(product => <ProductCard key={product._id} product={product} />)}
            </div>
          ) : (
            <div className="py-16 text-center flex flex-col items-center justify-center border-2 border-dashed rounded-3xl" style={{ borderColor: '#E5E7EB' }}>
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-bold mb-2" style={{ color: '#1A1A1A' }}>No results found</h3>
              <p className="text-sm mb-6" style={{ color: '#6B7280' }}>
                We couldn't find anything matching your search.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {['Trending', 'New Arrivals', 'Best Sellers'].map(s => (
                  <button
                    key={s}
                    onClick={clearFilters}
                    className="px-4 py-1.5 rounded-full text-sm font-semibold border"
                    style={{ borderColor: '#22C55E', color: '#22C55E' }}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <button onClick={clearFilters} className="mt-4 text-sm font-bold underline" style={{ color: '#6B7280' }}>
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* FILTER DRAWER */}
      {isFilterOpen && (
        <div
          className="fixed inset-0 z-[100] flex justify-end"
          style={{ background: 'rgba(0,0,0,0.4)' }}
          onClick={e => e.target === e.currentTarget && setIsFilterOpen(false)}
        >
          <div
            className="w-full md:w-[380px] max-h-[90vh] md:h-full mt-auto md:mt-0 rounded-t-3xl md:rounded-tl-3xl md:rounded-tr-none flex flex-col shadow-2xl animate-slide-up md:animate-none"
            style={{ background: '#FFFFFF', color: '#1A1A1A' }}
          >
            <div className="flex justify-center pt-3 pb-1 md:hidden">
              <div className="w-10 h-1 rounded-full" style={{ background: '#E5E7EB' }}></div>
            </div>

            <div className="flex items-center justify-between p-5" style={{ borderBottom: '1px solid #F3F4F6' }}>
              <h2 className="text-lg font-heading font-black">Filters</h2>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                style={{ background: '#F5F0E8', color: '#6B7280' }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Category */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.1em] mb-3" style={{ color: '#6B7280' }}>Category</h3>
                <div className="flex flex-col gap-2">
                  {['All', 'Fashion', 'Electronics', 'Home & Living', 'Beauty', 'Gadgets'].map(cat => {
                    const isActive = cat === 'All' ? !category : category === cat;
                    return (
                      <label key={cat} className="flex items-center gap-3 cursor-pointer">
                        <div
                          className="w-5 h-5 rounded flex items-center justify-center transition-colors"
                          style={{
                            background: isActive ? '#22C55E' : 'transparent',
                            border: `1.5px solid ${isActive ? '#22C55E' : '#E5E7EB'}`,
                          }}
                          onClick={() => setCategory(cat === 'All' ? '' : cat)}
                        >
                          {isActive && <div className="w-2 h-2 rounded-sm bg-white"></div>}
                        </div>
                        <span className="text-sm font-semibold" style={{ color: '#1A1A1A' }}>{cat}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="h-px" style={{ background: '#F3F4F6' }}></div>

              {/* Price */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.1em] mb-3" style={{ color: '#6B7280' }}>Price Range (₹)</h3>
                <div className="flex items-center gap-3">
                  <input type="number" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value)}
                    className="flex-1 px-3 py-2.5 rounded-xl text-sm font-semibold outline-none border"
                    style={{ background: '#F5F0E8', borderColor: '#E5E7EB', color: '#1A1A1A' }}
                    onFocus={e => e.target.style.borderColor = '#22C55E'}
                    onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                  />
                  <span className="font-bold" style={{ color: '#6B7280' }}>–</span>
                  <input type="number" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
                    className="flex-1 px-3 py-2.5 rounded-xl text-sm font-semibold outline-none border"
                    style={{ background: '#F5F0E8', borderColor: '#E5E7EB', color: '#1A1A1A' }}
                    onFocus={e => e.target.style.borderColor = '#22C55E'}
                    onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                  />
                </div>
              </div>

              <div className="h-px" style={{ background: '#F3F4F6' }}></div>

              {/* Rating */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.1em] mb-3" style={{ color: '#6B7280' }}>Rating</h3>
                <div className="flex flex-col gap-2">
                  {[4, 3].map(val => (
                    <label key={val} className="flex items-center gap-3 cursor-pointer">
                      <div
                        className="w-5 h-5 rounded flex items-center justify-center transition-colors"
                        style={{
                          background: rating === String(val) ? '#22C55E' : 'transparent',
                          border: `1.5px solid ${rating === String(val) ? '#22C55E' : '#E5E7EB'}`,
                        }}
                        onClick={() => setRating(rating === String(val) ? '' : String(val))}
                      >
                        {rating === String(val) && <div className="w-2 h-2 rounded-sm bg-white"></div>}
                      </div>
                      <span className="text-sm font-semibold flex items-center gap-1" style={{ color: '#1A1A1A' }}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5" style={{ color: '#F59E0B', fill: i < val ? '#F59E0B' : 'none' }} />
                        ))}
                        <span className="ml-1 text-xs" style={{ color: '#6B7280' }}>& Up</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-5 grid grid-cols-2 gap-3" style={{ borderTop: '1px solid #F3F4F6' }}>
              <button
                onClick={clearFilters}
                className="py-3 rounded-xl font-bold border text-sm transition-colors"
                style={{ background: 'transparent', borderColor: '#E5E7EB', color: '#6B7280' }}
                onMouseEnter={e => e.currentTarget.style.background = '#F5F0E8'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                Reset All
              </button>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="py-3 rounded-xl font-bold text-sm transition-colors text-white"
                style={{ background: '#22C55E' }}
                onMouseEnter={e => e.currentTarget.style.background = '#16A34A'}
                onMouseLeave={e => e.currentTarget.style.background = '#22C55E'}
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
