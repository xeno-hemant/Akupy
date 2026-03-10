import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, QrCode, Upload, ArrowLeft, ShieldCheck, CreditCard, Banknote, Landmark, MapPin } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import useFeatureStore from '../store/useFeatureStore';

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
  amber: '#c4a882',
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, getTotalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const { isIncognitoActive, anonId } = useFeatureStore();

  const [activeStep, setActiveStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [address, setAddress] = useState({ name: user?.name || '', phone: '', street: '', city: '', state: '', pincode: '' });
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiStep, setUpiStep] = useState(false);
  const [upiScreenshot, setUpiScreenshot] = useState(null);
  const [incognitoOrderId, setIncognitoOrderId] = useState(null);

  const incog = isIncognitoActive;
  const pageBg = incog ? HH.dark : HH.ivory;
  const cardBg = incog ? '#2e2a25' : HH.cream;
  const cardBdr = incog ? HH.taupe : HH.silver;
  const textMain = incog ? HH.ivory : HH.dark;
  const textSub = incog ? HH.silver : HH.taupe;
  const activeBg = incog ? '#3a3530' : HH.linen;

  useEffect(() => {
    if (cart.length === 0) navigate('/cart');
    if (!user && !isIncognitoActive) navigate('/?login=true');
    if ((user || isIncognitoActive) && activeStep === 1) setActiveStep(2);
  }, [cart, user, isIncognitoActive, navigate]);

  const cartTotal = getTotalPrice();
  const finalTotal = cartTotal + 5;

  const handleNextStep = (step) => {
    if (step === 2 && !address.street) return;
    setActiveStep(step + 1);
  };

  const submitOrder = async () => {
    if (paymentMethod === 'upi' && !upiStep) { setUpiStep(true); return; }
    if (paymentMethod === 'upi' && upiStep && !upiScreenshot) return;

    setIsProcessing(true);
    try {
      if (isIncognitoActive && anonId) {
        const apiUrl = window.location.hostname.includes('akupy.in') ? 'https://akupybackend.onrender.com' : 'http://localhost:5000';
        const res = await fetch(`${apiUrl}/api/orders/incognito`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            anonId,
            shopId: cart[0]?.businessId || '000000000000000000000000',
            products: cart.map(i => ({ productId: i._id, name: i.name, price: i.price, quantity: i.quantity })),
            totalAmount: finalTotal,
            deliveryAddress: 'Address Only — No personal details'
          })
        });
        if (res.ok) { const d = await res.json(); setIncognitoOrderId(d.order?.incognitoOrderId); }
      }
      setTimeout(() => {
        setIsProcessing(false); setIsSuccess(true);
        setTimeout(() => { clearCart(); navigate(isIncognitoActive ? '/' : '/dashboard'); }, 5000);
      }, 2000);
    } catch (err) { console.error(err); setIsProcessing(false); }
  };

  const getUpiUrl = () => `upi://pay?pa=merchant@upi&pn=Akupy&am=${finalTotal.toFixed(2)}&cu=INR`;

  const inputCls = `w-full px-4 py-3 rounded-xl outline-none font-medium text-sm border transition-colors`;
  const inputSty = { background: HH.ivory, borderColor: HH.silver, color: HH.dark };

  const StepCircle = ({ n, done }) => (
    <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm" style={{
      background: done ? HH.sage : (activeStep === n ? HH.taupe : HH.linen),
      color: done || activeStep === n ? HH.ivory : HH.taupe,
    }}>
      {done ? <CheckCircle2 className="w-5 h-5" /> : n}
    </div>
  );

  if (cart.length === 0) return null;

  if (isSuccess) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center" style={{ background: pageBg }}>
        <div className="max-w-md w-full p-8 rounded-3xl text-center" style={{ background: cardBg, border: `1px solid ${cardBdr}` }}>
          <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 relative" style={{ background: HH.linen }}>
            <CheckCircle2 className="w-12 h-12" style={{ color: HH.sage }} />
            {incog && (
              <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center border-4 text-white shadow-lg animate-bounce text-xl"
                style={{ background: HH.taupe, borderColor: cardBg }}>
                🕵️
              </div>
            )}
          </div>
          <h2 className="text-3xl font-heading font-black mb-4" style={{ color: textMain }}>
            {incog ? 'Anonymous Order Placed!' : 'Order Confirmed!'}
          </h2>
          <p className="mb-8 font-medium" style={{ color: textSub }}>
            {incog ? 'Your identity is completely hidden from the seller. They only receive the delivery address.' : 'Thank you! Confirmation sent to your email.'}
          </p>
          {incog && incognitoOrderId && (
            <div className="p-4 rounded-2xl mb-8 text-left" style={{ background: HH.linen, border: `1px solid ${HH.silver}` }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: HH.taupe }}>Secure Tracking ID</p>
              <p className="text-xl font-mono font-black" style={{ color: textMain }}>{incognitoOrderId}</p>
            </div>
          )}
          <div className="inline-flex items-center gap-2 text-sm font-bold animate-pulse" style={{ color: HH.muted }}>
            <div className="w-2 h-2 rounded-full" style={{ background: HH.taupe }}></div>
            Redirecting...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24" style={{ background: pageBg, paddingTop: '120px' }}>
      <div className="max-w-[1000px] mx-auto px-4 md:px-6">

        <button onClick={() => navigate('/cart')} className="flex items-center gap-2 font-bold mb-8 transition-colors" style={{ color: textSub }}>
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </button>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* LEFT: Steps */}
          <div className="flex-grow space-y-4">

            {/* STEP 1: ACCOUNT */}
            <div className="rounded-3xl overflow-hidden" style={{ background: cardBg, border: `1px solid ${cardBdr}` }}>
              <div className="p-6 flex items-center gap-4" style={{ background: activeStep === 1 ? activeBg : 'transparent' }}>
                <StepCircle n={1} done={activeStep > 1} />
                <div>
                  <h3 className="text-lg font-heading font-black" style={{ color: textMain }}>Account</h3>
                  <p className="text-sm font-medium" style={{ color: textSub }}>
                    {incog ? '🕵️ Checkout as Anonymous (Incognito Active)'
                      : user ? `Logged in as ${user.name || user.username || 'Akupy User'}` : 'Not logged in'}
                  </p>
                </div>
              </div>
            </div>

            {/* STEP 2: DELIVERY */}
            <div className="rounded-3xl overflow-hidden" style={{ background: cardBg, border: `1px solid ${cardBdr}` }}>
              <div
                className="p-6 flex items-center justify-between cursor-pointer"
                style={{ background: activeStep === 2 ? activeBg : 'transparent' }}
                onClick={() => activeStep > 2 && setActiveStep(2)}
              >
                <div className="flex items-center gap-4">
                  <StepCircle n={2} done={activeStep > 2} />
                  <div>
                    <h3 className="text-lg font-heading font-black" style={{ color: textMain }}>Delivery Address</h3>
                    {activeStep > 2 && <p className="text-sm font-medium mt-0.5" style={{ color: textSub }}>{address.street}, {address.city}</p>}
                  </div>
                </div>
                {activeStep > 2 && <button className="text-sm font-bold" style={{ color: HH.taupe }}>Change</button>}
              </div>

              {activeStep === 2 && (
                <div className="px-6 pb-6">
                  {incog && (
                    <div className="p-3 rounded-xl mb-4 text-xs font-bold flex items-start gap-2" style={{ background: HH.linen, color: HH.taupe, border: `1px solid ${HH.silver}` }}>
                      <ShieldCheck className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <p>This address is forwarded only to the seller for delivery. It won't be stored in your account history.</p>
                    </div>
                  )}
                  <form onSubmit={(e) => { e.preventDefault(); handleNextStep(2); }} className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input type="text" placeholder="Full Name" value={address.name} onChange={e => setAddress({ ...address, name: e.target.value })} required className={inputCls} style={inputSty} onFocus={e => e.target.style.borderColor = HH.taupe} onBlur={e => e.target.style.borderColor = HH.silver} />
                      <input type="tel" placeholder="Mobile Number" value={address.phone} onChange={e => setAddress({ ...address, phone: e.target.value })} required className={inputCls} style={inputSty} onFocus={e => e.target.style.borderColor = HH.taupe} onBlur={e => e.target.style.borderColor = HH.silver} />
                    </div>
                    <input type="text" placeholder="House No., Street, Area" value={address.street} onChange={e => setAddress({ ...address, street: e.target.value })} required className={inputCls} style={inputSty} onFocus={e => e.target.style.borderColor = HH.taupe} onBlur={e => e.target.style.borderColor = HH.silver} />
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <input type="text" placeholder="City" value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} required className={inputCls} style={inputSty} onFocus={e => e.target.style.borderColor = HH.taupe} onBlur={e => e.target.style.borderColor = HH.silver} />
                      <input type="text" placeholder="State" value={address.state} onChange={e => setAddress({ ...address, state: e.target.value })} required className={inputCls} style={inputSty} onFocus={e => e.target.style.borderColor = HH.taupe} onBlur={e => e.target.style.borderColor = HH.silver} />
                      <input type="text" placeholder="Pincode" value={address.pincode} onChange={e => setAddress({ ...address, pincode: e.target.value })} required className={inputCls} style={inputSty} onFocus={e => e.target.style.borderColor = HH.taupe} onBlur={e => e.target.style.borderColor = HH.silver} />
                    </div>
                    <button type="submit" className="px-8 py-3.5 rounded-xl font-bold transition-colors mt-2" style={{ background: HH.taupe, color: HH.ivory }}>
                      Deliver Here
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* STEP 3: ORDER SUMMARY */}
            <div className="rounded-3xl overflow-hidden" style={{ background: cardBg, border: `1px solid ${cardBdr}` }}>
              <div
                className="p-6 flex items-center justify-between cursor-pointer"
                style={{ background: activeStep === 3 ? activeBg : 'transparent' }}
                onClick={() => activeStep > 3 && setActiveStep(3)}
              >
                <div className="flex items-center gap-4">
                  <StepCircle n={3} done={activeStep > 3} />
                  <div>
                    <h3 className="text-lg font-heading font-black" style={{ color: textMain }}>Order Summary</h3>
                    {activeStep > 3 && <p className="text-sm font-medium mt-0.5" style={{ color: textSub }}>{cart.length} items</p>}
                  </div>
                </div>
                {activeStep > 3 && <button className="text-sm font-bold" style={{ color: HH.taupe }}>Change</button>}
              </div>

              {activeStep === 3 && (
                <div className="px-6 pb-6">
                  <div className="space-y-3 pt-4 mb-6">
                    {cart.map((item) => (
                      <div key={item.variantId} className="flex gap-4 p-4 rounded-2xl" style={{ background: HH.linen, border: `1px solid ${HH.silver}` }}>
                        <div className="w-16 h-16 rounded-lg overflow-hidden" style={{ background: HH.silver }}>
                          <img src={item.images?.[0] || item.imageUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm line-clamp-1" style={{ color: textMain }}>{item.name}</h4>
                          <p className="text-xs font-semibold mt-0.5" style={{ color: textSub }}>{item.shopName}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs font-bold" style={{ color: textSub }}>Qty: {item.quantity}</span>
                            <span className="font-black" style={{ color: textMain }}>₹{item.price * item.quantity}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => handleNextStep(3)} className="px-8 py-3.5 rounded-xl font-bold transition-colors" style={{ background: HH.taupe, color: HH.ivory }}>
                    Continue to Payment
                  </button>
                </div>
              )}
            </div>

            {/* STEP 4: PAYMENT */}
            <div className="rounded-3xl overflow-hidden" style={{ background: cardBg, border: `1px solid ${cardBdr}` }}>
              <div className="p-6 flex items-center gap-4" style={{ background: activeStep === 4 ? activeBg : 'transparent' }}>
                <StepCircle n={4} done={false} />
                <h3 className="text-lg font-heading font-black" style={{ color: textMain }}>Payment Options</h3>
              </div>

              {activeStep === 4 && (
                <div className="px-6 pb-6">
                  {upiStep ? (
                    <div className="flex flex-col items-center pt-6 pb-4 text-center max-w-sm mx-auto animate-fade-in-up">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ background: HH.linen, border: `1px solid ${HH.silver}` }}>
                        <QrCode className="w-8 h-8" style={{ color: HH.taupe }} />
                      </div>
                      <h3 className="text-2xl font-black mb-2" style={{ color: textMain }}>Scan to Pay</h3>
                      <p className="text-sm font-medium mb-8" style={{ color: textSub }}>Use Google Pay, PhonePe, or Paytm.</p>

                      <div className="p-4 rounded-[2rem] mb-8 hover:scale-105 transition-transform duration-500" style={{ background: 'white', border: `1px solid ${HH.silver}` }}>
                        <QRCodeSVG value={getUpiUrl()} size={200} bgColor="#ffffff" fgColor={HH.dark} level="H" />
                      </div>

                      <div className="w-full p-5 rounded-2xl" style={{ background: HH.linen, border: `1px solid ${HH.silver}` }}>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-3" style={{ color: HH.taupe }}>Upload Payment Proof</label>
                        <label className="flex flex-col items-center justify-center w-full p-5 border-2 border-dashed rounded-xl cursor-pointer transition-colors"
                          style={{ borderColor: upiScreenshot ? HH.taupe : HH.silver, background: upiScreenshot ? HH.linen : HH.ivory, color: upiScreenshot ? HH.taupe : HH.muted }}>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => setUpiScreenshot(e.target.files[0])} />
                          <Upload className="w-6 h-6 mb-2" />
                          <span className="text-sm font-bold">{upiScreenshot ? `✓ ${upiScreenshot.name}` : 'Attach Screenshot'}</span>
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 pt-4">
                      {[
                        { value: 'upi', Icon: Landmark, label: 'UPI Transfer', sub: 'GPay, PhonePe, Paytm' },
                        { value: 'card', Icon: CreditCard, label: 'Credit / Debit Card', sub: 'Visa, Mastercard (Razorpay)' },
                        { value: 'cod', Icon: Banknote, label: 'Cash on Delivery', sub: 'Pay when you receive (+₹50)' },
                      ].map(({ value, Icon, label, sub }) => (
                        <label
                          key={value}
                          className="flex items-center gap-4 p-5 rounded-2xl cursor-pointer transition-all"
                          style={{
                            background: paymentMethod === value ? HH.linen : 'transparent',
                            border: `1px solid ${paymentMethod === value ? HH.taupe : HH.silver}`,
                            borderLeft: paymentMethod === value ? `3px solid ${HH.taupe}` : `1px solid ${HH.silver}`,
                          }}
                        >
                          <input type="radio" name="payment" value={value} checked={paymentMethod === value} onChange={() => setPaymentMethod(value)} className="w-5 h-5" style={{ accentColor: HH.taupe }} />
                          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: HH.linen, color: HH.taupe }}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-bold text-base" style={{ color: textMain }}>{label}</h4>
                            <p className="text-sm font-medium" style={{ color: textSub }}>{sub}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}

                  <div className="mt-6 pt-5 flex flex-col sm:flex-row gap-3" style={{ borderTop: `1px solid ${HH.silver}` }}>
                    {upiStep && (
                      <button onClick={() => setUpiStep(false)} className="py-4 px-6 rounded-xl font-bold border flex-1 transition-colors" style={{ background: 'transparent', borderColor: HH.silver, color: HH.taupe }}>
                        Back
                      </button>
                    )}
                    <button
                      onClick={submitOrder}
                      disabled={isProcessing || (paymentMethod === 'upi' && upiStep && !upiScreenshot)}
                      className="py-4 px-8 rounded-xl font-black text-lg flex items-center justify-center gap-2 flex-[2] transition-all active:scale-[0.98]"
                      style={{
                        background: (isProcessing || (paymentMethod === 'upi' && upiStep && !upiScreenshot)) ? HH.silver : HH.dark,
                        color: (isProcessing || (paymentMethod === 'upi' && upiStep && !upiScreenshot)) ? HH.muted : HH.ivory,
                        cursor: isProcessing ? 'not-allowed' : 'pointer',
                        minHeight: '56px',
                      }}
                    >
                      {isProcessing ? 'Processing...' : paymentMethod === 'upi' && !upiStep ? 'Generate UPI QR' : `Pay ₹${finalTotal} Securely`}
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT: Summary Pillar */}
          <div className="w-full lg:w-[340px] flex-shrink-0">
            <div className="p-6 rounded-3xl sticky top-28" style={{ background: cardBg, border: `1px solid ${cardBdr}`, boxShadow: '0 4px 16px rgba(142,134,123,0.12)' }}>
              <h3 className="text-lg font-heading font-black mb-4" style={{ color: textMain }}>Summary</h3>
              <div className="space-y-3 text-sm font-semibold mb-5">
                <div className="flex justify-between">
                  <span style={{ color: textSub }}>Items Total ({cart.length})</span>
                  <span style={{ color: textMain }}>₹{cartTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: textSub }}>Platform Fee</span>
                  <span style={{ color: textMain }}>₹5</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: textSub }}>Delivery</span>
                  <span style={{ color: HH.sage }}>Free</span>
                </div>
              </div>
              <div className="my-4 h-px" style={{ background: HH.silver }}></div>
              <div className="flex justify-between items-center">
                <span className="text-base font-black" style={{ color: textMain }}>Total Pay</span>
                <span className="text-2xl font-heading font-black" style={{ color: textMain }}>₹{finalTotal}</span>
              </div>

              <div className="mt-5 flex items-center justify-center gap-2 text-xs font-bold p-3 rounded-xl" style={{ background: HH.linen, color: HH.sage }}>
                <ShieldCheck className="w-4 h-4" /> Secure 256-bit Encryption
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
