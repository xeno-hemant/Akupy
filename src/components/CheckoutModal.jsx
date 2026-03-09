import { useState } from 'react';
import { X, CreditCard, Banknote, Landmark, CheckCircle2 } from 'lucide-react';
import useCartStore from '../store/useCartStore';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

export default function CheckoutModal({ isOpen, onClose }) {
  const { cart, getTotalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  const [method, setMethod] = useState('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCheckout = () => {
    if (!user) {
      onClose();
      const el = document.querySelector('#register-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      else navigate('/');
      return;
    }

    setIsProcessing(true);
    
    // Mock processing delay
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      // Clear cart after short delay
      setTimeout(() => {
        clearCart();
        setIsSuccess(false);
        onClose();
        navigate('/dashboard');
      }, 2500);
      
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => !isProcessing && !isSuccess && onClose()}
      />
      
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {!isSuccess ? (
          <>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-xl font-heading font-bold text-[#080808]">Complete Payment</h2>
              <button 
                onClick={onClose} 
                disabled={isProcessing}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              <div className="mb-8 text-center">
                <p className="text-gray-500 text-sm mb-1">Total to Pay</p>
                <h3 className="text-4xl font-bold tracking-tight text-[#080808]">
                  ${getTotalPrice().toFixed(2)}
                </h3>
              </div>

              <div className="space-y-3 mb-6">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Select Method</p>
                
                {/* Razorpay Option */}
                <label 
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${method === 'razorpay' ? 'border-blue-500 bg-blue-50/30' : 'border-gray-100 hover:border-blue-200'}`}
                >
                  <input 
                    type="radio" 
                    name="payment" 
                    value="razorpay" 
                    checked={method === 'razorpay'} 
                    onChange={() => setMethod('razorpay')}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#080808]">Razorpay / Cards</h4>
                    <p className="text-xs text-gray-500">Credit, Debit, Netbanking</p>
                  </div>
                </label>

                {/* UPI Option */}
                <label 
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${method === 'upi' ? 'border-primary bg-green-50/30' : 'border-gray-100 hover:border-green-200'}`}
                >
                  <input 
                    type="radio" 
                    name="payment" 
                    value="upi" 
                    checked={method === 'upi'} 
                    onChange={() => setMethod('upi')}
                    className="w-4 h-4 text-green-600 focus:ring-green-500"
                  />
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-600">
                    <Landmark className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#080808]">UPI (QR Code)</h4>
                    <p className="text-xs text-gray-500">Google Pay, PhonePe, Paytm</p>
                  </div>
                </label>

                {/* COD Option */}
                <label 
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${method === 'cod' ? 'border-gray-800 bg-gray-50' : 'border-gray-100 hover:border-gray-300'}`}
                >
                  <input 
                    type="radio" 
                    name="payment" 
                    value="cod" 
                    checked={method === 'cod'} 
                    onChange={() => setMethod('cod')}
                    className="w-4 h-4 text-gray-800 focus:ring-gray-800"
                  />
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-700">
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#080808]">Cash on Delivery</h4>
                    <p className="text-xs text-gray-500">Pay when you receive the order</p>
                  </div>
                </label>
              </div>

            </div>

            <div className="p-6 border-t border-gray-100 bg-white">
              <button 
                onClick={handleCheckout}
                disabled={isProcessing}
                className={`w-full py-4 rounded-xl font-semibold flex justify-center items-center gap-2 transition-all duration-300 ${isProcessing ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-[#080808] text-white hover:bg-black/80 hover:scale-[1.02] active:scale-95 shadow-xl'}`}
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-600 rounded-full animate-spin"></div>
                    Processing Payment...
                  </>
                ) : (
                  `Pay $${getTotalPrice().toFixed(2)} Securely`
                )}
              </button>
              <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
                🔒 Secured by Akupy Encrypted Protocol
              </p>
            </div>
          </>
        ) : (
          <div className="p-12 text-center flex flex-col items-center justify-center h-full animate-fade-in">
            <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-heading font-bold text-[#080808] mb-2">Payment Successful!</h2>
            <p className="text-gray-500 font-medium">Your order has been placed securely.</p>
            <p className="text-sm text-gray-400 mt-8 animate-pulse">Redirecting to dashboard...</p>
          </div>
        )}
      </div>
    </div>
  );
}
