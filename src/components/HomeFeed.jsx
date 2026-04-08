import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Store, Wrench, Star, MapPin, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import useFeatureStore from '../store/useFeatureStore';
import useLocationStore from '../store/useLocationStore';
import useTranslation from '../hooks/useTranslation';
import API from '../config/apiRoutes';
import api from '../utils/apiHelper';

// ─── Promo Banner ─────────────────────────────────────────────────────────────
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
      <div className="p-6 md:p-8 flex-1">
        <span className="inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3"
          style={{ background: '#DCFCE7', color: '#16A34A' }}>
          🔥 Limited Offer
        </span>
        <h2 className="text-xl md:text-2xl font-heading font-black mb-3" style={{ color: '#1A1A1A' }}>
          Grab Upto <span style={{ color: '#22C55E' }}>50% Off</span><br />
          On Selected Products
        </h2>
        <Link
          to="/discover"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white transition-all hover:shadow-lg active:scale-95"
          style={{ background: '#22C55E' }}
          onMouseEnter={e => e.currentTarget.style.background = '#16A34A'}
          onMouseLeave={e => e.currentTarget.style.background = '#22C55E'}
        >
          Shop Now →
        </Link>
      </div>
      <div className="hidden sm:flex items-center justify-end pr-6 w-48 md:w-56 flex-shrink-0">
        <img
          src="https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=300&q=80"
          alt="Offer"
          className="w-36 md:w-44 object-contain drop-shadow-xl"
          style={{ maxHeight: 160 }}
        />
      </div>
      <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full opacity-10 pointer-events-none" style={{ background: '#22C55E' }} />
    </div>
  );
}

// ─── Skeleton Cards ───────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-card-image" />
      <div className="skeleton-card-body">
        <div className="skeleton-line sm" />
        <div className="skeleton-line md" />
        <div className="skeleton-line md" style={{ width: '60%' }} />
        <div className="skeleton-line xl" style={{ marginTop: '4px' }} />
      </div>
    </div>
  );
}

function SkeletonBanner() { return <div className="skeleton-banner" />; }

function SkeletonShopCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm p-4 flex gap-3 items-start">
      <div className="skeleton-shimmer w-14 h-14 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="skeleton-line md" style={{ width: '70%' }} />
        <div className="skeleton-line sm" style={{ width: '40%' }} />
        <div className="skeleton-line sm" style={{ width: '55%' }} />
      </div>
    </div>
  );
}

