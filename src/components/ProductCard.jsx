import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Share2, Check } from 'lucide-react';
import useCartStore from '../store/useCartStore';
import useFeatureStore from '../store/useFeatureStore';
import useWishlistStore from '../store/useWishlistStore';
import useAuthStore from '../store/useAuthStore';
import useShareProduct from '../hooks/useShareProduct';

export default function ProductCard({ product }) {
    const navigate = useNavigate();
    const addToCart = useCartStore((state) => state.addToCart);
    const { isIncognitoActive } = useFeatureStore();
    const { token } = useAuthStore();
    const { isWishlisted, toggleItem } = useWishlistStore();
    const [added, setAdded] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);
    const productId = product._id || product.id;
    const wishlisted = isWishlisted(productId);
    const { share, copied } = useShareProduct();

    const handleShare = (e) => {
        e.preventDefault();
        e.stopPropagation();
        share({ productId, productName: product.name });
    };

    const isShopClosed = product.shopId?.shopStatus === 'closed';

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isShopClosed) return;
        addToCart(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    const handleWishlist = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!token) {
            navigate('/login');
            return;
        }
        if (wishlistLoading) return;
        setWishlistLoading(true);
        await toggleItem(productId, token);
        setWishlistLoading(false);
    };

    const hasDiscount = product.discountPercent && product.discountPercent > 0;
    const hasTryOn = product.garmentType && product.garmentType !== 'none';
    const rawShopName = product.shopId?.name || product.shopName || product.businessName || product.brand || 'Akupy Store';
    // BUG 3 FIX: Replace seller name with "Private Seller" in incognito mode
    const shopName = isIncognitoActive
        ? 'Private Seller'
        : ((rawShopName && !rawShopName.toLowerCase().includes('unknown')) ? rawShopName : 'Akupy Store');

    return (
        <Link
            to={`/product/${product._id || product.id}`}
            className="group block rounded-2xl overflow-hidden transition-all duration-300 relative cursor-pointer"
            style={{
                background: '#FFFFFF',
                border: '1px solid #F3F4F6',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.12)';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)';
            }}
        >
            {/* Image Container */}
            <div className="relative w-full aspect-square overflow-hidden" style={{ background: '#F5F0E8' }}>
                <img
                    src={(product.images?.[0]?.url || product.images?.[0]) || product.imageUrl || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80'}
                    alt={product.name}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />

                {/* Heart Wishlist Button — top right */}
                <button
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90 z-10"
                    style={{
                        background: 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(4px)',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                    onClick={handleWishlist}
                >
                    <Heart
                        className="w-4 h-4"
                        style={{
                            color: wishlisted ? '#EF4444' : '#9CA3AF',
                            fill: wishlisted ? '#EF4444' : 'none'
                        }}
                    />
                </button>

                {/* Discount Badge */}
                {hasDiscount && (
                    <div
                        className="absolute top-2.5 left-2.5 text-[10px] font-black px-2 py-0.5 rounded-full z-10"
                        style={{ background: '#22C55E', color: '#fff' }}
                    >
                        -{product.discountPercent}%
                    </div>
                )}

                {/* Shop Closed Overlay */}
                {isShopClosed && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
                        <div className="relative bg-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-white/50 shadow-xl">
                            <span className="text-[10px] font-black uppercase tracking-widest text-red-600 flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                                Shop Closed
                            </span>
                        </div>
                    </div>
                )}

                {/* Desktop/Tablet hover: Add to Cart overlay */}
                <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 md:group-hover:translate-y-0 transition-transform duration-300 pointer-events-none group-hover:pointer-events-auto p-2 hidden md:block">
                    <div style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }} className="absolute inset-0 rounded-b-2xl" />
                    <div className="relative flex gap-1">
                        {hasTryOn && (
                            <button
                                className="flex-1 py-2 rounded-xl text-xs font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ background: '#3B82F6', color: '#fff' }}
                                disabled={isShopClosed}
                                onClick={(e) => {
                                    e.preventDefault(); e.stopPropagation();
                                    if (isShopClosed) return;
                                    navigate(`/product/${product._id || product.id}?tryon=true`);
                                }}
                            >
                                👗 Try On
                            </button>
                        )}
                        <button
                            className="flex-1 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            style={added
                                ? { background: '#22C55E', color: '#fff' }
                                : { background: 'rgba(255,255,255,0.9)', color: '#1A1A1A' }
                            }
                            disabled={isShopClosed}
                            onClick={handleAddToCart}
                        >
                            {added ? '✓ Added!' : 'Add to Cart'}
                        </button>
                        <button
                            className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
                            style={{ background: copied ? '#22C55E' : 'rgba(255,255,255,0.85)', color: copied ? '#fff' : '#6B7280' }}
                            onClick={handleShare}
                            title="Share"
                        >
                            {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Info Section */}
            <div className="p-3">
                {/* Shop Name */}
                {shopName && (
                    <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(`/business/${product.shopId?._id || product.shopId?.id || product.shopId}`); }} className="text-[11px] font-semibold truncate mb-0.5 hover:underline cursor-pointer" style={{ color: '#6B7280' }}>
                        by {shopName}
                    </div>
                )}

                {/* Product Name */}
                <h3
                    className="text-sm font-bold leading-tight line-clamp-2 mb-1.5"
                    style={{ color: '#1A1A1A', minHeight: '2.5rem' }}
                >
                    {product.name}
                </h3>

                {/* Stars */}
                <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                            key={i}
                            className="w-3 h-3"
                            style={{
                                color: '#F59E0B',
                                fill: i < Math.round(product.rating || 4.5) ? '#F59E0B' : 'none'
                            }}
                        />
                    ))}
                    <span className="text-[11px] font-semibold" style={{ color: '#1A1A1A' }}>
                        {(product.rating || 4.5).toFixed(1)}
                    </span>
                    <span className="text-[11px]" style={{ color: '#9CA3AF' }}>
                        ({product.reviewCount || 10})
                    </span>
                </div>

                {/* Price Row */}
                <div className="flex items-center justify-between gap-2">
                    <div>
                        {Boolean(hasDiscount) && (
                            <span className="text-[11px] line-through mr-1" style={{ color: '#9CA3AF' }}>
                                ₹{product.originalPrice}
                            </span>
                        )}
                        <span className="font-black text-base" style={{ color: '#1A1A1A' }}>
                            ₹{product.price}
                        </span>
                    </div>

                    {/* Mobile quick add */}
                    <button
                        className="md:hidden w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90 disabled:opacity-50"
                        style={added
                            ? { background: '#22C55E', color: '#fff' }
                            : { background: '#F0FDF4', color: '#22C55E', border: '1.5px solid #DCFCE7' }
                        }
                        disabled={isShopClosed}
                        onClick={handleAddToCart}
                    >
                        <ShoppingCart className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </Link>
    );
}
