import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Globe, ShoppingCart, Star } from 'lucide-react';
import useCartStore from '../store/useCartStore';

export default function ProductCard({ product }) {
    const navigate = useNavigate();
    const addToCart = useCartStore((state) => state.addToCart);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
    };

    const hasDiscount = product.discountPercent && product.discountPercent > 0;
    const isGlobal = product.isGlobeShop || product.shopId?.enableGlobeShop;
    const hasTryOn = product.garmentType && product.garmentType !== 'none';
    const isNew = product.tags?.includes('NEW');
    const isHot = product.tags?.includes('TRENDING') || product.tags?.includes('HOT');

    return (
        <Link
            to={`/product/${product._id || product.id}`}
            className="group block rounded-xl md:rounded-2xl overflow-hidden transition-all duration-300 relative"
            style={{
                background: '#F0EADD',
                border: '1px solid #D9D5D2',
                boxShadow: '0 1px 4px rgba(142,134,123,0.10)',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(142,134,123,0.18)';
                e.currentTarget.style.borderColor = '#c8c2bc';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 4px rgba(142,134,123,0.10)';
                e.currentTarget.style.borderColor = '#D9D5D2';
            }}
        >
            {/* Top Right Actions */}
            <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
                <button
                    className="w-8 h-8 rounded-full backdrop-blur-md shadow-sm flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                    style={{ background: 'rgba(240,234,221,0.85)', border: '1px solid #D9D5D2', color: '#aba49c' }}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    onMouseEnter={e => e.currentTarget.style.color = '#b5776e'}
                    onMouseLeave={e => e.currentTarget.style.color = '#aba49c'}
                >
                    <Heart className="w-4 h-4" />
                </button>
                {isGlobal && (
                    <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm"
                        style={{ background: '#8a9eb5', color: '#F3F0E2', border: '1px solid #7a8ea5' }}
                        title="Globe Shop Item"
                    >
                        <Globe className="w-4 h-4" />
                    </div>
                )}
            </div>

            {/* Badges (Top Left) */}
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
                {hasDiscount && (
                    <span
                        className="text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full shadow-sm"
                        style={{ background: '#3d3830', color: '#F3F0E2' }}
                    >
                        -{product.discountPercent}%
                    </span>
                )}
                {isNew && !hasDiscount && (
                    <span
                        className="text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full shadow-sm uppercase tracking-wider"
                        style={{ background: '#8E867B', color: '#F3F0E2' }}
                    >
                        NEW
                    </span>
                )}
                {isHot && !isNew && !hasDiscount && (
                    <span
                        className="text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full shadow-sm uppercase tracking-wider"
                        style={{ background: '#b5776e', color: '#F3F0E2' }}
                    >
                        HOT
                    </span>
                )}
            </div>

            {/* Image */}
            <div className="w-full aspect-[4/5] sm:aspect-square relative overflow-hidden" style={{ background: '#F3F0E2' }}>
                <img
                    src={product.images?.[0] || product.imageUrl || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80'}
                    alt={product.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />

                {/* Hover Actions Overlay */}
                <div
                    className="absolute left-0 right-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none group-hover:pointer-events-auto p-2 hidden md:flex gap-2"
                    style={{ background: 'linear-gradient(to top, rgba(61,56,48,0.55), transparent)' }}
                >
                    {hasTryOn && (
                        <button
                            className="flex-1 font-bold text-xs py-2 rounded-lg flex items-center justify-center gap-1 shadow-md transition-colors"
                            style={{ background: '#4fc3f7', color: '#fff', border: '1px solid #29b6f6' }}
                            onClick={(e) => {
                                e.preventDefault(); e.stopPropagation();
                                navigate(`/product/${product._id || product.id}?tryon=true`);
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = '#29b6f6'}
                            onMouseLeave={e => e.currentTarget.style.background = '#4fc3f7'}
                        >
                            👗 Try On
                        </button>
                    )}
                    <button
                        className="flex-1 font-bold text-xs py-2 rounded-lg flex items-center justify-center gap-1 shadow-md transition-opacity hover:opacity-90"
                        style={{ background: '#81c784', color: '#fff' }}
                        onClick={handleAddToCart}
                    >
                        <ShoppingCart className="w-4 h-4" /> Add
                    </button>
                </div>
            </div>

            {/* Info */}
            <div className="p-3 sm:p-4 flex flex-col" style={{ background: '#F0EADD' }}>
                <div className="mb-0.5 text-xs font-semibold truncate" style={{ color: '#8E867B' }}>
                    {product.shopId?.name || product.brand || 'Unknown Shop'}
                </div>

                <h3
                    className="text-sm font-semibold leading-tight line-clamp-2 min-h-[40px] transition-colors"
                    style={{ color: '#3d3830' }}
                >
                    {product.name}
                </h3>

                <div className="flex items-center gap-1 mt-1.5 mb-2">
                    <Star className="w-3.5 h-3.5 fill-current" style={{ color: '#c4a882' }} />
                    <span className="text-xs font-bold" style={{ color: '#3d3830' }}>{product.rating?.toFixed(1) || '4.5'}</span>
                    <span className="text-xs" style={{ color: '#aba49c' }}>({product.reviewCount || 10})</span>
                </div>

                <div className="mt-auto pt-2 flex items-end justify-between">
                    <div>
                        {hasDiscount && (
                            <span className="text-xs line-through mr-1 block sm:inline" style={{ color: '#aba49c' }}>
                                ₹{product.originalPrice}
                            </span>
                        )}
                        <span className="font-heading font-black text-base sm:text-lg" style={{ color: '#3d3830' }}>
                            ₹{product.price}
                        </span>
                    </div>

                    {/* Mobile Quick Add */}
                    <button
                        className="md:hidden w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-95"
                        style={{ background: '#e8f5e9', color: '#4caf50', border: '1px solid #c8e6c9' }}
                        onClick={handleAddToCart}
                        onMouseEnter={e => { e.currentTarget.style.background = '#81c784'; e.currentTarget.style.color = '#fff'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#e8f5e9'; e.currentTarget.style.color = '#4caf50'; }}
                    >
                        <ShoppingCart className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </Link>
    );
}
