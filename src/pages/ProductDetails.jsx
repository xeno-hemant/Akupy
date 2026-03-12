import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
    ChevronRight, ChevronDown, Star, Heart, Share2, 
    MapPin, Truck, ShieldCheck, ShoppingCart 
} from 'lucide-react';
import useCartStore from '../store/useCartStore';
import useTryOnStore from '../store/useTryOnStore';
import useFeatureStore from '../store/useFeatureStore';
import API from '../config/apiRoutes';
import api from '../utils/apiHelper';

// Hidden Hues tokens
const HH = {
    ivory: '#F3F0E2',
    cream: '#F0EADD',
    linen: '#E8E0D6',
    silver: '#D9D5D2',
    taupe: '#8E867B',
    dark: '#3d3830',
    muted: '#aba49c',
    sage: '#7a9e7e',
    terra: '#b5776e',
};

export default function ProductDetails() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState('');
    const [selectedColor, setSelectedColor] = useState(0);
    const [selectedSize, setSelectedSize] = useState('M');
    const [qty, setQty] = useState(1);
    const [offersExpanded, setOffersExpanded] = useState(false);
    const [detailsExpanded, setDetailsExpanded] = useState(true);

    const addToCart = useCartStore((state) => state.addToCart);
    const { openTryOnForProduct } = useTryOnStore();
    const { isIncognitoActive } = useFeatureStore();

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchProd = async () => {
            setLoading(true);
            try {
                const res = await api.get(`${API.PRODUCTS}/${productId}`);
                const data = res.data?.product || res.data;
                if (data) {
                    setProduct(data);
                    if (data.images?.length > 0) {
                        const firstImg = typeof data.images[0] === 'string' ? data.images[0] : data.images[0].url;
                        setActiveImage(firstImg);
                    }
                } else {
                    throw new Error('Product not found in database');
                }
            } catch {
                const mock = {
                    _id: productId,
                    name: 'Premium Japanese Denim Jacket — Contrast Stitching',
                    price: 3499, originalPrice: 4999, discountPercent: 30,
                    description: 'Crafted from heavy-weight selvedge denim from Okayama. Features a boxy fit perfect for layering with contrast gold stitching and custom brass hardware.',
                    shopId: { name: 'Urban Threads', isVerified: true, rating: 4.8, reviewCount: 230 },
                    category: 'Fashion', rating: 4.9, reviewCount: 124,
                    images: [
                        'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80',
                        'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
                        'https://images.unsplash.com/photo-1520975954732-57dd22299614?w=800&q=80',
                    ],
                    colorVariants: [
                        { name: 'Stone Wash', hex: '#8E867B' },
                        { name: 'Vintage Dark', hex: '#3d3830' },
                    ],
                    sizes: ['S', 'M', 'L', 'XL'],
                    garmentType: 'outerwear',
                };
                setProduct(mock);
                setActiveImage(mock.images[0]);
            } finally { setLoading(false); }
        };
        fetchProd();
    }, [productId]);

    const handleAddToCart = () => {
        if (!product) return;
        const rawShopName = product.shopId?.name || product.shopId?.shopName || 'Akupy Store';
        const shopName = (rawShopName && !rawShopName.toLowerCase().includes('unknown')) ? rawShopName : 'Akupy Store';
        const cartItem = { 
            ...product, 
            id: product._id,
            selectedColor: product.colorVariants?.[selectedColor]?.name, 
            selectedSize, 
            quantity: qty,
            shopName
        };
        addToCart(cartItem);
    };
    const handleBuyNow = () => { handleAddToCart(); navigate('/cart'); };

    const incog = isIncognitoActive;
    const pageBg = incog ? HH.dark : HH.ivory;
    const cardBg = incog ? '#2e2a25' : HH.cream;
    const textMain = incog ? HH.ivory : HH.dark;
    const textSub = incog ? HH.silver : HH.taupe;
    const border = incog ? HH.taupe : HH.silver;

    if (loading) return (
        <div className="min-h-screen pt-32 text-center font-bold animate-pulse" style={{ background: HH.ivory, color: HH.muted }}>
            Loading product...
        </div>
    );
    if (!product) return (
        <div className="min-h-screen pt-32 text-center font-bold" style={{ background: HH.ivory, color: HH.dark }}>
            Product not found.
        </div>
    );

    return (
        <div className="min-h-screen pb-32 md:pb-24" style={{ background: pageBg, paddingTop: '120px' }}>
            <div className="max-w-[1200px] mx-auto px-4 md:px-6">

                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-xs font-semibold mb-6" style={{ color: HH.muted }}>
                    <Link to="/" className="hover:text-taupe transition-colors" style={{ color: HH.muted }}>Home</Link>
                    <ChevronRight className="w-3 h-3" />
                    <Link to={`/discover?category=${product.category}`} style={{ color: HH.muted }} className="transition-colors">{product.category}</Link>
                    <ChevronRight className="w-3 h-3" />
                    <span style={{ color: textMain }} className="truncate">{product.name}</span>
                </div>

                <div className="flex flex-col md:flex-row gap-8 lg:gap-12">

                    {/* LEFT: Images */}
                    <div className="w-full md:w-1/2 flex flex-col gap-4">
                        <div
                            className="w-full aspect-[4/5] md:aspect-square rounded-3xl overflow-hidden relative group"
                            style={{ background: HH.cream, border: `1px solid ${border}` }}
                        >
                            <img
                                src={activeImage}
                                alt={product.name}
                                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110 cursor-crosshair"
                            />

                            <div className="absolute top-4 right-4 flex flex-col gap-2">
                                <button
                                    className="w-10 h-10 rounded-full backdrop-blur-sm shadow-md flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                                    style={{ background: 'rgba(240,234,221,0.85)', color: HH.muted, border: `1px solid ${HH.silver}` }}
                                    onMouseEnter={e => e.currentTarget.style.color = HH.terra}
                                    onMouseLeave={e => e.currentTarget.style.color = HH.muted}
                                >
                                    <Heart className="w-5 h-5" />
                                </button>
                                <button
                                    className="w-10 h-10 rounded-full backdrop-blur-sm shadow-md flex items-center justify-center transition-all hover:scale-110"
                                    style={{ background: 'rgba(240,234,221,0.85)', color: HH.taupe, border: `1px solid ${HH.silver}` }}
                                >
                                    <Share2 className="w-4 h-4" />
                                </button>
                            </div>

                            {product.discountPercent > 0 && (
                                <div
                                    className="absolute top-4 left-4 text-sm font-black px-3 py-1 rounded-full shadow-sm"
                                    style={{ background: HH.dark, color: HH.ivory }}
                                >
                                    -{product.discountPercent}% OFF
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3 overflow-x-auto hide-scrollbar">
                            {product.images?.map((img, i) => {
                                const url = typeof img === 'object' ? img.url : img;
                                return (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImage(url)}
                                        className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border-2 transition-all relative flex items-center justify-center p-1"
                                        style={{
                                            borderColor: activeImage === url ? HH.taupe : 'transparent',
                                            opacity: activeImage === url ? 1 : 0.55,
                                            background: HH.cream
                                        }}
                                    >
                                        <img src={url} alt="" className="w-full h-full object-cover rounded-xl" />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* RIGHT: Details */}
                    <div className="w-full md:w-1/2 flex flex-col">

                        {/* Shop Link (Hidden in Incognito) */}
                        {!incog && (
                            <Link to={`/business/${product.shopId?._id || product.shopId?.id || product.shopId}`} className="inline-flex items-center gap-2 mb-2 w-max group">
                                <div className="w-6 h-6 rounded-full overflow-hidden" style={{ background: HH.linen }}>
                                    <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${product.shopId?.name}&backgroundColor=8E867B`} className="w-full h-full" alt="" />
                                </div>
                                <span className="text-sm font-bold flex items-center gap-1 transition-colors" style={{ color: HH.taupe }}
                                    onMouseEnter={e => e.currentTarget.style.color = HH.dark}
                                    onMouseLeave={e => e.currentTarget.style.color = HH.taupe}
                                >
                                    {product.shopId?.name}
                                    {product.shopId?.isVerified && <ShieldCheck className="w-3.5 h-3.5" style={{ color: HH.sage }} />}
                                </span>
                            </Link>
                        )}

                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-black leading-tight mb-2" style={{ color: textMain }}>
                            {product.name}
                        </h1>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-6">
                            <div className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4" style={{ color: '#c4a882', fill: i < Math.floor(product.rating || 0) ? '#c4a882' : 'none' }} />
                                ))}
                            </div>
                            <span className="text-sm font-bold" style={{ color: textMain }}>{product.rating || '4.0'}</span>
                            <span className="text-sm font-medium underline cursor-pointer" style={{ color: HH.taupe }}>
                                ({product.reviewCount || 0} reviews)
                            </span>
                        </div>

                        {/* Price */}
                        <div className="mb-8 flex items-end gap-3">
                            <span className="text-4xl font-black tracking-tight" style={{ color: textMain }}>₹{product.price}</span>
                            {product.originalPrice && (
                                <>
                                    <span className="text-lg line-through mb-1" style={{ color: HH.muted }}>₹{product.originalPrice}</span>
                                    <span className="text-sm font-bold mb-1.5" style={{ color: HH.sage }}>(Save ₹{product.originalPrice - product.price})</span>
                                </>
                            )}
                        </div>

                        <div className="h-px w-full mb-8" style={{ background: HH.silver }}></div>

                        {/* Color Variants */}
                        {product.colorVariants?.length > 0 && (
                            <div className="mb-6">
                                <div className="flex items-center mb-3">
                                    <span className="text-sm font-bold" style={{ color: textMain }}>
                                        Color: <span className="font-semibold ml-1" style={{ color: textSub }}>{product.colorVariants[selectedColor].name}</span>
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    {product.colorVariants.map((color, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedColor(idx)}
                                            className="w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center"
                                            style={{ borderColor: selectedColor === idx ? HH.taupe : 'transparent' }}
                                        >
                                            <span className="w-8 h-8 rounded-full shadow-inner block" style={{ backgroundColor: color.hex }}></span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Size */}
                        {product.sizes?.length > 0 && (
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-bold" style={{ color: textMain }}>
                                        Size: <span className="font-semibold ml-1" style={{ color: textSub }}>{selectedSize}</span>
                                    </span>
                                    <button className="text-xs font-bold" style={{ color: HH.taupe }}>Size Guide →</button>
                                </div>
                                <div className="flex flex-wrap gap-2 md:gap-3">
                                    {product.sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className="flex-1 min-w-[60px] py-3 rounded-xl text-sm font-bold border transition-all"
                                            style={{
                                                background: selectedSize === size ? HH.taupe : HH.ivory,
                                                borderColor: selectedSize === size ? HH.taupe : HH.silver,
                                                color: selectedSize === size ? HH.ivory : HH.taupe,
                                            }}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row items-center gap-3 mb-8">
                            <div className="flex items-center rounded-xl overflow-hidden h-12" style={{ background: HH.linen, border: `1px solid ${HH.silver}` }}>
                                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-12 h-12 flex items-center justify-center font-bold text-lg transition-colors" style={{ color: HH.taupe }}
                                    onMouseEnter={e => e.currentTarget.style.background = HH.silver}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >-</button>
                                <input type="number" readOnly value={qty} className="w-12 h-12 text-center font-bold outline-none text-sm" style={{ borderLeft: `1px solid ${HH.silver}`, borderRight: `1px solid ${HH.silver}`, color: HH.dark, background: 'transparent' }} />
                                <button onClick={() => setQty(qty + 1)} className="w-12 h-12 flex items-center justify-center font-bold text-lg transition-colors" style={{ color: HH.taupe }}
                                    onMouseEnter={e => e.currentTarget.style.background = HH.silver}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >+</button>
                            </div>
                            
                            <button
                                onClick={handleAddToCart}
                                className="w-full sm:flex-1 h-12 flex items-center justify-center gap-2 rounded-xl font-bold transition-all shadow-sm"
                                style={{ background: '#81c784', color: '#fff' }}
                            >
                                <ShoppingCart className="w-5 h-5" /> Add to Cart
                            </button>
                        </div>

                        {/* Offers Box */}
                        <div className="mb-8 rounded-2xl overflow-hidden" style={{ background: HH.cream, border: `1px solid ${HH.silver}`, borderLeft: `3px solid ${HH.taupe}` }}>
                            <button onClick={() => setOffersExpanded(!offersExpanded)} className="w-full p-4 flex items-center justify-between font-bold">
                                <div className="flex items-center gap-2" style={{ color: HH.taupe }}>
                                    <span className="text-xl">🏷️</span> Available Offers
                                </div>
                                <ChevronDown className={`w-4 h-4 transition-transform ${offersExpanded ? 'rotate-180' : ''}`} style={{ color: HH.taupe }} />
                            </button>
                            {offersExpanded && (
                                <div className="p-4 pt-0 text-sm space-y-3 font-medium" style={{ color: textSub }}>
                                    <div className="flex gap-2"><span className="font-black" style={{ color: '#c4a882' }}>•</span><span>10% off with HDFC Credit Card (up to ₹1,500)</span></div>
                                    <div className="flex gap-2"><span className="font-black" style={{ color: '#c4a882' }}>•</span><span>Extra 5% off on orders above ₹2000</span></div>
                                    <div className="flex gap-2"><span className="font-black" style={{ color: '#c4a882' }}>•</span><span className="text-[#7a9e7e] font-semibold">Free delivery on this item</span></div>
                                </div>
                            )}
                        </div>

                        {/* Delivery Info */}
                        <div className="mb-8 flex flex-col gap-3 font-medium text-sm" style={{ color: textSub }}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" style={{ color: HH.taupe }} />
                                    <span>Deliver to: <span className="font-bold" style={{ color: textMain }}>Mumbai 400001</span></span>
                                </div>
                                <button className="font-bold" style={{ color: HH.taupe }}>Change</button>
                            </div>
                            <div className="flex items-center gap-2">
                                <Truck className="w-4 h-4" style={{ color: HH.sage }} />
                                <span className="font-bold" style={{ color: HH.sage }}>Free delivery by Tomorrow</span>
                            </div>
                        </div>

                        {/* Seller Card (Hidden in incognito) */}
                        {!incog && (
                            <div className="mb-8 p-4 rounded-2xl flex items-center gap-4" style={{ background: HH.cream, border: `1px solid ${HH.silver}` }}>
                                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0" style={{ border: `1.5px solid ${HH.silver}` }}>
                                    <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${product.shopId?.name}&backgroundColor=8E867B`} className="w-full h-full" alt="" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold flex items-center gap-1" style={{ color: HH.dark }}>
                                        {product.shopId?.name} <ShieldCheck className="w-3.5 h-3.5" style={{ color: HH.sage }} />
                                    </h4>
                                    <div className="flex items-center gap-2 text-xs font-semibold mt-0.5" style={{ color: HH.muted }}>
                                        <span className="flex items-center gap-0.5"><Star className="w-3 h-3" style={{ color: '#c4a882', fill: '#c4a882' }} /> 4.8 Rating</span>
                                        <span>•</span><span>98% Positive</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate(`/business/${product.shopId?._id || product.shopId?.id || product.shopId}`)}
                                    className="px-4 py-2 rounded-full text-xs font-bold transition-colors hidden sm:block"
                                    style={{ background: HH.linen, color: HH.taupe, border: `1px solid ${HH.silver}` }}
                                    onMouseEnter={e => e.currentTarget.style.background = HH.silver}
                                    onMouseLeave={e => e.currentTarget.style.background = HH.linen}
                                >
                                    Visit Shop
                                </button>
                            </div>
                        )}

                        {/* Product Details */}
                        <div className="mb-12 pt-6" style={{ borderTop: `1px solid ${HH.silver}` }}>
                            <button onClick={() => setDetailsExpanded(!detailsExpanded)} className="w-full flex items-center justify-between font-heading font-black text-xl mb-4" style={{ color: textMain }}>
                                Product Details
                                <ChevronDown className={`w-5 h-5 transition-transform ${detailsExpanded ? 'rotate-180' : ''}`} style={{ color: HH.taupe }} />
                            </button>
                            {detailsExpanded && (
                                <div className="text-sm font-medium leading-relaxed space-y-4" style={{ color: textSub }}>
                                    <p>{product.description}</p>
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li>Premium Materials</li>
                                        <li>Sustainably sourced</li>
                                        <li>Machine washable</li>
                                    </ul>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>

            {/* BOTTOM FIXED BAR */}
            <div
                className="fixed bottom-0 left-0 right-0 z-40 p-3 md:p-4 md:px-6 backdrop-blur-xl"
                style={{
                    background: incog ? 'rgba(61,56,48,0.97)' : 'rgba(240,234,221,0.97)',
                    borderTop: `1px solid ${incog ? HH.taupe : HH.silver}`,
                    boxShadow: '0 -4px 24px rgba(142,134,123,0.14)',
                }}
            >
                <div className="max-w-[1200px] mx-auto flex items-center gap-2 md:gap-4 justify-end">

                    <div className="hidden md:flex items-center gap-4 mr-auto">
                        <div className="w-12 h-12 rounded-lg overflow-hidden" style={{ background: HH.linen }}>
                            <img src={activeImage} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div>
                            <h4 className="font-bold text-sm truncate max-w-[200px]" style={{ color: textMain }}>{product.name}</h4>
                            <span className="font-black" style={{ color: textMain }}>₹{product.price}</span>
                        </div>
                    </div>

                    <button className="p-3 rounded-full border hidden sm:flex transition-colors" style={{ borderColor: border, color: HH.taupe }}
                        onMouseEnter={e => e.currentTarget.style.background = HH.linen}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                        <Heart className="w-5 h-5" />
                    </button>

                    {product.garmentType && product.garmentType !== 'none' && (
                        <button
                            onClick={() => openTryOnForProduct(product)}
                            className="flex-shrink-0 flex items-center gap-2 px-4 md:px-6 py-3.5 rounded-full font-bold border transition-colors shadow-sm"
                            style={{ background: '#4fc3f7', borderColor: '#29b6f6', color: '#fff' }}
                            onMouseEnter={e => e.currentTarget.style.background = '#29b6f6'}
                            onMouseLeave={e => e.currentTarget.style.background = '#4fc3f7'}
                        >
                            👗 <span className="hidden sm:inline">Try On</span>
                        </button>
                    )}

                    <button
                        onClick={handleAddToCart}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-full font-bold transition-colors border"
                        style={{ background: '#81c784', borderColor: '#66bb6a', color: '#fff' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#66bb6a'}
                        onMouseLeave={e => e.currentTarget.style.background = '#81c784'}
                    >
                        <ShoppingCart className="w-5 h-5" /> Add
                    </button>

                    <button
                        onClick={handleBuyNow}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-black shadow-md transition-all active:scale-[0.98]"
                        style={{ background: HH.dark, color: HH.ivory }}
                        onMouseEnter={e => e.currentTarget.style.background = HH.taupe}
                        onMouseLeave={e => e.currentTarget.style.background = HH.dark}
                    >
                        Buy Now →
                    </button>
                </div>
            </div>
        </div>
    );
}
