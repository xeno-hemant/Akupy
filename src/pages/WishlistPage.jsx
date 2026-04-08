import React, { useEffect, useState } from 'react';
import { ArrowLeft, Heart, ShoppingBag } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import useWishlistStore from '../store/useWishlistStore';
import ProductCard from '../components/ProductCard';
import API from '../config/apiRoutes';
import api from '../utils/apiHelper';

function SkeletonCard() {
    return (
        <div className="skeleton-card">
            <div className="skeleton-card-image" />
            <div className="skeleton-card-body">
                <div className="skeleton-line sm" />
                <div className="skeleton-line md" />
                <div className="skeleton-line xl" style={{ marginTop: 4 }} />
            </div>
        </div>
    );
}

export default function WishlistPage() {
    const navigate = useNavigate();
    const { token } = useAuthStore();
    const { ids, fetchWishlist } = useWishlistStore();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            if (!token) { setLoading(false); return; }
            setLoading(true);
            try {
                const res = await api.get(API.WISHLIST);
                if (res.data.success) {
                    const items = res.data.items || [];
                    setProducts(items.map(item => item.productId).filter(Boolean));
                }
            } catch (err) {
                console.error('Wishlist load error:', err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [token, ids]); // refetch when ids changes (item removed)

    return (
        <div className="min-h-screen pb-24" style={{ background: '#F5F0E8', paddingTop: '80px' }}>
            <div className="max-w-[1200px] mx-auto px-4 md:px-6">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-2 text-gray-500 font-semibold hover:text-gray-900 transition-colors text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                            <Heart className="w-6 h-6 text-red-400 fill-red-400" /> My Wishlist
                        </h1>
                        {!loading && (
                            <p className="text-sm text-gray-500 mt-0.5">
                                {products.length} {products.length === 1 ? 'item' : 'items'} saved
                            </p>
                        )}
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                ) : products.length === 0 ? (
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm text-center py-16 px-8">
                        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
                            <Heart className="w-10 h-10 text-red-200" />
                        </div>
                        <h2 className="text-xl font-black text-gray-900 mb-2">Your wishlist is empty</h2>
                        <p className="text-gray-500 font-medium mb-8">Save products you love by tapping the ♡ heart icon</p>
                        <Link
                            to="/shop"
                            className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-sm text-white transition-all active:scale-95"
                            style={{ background: '#1A1A1A' }}
                        >
                            <ShoppingBag className="w-4 h-4" /> Explore Products
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                        {products.map(product => (
                            <ProductCard key={product._id || product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
