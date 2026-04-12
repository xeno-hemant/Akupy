import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../config/apiRoutes';
import api from '../utils/apiHelper';
import useCartStore from '../store/useCartStore';
import useFeatureStore from '../store/useFeatureStore';
import useChatStore from '../store/useChatStore';
import useAuthStore from '../store/useAuthStore';

export default function ShopSubdomain({ shopId: propShopId }) {
  const { shopId: paramShopId } = useParams();
  const shopId = propShopId || paramShopId;
  const navigate = useNavigate();

  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { addToCart } = useCartStore();
  const { isIncognitoActive } = useFeatureStore();
  const { startChatWithSeller } = useChatStore();
  const { token } = useAuthStore();

  const handleChat = async () => {
    if (!token) { navigate('/login'); return; }
    const sellerId = business.userId?._id || business.userId || business.sellerId;
    const conversationId = await startChatWithSeller(sellerId);
    if (conversationId) navigate(`/chat/${conversationId}`);
  };

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const data = await api.get(API.BUSINESS_BY_SHOP_ID(shopId));
        if (data) {
          setBusiness(data);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchBusiness();
  }, [shopId]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-lg">Loading {shopId}...</div>;
  }

  if (error || !business) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">Shop Not Found</h1>
        <p className="text-gray-500">The shop <strong>{shopId}</strong> does not exist.</p>
        <a href="https://akupy.in" className="mt-6 hover:underline" style={{ color: '#8E867B' }}>Return to Akupy</a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F0E2] -mt-[170px] md:-mt-[114px]">
      {/* Dynamic Header specific to this shop */}
      <header className={`w-full ${isIncognitoActive ? 'bg-[#3d3830] text-[#F3F0E2]' : 'bg-[#3d3830] text-[#F3F0E2]'} pt-[calc(170px+2.5rem)] md:pt-[calc(114px+4rem)] pb-10 md:pb-16 px-6 text-center`}>
        <h1 className="text-3xl md:text-5xl font-heading font-bold mb-4">
          {isIncognitoActive ? 'Anonymous Store' : business.name}
        </h1>
        <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto">
          {isIncognitoActive
            ? 'Store details are hidden while browsing in Incognito mode.'
            : (business.description || 'Welcome to our official Akupy store.')}
        </p>

        {!isIncognitoActive && (
          <div className="mt-4 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border"
              style={{ 
                background: business.shopStatus === 'closed' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                borderColor: business.shopStatus === 'closed' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)',
                color: business.shopStatus === 'closed' ? '#EF4444' : '#22C55E'
              }}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${business.shopStatus === 'closed' ? 'bg-[#EF4444]' : 'bg-[#22C55E]'} animate-pulse`} />
              {business.shopStatus === 'closed' ? 'Closed' : 'Open'}
            </div>
          </div>
        )}
        {!isIncognitoActive && business.category && (
          <span className="inline-block mt-4 px-3 py-1 bg-white/10 rounded-full text-xs font-medium uppercase tracking-wider">
            {business.category}
          </span>
        )}

        {/* Chat Button */}
        <div className="mt-6">
            <button
                onClick={handleChat}
                className="px-6 py-2.5 rounded-full font-bold text-sm bg-white text-[#3d3830] transition-transform active:scale-95 shadow-lg flex items-center gap-2 mx-auto"
            >
                💬 Message Shop
            </button>
        </div>
      </header>

      {/* Catalog Render */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-semibold mb-8 border-b pb-4">Our Products</h2>
        {business.products && business.products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {business.products.map((product, index) => (
              <div key={index} className="bg-white border rounded-2xl overflow-hidden hover:shadow-lg transition flex flex-col">
                <div className="aspect-square bg-gray-50 flex items-center justify-center text-gray-300 relative overflow-hidden">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} className={`w-full h-full object-cover transition-transform duration-500 ${isIncognitoActive ? 'blur-md scale-110' : 'hover:scale-105'}`} alt={product.name} />
                  ) : 'No Image'}
                  {!product.inStock && (
                    <div className="absolute top-2 right-2 bg-white/90 text-red-500 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider">Out of Stock</div>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold mb-1 border-b pb-1">{product.name}</h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{product.description}</p>

                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xl font-bold">${Number(product.price).toFixed(2)}</span>
                    <button
                      onClick={() => addToCart(product, business)}
                      disabled={!product.inStock}
                      className="px-4 py-2 rounded-full font-medium transition-colors disabled:opacity-50"
                      style={{ background: 'rgba(142,134,123,0.1)', color: '#8E867B' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#8E867B'; e.currentTarget.style.color = '#F3F0E2'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(142,134,123,0.1)'; e.currentTarget.style.color = '#8E867B'; }}
                    >
                      Buy
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-12 border-2 border-dashed border-gray-100 rounded-3xl">
            This shop hasn't listed any products yet.
          </div>
        )}
      </main>

      <footer className="w-full text-center py-6 text-sm text-gray-400 border-t">
        Powered by Akupy Infrastructure
      </footer>
    </div>
  );
}
