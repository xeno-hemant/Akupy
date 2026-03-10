import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, ArrowRight, ShieldCheck, Globe } from 'lucide-react';

export default function ShopDiscovery() {
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/businesses`)
            .then(res => res.json())
            .then(data => {
                if (!data || data.length === 0) throw new Error('No shops yet');
                setShops(data);
            })
            .catch(() => {
                setShops([
                    { _id: '1', shopId: 'zara-mumbai', name: 'Zara Premium', category: 'Fashion', rating: 4.8, isVerified: true, enableGlobeShop: false, imageUrl: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&q=80', isOpen: true, distance: '1.2 km' },
                    { _id: '2', shopId: 'apple-reseller', name: 'iStore Hub', category: 'Electronics', rating: 4.9, isVerified: true, enableGlobeShop: true, imageUrl: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&q=80', isOpen: true, distance: '2.4 km' },
                    { _id: '3', shopId: 'books-corner', name: 'The Reading Room', category: 'Books', rating: 4.5, isVerified: false, enableGlobeShop: false, imageUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&q=80', isOpen: false, distance: '3.1 km' },
                    { _id: '4', shopId: 'sneaker-head', name: 'Kickz Kulture', category: 'Fashion', rating: 4.7, isVerified: true, enableGlobeShop: true, imageUrl: 'https://images.unsplash.com/photo-1618365908648-e71bd5716cba?w=400&q=80', isOpen: true, distance: '4.5 km' },
                ]);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <section
            className="w-full max-w-[1400px] mx-auto px-4 md:px-6 py-12 mt-8 mb-8 rounded-3xl"
            style={{ background: '#E8E0D6' }}
        >
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl md:text-3xl font-heading font-bold flex items-center gap-2" style={{ color: '#3d3830' }}>
                        Shops Near You <span className="text-2xl">📍</span>
                    </h2>
                    <p className="text-sm font-medium mt-1" style={{ color: '#8E867B' }}>Discover verified local businesses</p>
                </div>
                <Link
                    to="/discover?type=shops"
                    className="hidden sm:flex items-center gap-1 font-bold transition-colors"
                    style={{ color: '#8E867B' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#3d3830'}
                    onMouseLeave={e => e.currentTarget.style.color = '#8E867B'}
                >
                    See All <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="flex overflow-x-auto hide-scrollbar gap-4 md:gap-6 pb-4 -mx-4 px-4 md:mx-0 md:px-0">
                {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="min-w-[200px] md:min-w-[240px] h-[300px] rounded-2xl animate-pulse" style={{ background: '#F0EADD', border: '1px solid #D9D5D2' }}></div>
                    ))
                ) : (
                    shops.map((shop) => (
                        <Link
                            key={shop._id}
                            to={`/${shop.shopId}`}
                            className="flex-shrink-0 w-[220px] md:w-[260px] rounded-2xl overflow-hidden transition-all duration-300 group"
                            style={{ background: '#F0EADD', border: '1px solid #D9D5D2' }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-3px)';
                                e.currentTarget.style.boxShadow = '0 4px 16px rgba(142,134,123,0.18)';
                                e.currentTarget.style.background = '#E8E0D6';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                                e.currentTarget.style.background = '#F0EADD';
                            }}
                        >
                            {/* Banner */}
                            <div className="h-32 w-full relative overflow-hidden" style={{ background: '#D9D5D2' }}>
                                <img
                                    src={shop.imageUrl || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80'}
                                    alt={shop.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />

                                {/* Badges */}
                                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                                    <span
                                        className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md"
                                        style={{ background: 'rgba(240,234,221,0.9)', color: '#3d3830' }}
                                    >
                                        {shop.category}
                                    </span>
                                    {shop.enableGlobeShop && (
                                        <span
                                            className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1 shadow-md"
                                            style={{ background: '#8a9eb5', color: '#F3F0E2', border: '1px solid rgba(138,158,181,0.5)' }}
                                        >
                                            <Globe className="w-3 h-3" /> Global
                                        </span>
                                    )}
                                </div>

                                {/* Open/Closed dot */}
                                <div className="absolute top-3 right-3">
                                    <span
                                        className="w-3 h-3 rounded-full block border-2 border-white"
                                        style={{ background: shop.isOpen ? '#7a9e7e' : '#b5776e' }}
                                        title={shop.isOpen ? 'Open Now' : 'Closed'}
                                    ></span>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="p-4 relative">
                                {/* Logo float */}
                                <div
                                    className="absolute -top-9 right-4 w-11 h-11 rounded-xl shadow-sm p-1"
                                    style={{ background: '#F0EADD', border: '1.5px solid #D9D5D2' }}
                                >
                                    <img
                                        src={shop.thumbnail || `https://api.dicebear.com/7.x/initials/svg?seed=${shop.name}&backgroundColor=8E867B`}
                                        className="w-full h-full object-cover rounded-lg"
                                        alt=""
                                    />
                                </div>

                                <h3 className="text-base font-bold flex items-center gap-1 mt-1 pr-12 line-clamp-1" style={{ color: '#3d3830' }}>
                                    {shop.name}
                                    {shop.isVerified && <ShieldCheck className="w-4 h-4 flex-shrink-0" style={{ color: '#7a9e7e' }} />}
                                </h3>

                                <div className="flex items-center gap-3 mt-2 text-sm">
                                    <span className="flex items-center gap-0.5 font-bold" style={{ color: '#3d3830' }}>
                                        <Star className="w-4 h-4 fill-current" style={{ color: '#c4a882' }} />
                                        {shop.rating?.toFixed(1) || '4.5'}
                                    </span>
                                    <span style={{ color: '#D9D5D2' }}>|</span>
                                    <span className="flex items-center gap-1 font-medium" style={{ color: '#8E867B' }}>
                                        <MapPin className="w-3.5 h-3.5" />
                                        {shop.distance || '2.0 km'}
                                    </span>
                                </div>

                                <div
                                    className="mt-4 pt-4 w-full flex justify-center text-sm font-bold transition-colors"
                                    style={{ borderTop: '1px solid #D9D5D2', color: '#8E867B' }}
                                >
                                    Visit Shop →
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </section>
    );
}
