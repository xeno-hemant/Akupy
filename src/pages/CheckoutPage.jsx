import { useState, useEffect } from 'react';
import { CreditCard, Banknote, Landmark, CheckCircle2, QrCode, Upload, ArrowLeft, ShieldCheck } from 'lucide-react';
import useCartStore from '../store/useCartStore';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { QRCodeSVG } from 'qrcode.react';

export default function CheckoutPage() {
  const { cart, getTotalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  const [method, setMethod] = useState('upi'); // default to upi
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [upiStep, setUpiStep] = useState(false); // true when showing QR code
  const [upiScreenshot, setUpiScreenshot] = useState(null);

  useEffect(() => {
    // Redirect if cart is empty or user is not logged in
    if (cart.length === 0) {
      navigate('/cart');
    }
    if (!user) {
      navigate('/shop');
      setTimeout(() => {
        const el = document.querySelector('#register-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  }, [cart, user, navigate]);

  const handleCheckout = () => {
    if (method === 'upi' && !upiStep) {
      setUpiStep(true);
      return;
    }

    if (method === 'upi' && upiStep && !upiScreenshot) {
      return; // Ensure screenshot is selected
    }

    setIsProcessing(true);
    
    // Mock processing delay for confirmation
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      // Clear cart after short delay
      setTimeout(() => {
        clearCart();
        setIsSuccess(false);
        setUpiStep(false);
        navigate('/dashboard');
      }, 2500);
      
    }, 2000);
  };

  const getUpiUrl = () => {
    return `upi://pay?pa=hemantgurjar2100@oksbi&pn=Akupy&am=${getTotalPrice().toFixed(2)}&cu=INR`;
  };

  if (cart.length === 0 || !user) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 pt-32 min-h-[85vh] flex flex-col items-center">
      
      {!isSuccess && !upiStep && (
        <button 
          onClick={() => navigate('/cart')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors w-full mb-8 font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </button>
      )}

      <div className="w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-gray-100/50">
        {!isSuccess ? (
          <>
            <div className="p-8 border-b border-gray-100 flex items-center justify-between pointer-events-none relative overflow-hidden bg-gray-50/50">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent"></div>
              <h1 className="text-2xl font-heading font-black text-[#080808] relative z-10 flex items-center gap-3">
                 <ShieldCheck className="w-6 h-6 text-green-500" />
                 Secure Checkout
              </h1>
            </div>

            <div className="p-8 pb-10">
              {upiStep ? (
                <div className="flex flex-col items-center justify-center animate-fade-in text-center max-w-sm mx-auto">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                    <QrCode className="w-8 h-8" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2">Scan & Pay securely</h3>
                  <p className="text-gray-500 mb-8 leading-relaxed">
                    Scan the QR code vertically using any UPI app (GPay, PhonePe, Paytm, etc.) to complete your payment of <b className="text-[#080808]">${getTotalPrice().toFixed(2)}</b>.
                  </p>
                  
                  <div className="bg-white p-4 rounded-[2rem] shadow-lg border border-gray-100 mb-8 hover:scale-105 transition-transform duration-500 hover:shadow-green-500/20">
                    <QRCodeSVG 
                      value={getUpiUrl()} 
                      size={200}
                      bgColor={"#ffffff"}
                      fgColor={"#080808"}
                      level={"H"}
                      includeMargin={false}
                    />
                  </div>
                  
                  <div className="w-full flex flex-col gap-4">
                    <a 
                      href={getUpiUrl()}
                      className="w-full bg-primary text-[#080808] font-bold py-4 rounded-xl hover:bg-green-500 transition-colors shadow-sm block md:hidden text-center text-lg uppercase tracking-wide"
                    >
                      Open UPI App
                    </a>
                    
                    <div className="text-left w-full bg-gray-50 rounded-2xl p-6 border border-gray-100">
                      <label className="block text-sm font-bold text-gray-500 uppercase mb-4 tracking-wider flex items-center gap-2">
                         Upload Screenshot *
                      </label>
                      <label className={`flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${upiScreenshot ? 'border-primary bg-green-50 text-green-700' : 'border-gray-200 hover:bg-white hover:border-gray-300 text-gray-400 bg-white'}`}>
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => setUpiScreenshot(e.target.files[0])} />
                        <div className="flex flex-col items-center gap-3">
                           <Upload className="w-8 h-8 flex-shrink-0" />
                           <span className="text-sm tracking-wide font-semibold text-center">{upiScreenshot ? `Selected: ${upiScreenshot.name}` : "Click to attach payment screenshot"}</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-10 text-center bg-gray-50 rounded-3xl p-8 border border-gray-100 shadow-inner">
                    <p className="text-gray-500 text-sm mb-2 font-bold uppercase tracking-widest">Amount to Pay</p>
                    <h3 className="text-5xl font-black tracking-tight text-[#080808]">
                      ${getTotalPrice().toFixed(2)}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 pl-2">Select Payment Method</p>
                    
                    {/* UPI Option */}
                    <label 
                      className={`flex items-center gap-6 p-5 rounded-2xl border flex-row cursor-pointer transition-all ${method === 'upi' ? 'border-primary bg-primary/5 shadow-sm' : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50'}`}
                    >
                      <input 
                        type="radio" 
                        name="payment" 
                        value="upi" 
                        checked={method === 'upi'} 
                        onChange={() => setMethod('upi')}
                        className="w-5 h-5 text-green-600 focus:ring-green-500"
                      />
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 shadow-inner">
                        <Landmark className="w-6 h-6" />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-bold text-lg text-[#080808]">UPI Transfer</h4>
                        <p className="text-sm text-gray-500">Google Pay, PhonePe, Paytm, BHIM</p>
                      </div>
                    </label>

                    {/* Razorpay Option */}
                    <label 
                      className={`flex items-center gap-6 p-5 rounded-2xl border flex-row cursor-pointer transition-all ${method === 'razorpay' ? 'border-blue-500 bg-blue-50/50 shadow-sm' : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50'}`}
                    >
                      <input 
                        type="radio" 
                        name="payment" 
                        value="razorpay" 
                        checked={method === 'razorpay'} 
                        onChange={() => setMethod('razorpay')}
                        className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 shadow-inner">
                        <CreditCard className="w-6 h-6" />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-bold text-lg text-[#080808]">Credit / Debit Card</h4>
                        <p className="text-sm text-gray-500">Visa, Mastercard, Netbanking via Razorpay</p>
                      </div>
                    </label>

                    {/* COD Option */}
                    <label 
                      className={`flex items-center gap-6 p-5 rounded-2xl border flex-row cursor-pointer transition-all ${method === 'cod' ? 'border-gray-800 bg-gray-50 shadow-sm' : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50'}`}
                    >
                      <input 
                        type="radio" 
                        name="payment" 
                        value="cod" 
                        checked={method === 'cod'} 
                        onChange={() => setMethod('cod')}
                        className="w-5 h-5 text-gray-800 focus:ring-gray-800"
                      />
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 text-gray-700 shadow-inner">
                        <Banknote className="w-6 h-6" />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-bold text-lg text-[#080808]">Cash on Delivery</h4>
                        <p className="text-sm text-gray-500">Pay physically when you receive the order</p>
                      </div>
                    </label>
                  </div>
                </>
              )}
            </div>

            <div className="p-8 border-t border-gray-100 bg-gray-50/80">
              {upiStep && (
                <button 
                  onClick={() => setUpiStep(false)}
                  className="w-full py-4 mb-4 rounded-xl font-bold flex justify-center items-center gap-2 transition-all duration-300 bg-white border-2 border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                >
                  Change Payment Method
                </button>
              )}
              <button 
                onClick={handleCheckout}
                disabled={isProcessing || (method === 'upi' && upiStep && !upiScreenshot)}
                className={`w-full py-5 rounded-xl font-bold flex justify-center items-center gap-3 text-lg transition-all duration-300 shadow-xl ${(isProcessing || (method === 'upi' && upiStep && !upiScreenshot)) ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' : 'bg-[#080808] text-white hover:bg-black/80 hover:scale-[1.01] active:scale-95 hover:shadow-black/20'}`}
              >
                {isProcessing ? (
                  <>
                    <div className="w-6 h-6 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
                    Verifying Payment...
                  </>
                ) : upiStep ? (
                  `Confirm Payment`
                ) : (
                  method === 'upi' ? `Generate QR Code` : `Pay $${getTotalPrice().toFixed(2)} Securely`
                )}
              </button>
              <div className="text-center text-xs text-gray-400 mt-6 flex items-center justify-center gap-2 font-medium tracking-wide">
                 <ShieldCheck className="w-4 h-4 text-green-500" />
                 100% Secured by Akupy Encrypted Protocol
              </div>
            </div>
          </>
        ) : (
          <div className="p-16 text-center flex flex-col items-center justify-center h-full animate-fade-in bg-green-50/50 min-h-[400px]">
            <div className="w-32 h-32 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-8 shadow-inner border border-green-200">
              <CheckCircle2 className="w-16 h-16" />
            </div>
            <h2 className="text-4xl font-heading font-black text-[#080808] mb-3">Payment Successful!</h2>
            <p className="text-gray-600 font-medium text-lg leading-relaxed max-w-sm">We've securely received your payment and your order is confirmed.</p>
            
            <div className="mt-12 inline-flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-sm border border-gray-100 animate-pulse">
               <div className="w-2 h-2 rounded-full bg-primary animate-ping"></div>
               <p className="text-sm text-gray-500 font-bold tracking-wide uppercase">Routing to Dashboard</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
