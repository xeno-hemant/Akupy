import useFeatureStore from '../store/useFeatureStore';
import API from '../config/apiRoutes';
import api from '../utils/apiHelper';

const G = '#22C55E';
const GD = '#16A34A';

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
        const data = await api.post(API.ORDERS_INCOGNITO, { 
          anonId, 
          shopId: cart[0]?.businessId || '000000000000000000000000', 
          products: cart.map(i => ({ productId: i._id, name: i.name, price: i.price, quantity: i.quantity })), 
          totalAmount: finalTotal, 
          deliveryAddress: 'Address Only — No personal details' 
        });
        if (data) { setIncognitoOrderId(data.order?.incognitoOrderId); }
      }
      setTimeout(() => {
        setIsProcessing(false); setIsSuccess(true);
        setTimeout(() => { clearCart(); navigate(isIncognitoActive ? '/' : '/dashboard'); }, 5000);
      }, 2000);
    } catch (err) { console.error(err); setIsProcessing(false); }
  };

  const getUpiUrl = () => `upi://pay?pa=merchant@upi&pn=Akupy&am=${finalTotal.toFixed(2)}&cu=INR`;

  const inputCls = 'w-full px-4 py-3 rounded-xl outline-none font-medium text-sm border-2 transition-colors';
  const inputSty = { background: '#FFFFFF', borderColor: '#E5E7EB', color: '#1A1A1A' };
  const focusBorderGreen = (e) => e.target.style.borderColor = G;
  const blurBorderGray = (e) => e.target.style.borderColor = '#E5E7EB';

  const StepCircle = ({ n, done }) => (
    <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0" style={{
      background: done ? G : (activeStep === n ? '#1A1A1A' : '#EDE6D8'),
      color: done || activeStep === n ? '#FFFFFF' : '#6B7280',
    }}>
      {done ? <CheckCircle2 className="w-4 h-4" /> : n}
    </div>
  );

  const cardSty = { background: '#FFFFFF', border: '1px solid #F3F4F6', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' };

  if (cart.length === 0) return null;

  if (isSuccess) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center" style={{ background: '#F5F0E8' }}>
        <div className="max-w-md w-full p-8 rounded-3xl text-center" style={cardSty}>
          <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6" style={{ background: '#F0FDF4' }}>
            <CheckCircle2 className="w-12 h-12" style={{ color: G }} />
          </div>
          <h2 className="text-3xl font-heading font-black mb-4" style={{ color: '#1A1A1A' }}>
            {incog ? 'Anonymous Order Placed!' : 'Order Confirmed!'}
          </h2>
          <p className="mb-8 font-medium" style={{ color: '#6B7280' }}>
            {incog ? 'Your identity is completely hidden from the seller.' : 'Thank you! Confirmation sent to your email.'}
          </p>
          {incog && incognitoOrderId && (
            <div className="p-4 rounded-2xl mb-8 text-left" style={{ background: '#F5F0E8', border: '1px solid #E5E7EB' }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#6B7280' }}>Secure Tracking ID</p>
              <p className="text-xl font-mono font-black" style={{ color: '#1A1A1A' }}>{incognitoOrderId}</p>
            </div>
          )}
          <div className="inline-flex items-center gap-2 text-sm font-bold animate-pulse" style={{ color: '#9CA3AF' }}>
            <div className="w-2 h-2 rounded-full" style={{ background: G }}></div>
            Redirecting...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 page-bottom-padding" style={{ background: '#F5F0E8', paddingTop: '120px' }}>
      <div className="max-w-[1000px] mx-auto px-4 md:px-6">
        <button onClick={() => navigate('/cart')} className="flex items-center gap-2 font-bold mb-8" style={{ color: '#6B7280' }}>
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT: Steps */}
          <div className="flex-grow space-y-4">

            {/* STEP 1: ACCOUNT */}
            <div className="rounded-3xl overflow-hidden" style={cardSty}>
              <div className="p-5 flex items-center gap-4">
                <StepCircle n={1} done={activeStep > 1} />
                <div>
                  <h3 className="text-base font-heading font-black" style={{ color: '#1A1A1A' }}>Account</h3>
                  <p className="text-sm font-medium" style={{ color: '#6B7280' }}>
                    {incog ? '🕵️ Checkout as Anonymous'
                      : user ? `Logged in as ${user.name || user.username || 'Akupy User'}` : 'Not logged in'}
                  </p>
                </div>
              </div>
            </div>

            {/* STEP 2: DELIVERY */}
            <div className="rounded-3xl overflow-hidden" style={cardSty}>
              <div
                className="p-5 flex items-center justify-between cursor-pointer"
                onClick={() => activeStep > 2 && setActiveStep(2)}
              >
                <div className="flex items-center gap-4">
                  <StepCircle n={2} done={activeStep > 2} />
                  <div>
                    <h3 className="text-base font-heading font-black" style={{ color: '#1A1A1A' }}>Delivery Address</h3>
                    {activeStep > 2 && <p className="text-sm font-medium mt-0.5" style={{ color: '#6B7280' }}>{address.street}, {address.city}</p>}
                  </div>
                </div>
                {activeStep > 2 && <button className="text-sm font-bold" style={{ color: G }}>Change</button>}
              </div>
              {activeStep === 2 && (
                <div className="px-5 pb-5">
                  {incog && (
                    <div className="p-3 rounded-xl mb-4 text-xs font-bold flex items-start gap-2" style={{ background: '#F0FDF4', color: G, border: '1px solid #DCFCE7' }}>
                      <ShieldCheck className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <p>This address is forwarded only to the seller for delivery. It won't be stored in your account history.</p>
                    </div>
                  )}
                  <form onSubmit={(e) => { e.preventDefault(); handleNextStep(2); }} className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input type="text" placeholder="Full Name" value={address.name} onChange={e => setAddress({ ...address, name: e.target.value })} required className={inputCls} style={inputSty} onFocus={focusBorderGreen} onBlur={blurBorderGray} />
                      <input type="tel" placeholder="Mobile Number" value={address.phone} onChange={e => setAddress({ ...address, phone: e.target.value })} required className={inputCls} style={inputSty} onFocus={focusBorderGreen} onBlur={blurBorderGray} />
                    </div>
                    <input type="text" placeholder="House No., Street, Area" value={address.street} onChange={e => setAddress({ ...address, street: e.target.value })} required className={inputCls} style={inputSty} onFocus={focusBorderGreen} onBlur={blurBorderGray} />
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <input type="text" placeholder="City" value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} required className={inputCls} style={inputSty} onFocus={focusBorderGreen} onBlur={blurBorderGray} />
                      <input type="text" placeholder="State" value={address.state} onChange={e => setAddress({ ...address, state: e.target.value })} required className={inputCls} style={inputSty} onFocus={focusBorderGreen} onBlur={blurBorderGray} />
                      <input type="text" placeholder="Pincode" value={address.pincode} onChange={e => setAddress({ ...address, pincode: e.target.value })} required className={inputCls} style={inputSty} onFocus={focusBorderGreen} onBlur={blurBorderGray} />
                    </div>
                    <button type="submit" className="px-8 py-3.5 rounded-xl font-bold transition-colors text-white"
                      style={{ background: G }}
                      onMouseEnter={e => e.currentTarget.style.background = GD}
                      onMouseLeave={e => e.currentTarget.style.background = G}>
                      Deliver Here
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* STEP 3: ORDER SUMMARY */}
            <div className="rounded-3xl overflow-hidden" style={cardSty}>
              <div className="p-5 flex items-center justify-between cursor-pointer" onClick={() => activeStep > 3 && setActiveStep(3)}>
                <div className="flex items-center gap-4">
                  <StepCircle n={3} done={activeStep > 3} />
                  <div>
                    <h3 className="text-base font-heading font-black" style={{ color: '#1A1A1A' }}>Order Summary</h3>
                    {activeStep > 3 && <p className="text-sm font-medium mt-0.5" style={{ color: '#6B7280' }}>{cart.length} items</p>}
                  </div>
                </div>
                {activeStep > 3 && <button className="text-sm font-bold" style={{ color: G }}>Change</button>}
              </div>
              {activeStep === 3 && (
                <div className="px-5 pb-5">
                  <div className="space-y-3 pt-4 mb-5">
                    {cart.map((item) => (
                      <div key={item.variantId} className="flex gap-4 p-4 rounded-2xl" style={{ background: '#F5F0E8', border: '1px solid #E5E7EB' }}>
                        <div className="w-16 h-16 rounded-xl overflow-hidden" style={{ background: '#EDE6D8' }}>
                          <img src={item.images?.[0] || item.imageUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm line-clamp-1" style={{ color: '#1A1A1A' }}>{item.name}</h4>
                          <p className="text-xs font-semibold mt-0.5" style={{ color: '#6B7280' }}>{item.shopName}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs font-bold" style={{ color: '#9CA3AF' }}>Qty: {item.quantity}</span>
                            <span className="font-black" style={{ color: '#1A1A1A' }}>₹{item.price * item.quantity}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => handleNextStep(3)} className="px-8 py-3.5 rounded-xl font-bold transition-colors text-white"
                    style={{ background: G }}
                    onMouseEnter={e => e.currentTarget.style.background = GD}
                    onMouseLeave={e => e.currentTarget.style.background = G}>
                    Continue to Payment
                  </button>
                </div>
              )}
            </div>

            {/* STEP 4: PAYMENT */}
            <div className="rounded-3xl overflow-hidden" style={cardSty}>
              <div className="p-5 flex items-center gap-4">
                <StepCircle n={4} done={false} />
                <h3 className="text-base font-heading font-black" style={{ color: '#1A1A1A' }}>Payment Options</h3>
              </div>
              {activeStep === 4 && (
                <div className="px-5 pb-5">
                  {upiStep ? (
                    <div className="flex flex-col items-center pt-6 pb-4 text-center max-w-sm mx-auto animate-fade-in-up">
                      <h3 className="text-2xl font-black mb-2" style={{ color: '#1A1A1A' }}>Scan to Pay</h3>
                      <p className="text-sm font-medium mb-8" style={{ color: '#6B7280' }}>Use Google Pay, PhonePe, or Paytm.</p>
                      <div className="p-4 rounded-3xl mb-8 hover:scale-105 transition-transform duration-500" style={{ background: 'white', border: '2px solid #E5E7EB' }}>
                        <QRCodeSVG value={getUpiUrl()} size={200} bgColor="#ffffff" fgColor="#1A1A1A" level="H" />
                      </div>
                      <div className="w-full p-5 rounded-2xl" style={{ background: '#F5F0E8', border: '1px solid #E5E7EB' }}>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#6B7280' }}>Upload Payment Proof</label>
                        <label className="flex flex-col items-center justify-center w-full p-5 border-2 border-dashed rounded-xl cursor-pointer transition-colors"
                          style={{ borderColor: upiScreenshot ? G : '#D1D5DB', background: upiScreenshot ? '#F0FDF4' : '#FFFFFF', color: upiScreenshot ? G : '#9CA3AF' }}>
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
                            background: paymentMethod === value ? '#F0FDF4' : 'transparent',
                            border: `1.5px solid ${paymentMethod === value ? G : '#E5E7EB'}`,
                            borderLeft: paymentMethod === value ? `4px solid ${G}` : '1.5px solid #E5E7EB',
                          }}
                        >
                          <input type="radio" name="payment" value={value} checked={paymentMethod === value} onChange={() => setPaymentMethod(value)} className="w-5 h-5" style={{ accentColor: G }} />
                          <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: paymentMethod === value ? '#DCFCE7' : '#F5F0E8', color: paymentMethod === value ? G : '#6B7280' }}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-base" style={{ color: '#1A1A1A' }}>{label}</h4>
                            <p className="text-sm font-medium" style={{ color: '#6B7280' }}>{sub}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                  <div className="mt-5 pt-5 flex flex-col sm:flex-row gap-3" style={{ borderTop: '1px solid #F3F4F6' }}>
                    {upiStep && (
                      <button onClick={() => setUpiStep(false)} className="py-4 px-6 rounded-xl font-bold border flex-1 transition-colors" style={{ background: 'transparent', borderColor: '#E5E7EB', color: '#6B7280' }}>
                        Back
                      </button>
                    )}
                    <button
                      onClick={submitOrder}
                      disabled={isProcessing || (paymentMethod === 'upi' && upiStep && !upiScreenshot)}
                      className="py-4 px-8 rounded-xl font-black text-lg flex items-center justify-center gap-2 flex-[2] transition-all active:scale-[0.98] text-white"
                      style={{
                        background: (isProcessing || (paymentMethod === 'upi' && upiStep && !upiScreenshot)) ? '#E5E7EB' : G,
                        cursor: isProcessing ? 'not-allowed' : 'pointer',
                        minHeight: '56px',
                      }}
                      onMouseEnter={e => { if (!isProcessing) e.currentTarget.style.background = GD; }}
                      onMouseLeave={e => { if (!isProcessing) e.currentTarget.style.background = G; }}
                    >
                      {isProcessing ? 'Processing...' : paymentMethod === 'upi' && !upiStep ? 'Generate UPI QR' : `Pay ₹${finalTotal} Securely`}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Summary */}
          <div className="w-full lg:w-[320px] flex-shrink-0">
            <div className="p-6 rounded-3xl sticky top-32" style={cardSty}>
              <h3 className="text-lg font-heading font-black mb-4" style={{ color: '#1A1A1A' }}>Summary</h3>
              <div className="space-y-3 text-sm font-semibold mb-5">
                <div className="flex justify-between">
                  <span style={{ color: '#6B7280' }}>Items Total ({cart.length})</span>
                  <span style={{ color: '#1A1A1A' }}>₹{cartTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#6B7280' }}>Platform Fee</span>
                  <span style={{ color: '#1A1A1A' }}>₹5</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#6B7280' }}>Delivery</span>
                  <span style={{ color: G }}>Free</span>
                </div>
              </div>
              <div className="my-4 h-px" style={{ background: '#F3F4F6' }}></div>
              <div className="flex justify-between items-center">
                <span className="text-base font-black" style={{ color: '#1A1A1A' }}>Total Pay</span>
                <span className="text-2xl font-heading font-black" style={{ color: '#1A1A1A' }}>₹{finalTotal}</span>
              </div>
              <div className="mt-5 flex items-center justify-center gap-2 text-xs font-bold p-3 rounded-xl" style={{ background: '#F0FDF4', color: G }}>
                <ShieldCheck className="w-4 h-4" /> Secure 256-bit Encryption
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
