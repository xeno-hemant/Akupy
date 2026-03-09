import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, ShieldCheck, Tag } from 'lucide-react';
import useCartStore from '../store/useCartStore';
import { useNavigate } from 'react-router-dom';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getTotalItems, getTotalPrice } = useCartStore();
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-12 py-12 pb-24 min-h-[80vh] flex flex-col pt-32">
       <button 
         onClick={() => navigate(-1)}
         className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors w-fit mb-8 font-semibold"
       >
         <ArrowLeft className="w-4 h-4" /> Continue Shopping
       </button>

      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* Cart Items Section */}
        <div className="flex-grow">
          <div className="flex items-center justify-between mb-8 pb-4 border-b">
             <h1 className="text-3xl font-heading font-black text-[#080808] flex items-center gap-3">
               Shopping Cart
               <span className="text-lg bg-gray-100 px-3 py-1 rounded-full text-gray-600 font-bold">{getTotalItems()} Items</span>
             </h1>
          </div>

          {cart.length === 0 ? (
            <div className="text-center text-gray-400 py-24 bg-gray-50 rounded-[2rem] border border-dashed border-gray-200">
              <ShoppingCart className="w-20 h-20 mx-auto mb-6 text-gray-300" />
              <h2 className="text-2xl font-bold text-gray-600 mb-2">Your cart is empty</h2>
              <p className="mb-8">Discover amazing local products and add them to your cart.</p>
              <button 
                onClick={() => navigate('/discover')}
                className="bg-[#080808] text-white px-8 py-4 rounded-xl font-bold hover:bg-primary hover:text-black transition-all"
              >
                Explore Shops
              </button>
            </div>
          ) : (
             <div className="space-y-6">
               {cart.map((item) => (
                 <div key={item._id || item.name} className="flex flex-col sm:flex-row gap-6 p-6 rounded-[2rem] border hover:shadow-lg transition-shadow bg-white items-center">
                   <div className="w-full sm:w-32 sm:h-32 h-48 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                     {item.imageUrl ? (
                       <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                     ) : (
                       <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Img</div>
                     )}
                   </div>
                   
                   <div className="flex flex-col flex-grow w-full">
                     <div className="flex justify-between items-start mb-2">
                       <div>
                         <h4 className="font-bold text-[#080808] text-lg lg:text-xl">{item.name}</h4>
                         <span className="text-sm text-gray-500 font-medium">Sold by {item.businessName}</span>
                       </div>
                       <button 
                         onClick={() => removeFromCart(item._id || item.name)}
                         className="text-red-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors flex-shrink-0"
                         title="Remove item"
                       >
                         <Trash2 className="w-5 h-5" />
                       </button>
                     </div>
                     
                     <div className="mt-4 sm:mt-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
                       <span className="font-black text-2xl text-[#080808]">
                         ${Number(item.price).toFixed(2)}
                       </span>
                       
                       <div className="flex items-center gap-4 bg-gray-50 rounded-full px-2 py-1 border">
                         <button 
                           onClick={() => updateQuantity(item._id || item.name, item.quantity - 1)} 
                           className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm"
                         >
                           <Minus className="w-4 h-4" />
                         </button>
                         <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                         <button 
                           onClick={() => updateQuantity(item._id || item.name, item.quantity + 1)} 
                           className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm"
                         >
                           <Plus className="w-4 h-4" />
                         </button>
                       </div>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
          )}
        </div>

        {/* Order Summary Section */}
        {cart.length > 0 && (
          <div className="w-full lg:w-[400px] flex-shrink-0">
            <div className="bg-gray-50 rounded-[2rem] p-8 border hover:border-gray-300 transition-colors sticky top-28">
              <h3 className="text-xl font-bold mb-6 text-[#080808]">Order Summary</h3>
              
              <div className="space-y-4 text-sm font-medium text-gray-600 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between">
                  <span>Subtotal ({getTotalItems()} items)</span>
                  <span className="text-[#080808]">${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Estimated Tax</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-8">
                <span className="text-lg font-bold text-[#080808]">Total</span>
                <span className="text-3xl font-black text-[#080808]">${getTotalPrice().toFixed(2)}</span>
              </div>

              <button 
                className="w-full bg-[#080808] text-white py-4 rounded-xl font-bold text-lg hover:bg-primary hover:text-black transition-all active:scale-95 flex justify-center items-center shadow-xl hover:shadow-primary/20 mb-4"
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout
              </button>
              
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-4">
                 <ShieldCheck className="w-4 h-4 text-green-500" />
                 Secure Checkout Process
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
