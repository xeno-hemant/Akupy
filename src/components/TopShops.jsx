import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, ChevronRight, Store } from 'lucide-react';
import api from '../utils/apiHelper';
import API from '../config/apiRoutes';

export default function TopShops({ city }) {
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTopShops = async () => {
            setLoading(true);
            try {
                const res = await api.get(`${API.SHOPS}/top?city=${city || ''}`);
                if (res.data.success) {
                    setShops(res.data.shops);
                }
            } catch (err) {
                console.error('Error fetching top shops:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchTopShops();
    }, [city]);

    if (!loading && shops.length === 0) return null;

    return (
        <div className="mb-10 mt-2">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-gray-900">⭐ Top Shops {city ? `in ${city}` : 'Near You'}</h2>
                </div>
                <button onClick={() => navigate('/discover')} className="text-xs font-bold text-green-600 flex items-center gap-1 hover:underline">
                    View All <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-6 hide-scrollbar -mx-1 px-1">
                {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="min-w-[280px] h-64 bg-gray-50 rounded-3xl animate-pulse" />
                    ))
                ) : (
                    shops.map((shop) => (
                        <ShopCard key={shop._id} shop={shop} />
                    ))
                )}
            </div>
        </div>
    );
}

function ShopCard({ shop }) {
    const navigate = useNavigate();
    const isFeatured = shop.isAdvertised && shop.advertisingPlan === 'featured';
    const isBasic = shop.isAdvertised && shop.advertisingPlan === 'basic';
    
    return (
        <div 
            onClick={() => navigate(`/business/${shop._id || shop.id}`)}
            className={`min-w-[280px] md:min-w-[320px] bg-white rounded-3xl overflow-hidden shadow-sm transition-all active:scale-95 cursor-pointer relative border ${
                isFeatured ? 'border-amber-300 ring-2 ring-amber-100 ring-offset-0' : 'border-gray-100'
            }`}
        >
            {/* Sponsored Badge */}
            {isFeatured && (
                <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
                    ⭐ Featured
                </div>
            )}
            {isBasic && (
                <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-[10px] font-black uppercase tracking-wider border border-orange-200">
                    Sponsored
                </div>
            )}

            {/* Banner/Header */}
            <div className="h-28 relative bg-[#F0FDF4]">
                {shop.banner && shop.banner !== 'null' ? (
                    <img src={shop.banner} alt="" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-green-100 italic">Akupy Shop</div>
                )}
                {/* Logo Overlap */}
                <div className="absolute -bottom-6 left-5 w-14 h-14 rounded-2xl border-4 border-white shadow-md bg-white overflow-hidden">
                    <img src={shop.logo || `https://api.dicebear.com/7.x/initials/svg?seed=${shop.name}`} className="w-full h-full object-cover" alt="" />
                </div>
            </div>

            <div className="pt-8 pb-5 px-5">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-gray-900 leading-tight line-clamp-1">{shop.name}</h3>
                    {shop.rating > 0 && (
                        <div className="flex items-center gap-1 text-xs font-black text-amber-500">
                            <Star className="w-3.5 h-3.5 fill-amber-500" /> {shop.rating.toFixed(1)}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3 mb-4">
                    <span className="text-[11px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full uppercase truncate max-w-[120px]">
                        {shop.category}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-gray-400">
                        <MapPin className="w-3 h-3" /> {shop.shopCity}
                    </span>
                </div>

                <button className={`w-full py-3 rounded-2xl font-black text-xs transition-all uppercase tracking-widest ${
                    isFeatured ? 'bg-amber-500 text-white hover:bg-amber-600' : 'bg-gray-900 text-white hover:bg-black'
                }`}>
                    Visit Shop
                </button>
            </div>
        </div>
    );
}
