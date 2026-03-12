import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag, Plus, Minus } from 'lucide-react';
import useCartStore from '../store/useCartStore';
import useFeatureStore from '../store/useFeatureStore';

// Akupy tokens
const HH = {
  ivory: '#F5F0E8',
  cream: '#FFFFFF',
  linen: '#F5F0E8',
  silver: '#E5E7EB',
  taupe: '#22C55E',
  dark: '#1A1A1A',
  muted: '#9CA3AF',
};

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, getTotalItems } = useCartStore();
  const { isIncognitoActive } = useFeatureStore();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

  const subtotal = getTotalPrice();
  const discount = couponApplied ? Math.floor(subtotal * 0.1) : 0;
  const platformFee = 5;
  const delivery = subtotal > 499 ? 0 : 49;
  const cartTotal = subtotal - discount + platformFee + delivery;

  const incog = isIncognitoActive;
  const pageBg = incog ? HH.dark : HH.ivory;
  const cardBg = incog ? '#2e2a25' : HH.cream;
  const cardBdr = incog ? '#8E867B' : HH.silver;
  const textMain = incog ? HH.ivory : HH.dark;
  const textSub = incog ? HH.silver : HH.taupe;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'AKUPY10') setCouponApplied(true);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center" style={{ background: pageBg }}>
        <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6" style={{ background: HH.linen }}>
          <ShoppingBag className="w-10 h-10" style={{ color: HH.taupe }} />
        </div>
        <h2 className="text-3xl font-heading font-black mb-3" style={{ color: textMain }}>Your Cart is Empty</h2>
        <p className="mb-8" style={{ color: textSub }}>Looks like you haven't added anything yet.</p>
        <Link
          to="/discover"
          className="px-8 py-4 rounded-full font-bold transition-transform shadow-sm active:scale-95 text-white"
          style={{ background: '#22C55E' }}
          onMouseEnter={e => e.currentTarget.style.background = '#16A34A'}
          onMouseLeave={e => e.currentTarget.style.background = '#22C55E'}
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 page-bottom-padding" style={{ background: '#F5F0E8', paddingTop: '120px' }}>
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-black" style={{ color: textMain }}>Shopping Cart</h1>
          <span className="text-lg font-bold" style={{ color: textSub }}>{getTotalItems()} Items</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

          {/* ITEMS LIST */}
          <div className="flex-grow space-y-4">
            {cart.map((item) => (
              <div
                key={item.variantId}
                className="p-4 md:p-6 rounded-2xl md:rounded-3xl flex gap-4 md:gap-6 relative"
                style={{ background: cardBg, border: `1px solid ${cardBdr}` }}
              >
                {/* Image */}
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-xl overflow-hidden flex-shrink-0" style={{ background: HH.linen }}>
                  <img
                    src={item.images?.[0] || item.imageUrl || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&q=80'}
                    className="w-full h-full object-cover"
                    alt={item.name}
                  />
                </div>

                {/* Details */}
                <div className="flex flex-col flex-grow min-w-0">
                  <div className="flex justify-between items-start gap-4">
                    <div className="min-w-0">
                      <span className="text-xs font-bold block mb-0.5 truncate" style={{ color: textSub }}>
                        {String(item.shopName || 'Akupy Store')}
                      </span>
                      <Link
                        to={`/product/${item._id || item.id}`}
                        className="text-sm md:text-base font-bold leading-tight line-clamp-2 transition-colors"
                        style={{ color: textMain }}
                      >
                        {item.name}
                      </Link>

                      {/* Variants */}
                      {(item.selectedColor || item.selectedSize) && (
                        <div
                          className="flex items-center gap-3 mt-2 text-xs font-semibold w-max px-3 py-1 rounded-full"
                          style={{ background: HH.linen, border: `1px solid ${HH.silver}`, color: textSub }}
                        >
                          {item.selectedColor && (
                            <span className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.colorVariants?.find(c => c.name === item.selectedColor)?.hex || '#8E867B' }}></span>
                              {item.selectedColor}
                            </span>
                          )}
                          {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                        </div>
                      )}
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeFromCart(item.variantId)}
                      className="p-2 rounded-full flex-shrink-0 transition-colors"
                      style={{ color: HH.muted }}
                      onMouseEnter={e => e.currentTarget.style.color = '#b5776e'}
                      onMouseLeave={e => e.currentTarget.style.color = HH.muted}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-auto pt-4 flex items-center justify-between">
                    {/* Qty Controls */}
                    <div className="flex items-center rounded-xl overflow-hidden" style={{ border: `1px solid ${HH.silver}`, background: HH.linen }}>
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                        className="w-9 h-9 flex items-center justify-center font-bold transition-colors"
                        style={{ color: HH.taupe }}
                        onMouseEnter={e => e.currentTarget.style.background = HH.silver}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center font-bold text-sm" style={{ color: HH.dark }}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                        className="w-9 h-9 flex items-center justify-center font-bold transition-colors"
                        style={{ color: HH.taupe }}
                        onMouseEnter={e => e.currentTarget.style.background = HH.silver}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Price */}
                    <span className="font-heading font-black text-lg" style={{ color: textMain }}>
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* PRICE SUMMARY */}
          <div className="w-full lg:w-[380px] flex-shrink-0 space-y-4">

            {/* Coupon */}
            <div className="p-4 rounded-2xl" style={{ background: cardBg, border: `1px solid ${cardBdr}` }}>
              <p className="text-xs font-bold uppercase tracking-[0.1em] mb-3 flex items-center gap-1.5" style={{ color: HH.taupe }}>
                <Tag className="w-3.5 h-3.5" /> Apply Coupon
              </p>
              {couponApplied ? (
                <div
                  className="flex items-center justify-between px-4 py-3 rounded-xl"
                  style={{ background: '#eef2ee', border: '1px solid #7a9e7e' }}
                >
                  <span className="font-bold text-sm" style={{ color: '#7a9e7e' }}>✓ AKUPY10 Applied — 10% Off</span>
                  <button className="text-xs font-bold" style={{ color: '#b5776e' }} onClick={() => setCouponApplied(false)}>Remove</button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium outline-none border"
                    style={{ background: '#FFFFFF', borderColor: '#E5E7EB', color: '#1A1A1A' }}
                    onFocus={e => e.target.style.borderColor = '#22C55E'}
                    onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl font-bold text-sm transition-colors text-white"
                    style={{ background: '#22C55E' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#16A34A'}
                    onMouseLeave={e => e.currentTarget.style.background = '#22C55E'}
                  >
                    Apply
                  </button>
                </form>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="p-6 rounded-2xl" style={{ background: cardBg, border: `1px solid ${cardBdr}`, boxShadow: '0 4px 16px rgba(142,134,123,0.12)' }}>
              <h3 className="text-sm font-bold uppercase tracking-[0.12em] pb-4 mb-4" style={{ color: HH.dark, borderBottom: `1px solid ${HH.silver}` }}>
                Price Details
              </h3>

              <div className="space-y-3 text-sm font-semibold">
                <div className="flex justify-between">
                  <span style={{ color: textSub }}>Price ({getTotalItems()} items)</span>
                  <span style={{ color: textMain }}>₹{subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between">
                    <span style={{ color: textSub }}>Coupon Discount</span>
                    <span style={{ color: '#7a9e7e' }}>-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span style={{ color: textSub }}>Delivery</span>
                  <span style={{ color: delivery === 0 ? '#7a9e7e' : textMain }}>
                    {delivery === 0 ? 'FREE' : `₹${delivery}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: textSub }}>Platform Fee</span>
                  <span style={{ color: textMain }}>₹{platformFee}</span>
                </div>
              </div>

              <div className="my-4 h-px" style={{ background: HH.silver }}></div>

              <div className="flex justify-between items-center mb-4">
                <span className="font-black text-base" style={{ color: textMain }}>Total Pay</span>
                <span className="font-heading font-black text-2xl" style={{ color: textMain }}>₹{cartTotal.toLocaleString()}</span>
              </div>

              {discount > 0 && (
                <div className="px-3 py-2 rounded-xl mb-4 text-sm font-bold text-center" style={{ background: '#eef2ee', color: '#7a9e7e' }}>
                  🎉 You're saving ₹{discount} on this order!
                </div>
              )}

              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-4 rounded-xl font-black text-base flex items-center justify-center gap-2 transition-all active:scale-[0.99] text-white"
                style={{ background: '#22C55E', minHeight: '56px' }}
                onMouseEnter={e => e.currentTarget.style.background = '#16A34A'}
                onMouseLeave={e => e.currentTarget.style.background = '#22C55E'}
              >
                Proceed to Checkout <ArrowRight className="w-5 h-5" />
              </button>

              <div className="flex items-center justify-center gap-2 mt-4 text-xs font-medium" style={{ color: '#9CA3AF' }}>
                <ShieldCheck className="w-4 h-4" style={{ color: '#22C55E' }} />
                Secured with 256-bit encryption
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