// ─── Tab Bar ──────────────────────────────────────────────────────────────────
function TabBar({ activeTab, setActiveTab, t }) {
  const TABS = [
    { id: 'products', label: t('products'), icon: ShoppingBag },
    { id: 'shops', label: t('shops'), icon: Store },
    { id: 'services', label: t('services'), icon: Wrench },
  ];

  return (
    <div className="flex gap-1 mb-6 p-1 rounded-2xl" style={{ background: '#EDE6D8' }}>
      {TABS.map(({ id, label, icon: Icon }) => {
        const active = activeTab === id;
        return (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all"
            style={
              active
                ? { background: '#22C55E', color: '#fff', boxShadow: '0 2px 8px rgba(34,197,94,0.3)' }
                : { background: 'transparent', color: '#6B7280' }
            }
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Shop Card ───────────────────────────────────────────────────────────────
function ShopCard({ shop }) {
  const navigate = useNavigate();
  const initial = (shop.shopName || 'S')[0].toUpperCase();

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer group"
      onClick={() => navigate(`/business/${shop._id}`)}
    >
      {/* Banner / Logo area */}
      <div className="relative h-28 flex-shrink-0" style={{ background: 'linear-gradient(135deg, #F0FDF4, #DCFCE7)' }}>
        {shop.bannerUrl && (
          <img src={shop.bannerUrl} alt="" className="w-full h-full object-cover" />
        )}
        {/* Logo */}
        <div className="absolute -bottom-5 left-4 w-12 h-12 rounded-xl overflow-hidden border-2 border-white shadow-md flex items-center justify-center font-black text-white text-lg"
          style={{ background: shop.logoUrl ? 'transparent' : '#22C55E' }}>
          {shop.logoUrl
            ? <img src={shop.logoUrl} alt={shop.shopName} className="w-full h-full object-cover" />
            : initial
          }
        </div>
      </div>

      <div className="pt-7 pb-4 px-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-black text-[14px] text-gray-900 line-clamp-1 group-hover:text-[#22C55E] transition-colors">
            {shop.shopName}
          </h3>
          {shop.rating > 0 && (
            <span className="flex items-center gap-0.5 text-[11px] font-bold text-amber-600 flex-shrink-0">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {shop.rating.toFixed(1)}
            </span>
          )}
        </div>

        {shop.category && (
          <span className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full mb-2"
            style={{ background: '#F0FDF4', color: '#16A34A' }}>
            {shop.category}
          </span>
        )}

        {(shop.city || shop.tagline) && (
          <p className="text-[12px] text-gray-400 font-medium flex items-center gap-1 mb-3 line-clamp-1">
            {shop.city && <><MapPin className="w-3 h-3 flex-shrink-0" />{shop.city}</>}
            {shop.city && shop.tagline && ' · '}
            {shop.tagline && <span className="truncate">{shop.tagline}</span>}
          </p>
        )}

        <button
          className="w-full py-2 rounded-xl text-xs font-bold text-[#22C55E] border border-[#22C55E] transition-all hover:bg-[#22C55E] hover:text-white active:scale-95"
          onClick={e => { e.stopPropagation(); navigate(`/business/${shop._id}`); }}
        >
          Visit Shop →
        </button>
      </div>
    </div>
  );
}

// ─── Service Card ─────────────────────────────────────────────────────────────
function ServiceCard({ service }) {
  const navigate = useNavigate();
  const title = service.serviceName || service.name || service.category || 'Service';
  const initial = title[0].toUpperCase();

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-3 items-start transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer group"
      onClick={() => navigate(`/service/${service._id}`)}
    >
      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center font-black text-white text-lg"
        style={{ background: service.images?.[0] ? 'transparent' : '#3B82F6' }}>
        {service.images?.[0]
          ? <img src={service.images[0]} alt="" className="w-full h-full object-cover" />
          : initial
        }
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-black text-[14px] text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {service.name}
        </h3>
        {service.category && (
          <span className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full mb-1"
            style={{ background: '#EFF6FF', color: '#2563EB' }}>
            {service.category}
          </span>
        )}
        {service.shopCity && (
          <p className="text-[11px] text-gray-400 font-medium flex items-center gap-1">
            <MapPin className="w-2.5 h-2.5" /> {service.shopCity}
          </p>
        )}
        <button
          className="mt-2 text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline"
          onClick={e => { e.stopPropagation(); navigate(`/business/${service._id}`); }}
        >
          Book Now <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

// ─── Products Tab ─────────────────────────────────────────────────────────────
function ProductsTab({ city }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isIncognitoActive } = useFeatureStore();

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const cityParam = city ? `&city=${encodeURIComponent(city)}` : '';
        const res = await api.get(`${API.PRODUCTS}?limit=24${cityParam}`);
        let items = res.data.products || [];

        // Fallback: augment from Business catalog if v1 is empty
        if (items.length === 0) {
          const res2 = await api.get(API.SHOPS);
          const businesses = res2.data;
          if (Array.isArray(businesses)) {
            businesses.forEach(biz => {
              if (biz.products?.length > 0) {
                biz.products.forEach((product, idx) => {
                  const pId = product._id || `cat-${biz._id}-${idx}`;
                  items.push({
                    ...product,
                    _id: pId,
                    businessName: biz.name,
                    shopId: { name: biz.name }
                  });
                });
              }
            });
          }
        }
        setProducts(items);
      } catch (err) {
        console.error('Products tab error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [city]);

  if (loading) return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
      {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );

  if (products.length === 0) return (
    <div className="text-center py-16 text-gray-400">
      <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-20" />
      <p className="font-semibold">No products found{city ? ` near ${city}` : ''}.</p>
      {city && <p className="text-sm mt-1">Try clearing the city filter.</p>}
    </div>
  );

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-heading font-black" style={{ color: '#1A1A1A' }}>
          {city ? `Products near ${city}` : 'Products For You!'}
        </h2>
        <Link to="/discover" className="text-sm font-semibold" style={{ color: '#22C55E' }}>View All →</Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
        {products.slice(0, 24).map(product => (
          <ProductCard key={product._id || product.id} product={product} />
        ))}
      </div>
    </>
  );
}

// ─── Shops Tab ────────────────────────────────────────────────────────────────
function ShopsTab({ city }) {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const cityParam = city ? `&city=${encodeURIComponent(city)}` : '';
        const res = await api.get(`${API.SHOPS}?limit=24${cityParam}`);
        setShops(res.data.shops || []);
      } catch (err) {
        console.error('Shops tab error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [city]);

  if (loading) return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => <SkeletonShopCard key={i} />)}
    </div>
  );

  if (shops.length === 0) return (
    <div className="text-center py-16 text-gray-400">
      <Store className="w-12 h-12 mx-auto mb-3 opacity-20" />
      <p className="font-semibold">No shops found{city ? ` near ${city}` : ''}.</p>
      {city && <p className="text-sm mt-1">Try clearing the city filter or become the first seller here!</p>}
    </div>
  );

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-heading font-black" style={{ color: '#1A1A1A' }}>
          {city ? `Shops near ${city}` : 'Explore Shops'}
        </h2>
        <Link to="/discover" className="text-sm font-semibold" style={{ color: '#22C55E' }}>View All →</Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {shops.map(shop => <ShopCard key={shop._id} shop={shop} />)}
      </div>
    </>
  );
}

// ─── Services Tab ─────────────────────────────────────────────────────────────
function ServicesTab({ city }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const cityParam = city ? `?city=${encodeURIComponent(city)}` : '';
        const res = await api.get(`${API.SERVICES}${cityParam}`);
        setServices(res.data.services || []);
      } catch (err) {
        console.error('Services tab error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [city]);

  if (loading) return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {Array.from({ length: 4 }).map((_, i) => <SkeletonShopCard key={i} />)}
    </div>
  );

  if (services.length === 0) return (
    <div className="text-center py-16 text-gray-400">
      <Wrench className="w-12 h-12 mx-auto mb-3 opacity-20" />
      <p className="font-semibold">No services found{city ? ` near ${city}` : ''}.</p>
      <p className="text-sm mt-1">Services from local providers will appear here soon.</p>
    </div>
  );

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-heading font-black" style={{ color: '#1A1A1A' }}>
          {city ? `Services near ${city}` : 'Local Services'}
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {services.map(s => <ServiceCard key={s._id} service={s} />)}
      </div>
    </>
  );
}

export default function HomeFeed() {
  const [activeTab, setActiveTab] = useState('products');
  const [bannerLoaded, setBannerLoaded] = useState(false);
  const { city } = useLocationStore();
  const { t } = useTranslation();

  // Quick banner reveal
  useEffect(() => { const t = setTimeout(() => setBannerLoaded(true), 300); return () => clearTimeout(t); }, []);

  return (
    <section className="px-4 md:px-6 pb-24 xl:pb-6 max-w-[1400px] mx-auto">
      {/* Banner */}
      {!bannerLoaded ? <SkeletonBanner /> : <PromoBanner />}

      {/* Location label */}
      {city && (
        <div className="flex items-center gap-1.5 text-sm font-semibold mb-4 mt-1" style={{ color: '#16A34A' }}>
          <MapPin className="w-4 h-4" />
          Showing results near <span className="font-black">{city}</span>
        </div>
      )}

      {/* Tab bar */}
      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} t={t} />

      {/* Tab content */}
      {activeTab === 'products' && <ProductsTab city={city} />}
      {activeTab === 'shops' && <ShopsTab city={city} />}
      {activeTab === 'services' && <ServicesTab city={city} />}
    </section>
  );
}
